"""
Match geoBoundaries (Latin) shapeNames to canonical Greek municipality names.

Source of truth:  names_wikipedia.json (parsed from
                  https://en.wikipedia.org/wiki/List_of_municipalities_of_Greece_(2011) ,
                  CC-BY-SA / public-fact data).
Target:          municipalities.geojson  (geoBoundaries ADM3, CC-BY 4.0).
Output:          municipality_names.json   { shapeID -> {el, en, match} }

Run:  python match_names.py
"""

import json
import os
import re
import unicodedata
from pathlib import Path

from rapidfuzz import fuzz, process

HERE = Path(__file__).parent
GEOJSON = HERE / "municipalities.geojson"
NAMES   = HERE / "names_wikipedia.json"
OUT     = HERE / "municipality_names.json"

# ---------------------------------------------------------------------------
# Manual overrides — applied AFTER fuzzy matching wins.
#   key   = geoBoundaries shapeName, lowercased and ASCII-folded
#   value = Greek genitive municipal name (form used in `Δήμος <X>`)
# Filled in iteratively after running the script and inspecting low-confidence
# / unmatched features.
# ---------------------------------------------------------------------------
OVERRIDES: dict[str, str] = {
    # Capitals / megacities — Wikipedia listing uses different surface forms
    "athens":               "Αθηναίων",
    "thessaloniki":         "Θεσσαλονίκης",
    "piraeus":              "Πειραιώς",
    "patras":               "Πατρέων",
    "heraklion":            "Ηρακλείου",
    "larissa":              "Λαρισαίων",
    "volos":                "Βόλου",
    "ioannina":             "Ιωαννιτών",
    "trikala":              "Τρικκαίων",
    "chalcis":              "Χαλκιδέων",
    "chania":               "Χανίων",
    "rhodes":               "Ρόδου",
    "corfu":                "Κεντρικής Κέρκυρας και Διαποντίων Νήσων",  # post-2019 split; best guess
    "kavala":               "Καβάλας",
    "katerini":             "Κατερίνης",
    "agrinion":             "Αγρινίου",
    "kalamata":             "Καλαμάτας",
    "rethymno":             "Ρεθύμνης",
    # Special / monastic — geoBoundaries spells it "Mount Anthos" (sic)
    "mount athos":          "Αγίου Όρους",
    "mount anthos":         "Αγίου Όρους",
    "agion oros":           "Αγίου Όρους",
    # Not present in the 2011 Wikipedia list (post-2019 split / informal naming)
    "cephalonia":           "Κεφαλονιάς",
    "lasithi plateau":      "Οροπεδίου Λασιθίου",
    "paxos":                "Παξών",
}


# ---------------------------------------------------------------------------
# Normalisation
# ---------------------------------------------------------------------------

# Greek -> Latin ISO-843-like transliteration. We use a *lossy* form that
# matches the conventions geoBoundaries uses (so e.g. χ -> h, η -> i, ω -> o,
# υ -> i, αι -> e, ου -> u, ντ -> nt, μπ -> mp, etc.).
_GREEK_TO_LATIN = {
    "α": "a", "β": "v", "γ": "g", "δ": "d", "ε": "e", "ζ": "z",
    "η": "i", "θ": "t", "ι": "i", "κ": "k", "λ": "l", "μ": "m",
    "ν": "n", "ξ": "x", "ο": "o", "π": "p", "ρ": "r", "σ": "s",
    "ς": "s", "τ": "t", "υ": "i", "φ": "f", "χ": "h", "ψ": "ps",
    "ω": "o",
}
_GREEK_DIGRAPHS = [
    ("ντ", "nt"), ("μπ", "mp"), ("γκ", "g"), ("γγ", "ng"),
    ("τσ", "ts"), ("τζ", "tz"),
    ("αι", "e"),  ("ει", "i"),  ("οι", "i"), ("υι", "i"),
    ("ου", "u"),  ("αυ", "av"), ("ευ", "ev"), ("ηυ", "iv"),
]

def _greek_to_latin(s: str) -> str:
    for d, r in _GREEK_DIGRAPHS:
        s = s.replace(d, r)
    return "".join(_GREEK_TO_LATIN.get(c, c) for c in s)


# Latin normalisation rules — applied AFTER greek->latin so both sides land in
# the same idiomatic ASCII shape.
_TRANS_RULES = [
    (r"\bdemos\b",   ""),
    (r"\bdimos\b",   ""),
    (r"\bdhmos\b",   ""),
    (r"ph", "f"),
    (r"th", "t"),
    (r"ch", "h"),
    (r"kh", "h"),
    (r"gh", "g"),
    (r"ks", "x"),
    (r"ai", "e"),
    (r"oi", "i"),
    (r"ei", "i"),
    (r"ou", "u"),
    (r"y",  "i"),
    (r"w",  "v"),
    (r"c",  "k"),
    (r"\s+", " "),
]


def fold(s: str) -> str:
    """Lowercase, transliterate Greek->Latin, strip diacritics, normalise."""
    s = s.lower().strip()
    # Strip Greek tonos / dialytika / Latin diacritics BEFORE transliteration
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    # Greek -> Latin
    s = _greek_to_latin(s)
    # Strip remaining punctuation
    s = re.sub(r"[^\w\s]", " ", s)
    # Idiomatic Latin folding (ph<->f, ch<->h, ai<->e, ...)
    for pat, rep in _TRANS_RULES:
        s = re.sub(pat, rep, s)
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------------------
# Load sources
# ---------------------------------------------------------------------------
def load_features():
    data = json.loads(GEOJSON.read_text(encoding="utf-8"))
    out = []
    for f in data["features"]:
        p = f["properties"]
        out.append({"shapeID": p["shapeID"], "shapeName": p["shapeName"]})
    return out


def load_names():
    """Returns list[{en, el, el_short}] from the Wikipedia table."""
    raw = json.loads(NAMES.read_text(encoding="utf-8"))
    out = []
    for r in raw:
        el = r["el"]
        # el format is e.g. "Άβδηρα(Δήμος Αβδήρων)"
        m = re.search(r"\(Δήμος\s+([^)]+)\)", el)
        el_genitive = m.group(1).strip() if m else el
        # Take the part before the parenthesis as the short Greek name
        el_short = re.split(r"\s*\(", el, maxsplit=1)[0].strip()
        out.append({
            "en": r["en"],
            "el": el_genitive,    # canonical "Δήμος <X>" form
            "el_short": el_short, # nominative / popular form
        })
    return out


# ---------------------------------------------------------------------------
# Matcher
# ---------------------------------------------------------------------------
def build_match_index(names: list[dict]):
    """key -> (index, value)"""
    # We match against an *expanded* corpus -- each name can be referenced by
    # its English form OR by either Greek form (folded the same way).
    choices = {}
    for i, n in enumerate(names):
        for surface in (n["en"], n["el"], n["el_short"]):
            key = fold(surface)
            if not key:
                continue
            # Keep the first owner for each key to avoid clobbering
            choices.setdefault(key, i)
    return choices


def main():
    feats = load_features()
    names = load_names()
    print(f"geoBoundaries features : {len(feats)}")
    print(f"Wikipedia name records : {len(names)}")

    choices = build_match_index(names)
    keys = list(choices.keys())

    result: dict[str, dict] = {}
    overridden = 0

    for f in feats:
        sid = f["shapeID"]
        sname = f["shapeName"]
        folded_query = fold(sname)
        override_key = sname.lower().strip()

        if override_key in OVERRIDES:
            result[sid] = {
                "el": OVERRIDES[override_key],
                "en": sname,
                "match": 100,
                "override": True,
            }
            overridden += 1
            continue

        m = process.extractOne(folded_query, keys, scorer=fuzz.WRatio)
        if m is None:
            result[sid] = {"el": None, "en": sname, "match": 0}
            continue
        best_key, score, _ = m
        rec = names[choices[best_key]]
        result[sid] = {
            "el": rec["el"],
            "en": sname,
            "match": int(round(score)),
        }

    # Histogram
    buckets = {"hi": 0, "mid": 0, "low": 0, "none": 0}
    low_list = []
    none_list = []
    for sid, r in result.items():
        s = r["match"]
        if r.get("el") is None:
            buckets["none"] += 1
            none_list.append(r["en"])
        elif s >= 90:
            buckets["hi"] += 1
        elif s >= 70:
            buckets["mid"] += 1
        else:
            buckets["low"] += 1
            low_list.append((r["en"], s, r["el"]))

    print()
    print("--- Match confidence histogram ---")
    print(f"  >=90      : {buckets['hi']}")
    print(f"  70-89     : {buckets['mid']}")
    print(f"  <70       : {buckets['low']}")
    print(f"  unmatched : {buckets['none']}")
    print(f"  overrides : {overridden}")
    print()
    print("Low-confidence (<70):")
    for en, sc, el in low_list:
        print(f"  {sc:>3}  {en!r:30}  ->  {el}")
    print()
    print("Unmatched:")
    for n in none_list:
        print(f"  {n}")

    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print()
    print(f"wrote {OUT}  ({OUT.stat().st_size:,} bytes, {len(result)} entries)")

    # Coverage = (matched >= 70) + overridden + unmatched-but-overridden(0)
    confident = buckets["hi"] + buckets["mid"]
    print(f"Coverage >=70 or overridden : {confident}/{len(feats)}  "
          f"({100*confident/len(feats):.1f}%)")


if __name__ == "__main__":
    main()
