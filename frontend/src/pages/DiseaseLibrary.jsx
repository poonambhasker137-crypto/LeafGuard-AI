
import { useMemo, useState } from "react";
import {
  Search, BookOpen, ShieldCheck, AlertTriangle,
  Leaf, ArrowRight, X, Sprout, Info
} from "lucide-react";
import "./DiseaseLibrary.css";

const diseases = [
  {
    id: 1,
    plant: "Tomato",
    name: "Early Blight",
    type: "Fungal",
    symptoms: "Dark brown spots with concentric rings, often starting on older leaves. Yellowing may develop around the spots.",
    prevention: [
      "Avoid overhead watering when possible.",
      "Improve airflow through proper plant spacing.",
      "Remove infected plant debris.",
      "Rotate crops where practical."
    ],
    care: "Monitor older leaves regularly and avoid leaving infected debris in the growing area."
  },
  {
    id: 2,
    plant: "Tomato",
    name: "Late Blight",
    type: "Oomycete",
    symptoms: "Water-soaked, dark lesions on leaves and stems. Under humid conditions, whitish growth may appear on leaf undersides.",
    prevention: [
      "Avoid prolonged leaf wetness.",
      "Improve airflow around plants.",
      "Inspect plants during cool, wet weather.",
      "Remove affected material according to local guidance."
    ],
    care: "Seek local agricultural advice promptly if late blight is suspected because it can spread quickly."
  },
  {
    id: 3,
    plant: "Tomato",
    name: "Leaf Mold",
    type: "Fungal",
    symptoms: "Yellow patches on upper leaf surfaces and olive-green or brown velvety growth underneath.",
    prevention: [
      "Reduce excess humidity.",
      "Improve greenhouse ventilation.",
      "Avoid wetting foliage.",
      "Remove heavily affected leaves carefully."
    ],
    care: "Maintain airflow and monitor humidity, especially in protected growing environments."
  },
  {
    id: 4,
    plant: "Tomato",
    name: "Bacterial Spot",
    type: "Bacterial",
    symptoms: "Small dark spots on leaves, sometimes with yellow halos. Severe infections can cause leaf yellowing.",
    prevention: [
      "Use healthy planting material.",
      "Avoid handling plants when foliage is wet.",
      "Clean gardening tools.",
      "Avoid overhead irrigation where possible."
    ],
    care: "Limit movement between wet plants and consult local extension guidance for management options."
  },
  {
    id: 5,
    plant: "Tomato",
    name: "Spider Mites",
    type: "Pest",
    symptoms: "Fine yellow speckling, bronzing, and sometimes delicate webbing on leaves.",
    prevention: [
      "Inspect leaf undersides regularly.",
      "Reduce plant stress from inadequate watering.",
      "Avoid unnecessary broad-spectrum pesticide use.",
      "Monitor populations before deciding on control measures."
    ],
    care: "Check the undersides of leaves with a magnifier to confirm mite activity."
  },
  {
    id: 6,
    plant: "Tomato",
    name: "Yellow Leaf Curl Virus",
    type: "Viral",
    symptoms: "Upward curling, yellowing, reduced leaf size, and stunted plant growth.",
    prevention: [
      "Monitor whitefly populations.",
      "Use healthy transplants.",
      "Remove weeds that may host pests.",
      "Consider locally recommended resistant varieties."
    ],
    care: "Consult local agricultural guidance because viral infections cannot be cured by ordinary leaf treatments."
  },
  {
    id: 7,
    plant: "Potato",
    name: "Early Blight",
    type: "Fungal",
    symptoms: "Brown lesions with target-like rings, usually on older leaves.",
    prevention: [
      "Rotate crops.",
      "Remove infected plant residue.",
      "Maintain balanced plant nutrition.",
      "Avoid prolonged leaf wetness."
    ],
    care: "Inspect lower leaves frequently and remove infected debris after harvest."
  },
  {
    id: 8,
    plant: "Potato",
    name: "Late Blight",
    type: "Oomycete",
    symptoms: "Dark, water-soaked lesions that may enlarge rapidly in cool, humid weather.",
    prevention: [
      "Use certified healthy seed potatoes.",
      "Avoid prolonged wet foliage.",
      "Monitor weather conditions.",
      "Follow local late blight alerts."
    ],
    care: "Seek prompt expert advice when late blight symptoms appear."
  },
  {
    id: 9,
    plant: "Apple",
    name: "Apple Scab",
    type: "Fungal",
    symptoms: "Olive-green to dark, velvety spots on leaves and sometimes fruit.",
    prevention: [
      "Remove fallen infected leaves.",
      "Prune to improve airflow.",
      "Monitor during wet spring weather.",
      "Use locally suitable resistant cultivars."
    ],
    care: "Keep the orchard floor clean and follow region-specific orchard management guidance."
  },
  {
    id: 10,
    plant: "Apple",
    name: "Black Rot",
    type: "Fungal",
    symptoms: "Leaf spots with concentric rings and possible fruit or branch symptoms.",
    prevention: [
      "Prune dead or diseased branches.",
      "Remove infected fruit and debris.",
      "Disinfect pruning equipment.",
      "Improve canopy airflow."
    ],
    care: "Check branches and fruit as well as leaves for signs of infection."
  },
  {
    id: 11,
    plant: "Grape",
    name: "Black Rot",
    type: "Fungal",
    symptoms: "Brown leaf spots with dark margins; infected fruit may shrivel into hard mummies.",
    prevention: [
      "Remove infected fruit mummies.",
      "Prune for good airflow.",
      "Reduce prolonged leaf wetness.",
      "Maintain vineyard sanitation."
    ],
    care: "Inspect grape clusters and foliage throughout the growing season."
  },
  {
    id: 12,
    plant: "Corn",
    name: "Common Rust",
    type: "Fungal",
    symptoms: "Raised cinnamon-brown pustules on leaf surfaces.",
    prevention: [
      "Choose locally recommended resistant hybrids.",
      "Monitor fields regularly.",
      "Maintain balanced crop nutrition.",
      "Follow regional crop management guidance."
    ],
    care: "Assess disease severity and crop growth stage before considering any intervention."
  },
  {
    id: 13,
    plant: "Pepper",
    name: "Bacterial Spot",
    type: "Bacterial",
    symptoms: "Small water-soaked spots that turn brown, sometimes with yellow margins.",
    prevention: [
      "Use disease-free seeds or transplants.",
      "Avoid handling wet foliage.",
      "Sanitize tools.",
      "Reduce leaf wetness."
    ],
    care: "Monitor nearby pepper plants and avoid spreading contaminated water or tools."
  },
  {
    id: 14,
    plant: "Peach",
    name: "Bacterial Spot",
    type: "Bacterial",
    symptoms: "Small angular leaf spots that may fall out, leaving shot-hole-like damage.",
    prevention: [
      "Select suitable resistant varieties where available.",
      "Maintain good orchard airflow.",
      "Avoid excessive nitrogen fertilization.",
      "Follow local orchard sanitation guidance."
    ],
    care: "Inspect fruit and twigs for additional symptoms."
  },
  {
    id: 15,
    plant: "Strawberry",
    name: "Leaf Scorch",
    type: "Fungal",
    symptoms: "Numerous small purple spots that may merge into brown or scorched-looking areas.",
    prevention: [
      "Use healthy planting material.",
      "Improve air circulation.",
      "Remove affected plant debris.",
      "Avoid excessive leaf wetness."
    ],
    care: "Monitor plants during humid conditions and maintain good bed sanitation."
  },
  {
    id: 16,
    plant: "Cherry",
    name: "Powdery Mildew",
    type: "Fungal",
    symptoms: "White powdery fungal growth on leaves and tender shoots.",
    prevention: [
      "Prune for airflow.",
      "Avoid overcrowded canopies.",
      "Monitor young growth.",
      "Follow locally recommended orchard practices."
    ],
    care: "Inspect new shoots regularly because young tissue may be especially affected."
  }
];

const plants = ["All Plants", ...new Set(diseases.map((d) => d.plant))];

export default function DiseaseLibrary() {
  const [search, setSearch] = useState("");
  const [plant, setPlant] = useState("All Plants");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return diseases.filter((d) => {
      const matchesPlant = plant === "All Plants" || d.plant === plant;
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.plant.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q);

      return matchesPlant && matchesSearch;
    });
  }, [search, plant]);

  return (
    <main className="library-page">
      <section className="library-hero">
        <div className="container">
          <div className="library-tag"><BookOpen size={16} /> PLANT HEALTH KNOWLEDGE BASE</div>
          <h1>Explore the <span>Disease Library.</span></h1>
          <p>
            Learn about common plant diseases, identify possible symptoms,
            and discover general prevention and plant care practices.
          </p>

          <div className="library-search">
            <Search size={21} />
            <input
              type="search"
              placeholder="Search diseases, plants, or disease types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="container library-content">
        <div className="library-toolbar">
          <div>
            <h2>Browse Plant Conditions</h2>
            <p>{filtered.length} of {diseases.length} reference entries</p>
          </div>

          <select value={plant} onChange={(e) => setPlant(e.target.value)}>
            {plants.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="library-grid">
          {filtered.map((d) => (
            <button
              key={d.id}
              className="library-card"
              onClick={() => setSelected(d)}
            >
              <div className="library-card-top">
                <span className="library-card-icon"><Leaf size={23} /></span>
                <span className="library-type">{d.type}</span>
              </div>

              <span className="library-plant">{d.plant}</span>
              <h3>{d.name}</h3>
              <p>{d.symptoms}</p>

              <span className="library-card-link">
                View Symptoms & Prevention <ArrowRight size={17} />
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="library-empty">
            <Search size={35} />
            <h3>No matching diseases</h3>
            <p>Try a different search term or plant filter.</p>
          </div>
        )}

        <div className="library-disclaimer">
          <Info size={20} />
          <p>
            This is a curated introductory reference library, not a complete
            list of the 38 PlantVillage classes. Symptoms may overlap across
            diseases. Confirm diagnoses with reliable local agricultural
            guidance before selecting treatments.
          </p>
        </div>
      </section>

      {selected && (
        <div
          className="library-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="library-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.plant} ${selected.name} information`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="library-modal-header">
              <div>
                <span className="library-plant">{selected.plant} · {selected.type}</span>
                <h2>{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close details">
                <X size={22} />
              </button>
            </div>

            <div className="library-modal-body">
              <div className="library-detail-section">
                <h3><AlertTriangle size={19} /> Common Symptoms</h3>
                <p>{selected.symptoms}</p>
              </div>

              <div className="library-detail-section">
                <h3><ShieldCheck size={19} /> Prevention Tips</h3>
                <ul>
                  {selected.prevention.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </div>

              <div className="library-detail-section">
                <h3><Sprout size={19} /> Plant Care Guidance</h3>
                <p>{selected.care}</p>
              </div>

              <div className="library-detail-note">
                <Info size={17} />
                General educational guidance only. Confirm the condition
                before taking action.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
