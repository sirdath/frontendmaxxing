"""
Bake Greek geo data → single greece-map-data.js for the GreeceMap component.

LAYERS (toggleable in the component)
  • regions        13  Eurostat NUTS 2021 level 2 (περιφέρειες)
  • prefectures    74  peterdsp/greece-prefectures-and-units (Kallikratis-modern, MIT)
                         + fallback to Eurostat NUTS3 (52) if peterdsp file missing
  • municipalities 326 geoBoundaries gbOpen ADM3 (CC0) — Latin names only
  • neighborhoods  20  Voronoi over OSM centroids, Athens central window

PROJECTION
  Equirectangular with cos(lat_mid) x-correction across the full-Greece bbox.
  Matches Mercator within sub-pixel at this scale; zero JS deps.

SIMPLIFICATION
  Shapely Douglas-Peucker with per-layer tolerance:
    prefectures     ~0.008° (~800 m at 38°N)
    municipalities  ~0.003° (~300 m)

USAGE
  python convert.py
"""
import json, math, os, re

try:
    from shapely.geometry import shape, mapping
    HAVE_SHAPELY = True
except ImportError:
    HAVE_SHAPELY = False
    print("[warn] shapely not installed — geometry will NOT be simplified")
    print("       install with: python -m pip install shapely")

HERE = os.path.dirname(os.path.abspath(__file__))

# Full Greece geographic bbox (padded outward)
LNG_MIN, LNG_MAX = 19.30, 28.40
LAT_MIN, LAT_MAX = 34.70, 41.80
LAT_MID = (LAT_MIN + LAT_MAX) / 2
COS_LAT = math.cos(math.radians(LAT_MID))

# SVG viewport
VIEW_W = 1000
DLNG = (LNG_MAX - LNG_MIN) * COS_LAT
DLAT = LAT_MAX - LAT_MIN
SCALE = VIEW_W / DLNG
VIEW_H = round(DLAT * SCALE, 1)


# ───── projection ─────
def project(lng, lat):
    x = (lng - LNG_MIN) * COS_LAT * SCALE
    y = (LAT_MAX - lat) * SCALE
    return round(x, 2), round(y, 2)


# ───── geometry → SVG path ─────
def ring_to_path(ring):
    parts = []
    for i, pt in enumerate(ring):
        x, y = project(pt[0], pt[1])
        parts.append(f"{'M' if i == 0 else 'L'}{x},{y}")
    parts.append("Z")
    return "".join(parts)


def geom_to_path(geom):
    t = geom["type"]
    if t == "Polygon":
        return "".join(ring_to_path(r) for r in geom["coordinates"])
    if t == "MultiPolygon":
        return "".join(
            "".join(ring_to_path(r) for r in poly) for poly in geom["coordinates"]
        )
    raise ValueError(f"Unsupported geometry type: {t}")


def simplify(geom_dict, tolerance):
    if not HAVE_SHAPELY or tolerance <= 0:
        return geom_dict
    g = shape(geom_dict)
    s = g.simplify(tolerance, preserve_topology=True)
    if s.is_empty:
        return geom_dict
    return mapping(s)


# ───── layer bbox helper ─────
_PT = re.compile(r"[ML]([-+]?\d*\.?\d+),([-+]?\d*\.?\d+)")


def projected_bbox(features, pad=10):
    xs, ys = [], []
    for feat in features:
        for sx, sy in _PT.findall(feat["d"]):
            xs.append(float(sx))
            ys.append(float(sy))
    if not xs:
        return f"0 0 {VIEW_W} {VIEW_H}"
    xmin, xmax = min(xs) - pad, max(xs) + pad
    ymin, ymax = min(ys) - pad, max(ys) + pad
    w, h = xmax - xmin, ymax - ymin
    return f"{xmin:.1f} {ymin:.1f} {w:.1f} {h:.1f}"


# ───── per-layer loaders ─────
def load_json(name):
    path = os.path.join(HERE, name)
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def make_regions():
    gj = load_json("regions.geojson")
    out = []
    for feat in gj["features"]:
        p = feat["properties"]
        out.append({
            "id": p["NUTS_ID"],
            "el": p["NUTS_NAME"],
            "en": p["NAME_LATN"],
            "d":  geom_to_path(feat["geometry"]),
        })
    return out


def make_prefectures():
    """Prefer modern Kallikratis 74; fall back to NUTS3 52."""
    kal = load_json("kallikratis74.geojson")
    if kal:
        out = []
        for feat in kal["features"]:
            p = feat["properties"]
            geom = simplify(feat["geometry"], 0.008)
            out.append({
                "id": p.get("id") or p.get("name") or "",
                "el": p.get("name_greek") or "",
                "en": (p.get("name") or "").title(),
                "d":  geom_to_path(geom),
            })
        return out, "kallikratis74"
    gj = load_json("prefectures.geojson")
    out = []
    for feat in gj["features"]:
        p = feat["properties"]
        out.append({
            "id": p["NUTS_ID"],
            "el": p["NUTS_NAME"],
            "en": p["NAME_LATN"],
            "region": p["NUTS_ID"][:4],
            "d":  geom_to_path(feat["geometry"]),
        })
    return out, "nuts3"


def make_municipalities():
    gj = load_json("municipalities.geojson")
    if not gj:
        return []
    out = []
    for feat in gj["features"]:
        p = feat["properties"]
        geom = simplify(feat["geometry"], 0.003)
        out.append({
            "id": p.get("shapeID", ""),
            "el": p.get("shapeName", ""),  # Latin only in source
            "en": p.get("shapeName", ""),
            "d":  geom_to_path(geom),
        })
    return out


def make_neighborhoods():
    gj = load_json("athens_neighborhoods.json")
    if not gj:
        return []
    out = []
    for f in gj["features"]:
        out.append({
            "id": f["id"],
            "el": f["el"],
            "en": f["en"],
            "centroid": [round(c, 4) for c in f["centroid"]],
            "d":  ring_to_path(f["polygon"]),
        })
    return out


# ───── build ─────
regions = make_regions()
prefectures, prefectures_kind = make_prefectures()
municipalities = make_municipalities()
neighborhoods = make_neighborhoods()

vb_full = f"0 0 {VIEW_W} {VIEW_H}"
vb_neighborhoods = projected_bbox(neighborhoods, pad=4) if neighborhoods else vb_full

print(f"viewBox (full)         : {vb_full}")
print(f"viewBox (neighborhoods): {vb_neighborhoods}")
print(f"regions        : {len(regions)} features")
print(f"prefectures    : {len(prefectures)} features  [{prefectures_kind}]")
print(f"municipalities : {len(municipalities)} features")
print(f"neighborhoods  : {len(neighborhoods)} features")

# ───── write (path: components/greece-map-data.js, one level up) ─────
out_path = os.path.normpath(os.path.join(HERE, "..", "greece-map-data.js"))
with open(out_path, "w", encoding="utf-8") as f:
    f.write("/* AUTO-GENERATED · regenerate via components/_greece-map-bake/convert.py */\n")
    f.write("/* Layers + sources:                                                       */\n")
    f.write("/*   regions        Eurostat NUTS 2021 level 2 (free reuse w/ attribution) */\n")
    f.write(f"/*   prefectures    {prefectures_kind:<14} (")
    f.write("peterdsp MIT)" if prefectures_kind == "kallikratis74" else "Eurostat NUTS 2021 level 3)")
    f.write(" */\n")
    f.write("/*   municipalities geoBoundaries gbOpen ADM3 (CC0, Latin names only)      */\n")
    f.write("/*   neighborhoods  Voronoi over OSM centroids, Athens central window      */\n")
    f.write(f"window.GREECE_MAP_VIEWBOX = '{vb_full}';\n")
    f.write(f"window.GREECE_MAP_VIEWBOX_NEIGHBORHOODS = '{vb_neighborhoods}';\n")
    f.write("window.GREECE_MAP_PROJECTION = {")
    f.write(f"lngMin:{LNG_MIN},lngMax:{LNG_MAX},latMin:{LAT_MIN},latMax:{LAT_MAX},")
    f.write(f"cosLat:{COS_LAT:.6f},scale:{SCALE:.4f},viewW:{VIEW_W},viewH:{VIEW_H}")
    f.write("};\n")
    for var, data in [
        ("GREECE_REGIONS", regions),
        ("GREECE_PREFECTURES", prefectures),
        ("GREECE_MUNICIPALITIES", municipalities),
        ("GREECE_NEIGHBORHOODS", neighborhoods),
    ]:
        f.write(f"window.{var} = ")
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

print(f"wrote: {out_path}")
print(f"size : {os.path.getsize(out_path):,} bytes")
