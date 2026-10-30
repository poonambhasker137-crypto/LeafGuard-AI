
from pathlib import Path
import json
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

with open(RESULTS / "class_names.json", "r", encoding="utf-8") as f:
    class_names = json.load(f)

total_images = 0
total_mismatches = 0

for split in ["train", "val", "test"]:
    df = pd.read_csv(RESULTS / f"{split}.csv")

    mismatches = []

    for _, row in df.iterrows():
        image_path = Path(str(row["image_path"]))
        class_id = int(row["class_id"])

        expected_class = class_names[class_id]
        actual_class = image_path.parent.name

        if actual_class != expected_class:
            mismatches.append({
                "image": str(image_path),
                "actual": actual_class,
                "expected": expected_class
            })

    print(f"\n{split.upper()} images: {len(df)}")
    print(f"Label mismatches: {len(mismatches)}")

    for error in mismatches[:3]:
        print(error)

    total_images += len(df)
    total_mismatches += len(mismatches)

print("\n================================")
print("TOTAL IMAGES:", total_images)
print("TOTAL LABEL MISMATCHES:", total_mismatches)
print("================================")
