
import { useState } from "react";
import {
  ShieldCheck, Droplets, Wind, Sprout,
  SearchCheck, Bug, ChevronDown, ChevronUp,
  AlertTriangle, ArrowRight, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Prevention.css";

const guides = [
  {
    title: "Watering & Moisture",
    icon: Droplets,
    description: "Reduce conditions that encourage many leaf diseases.",
    tips: [
      "Water near the base of plants rather than soaking foliage.",
      "Avoid leaving leaves wet for long periods.",
      "Check soil moisture before watering again.",
      "Ensure containers and beds have adequate drainage."
    ]
  },
  {
    title: "Airflow & Spacing",
    icon: Wind,
    description: "Help foliage dry and reduce crowded growing conditions.",
    tips: [
      "Follow crop-specific spacing recommendations.",
      "Improve ventilation in greenhouses.",
      "Prune only where appropriate for the crop.",
      "Avoid overcrowding seedlings and mature plants."
    ]
  },
  {
    title: "Plant Hygiene",
    icon: ShieldCheck,
    description: "Limit the movement of pathogens between plants.",
    tips: [
      "Clean gardening tools between affected plants.",
      "Remove diseased debris using appropriate precautions.",
      "Avoid working with plants while foliage is wet.",
      "Use healthy seeds and planting material."
    ]
  },
  {
    title: "Early Disease Monitoring",
    icon: SearchCheck,
    description: "Notice potential problems before they spread.",
    tips: [
      "Inspect both sides of leaves regularly.",
      "Watch for spots, curling, yellowing, and unusual growth.",
      "Photograph changing symptoms for comparison.",
      "Seek expert advice for rapidly spreading symptoms."
    ]
  },
  {
    title: "Pest Management",
    icon: Bug,
    description: "Monitor pests that damage plants or spread viruses.",
    tips: [
      "Check leaf undersides for mites, whiteflies, and other pests.",
      "Keep weeds and crop residues managed appropriately.",
      "Encourage beneficial organisms where suitable.",
      "Use locally approved pest management guidance."
    ]
  },
  {
    title: "Healthy Growing Practices",
    icon: Sprout,
    description: "Support healthy plants through suitable growing conditions.",
    tips: [
      "Choose varieties appropriate for your climate.",
      "Maintain balanced nutrition based on plant needs.",
      "Rotate crops when practical.",
      "Avoid unnecessary plant stress."
    ]
  }
];

const cropGuides = {
  Tomato: [
    "Monitor lower leaves for early blight symptoms.",
    "Check for whiteflies and spider mites.",
    "Avoid prolonged wet foliage.",
    "Use locally recommended resistant varieties where suitable."
  ],
  Potato: [
    "Watch for late blight during cool, wet conditions.",
    "Use healthy seed potatoes.",
    "Manage infected crop residue.",
    "Follow regional late blight advisories."
  ],
  Apple: [
    "Remove fallen leaves that may carry fungal pathogens.",
    "Prune appropriately for better airflow.",
    "Monitor for apple scab during wet weather.",
    "Maintain orchard sanitation."
  ],
  Grape: [
    "Remove infected fruit and plant debris.",
    "Maintain appropriate canopy ventilation.",
    "Monitor leaves and grape clusters regularly.",
    "Follow local vineyard disease management advice."
  ]
};

export default function Prevention() {
  const [expanded, setExpanded] = useState(0);
  const [crop, setCrop] = useState("Tomato");

  return (
    <main className="prevention-page">
      <section className="prevention-hero">
        <div className="container">
          <span className="prevention-eyebrow">
            <Sparkles size={15} /> LEAFGUARD PREVENTION CENTER
          </span>
          <h1>
            Protect today.
            <br />
            <span>Grow healthier tomorrow.</span>
          </h1>
          <p>
            Explore practical plant hygiene, disease prevention,
            and crop care strategies to support healthier growing.
          </p>
          <a href="#prevention-guides" className="prevention-primary">
            Explore Prevention Guides <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="prevention-guides" className="container prevention-content">
        <div className="prevention-section-heading">
          <span>PREVENTION ESSENTIALS</span>
          <h2>Six habits for healthier plants.</h2>
          <p>Click any guide to view its recommended practices.</p>
        </div>

        <div className="prevention-guides">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            const open = expanded === index;

            return (
              <div className={`prevention-guide ${open ? "open" : ""}`} key={guide.title}>
                <button
                  className="prevention-guide-button"
                  onClick={() => setExpanded(open ? -1 : index)}
                  aria-expanded={open}
                >
                  <span className="prevention-guide-icon"><Icon size={23} /></span>
                  <span className="prevention-guide-title">
                    <strong>{guide.title}</strong>
                    <small>{guide.description}</small>
                  </span>
                  {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {open && (
                  <ul className="prevention-tips">
                    {guide.tips.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="prevention-crop-section">
        <div className="container">
          <div className="prevention-section-heading">
            <span>CROP-SPECIFIC GUIDANCE</span>
            <h2>Prevention tips for your crop.</h2>
            <p>Select a crop to explore relevant general guidance.</p>
          </div>

          <div className="prevention-crop-tabs">
            {Object.keys(cropGuides).map((name) => (
              <button
                key={name}
                className={crop === name ? "active" : ""}
                onClick={() => setCrop(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="prevention-crop-card">
            <div className="prevention-crop-header">
              <Sprout size={27} />
              <div>
                <span>PLANT CARE GUIDE</span>
                <h3>{crop} Prevention Checklist</h3>
              </div>
            </div>
            <div className="prevention-crop-list">
              {cropGuides[crop].map((tip, index) => (
                <div key={tip}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container prevention-bottom">
        <div className="prevention-warning">
          <AlertTriangle size={22} />
          <p>
            Prevention guidance is educational and does not confirm a
            diagnosis. Plant diseases may have similar symptoms.
            Consult local agricultural specialists before using
            chemical treatments.
          </p>
        </div>

        <div className="prevention-cta">
          <div>
            <span>AI PLANT HEALTH SCANNER</span>
            <h2>Noticed unusual symptoms?</h2>
            <p>Explore an experimental AI prediction for a leaf image.</p>
          </div>
          <Link to="/scanner">
            Open AI Scanner <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
