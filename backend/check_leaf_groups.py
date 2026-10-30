
from pathlib import Path

# PlantVillage repository location
repo_path = Path(
    r"C:\Users\Alka Kashyap\Downloads\leaf\PlantVillage-Dataset-master\PlantVillage-Dataset-master"
)

# Leaf grouping metadata
group_path = repo_path / "leaf_grouping"

print("\nLEAF GROUPING METADATA")
print("-" * 50)

if not group_path.exists():
    print("Leaf grouping folder not found!")
else:
    files = sorted(group_path.rglob("*"))

    print("Folder:", group_path)
    print("\nContents:")

    for file in files[:40]:
        print(
            "[DIR] " if file.is_dir() else "[FILE]",
            file.relative_to(group_path)
        )

    print("\nTotal files:",
          sum(file.is_file() for file in files))

print("\nInspection completed!")
