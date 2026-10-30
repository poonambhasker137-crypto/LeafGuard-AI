
from pathlib import Path
import pandas as pd

# Original PlantVillage dataset
DATASET_PATH = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master\raw\color"
)

# Output directory
RESULTS_PATH = Path("results")
RESULTS_PATH.mkdir(parents=True, exist_ok=True)

# Supported image extensions
EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Verify dataset path
if not DATASET_PATH.is_dir():
    raise FileNotFoundError("Dataset path not found!")

records = []

# Read all class folders
for class_folder in sorted(DATASET_PATH.iterdir()):

    if not class_folder.is_dir():
        continue

    class_name = class_folder.name

    for image_path in sorted(class_folder.iterdir()):

        if image_path.suffix.lower() not in EXTENSIONS:
            continue

        records.append({
            "image_path": str(image_path),
            "class_name": class_name,
            "filename": image_path.name
        })

# Create dataframe
df = pd.DataFrame(records)

# Assign numeric class labels
class_names = sorted(df["class_name"].unique())
class_to_id = {
    name: index
    for index, name in enumerate(class_names)
}

df["class_id"] = df["class_name"].map(class_to_id)

# Save dataset inventory
output_file = RESULTS_PATH / "dataset_inventory.csv"
df.to_csv(output_file, index=False)

print("\nDATA PREPROCESSING - STAGE 1")
print("-" * 45)
print("Total images:", len(df))
print("Total classes:", len(class_names))
print("Missing paths:", sum(
    not Path(p).is_file() for p in df["image_path"]
))
print("\nClass distribution:")
print(df["class_name"].value_counts().sort_index())
print("\nInventory saved to:", output_file)
