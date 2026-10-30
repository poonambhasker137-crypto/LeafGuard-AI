
from pathlib import Path
from PIL import Image

# Your PlantVillage dataset location
dataset_path = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master\raw\color"
)

# Check dataset location
if not dataset_path.is_dir():
    raise FileNotFoundError("Dataset folder not found!")

# Get disease class folders
classes = sorted([
    folder for folder in dataset_path.iterdir()
    if folder.is_dir()
])

total_images = 0
invalid_images = []

print("\nPLANTVILLAGE DATASET REPORT")
print("-" * 55)

for folder in classes:
    images = [
        file for file in folder.iterdir()
        if file.suffix.lower() in [".jpg", ".jpeg", ".png"]
    ]

    total_images += len(images)

    # Check whether images can be opened
    for file in images:
        try:
            with Image.open(file) as img:
                img.verify()
        except Exception:
            invalid_images.append(str(file))

    print(f"{folder.name}: {len(images)} images")

print("-" * 55)
print("Total classes:", len(classes))
print("Total images:", total_images)
print("Invalid images:", len(invalid_images))

print("\nDataset verification completed!")
