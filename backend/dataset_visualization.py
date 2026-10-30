
from pathlib import Path
from collections import Counter
from PIL import Image
import matplotlib.pyplot as plt

# Dataset location
dataset_path = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master\raw\color"
)

# Output folder
results_path = Path("results")
results_path.mkdir(exist_ok=True)

# Get class folders
classes = sorted([
    folder for folder in dataset_path.iterdir()
    if folder.is_dir()
])

# Count images
counts = {}

for folder in classes:
    images = [
        file for file in folder.iterdir()
        if file.suffix.lower() in [".jpg", ".jpeg", ".png"]
    ]
    counts[folder.name] = len(images)

# Plot class distribution
plt.figure(figsize=(14, 12))
plt.barh(list(counts.keys()), list(counts.values()))
plt.xlabel("Number of Images")
plt.ylabel("Disease Classes")
plt.title("PlantVillage Dataset - Class Distribution")
plt.tight_layout()
plt.savefig(results_path / "class_distribution.png", dpi=200)
plt.show()

# Display 12 sample leaf images
fig, axes = plt.subplots(3, 4, figsize=(14, 11))

for ax, folder in zip(axes.flat, classes[:12]):
    image_files = sorted(folder.glob("*.JPG")) + sorted(
        folder.glob("*.jpg")
    )

    if image_files:
        with Image.open(image_files[0]) as img:
            ax.imshow(img.convert("RGB"))

    ax.set_title(folder.name.replace("___", "\n"), fontsize=9)
    ax.axis("off")

plt.tight_layout()
plt.savefig(results_path / "sample_leaves.png", dpi=200)
plt.show()

print("Dataset visualizations saved successfully!")
