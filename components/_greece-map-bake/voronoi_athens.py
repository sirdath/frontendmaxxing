"""
Generate Voronoi-cell polygons for ~20 Athens neighborhoods, clipped to a
bounding box around central Athens. Output: athens_neighborhoods.json next to
this script. Coordinates are raw lng/lat (no projection).
"""

import json
import math
import os
import sys

# ---------- Data ----------------------------------------------------------

# (greek, latin, lng, lat)
NEIGHBORHOODS = [
    ("Πλάκα",        "Plaka",        23.7298, 37.9728),
    ("Κολωνάκι",     "Kolonaki",     23.7438, 37.9788),
    ("Εξάρχεια",     "Exarchia",     23.7349, 37.9858),
    ("Μοναστηράκι",  "Monastiraki",  23.7252, 37.9763),
    ("Σύνταγμα",     "Syntagma",     23.7348, 37.9755),
    ("Ψυρρή",        "Psyrri",       23.7251, 37.9787),
    ("Παγκράτι",     "Pangrati",     23.7456, 37.9676),
    ("Αμπελόκηποι",  "Ampelokipoi",  23.7569, 37.9907),
    ("Πετράλωνα",    "Petralona",    23.7129, 37.9697),
    ("Κουκάκι",      "Koukaki",      23.7242, 37.9670),
    ("Γκάζι",        "Gazi",         23.7115, 37.9783),
    ("Μετς",         "Mets",         23.7388, 37.9650),
    ("Νέος Κόσμος",  "Neos Kosmos",  23.7283, 37.9586),
    ("Κυψέλη",       "Kypseli",      23.7396, 37.9962),
    ("Πατήσια",      "Patisia",      23.7388, 38.0080),
    ("Γκύζη",        "Gyzi",         23.7505, 37.9919),
    ("Καισαριανή",   "Kaisariani",   23.7639, 37.9683),
    ("Ιλίσια",       "Ilisia",       23.7565, 37.9716),
    ("Νέα Φιλοθέη",  "Nea Filothei", 23.7635, 37.9970),
    ("Θησείο",       "Thiseio",      23.7196, 37.9763),
]

BBOX = (23.69, 37.93, 23.78, 38.02)  # (minLng, minLat, maxLng, maxLat)


# ---------- Helpers -------------------------------------------------------

def latin_id(name: str) -> str:
    return name.strip().lower().replace(" ", "_")


def sutherland_hodgman(subject, clip_rect):
    """Polygon-rect clip. subject = [(x,y),...]; clip_rect = (minx,miny,maxx,maxy)."""
    minx, miny, maxx, maxy = clip_rect
    # edges: each = (inside_test, intersect_fn)
    def clip_edge(poly, axis, value, keep_greater):
        if not poly:
            return poly
        out = []
        n = len(poly)
        for i in range(n):
            cur = poly[i]
            prev = poly[i - 1]
            cur_in = (cur[axis] >= value) if keep_greater else (cur[axis] <= value)
            prev_in = (prev[axis] >= value) if keep_greater else (prev[axis] <= value)
            if cur_in:
                if not prev_in:
                    out.append(_intersect(prev, cur, axis, value))
                out.append(cur)
            elif prev_in:
                out.append(_intersect(prev, cur, axis, value))
        return out

    def _intersect(p1, p2, axis, value):
        # parametric solve along axis
        x1, y1 = p1
        x2, y2 = p2
        if axis == 0:
            if x2 == x1:
                t = 0.0
            else:
                t = (value - x1) / (x2 - x1)
            return (value, y1 + t * (y2 - y1))
        else:
            if y2 == y1:
                t = 0.0
            else:
                t = (value - y1) / (y2 - y1)
            return (x1 + t * (x2 - x1), value)

    poly = list(subject)
    poly = clip_edge(poly, 0, minx, True)   # x >= minx
    poly = clip_edge(poly, 0, maxx, False)  # x <= maxx
    poly = clip_edge(poly, 1, miny, True)   # y >= miny
    poly = clip_edge(poly, 1, maxy, False)  # y <= maxy
    return poly


def sort_ccw(points):
    """Sort vertices counter-clockwise about their centroid."""
    if len(points) < 3:
        return points
    cx = sum(p[0] for p in points) / len(points)
    cy = sum(p[1] for p in points) / len(points)
    return sorted(points, key=lambda p: math.atan2(p[1] - cy, p[0] - cx))


def close_ring(points):
    if not points:
        return points
    if points[0] != points[-1]:
        return points + [points[0]]
    return points


# ---------- Voronoi -------------------------------------------------------

def voronoi_polygons(points, bbox):
    """
    Build a Voronoi diagram and return one polygon per input point.
    Uses scipy. Handles infinite ridges by extending them far beyond bbox,
    then relies on Sutherland-Hodgman clipping to bound them.
    """
    from scipy.spatial import Voronoi  # local import so the module loads cleanly

    minx, miny, maxx, maxy = bbox
    # padding for "infinity" — large enough to dominate bbox span
    span = max(maxx - minx, maxy - miny)
    far = span * 1000.0

    # Add 4 distant sentinel points so all *real* points get finite regions.
    cx = (minx + maxx) / 2
    cy = (miny + maxy) / 2
    sentinels = [
        (cx - far, cy - far),
        (cx + far, cy - far),
        (cx + far, cy + far),
        (cx - far, cy + far),
    ]
    all_pts = list(points) + sentinels
    vor = Voronoi(all_pts)

    polys = []
    for i in range(len(points)):
        region_idx = vor.point_region[i]
        region = vor.regions[region_idx]
        if not region or -1 in region:
            polys.append([])
            continue
        polys.append([(float(vor.vertices[v][0]), float(vor.vertices[v][1])) for v in region])
    return polys


# ---------- Main ----------------------------------------------------------

def main():
    here = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(here, "athens_neighborhoods.json")

    points = [(n[2], n[3]) for n in NEIGHBORHOODS]
    raw_polys = voronoi_polygons(points, BBOX)

    # Try Shapely first; fall back to Sutherland-Hodgman.
    use_shapely = False
    try:
        from shapely.geometry import Polygon as ShPolygon, box as shbox
        use_shapely = True
        clip_rect = shbox(*BBOX)
    except Exception:
        clip_rect = None

    features = []
    empties = []

    for nb, raw in zip(NEIGHBORHOODS, raw_polys):
        el, en, lng, lat = nb
        fid = latin_id(en)

        if not raw:
            empties.append(en)
            continue

        if use_shapely:
            try:
                p = ShPolygon(raw)
                if not p.is_valid:
                    p = p.buffer(0)
                clipped = p.intersection(clip_rect)
                if clipped.is_empty:
                    empties.append(en)
                    continue
                # Take exterior of largest piece if it's a MultiPolygon
                geom = clipped
                if geom.geom_type == "MultiPolygon":
                    geom = max(geom.geoms, key=lambda g: g.area)
                ring = [(float(x), float(y)) for (x, y) in geom.exterior.coords]
                # Shapely returns a closed ring; drop the dup, we'll re-close after sort
                if ring and ring[0] == ring[-1]:
                    ring = ring[:-1]
            except Exception as e:
                # fall back to SH for this one
                ring = sutherland_hodgman(raw, BBOX)
        else:
            ring = sutherland_hodgman(raw, BBOX)

        if not ring:
            empties.append(en)
            continue

        ring = sort_ccw(ring)
        ring = close_ring(ring)
        # Round to 6 decimal places (~11 cm) to keep the JSON small.
        ring = [[round(x, 6), round(y, 6)] for (x, y) in ring]

        features.append({
            "id": fid,
            "el": el,
            "en": en,
            "centroid": [lng, lat],
            "polygon": ring,
        })

    payload = {
        "bbox": list(BBOX),
        "features": features,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))

    size = os.path.getsize(out_path)
    print(f"clipper          : {'shapely' if use_shapely else 'sutherland-hodgman'}")
    print(f"features written : {len(features)} / {len(NEIGHBORHOODS)}")
    print(f"output file      : {out_path}")
    print(f"file size        : {size} bytes ({size/1024:.2f} KB)")
    if empties:
        print(f"empty cells      : {empties}")
    else:
        print("empty cells      : (none)")


if __name__ == "__main__":
    sys.exit(main())
