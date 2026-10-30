
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from pathlib import Path
import json

import pandas as pd
import tensorflow as tf

# =====================================
# 1. PROJECT CONFIGURATION
# =====================================

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
AUTOTUNE = tf.data.AUTOTUNE

# =====================================
# 2. LOAD DATASET FILES
# =====================================

train_df = pd.read_csv(RESULTS / "train.csv")
val_df = pd.read_csv(RESULTS / "val.csv")
test_df = pd.read_csv(RESULTS / "test.csv")

with open(RESULTS / "class_names.json", "r", encoding="utf-8") as f:
    class_data = json.load(f)

if isinstance(class_data, list):
    class_names = class_data
elif isinstance(class_data, dict):
    class_names = [
        class_data[str(i)]
        for i in range(len(class_data))
    ]
else:
    raise ValueError("Invalid class_names.json format")

NUM_CLASSES = len(class_names)

# =====================================
# 3. VALIDATE CLASS IDS AND IMAGE PATHS
# =====================================

for split_name, df in [
    ("Training", train_df),
    ("Validation", val_df),
    ("Testing", test_df)
]:
    required_columns = {"image_path", "class_id"}

    if not required_columns.issubset(df.columns):
        raise ValueError(
            f"{split_name} CSV is missing required columns"
        )

    if df.empty:
        raise ValueError(f"{split_name} dataset is empty")

    if df[["image_path", "class_id"]].isnull().any().any():
        raise ValueError(
            f"{split_name} dataset contains missing values"
        )

    ids = df["class_id"].astype(int)

    if not ids.between(0, NUM_CLASSES - 1).all():
        raise ValueError(
            f"{split_name} contains invalid class IDs"
        )

    missing_paths = [
        path for path in df["image_path"].astype(str)
        if not Path(path).is_file()
    ]

    if missing_paths:
        raise FileNotFoundError(
            f"{split_name} contains missing images. "
            f"Example: {missing_paths[0]}"
        )

print("\nDataset validation completed!")
print("Training images:", len(train_df))
print("Validation images:", len(val_df))
print("Testing images:", len(test_df))
print("Total classes:", NUM_CLASSES)

# =====================================
# 4. LOAD AND RESIZE IMAGE
# =====================================

def load_image(path, label):

    image = tf.io.read_file(path)

    image = tf.io.decode_image(
        image,
        channels=3,
        expand_animations=False
    )

    image.set_shape([None, None, 3])

    image = tf.image.resize(
        image,
        IMG_SIZE,
        method="bilinear"
    )

    image = tf.cast(image, tf.float32)

    # IMPORTANT:
    # Keep pixel values between 0 and 255.
    # The CNN already contains Rescaling(1/255).
    # Do NOT normalize the image again here.

    label = tf.cast(label, tf.int32)

    return image, label

# =====================================
# 5. DATA AUGMENTATION
# =====================================

augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip(
        "horizontal_and_vertical"
    ),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
])

# =====================================
# 6. CREATE TENSORFLOW DATASET
# =====================================

def create_dataset(df, training=False):

    paths = df["image_path"].astype(str).tolist()
    labels = df["class_id"].astype("int32").tolist()

    dataset = tf.data.Dataset.from_tensor_slices(
        (paths, labels)
    )

    if training:
        dataset = dataset.shuffle(
            buffer_size=min(len(df), 2000),
            seed=42,
            reshuffle_each_iteration=True
        )

    dataset = dataset.map(
        load_image,
        num_parallel_calls=AUTOTUNE
    )

    dataset = dataset.batch(BATCH_SIZE)

    if training:
        dataset = dataset.map(
            lambda images, labels: (
                augmentation(images, training=True),
                labels
            ),
            num_parallel_calls=AUTOTUNE
        )

    dataset = dataset.prefetch(AUTOTUNE)

    return dataset

# =====================================
# 7. PREPARE DATASETS
# =====================================

train_ds = create_dataset(
    train_df,
    training=True
)

val_ds = create_dataset(
    val_df,
    training=False
)

test_ds = create_dataset(
    test_df,
    training=False
)

# =====================================
# 8. TEST PREPROCESSING
# =====================================

if __name__ == "__main__":

    print("\nLEAFGUARD AI PREPROCESSING REPORT")
    print("-" * 45)

    for images, labels in train_ds.take(1):

        print("Batch image shape:", images.shape)
        print("Batch label shape:", labels.shape)

        print(
            "Pixel range:",
            float(tf.reduce_min(images)),
            "to",
            float(tf.reduce_max(images))
        )

        print("Image dtype:", images.dtype)
        print("Label dtype:", labels.dtype)

    print("\nImage preprocessing pipeline ready!")
