
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

train = pd.read_csv(RESULTS / "train.csv")
val = pd.read_csv(RESULTS / "val.csv")

print("\nLEAFGUARD AI - CLASS BALANCE REPORT")
print("-" * 50)

train_counts = train["class_name"].value_counts()
val_counts = val["class_name"].value_counts()

print("\nTOP 10 LARGEST TRAINING CLASSES:")
print(train_counts.head(10).to_string())

print("\nTOP 10 SMALLEST TRAINING CLASSES:")
print(train_counts.tail(10).to_string())

print("\nTRAINING CLASS STATISTICS:")
print("Largest class:", train_counts.max())
print("Smallest class:", train_counts.min())
print(
    "Largest/smallest ratio:",
    round(train_counts.max() / train_counts.min(), 2)
)

# Save a report for future analysis
report = pd.DataFrame({
    "class_name": sorted(train["class_name"].unique())
})

report["train_images"] = (
    report["class_name"]
    .map(train_counts)
)

report["val_images"] = (
    report["class_name"]
    .map(val_counts)
)

report.to_csv(
    RESULTS / "class_balance_report.csv",
    index=False
)

print("\nReport saved successfully.")
