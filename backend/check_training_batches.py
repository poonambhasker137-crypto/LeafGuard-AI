
import pandas as pd
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

train = pd.read_csv(RESULTS / "train.csv")
val = pd.read_csv(RESULTS / "val.csv")

# Our CNN test used 20 training batches
# and 5 validation batches, each of size 16.
train_sample = train.head(320)
val_sample = val.head(80)

train_classes = set(train_sample["class_name"])
val_classes = set(val_sample["class_name"])

print("\nLEAFGUARD AI BATCH ANALYSIS")
print("-" * 45)

print("Training sample classes:", len(train_classes))
print("Validation sample classes:", len(val_classes))

print("\nClasses common to both samples:")
common = sorted(train_classes & val_classes)

for name in common:
    print(name)

print("\nNumber of common classes:", len(common))

print("\nValidation sample distribution:")
print(val_sample["class_name"].value_counts())
