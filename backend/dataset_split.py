
from pathlib import Path
from collections import defaultdict
import json
import re
import numpy as np
import pandas as pd

# ==========================================
# 1. CONFIGURATION
# ==========================================

REPO = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

IMAGE_ROOT = REPO / "raw" / "color"
MAP_PATH = REPO / "leaf-map.json"

OUTPUT = Path("results")
OUTPUT.mkdir(parents=True, exist_ok=True)

SEED = 42
rng = np.random.default_rng(SEED)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# ==========================================
# 2. LOAD LEAF GROUP METADATA
# ==========================================

with open(MAP_PATH, "r", encoding="utf-8") as f:
    leaf_map = json.load(f)

def normalize(value):
    return " ".join(str(value).strip().lower().split())

mapping = {
    normalize(key): value
    for key, value in leaf_map.items()
}

print("Leaf mapping loaded:", len(mapping))

# ==========================================
# 3. COLLECT ALL DATASET IMAGES
# ==========================================

records = []

for class_folder in sorted(IMAGE_ROOT.iterdir()):

    if not class_folder.is_dir():
        continue

    class_name = class_folder.name

    for image in sorted(class_folder.iterdir()):

        if image.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        original_name = normalize(
            image.stem.split("___", 1)[-1]
        )

        entries = mapping.get(original_name, [])

        group_ids = set()

        for entry in entries:
            parts = str(entry).rsplit(":::", 1)

            if len(parts) != 2:
                continue

            label, group_id = parts

            if label == class_name:
                group_ids.add(group_id)

        if len(group_ids) == 1:

            group_id = next(iter(group_ids))

            group_key = (
                f"verified::{class_name}::{group_id}"
            )

            status = "verified_group"

        else:
            # Provisional grouping for images without
            # reliable leaf-group metadata.
            # Same original filename stays together.
            group_key = (
                f"unverified::{class_name}::{original_name}"
            )

            status = "unverified_group"

        records.append({
            "image_path": str(image.resolve()),
            "class_name": class_name,
            "group_key": group_key,
            "metadata_status": status
        })

df = pd.DataFrame(records)

classes = sorted(df["class_name"].unique())

class_to_id = {
    name: index
    for index, name in enumerate(classes)
}

df["class_id"] = df["class_name"].map(class_to_id)

print("\nTotal images:", len(df))
print("Total classes:", len(classes))

print("\nMetadata status:")
print(df["metadata_status"].value_counts())

# ==========================================
# 4. SPLIT DATASET BY GROUPS
# ==========================================

split_records = []

for class_name, class_df in df.groupby("class_name"):

    # Convert to NumPy array to avoid
    # the StringArray shuffle warning.
    groups = np.array(
        sorted(class_df["group_key"].unique().tolist()),
        dtype=object
    )

    rng.shuffle(groups)

    n_groups = len(groups)

    if n_groups < 3:
        raise ValueError(
            f"Not enough groups for {class_name}: {n_groups}"
        )

    train_end = max(1, int(n_groups * 0.70))
    val_end = max(
        train_end + 1,
        int(n_groups * 0.85)
    )

    train_groups = set(groups[:train_end])
    val_groups = set(groups[train_end:val_end])
    test_groups = set(groups[val_end:])

    for row in class_df.itertuples(index=False):

        if row.group_key in train_groups:
            split = "train"

        elif row.group_key in val_groups:
            split = "val"

        else:
            split = "test"

        split_records.append({
            "image_path": row.image_path,
            "class_name": row.class_name,
            "class_id": row.class_id,
            "group_key": row.group_key,
            "metadata_status": row.metadata_status,
            "split": split
        })

split_df = pd.DataFrame(split_records)

# ==========================================
# 5. VERIFY SPLITS
# ==========================================

assert len(split_df) == len(df), (
    "Some images are missing from the split!"
)

assert split_df["image_path"].is_unique, (
    "Duplicate image paths detected!"
)

group_check = (
    split_df.groupby("group_key")["split"].nunique()
)

assert group_check.max() == 1, (
    "Group leakage detected!"
)

# Check all 38 classes in each split
for split_name in ["train", "val", "test"]:

    subset = split_df[
        split_df["split"] == split_name
    ]

    if subset["class_name"].nunique() != len(classes):
        raise ValueError(
            f"{split_name} does not contain all classes!"
        )

# ==========================================
# 6. SAVE CSV FILES
# ==========================================

for split_name in ["train", "val", "test"]:

    subset = split_df[
        split_df["split"] == split_name
    ]

    subset.to_csv(
        OUTPUT / f"{split_name}.csv",
        index=False
    )

split_df.to_csv(
    OUTPUT / "complete_dataset_split.csv",
    index=False
)

with open(
    OUTPUT / "class_names.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(classes, f, indent=4)

# ==========================================
# 7. FINAL REPORT
# ==========================================

print("\nFINAL DATASET SPLITTING REPORT")
print("=" * 50)

print("Total images:", len(split_df))
print("Total classes:", len(classes))

print("\nImages per split:")
print(split_df["split"].value_counts())

print("\nClasses per split:")
print(
    split_df.groupby("split")["class_name"].nunique()
)

print("\nMetadata status per split:")
print(
    pd.crosstab(
        split_df["split"],
        split_df["metadata_status"]
    )
)

print("\nGroup assignment check: PASSED")
print(
    "Note: Unverified groups still require "
    "duplicate/leaf-overlap assessment."
)

print("\nFiles saved in results folder.")


