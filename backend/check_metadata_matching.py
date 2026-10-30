
from pathlib import Path
import pandas as pd

repo = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

image_root = repo / "raw" / "color"
metadata_root = repo / "leaf_grouping" / "filtered_leafmaps"

csv_files = sorted(metadata_root.glob("*.csv"))

print("CSV files:", len(csv_files))
print("Image class folders:", len(list(image_root.iterdir())))

total_metadata_rows = 0
total_matched = 0
total_unmatched = 0

for csv_file in csv_files:
    class_name = csv_file.stem
    class_folder = image_root / class_name

    if not class_folder.is_dir():
        print("Class folder not found:", class_name)
        continue

    df = pd.read_csv(csv_file)

    if not {"File Name", "Leaf #"}.issubset(df.columns):
        print("Unexpected columns:", csv_file.name)
        continue

    image_names = {
        p.name.lower()
        for p in class_folder.iterdir()
        if p.is_file()
    }

    metadata_names = (
        df["File Name"]
        .dropna()
        .astype(str)
        .str.strip()
        .str.lower()
    )

    matched = metadata_names.isin(image_names).sum()

    total_metadata_rows += len(metadata_names)
    total_matched += matched
    total_unmatched += len(metadata_names) - matched

    print(
        f"{class_name}: "
        f"{matched}/{len(metadata_names)} matched"
    )

print("\nFINAL MATCHING REPORT")
print("Metadata rows:", total_metadata_rows)
print("Matched rows:", total_matched)
print("Unmatched rows:", total_unmatched)
