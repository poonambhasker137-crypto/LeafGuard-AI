
from pathlib import Path
from collections import Counter
import json

repo = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

image_root = repo / "raw" / "color"
map_path = repo / "leaf-map.json"

with open(map_path, encoding="utf-8") as f:
    leaf_map = json.load(f)

def normalize(value):
    return " ".join(str(value).strip().lower().split())

mapping = {
    normalize(key): value
    for key, value in leaf_map.items()
}

valid = 0
wrong_class = 0
missing = 0
invalid_groups = 0
examples = []
groups = set()

for folder in sorted(image_root.iterdir()):
    if not folder.is_dir():
        continue

    for image in folder.iterdir():
        if image.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue

        original = normalize(
            image.stem.split("___", 1)[-1]
        )

        if original not in mapping:
            missing += 1
            continue

        entries = mapping[original]

        if not isinstance(entries, list) or not entries:
            invalid_groups += 1
            continue

        parsed = []
        for entry in entries:
            parts = str(entry).rsplit(":::", 1)
            if len(parts) == 2 and parts[0] and parts[1]:
                parsed.append((parts[0], parts[1]))

        if not parsed:
            invalid_groups += 1
            continue

        matching = [
            (label, group_id)
            for label, group_id in parsed
            if label == folder.name
        ]

        if matching:
            valid += 1
            for label, group_id in matching:
                groups.add((label, group_id))
        else:
            wrong_class += 1
            if len(examples) < 5:
                examples.append(
                    (folder.name, image.name, entries)
                )

print("\nLEAF GROUP VALIDATION REPORT")
print("-" * 45)
print("Valid class matches:", valid)
print("Wrong class matches:", wrong_class)
print("Missing metadata:", missing)
print("Invalid group entries:", invalid_groups)
print("Unique class/group combinations:", len(groups))

print("\nFirst mismatched examples:")
for example in examples:
    print(example)
