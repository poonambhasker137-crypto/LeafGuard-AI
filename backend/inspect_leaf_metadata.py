
from pathlib import Path
import pandas as pd

repo = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

metadata_dir = repo / "leaf_grouping" / "filtered_leafmaps"

# Find CSV files
csv_files = sorted(metadata_dir.glob("*.csv"))

print("Total CSV files:", len(csv_files))

if not csv_files:
    raise FileNotFoundError("No CSV files found!")

# Inspect one example
csv_path = next(
    (p for p in csv_files if "Tomato" in p.name),
    csv_files[0]
)

print("\nSelected file:", csv_path.name)

df = pd.read_csv(csv_path)

print("\nColumn names:")
print(df.columns.tolist())

print("\nFirst five rows:")
print(df.head().to_string(index=False))

print("\nDataset shape:")
print(df.shape)
