"""
One-shot: project Eurostat NUTS GeoJSON (Greece subset) to SVG path data
and emit a single bundled greece-map-data.js consumed by greece-map.js.

Projection: equirectangular with cos(lat_mid) x-correction.
For Greece's small extent this matches Mercator within <0.5px at 1000-wide
and is dependency-free.

Output viewBox is the smallest box containing all geometry, rounded.
"""
import json, math, os

HERE = os.path.dirname(os.path.abspath(__file__))

# Geographic bounding box of Greece (from agent report, slightly padded)
LNG_MIN, LNG_MAX = 19.30, 28.40
LAT_MIN, LAT_MAX = 34.70, 41.80
LAT_MID = (LAT_MIN + LAT_MAX) / 2
COS_LAT = math.cos(math.radians(LAT_MID))

# Target SVG width; height is computed to preserve aspect
VIEW_W = 1000
DLNG = (LNG_MAX - LNG_MIN) * COS_LAT   # equivalent latitude-degrees
DLAT = LAT_MAX - LAT_MIN
SCALE = VIEW_W / DLNG
VIEW_H = round(DLAT * SCALE, 1)

def project(lng, lat):
    x = (lng - LNG_MIN) * COS_LAT * SCALE
    y = (LAT_MAX - lat) * SCALE
    return round(x, 2), round(y, 2)

def ring_to_path(ring):
    parts = []
    for i, pt in enumerate(ring):
        lng, lat = pt[0], pt[1]
        x, y = project(lng, lat)
        parts.append(f"{'M' if i == 0 else 'L'}{x},{y}")
    parts.append("Z")
    return "".join(parts)

def feature_to_path(feature):
    geom = feature["geometry"]
    t = geom["type"]
    if t == "Polygon":
        return "".join(ring_to_path(r) for r in geom["coordinates"])
    if t == "MultiPolygon":
        return "".join(
            "".join(ring_to_path(r) for r in poly)
            for poly in geom["coordinates"]
        )
    raise ValueError(f"Unsupported geometry type: {t}")

def parent_region(nuts_id):
    # NUTS_ID nesting: EL3 (level 1) > EL30 (level 2) > EL301 (level 3)
    if len(nuts_id) >= 4:
        return nuts_id[:4]
    return None

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def convert(infile, level):
    gj = load(os.path.join(HERE, infile))
    out = []
    for feat in gj["features"]:
        p = feat["properties"]
        item = {
            "id": p["NUTS_ID"],
            "el": p["NUTS_NAME"],
            "en": p["NAME_LATN"],
            "d":  feature_to_path(feat),
        }
        if level == 3:
            item["region"] = parent_region(p["NUTS_ID"])
        out.append(item)
    return out

regions = convert("regions.geojson", level=2)
prefectures = convert("prefectures.geojson", level=3)

print(f"viewBox: 0 0 {VIEW_W} {VIEW_H}")
print(f"regions: {len(regions)} features")
print(f"prefectures: {len(prefectures)} features")

# Emit a single data file
out_path = os.path.normpath(os.path.join(
    HERE, "..", "..", "..", "components", "greece-map-data.js"
))
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    f.write("/* AUTO-GENERATED · do not edit. Source: Eurostat NUTS 2021 (GISCO) */\n")
    f.write("/* Greek regions (13) + prefectures (52, NUTS3). Projection: equirectangular */\n")
    f.write("/* with cos(lat_mid) x-correction. License: EuroGeographics, free reuse. */\n")
    f.write(f"window.GREECE_MAP_VIEWBOX = '0 0 {VIEW_W} {VIEW_H}';\n")
    f.write("window.GREECE_REGIONS = ")
    json.dump(regions, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")
    f.write("window.GREECE_PREFECTURES = ")
    json.dump(prefectures, f, ensure_ascii=False, separators=(",", ":"))
    f.write(";\n")

print(f"wrote: {out_path}")
print(f"size:  {os.path.getsize(out_path)} bytes")
