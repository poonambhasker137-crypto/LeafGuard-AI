
import { useState } from "react";
import {
  Sprout, Droplets, Sun, Layers, Wind,
  CalendarDays, CheckCircle2, ArrowRight,
  Sparkles, AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import "./PlantCare.css";

const plants = {
  Tomato: {
    subtitle: "Warm-season vegetable crop",
    water: "Water deeply and consistently at soil level. Check soil moisture and avoid waterlogging.",
    light: "Usually needs at least 6–8 hours of direct sunlight daily.",
    soil: "Use fertile, well-draining soil with appropriate nutrients and organic matter.",
    environment: "Provide airflow and support growing stems. Protect from extreme temperatures.",
    tasks: [
      "Check soil moisture",
      "Inspect leaves for spots or pests",
      "Check plant support",
      "Remove fallen plant debris",
      "Look for signs of nutrient stress"
    ]
  },
  Potato: {
    subtitle: "Cool-season tuber crop",
    water: "Maintain consistent soil moisture, particularly during tuber development, without saturating the soil.",
    light: "Grow in a sunny location, generally with 6 or more hours of direct light.",
    soil: "Choose loose, well-draining soil and hill soil around stems as plants develop.",
    environment: "Avoid prolonged wet foliage and monitor weather conditions favorable to blight.",
    tasks: [
      "Check soil moisture",
      "Inspect foliage for blight symptoms",
      "Check soil coverage around tubers",
      "Monitor pests",
      "Remove diseased debris safely"
    ]
  },
  Apple: {
    subtitle: "Temperate fruit tree",
    water: "Water according to tree age, weather, and soil moisture. Young trees generally need closer monitoring.",
    light: "Choose a location with full sun for healthy growth and fruit production.",
    soil: "Prefer well-draining soil and manage nutrients based on local soil conditions.",
    environment: "Use appropriate pruning and orchard hygiene to support airflow and reduce disease pressure.",
    tasks: [
      "Check soil moisture",
      "Inspect leaves and fruit",
      "Monitor insect activity",
      "Check for damaged branches",
      "Remove fallen diseased material"
    ]
  },
  Grape: {
    subtitle: "Climbing fruit vine",
    water: "Irrigate based on soil conditions and vine growth stage, avoiding unnecessary water stress.",
    light: "Grow in a sunny location with good canopy exposure.",
    soil: "Use well-draining soil and avoid excessive fertilizer without assessing plant needs.",
    environment: "Maintain a suitable trellis and canopy airflow to reduce humidity around foliage.",
    tasks: [
      "Inspect leaves and grape clusters",
      "Check soil moisture",
      "Monitor canopy ventilation",
      "Look for fungal symptoms",
      "Check vine supports"
    ]
  },
  Pepper: {
    subtitle: "Warm-season vegetable crop",
    water: "Maintain even soil moisture and avoid letting roots remain waterlogged.",
    light: "Generally grows best with plenty of direct sunlight.",
    soil: "Use fertile, well-draining soil with balanced nutrients.",
    environment: "Protect from cold conditions and monitor insects that may spread plant diseases.",
    tasks: [
      "Check soil moisture",
      "Inspect leaf undersides",
      "Monitor flowering and fruit development",
      "Check for discoloration",
      "Remove plant debris"
    ]
  },
  Strawberry: {
    subtitle: "Low-growing fruit crop",
    water: "Keep soil evenly moist while minimizing prolonged leaf and fruit wetness.",
    light: "Provide a sunny location suited to the local climate.",
    soil: "Use well-draining soil and suitable mulch to reduce contact between fruit and soil.",
    environment: "Maintain spacing and remove damaged or rotting fruit promptly.",
    tasks: [
      "Check moisture near roots",
      "Inspect berries for rot",
      "Monitor leaf spots",
      "Check mulch condition",
      "Remove damaged fruit"
    ]
  }
};

const categories = [
  {
    title: "Watering",
    key: "water",
    icon: Droplets
  },
  {
    title: "Sunlight",
    key: "light",
    icon: Sun
  },
  {
    title: "Soil & Nutrition",
    key: "soil",
    icon: Layers
  },
  {
    title: "Growing Environment",
    key: "environment",
    icon: Wind
  }
];

export default function PlantCare() {
  const [selectedPlant, setSelectedPlant] = useState("Tomato");
  const [completed, setCompleted] = useState([]);

  const plant = plants[selectedPlant];

  function changePlant(name) {
    setSelectedPlant(name);
    setCompleted([]);
  }

  function toggleTask(index) {
    setCompleted((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    );
  }

  const progress = Math.round(
    (completed.length / plant.tasks.length) * 100
  );

  return (
    <main className="care-page">
      <section className="care-hero">
        <div className="care-container">
          <span className="care-eyebrow">
            <Sparkles size={15} />
            LEAFGUARD PLANT CARE HUB
          </span>

          <h1>
            Better care.
            <br />
            <span>Healthier plants.</span>
          </h1>

          <p>
            Discover practical watering, sunlight, soil, and
            growing guidance for your favorite plants.
          </p>

          <a href="#care-explorer" className="care-primary">
            Explore Plant Care
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section
        id="care-explorer"
        className="care-container care-explorer"
      >
        <div className="care-heading">
          <span>PERSONALIZED PLANT GUIDES</span>
          <h2>Choose your plant.</h2>
          <p>
            Select a crop to view its general care recommendations.
          </p>
        </div>

        <div className="care-plant-buttons">
          {Object.keys(plants).map((name) => (
            <button
              key={name}
              className={
                selectedPlant === name ? "active" : ""
              }
              onClick={() => changePlant(name)}
            >
              <Sprout size={16} />
              {name}
            </button>
          ))}
        </div>

        <div className="care-selected">
          <div className="care-selected-icon">
            <Sprout size={30} />
          </div>
          <div>
            <span>SELECTED CROP</span>
            <h3>{selectedPlant}</h3>
            <p>{plant.subtitle}</p>
          </div>
        </div>

        <div className="care-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                className="care-info-card"
                key={category.key}
              >
                <div className="care-info-icon">
                  <Icon size={24} />
                </div>
                <h3>{category.title}</h3>
                <p>{plant[category.key]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="care-checklist-section">
        <div className="care-container">
          <div className="care-heading">
            <span>INTERACTIVE PLANT CARE</span>
            <h2>Your care checklist.</h2>
            <p>
              Mark each task as complete while inspecting
              your {selectedPlant.toLowerCase()} plant.
            </p>
          </div>

          <div className="care-checklist">
            <div className="care-checklist-top">
              <div>
                <CalendarDays size={25} />
                <h3>{selectedPlant} Care Tasks</h3>
              </div>
              <strong>{progress}% complete</strong>
            </div>

            <div
              className="care-progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Care checklist progress"
            >
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="care-tasks">
              {plant.tasks.map((task, index) => {
                const checked = completed.includes(index);

                return (
                  <button
                    key={task}
                    className={
                      `care-task ${checked ? "done" : ""}`
                    }
                    onClick={() => toggleTask(index)}
                    aria-pressed={checked}
                  >
                    <CheckCircle2 size={21} />
                    <span>{task}</span>
                  </button>
                );
              })}
            </div>

            {progress === 100 && (
              <div className="care-success">
                <CheckCircle2 size={19} />
                All tasks checked for this session!
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="care-container care-bottom">
        <div className="care-notice">
          <AlertTriangle size={21} />
          <p>
            These are general educational recommendations.
            Plant needs vary with climate, soil, variety,
            and growth stage. Consult local agricultural
            guidance for specific decisions.
          </p>
        </div>

        <div className="care-cta">
          <div>
            <span>AI LEAF ANALYSIS</span>
            <h2>Does your plant look unhealthy?</h2>
            <p>
              Upload a leaf image to explore an experimental
              AI disease prediction.
            </p>
          </div>

          <Link to="/scanner">
            Scan a Leaf <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
