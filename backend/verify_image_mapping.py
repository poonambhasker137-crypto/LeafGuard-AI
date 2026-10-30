
from pathlib import Path
import json

repo = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

image_root = repo / "raw" / "color"
mapping_path = repo / "leaf-map.json"

with open(mapping_path, "r", encoding="utf-8") as f:
    leaf_map = json.load(f)

# Normalize filenames for matching
def normalize(name):
    return " ".join(str(name).strip().lower().split())

mapping = {
    normalize(key): value
    for key, value in leaf_map.items()
}

total_images = 0
matched_images = 0
unmatched_images = []

for class_folder in sorted(image_root.iterdir()):
    if not class_folder.is_dir():
        continue

    class_total = 0
    class_matched = 0

    for image in class_folder.iterdir():
        if image.suffix.lower() not in {
            ".jpg", ".jpeg", ".png"
        }:
            continue

        class_total += 1
        total_images += 1

        # Remove UUID prefix and file extension
        original_name = image.stem.split("___", 1)[-1]
        original_name = normalize(original_name)

        if original_name in mapping:
            class_matched += 1
            matched_images += 1
        else:
            unmatched_images.append(str(image))

    print(
        f"{class_folder.name}: "
        f"{class_matched}/{class_total} matched"
    )

print("\nFINAL CORRECTED MATCHING REPORT")
print("-" * 45)
print("Total images:", total_images)
print("Matched images:", matched_images)
print("Unmatched images:", len(unmatched_images))

print("\nFirst 5 unmatched examples:")
for image in unmatched_images[:5]:
    print(image)

