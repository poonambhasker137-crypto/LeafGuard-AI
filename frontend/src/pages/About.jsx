
import "./About.css";

const features = [
  {
    icon: "🌿",
    title: "AI Leaf Scanner",
    description: "Upload plant leaf photos and explore AI-generated disease predictions.",
  },
  {
    icon: "📚",
    title: "Disease Library",
    description: "Learn about common plant diseases, symptoms, and prevention.",
  },
  {
    icon: "📊",
    title: "Dashboard & Analytics",
    description: "Review saved scan results and explore prediction trends.",
  },
  {
    icon: "🪴",
    title: "Plant Care",
    description: "Discover useful plant care and prevention practices.",
  },
];

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <span className="about-tag">ABOUT LEAFGUARD AI</span>
        <h1>
          Protecting Plants Through <span>Artificial Intelligence</span>
        </h1>
        <p>
          LeafGuard AI is a B.Tech Computer Science and Engineering
          (AI & ML) project that explores how deep learning can help
          identify plant leaf diseases from images.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make plant disease information easier to
          access through a simple, interactive platform combining
          image analysis, educational resources, and plant care guidance.
        </p>
      </section>

      <section className="about-section">
        <h2>What Makes LeafGuard AI Useful?</h2>
        <div className="about-grid">
          {features.map((feature) => (
            <article className="about-card" key={feature.title}>
              <div className="about-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Technology Behind the Project</h2>
        <div className="about-tech">
          {[
            "React.js",
            "Vite",
            "Python",
            "FastAPI",
            "TensorFlow",
            "Keras",
            "Convolutional Neural Network",
            "PlantVillage Dataset",
          ].map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Our Dataset</h2>
        <div className="about-stats">
          <div><strong>54,305</strong><span>Leaf images</span></div>
          <div><strong>38</strong><span>Dataset classes</span></div>
          <div><strong>14</strong><span>Plant categories</span></div>
        </div>
        <p>
          LeafGuard AI uses the PlantVillage dataset for experimentation
          and model training. Our current CNN is experimental and needs
          further improvement before its predictions can be considered
          reliable.
        </p>
      </section>

      <section className="about-section">
        <h2>Future Scope</h2>
        <p>
          Future improvements include stronger disease recognition,
          better performance on real-world photographs, expanded
          datasets, multilingual support, and mobile-friendly access.
        </p>
      </section>

      <div className="about-notice">
        <strong>Important:</strong> LeafGuard AI is an educational
        project. Its current disease predictions are not verified
        diagnoses and should not be the sole basis for crop treatment.
      </div>
    </main>
  );
}
