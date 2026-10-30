
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "results"

train = pd.read_csv(RESULTS / "train.csv")
val = pd.read_csv(RESULTS / "val.csv")
test = pd.read_csv(RESULTS / "test.csv")

print("\nLEAFGUARD AI - LABEL CONSISTENCY CHECK")
print("-" * 50)

all_data = pd.concat(
    [train, val, test],
    ignore_index=True
)

# Each class must have exactly one ID.
class_id_counts = (
    all_data.groupby("class_name")["class_id"]
    .nunique()
)

# Each ID must represent exactly one class.
id_class_counts = (
    all_data.groupby("class_id")["class_name"]
    .nunique()
)

print("Total classes:", all_data["class_name"].nunique())
print("Total class IDs:", all_data["class_id"].nunique())

print("\nClasses with multiple IDs:")
print(class_id_counts[class_id_counts > 1])

print("\nIDs assigned to multiple classes:")
print(id_class_counts[id_class_counts > 1])

print("\nClass mapping:")
mapping = (
    all_data[["class_id", "class_name"]]
    .drop_duplicates()
    .sort_values("class_id")
)

print(mapping.to_string(index=False))

if (
    (class_id_counts == 1).all()
    and (id_class_counts == 1).all()
    and sorted(mapping["class_id"].tolist())
        == list(range(len(mapping)))
):
    print("\nRESULT: LABEL CONSISTENCY PASSED")
else:
    print("\nRESULT: LABEL CONSISTENCY FAILED")
