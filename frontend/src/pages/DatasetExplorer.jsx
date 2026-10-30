
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Database,
  Search,
  Leaf,
  Layers,
  Sprout,
  Filter,
  ArrowRight,
  BrainCircuit,
  Images,
  ShieldAlert,
  CheckCircle2,
  Info
} from "lucide-react";
import "./DatasetExplorer.css";

const classNames = [
  "Apple___Apple_scab",
  "Apple___Black_rot",
  "Apple___Cedar_apple_rust",
  "Apple___healthy",
  "Blueberry___healthy",
  "Cherry_(including_sour)___Powdery_mildew",
  "Cherry_(including_sour)___healthy",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
  "Corn_(maize)___Common_rust_",
  "Corn_(maize)___Northern_Leaf_Blight",
  "Corn_(maize)___healthy",
  "Grape___Black_rot",
  "Grape___Esca_(Black_Measles)",
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
  "Grape___healthy",
  "Orange___Haunglongbing_(Citrus_greening)",
  "Peach___Bacterial_spot",
  "Peach___healthy",
  "Pepper,_bell___Bacterial_spot",
  "Pepper,_bell___healthy",
  "Potato___Early_blight",
  "Potato___Late_blight",
  "Potato___healthy",
  "Raspberry___healthy",
  "Soybean___healthy",
  "Squash___Powdery_mildew",
  "Strawberry___Leaf_scorch",
  "Strawberry___healthy",
  "Tomato___Bacterial_spot",
  "Tomato___Early_blight",
  "Tomato___Late_blight",
  "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot",
  "Tomato___Spider_mites Two-spotted_spider_mite",
  "Tomato___Target_Spot",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
  "Tomato___Tomato_mosaic_virus",
  "Tomato___healthy"
];

function formatLabel(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();
}

const categories = classNames.map((name, index) => {
  const [plant, condition] = name.split("___");

  return {
    id: index + 1,
    className: name,
    plant: formatLabel(plant),
    condition: formatLabel(condition),
    healthy: condition.toLowerCase() === "healthy"
  };
});

const plantNames = [
  "All Plants",
  ...new Set(categories.map((item) => item.plant))
].sort((a, b) => {
  if (a === "All Plants") return -1;
  if (b === "All Plants") return 1;
  return a.localeCompare(b);
});

export default function DatasetExplorer() {
  const [search, setSearch] = useState("");
  const [plantFilter, setPlantFilter] = useState("All Plants");
  const [healthFilter, setHealthFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return categories.filter((item) => {
      const matchesSearch =
        item.plant.toLowerCase().includes(query) ||
        item.condition.toLowerCase().includes(query) ||
        item.className.toLowerCase().includes(query);

      const matchesPlant =
        plantFilter === "All Plants" ||
        item.plant === plantFilter;

      const matchesHealth =
        healthFilter === "all" ||
        (healthFilter === "healthy" && item.healthy) ||
        (healthFilter === "disease" && !item.healthy);

      return matchesSearch && matchesPlant && matchesHealth;
    });
  }, [search, plantFilter, healthFilter]);

  const healthyCount = categories.filter(
    (item) => item.healthy
  ).length;

  const diseaseCount = categories.length - healthyCount;

  function resetFilters() {
    setSearch("");
    setPlantFilter("All Plants");
    setHealthFilter("all");
  }

  return (
    <main className="dataset-page">
      <section className="dataset-hero">
        <div className="dataset-container">
          <div className="dataset-eyebrow">
            <Database size={16} />
            EXPLORE THE TRAINING DATA
          </div>

          <h1>
            PlantVillage <span>Dataset Explorer.</span>
          </h1>

          <p>
            Discover the plant categories and leaf
            conditions represented in the image dataset
            used for LeafGuard AI's classification task.
          </p>
        </div>
      </section>

      <section className="dataset-container dataset-content">
        <div className="dataset-stats">
          <article className="dataset-stat">
            <Images size={27} />
            <strong>54,305</strong>
            <span>Images in project dataset</span>
          </article>

          <article className="dataset-stat">
            <Layers size={27} />
            <strong>{categories.length}</strong>
            <span>Classification categories</span>
          </article>

          <article className="dataset-stat">
            <Sprout size={27} />
            <strong>{plantNames.length - 1}</strong>
            <span>Plant types</span>
          </article>

          <article className="dataset-stat">
            <Leaf size={27} />
            <strong>{diseaseCount}</strong>
            <span>Non-healthy categories</span>
          </article>
        </div>

        <div className="dataset-section-heading">
          <span>DATASET CATALOG</span>
          <h2>Explore Classification Categories</h2>
          <p>
            Search by plant or condition and filter
            categories to explore the available labels.
          </p>
        </div>

        <div className="dataset-toolbar">
          <div className="dataset-search">
            <Search size={20} />
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tomato, apple, blight..."
              aria-label="Search dataset categories"
            />
          </div>

          <div className="dataset-select">
            <Filter size={18} />
            <select
              value={plantFilter}
              onChange={(event) =>
                setPlantFilter(event.target.value)
              }
              aria-label="Filter by plant"
            >
              {plantNames.map((plant) => (
                <option key={plant} value={plant}>
                  {plant}
                </option>
              ))}
            </select>
          </div>

          <div className="dataset-select">
            <Leaf size={18} />
            <select
              value={healthFilter}
              onChange={(event) =>
                setHealthFilter(event.target.value)
              }
              aria-label="Filter by condition"
            >
              <option value="all">All Conditions</option>
              <option value="healthy">Healthy Only</option>
              <option value="disease">Other Conditions</option>
            </select>
          </div>
        </div>

        <div className="dataset-result-heading">
          <p>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{categories.length}</strong> categories
          </p>

          <button type="button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="dataset-grid">
            {filtered.map((item) => (
              <button
                type="button"
                className="dataset-card"
                key={item.className}
                onClick={() => setSelected(item)}
              >
                <div className="dataset-card-top">
                  <div className="dataset-card-icon">
                    <Leaf size={24} />
                  </div>
                  <span className="dataset-card-number">
                    #{String(item.id).padStart(2, "0")}
                  </span>
                </div>

                <span className="dataset-card-plant">
                  {item.plant}
                </span>

                <h3>{item.condition}</h3>

                <div className="dataset-card-bottom">
                  <span
                    className={
                      item.healthy
                        ? "dataset-tag healthy"
                        : "dataset-tag disease"
                    }
                  >
                    {item.healthy
                      ? "Healthy Label"
                      : "Condition Label"}
                  </span>

                  <ArrowRight size={18} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="dataset-empty">
            <Search size={35} />
            <h3>No matching categories</h3>
            <p>
              Try another search or clear your filters.
            </p>
            <button type="button" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        )}

        <div className="dataset-section-heading dataset-spaced">
          <span>DATA PREPARATION</span>
          <h2>How the Dataset Was Used</h2>
          <p>
            LeafGuard AI's experimental CNN was trained
            using labeled plant leaf images.
          </p>
        </div>

        <div className="dataset-process-grid">
          <div className="dataset-process-card">
            <Database size={25} />
            <h3>Dataset Collection</h3>
            <p>
              The project uses a PlantVillage image
              collection containing 54,305 labeled images.
            </p>
          </div>

          <div className="dataset-process-card">
            <Layers size={25} />
            <h3>Data Splitting</h3>
            <p>
              Images were divided into training,
              validation, and test sets using a
              stratified 70/15/15 split.
            </p>
          </div>

          <div className="dataset-process-card">
            <BrainCircuit size={25} />
            <h3>CNN Training</h3>
            <p>
              A convolutional neural network learned
              image patterns associated with the
              dataset's classification labels.
            </p>
          </div>
        </div>

        <div className="dataset-split-panel">
          <h3>Dataset Split</h3>
          <p>Approximate percentage of images in each set</p>

          <div className="dataset-split-bar">
            <div className="dataset-train">70%</div>
            <div className="dataset-val">15%</div>
            <div className="dataset-test">15%</div>
          </div>

          <div className="dataset-split-legend">
            <span>Training — 70%</span>
            <span>Validation — 15%</span>
            <span>Testing — 15%</span>
          </div>
        </div>

        <div className="dataset-info">
          <Info size={22} />
          <p>
            This page displays the 38 class labels,
            not the actual image files or per-class
            image counts. The dataset statistics
            describe the collection used in the project.
          </p>
        </div>

        <div className="dataset-info dataset-warning">
          <ShieldAlert size={22} />
          <p>
            PlantVillage images may differ from
            photographs taken in real fields.
            The current experimental model has limited
            validation accuracy, so predictions should
            not be treated as confirmed diagnoses.
          </p>
        </div>

        <div className="dataset-bottom-links">
          <Link to="/technology">
            Explore AI Technology
            <ArrowRight size={17} />
          </Link>

          <Link to="/scanner">
            Try AI Scanner
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {selected && (
        <div
          className="dataset-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="dataset-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Dataset category details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dataset-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="dataset-card-icon">
              <Leaf size={27} />
            </div>

            <span className="dataset-card-plant">
              {selected.plant}
            </span>

            <h2>{selected.condition}</h2>

            <div className="dataset-modal-detail">
              <span>Class number</span>
              <strong>{selected.id} / 38</strong>
            </div>

            <div className="dataset-modal-detail">
              <span>Plant</span>
              <strong>{selected.plant}</strong>
            </div>

            <div className="dataset-modal-detail">
              <span>Classification label</span>
              <strong>{selected.condition}</strong>
            </div>

            <div className="dataset-modal-detail">
              <span>Category type</span>
              <strong>
                {selected.healthy
                  ? "Healthy"
                  : "Non-healthy"}
              </strong>
            </div>

            <div className="dataset-modal-class">
              <span>Original class name</span>
              <code>{selected.className}</code>
            </div>

            <p className="dataset-modal-note">
              <CheckCircle2 size={17} />
              This is a dataset label, not a diagnosis.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
