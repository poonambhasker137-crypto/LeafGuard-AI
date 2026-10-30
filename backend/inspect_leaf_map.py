
import json
from pathlib import Path

repo = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

# Possible mapping files
mapping_files = [
    repo / "leaf-map.json",
    repo / "leaf_grouping" / "leaf-map.json"
]

for file in mapping_files:
    if not file.exists():
        continue

    print("\nFILE:", file)

    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("Data type:", type(data).__name__)

    if isinstance(data, dict):
        print("Total keys:", len(data))

        for key, value in list(data.items())[:5]:
            print("KEY:", key)
            print("VALUE:", str(value)[:300])
            print()

    elif isinstance(data, list):
        print("Total records:", len(data))

        for record in data[:5]:
            print(str(record)[:300])
