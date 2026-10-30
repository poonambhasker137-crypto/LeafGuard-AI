
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ScanSearch,
  ShieldCheck,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Leaf,
  Activity,
  Database,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import "./Home.css";

const features = [
  {
    icon: ScanSearch,
    title: "AI Disease Scanner",
    description:
      "Upload a leaf image and explore CNN-based predictions for supported plant conditions.",
    link: "/scanner",
    label: "Try Scanner",
  },
  {
    icon: BookOpen,
    title: "Disease Library",
    description:
      "Explore plant diseases, common symptoms, and useful reference information.",
    link: "/diseases",
    label: "Explore Library",
  },
  {
    icon: ShieldCheck,
    title: "Disease Prevention",
    description:
      "Learn practical ways to reduce disease risk and improve plant care.",
    link: "/prevention",
    label: "View Prevention",
  },
  {
    icon: Activity,
    title: "Plant Analytics",
    description:
      "Explore model information and analysis statistics in one dashboard.",
    link: "/analytics",
    label: "View Analytics",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload a leaf",
    description:
      "Choose a clear JPG, PNG, or WebP image of your plant leaf.",
  },
  {
    number: "02",
    title: "Run AI analysis",
    description:
      "The CNN processes the image and generates a classification score.",
  },
  {
    number: "03",
    title: "Explore the result",
    description:
      "Review the predicted condition and learn about plant care.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-glow home-glow-one" />
        <div className="home-glow home-glow-two" />

        <div className="container home-hero-content">
          <div className="home-announcement">
            <Sparkles size={15} />
            NEXT-GENERATION PLANT INTELLIGENCE
            <ChevronRight size={15} />
          </div>

          <h1>
            A smarter way to
            <br />
            <span>understand plant health.</span>
          </h1>

          <p className="home-subtitle">
            Meet LeafGuard AI — a deep learning-powered platform
            for exploring plant leaf diseases, prevention guidance,
            and intelligent agricultural insights.
          </p>

          <div className="home-actions">
            <Link to="/scanner" className="home-primary-button">
              <ScanSearch size={19} />
              Start AI Analysis
              <ArrowRight size={18} />
            </Link>

            <Link to="/diseases" className="home-secondary-button">
              Explore Disease Library
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="home-stats">
            <div>
              <strong>54K+</strong>
              <span>Dataset images</span>
            </div>
            <div>
              <strong>38</strong>
              <span>Classification categories</span>
            </div>
            <div>
              <strong>CNN</strong>
              <span>Deep learning architecture</span>
            </div>
          </div>

          <div className="home-preview">
            <div className="home-preview-top">
              <div className="home-window-dots">
                <span />
                <span />
                <span />
              </div>
              <span>LEAFGUARD AI / PLANT HEALTH WORKSPACE</span>
              <div className="home-preview-live">
                <span /> Research Prototype
              </div>
            </div>

            <div className="home-preview-body">
              <div className="home-preview-visual">
                <div className="home-orbit home-orbit-one" />
                <div className="home-orbit home-orbit-two" />
                <div className="home-leaf-symbol">
                  <Leaf size={76} strokeWidth={1.2} />
                </div>
                <div className="home-floating-label label-one">
                  <BrainCircuit size={16} />
                  CNN Analysis
                </div>
                <div className="home-floating-label label-two">
                  <CheckCircle2 size={16} />
                  Image Processing
                </div>
              </div>

              <div className="home-preview-details">
                <span className="home-preview-eyebrow">
                  INTELLIGENT LEAF ANALYSIS
                </span>
                <h2>
                  Discover insights
                  <br />
                  from every leaf.
                </h2>
                <p>
                  A connected workspace for image analysis,
                  disease information, and prevention guidance.
                </p>

                <div className="home-preview-checks">
                  <span><CheckCircle2 size={16} /> Image upload and preview</span>
                  <span><CheckCircle2 size={16} /> CNN classification</span>
                  <span><CheckCircle2 size={16} /> Model confidence display</span>
                </div>

                <Link to="/scanner" className="home-preview-link">
                  Open Scanner <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features container">
        <div className="home-section-header">
          <span className="home-eyebrow">
            <Sparkles size={15} /> EXPLORE THE PLATFORM
          </span>
          <h2>Everything your plant health journey needs.</h2>
          <p>
            Explore a connected set of tools designed for
            plant disease research and learning.
          </p>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                to={feature.link}
                className="home-feature-card"
                key={feature.title}
              >
                <div className="home-feature-icon">
                  <Icon size={25} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span>
                  {feature.label}
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-how-section">
        <div className="container">
          <div className="home-section-header">
            <span className="home-eyebrow">
              <Activity size={15} /> SIMPLE WORKFLOW
            </span>
            <h2>From leaf image to AI insight.</h2>
            <p>Three simple steps to explore a prediction.</p>
          </div>

          <div className="home-steps">
            {steps.map((step) => (
              <div className="home-step" key={step.number}>
                <span className="home-step-number">
                  {step.number}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-tech container">
        <div className="home-tech-icon">
          <Database size={28} />
        </div>

        <div>
          <span className="home-eyebrow">
            BUILT WITH DEEP LEARNING
          </span>
          <h2>Powered by CNN technology.</h2>
          <p>
            LeafGuard AI uses a convolutional neural network
            trained on PlantVillage leaf images. The current
            model is experimental and has limited validation
            accuracy, so predictions should be independently verified.
          </p>
        </div>

        <Link to="/technology" className="home-secondary-button">
          Explore Technology <ArrowRight size={18} />
        </Link>
      </section>

      <section className="home-cta container">
        <div className="home-cta-content">
          <span><Sparkles size={15} /> GET STARTED</span>
          <h2>Ready to explore your plant's health?</h2>
          <p>
            Upload your first leaf image and see how
            LeafGuard AI analyzes plant conditions.
          </p>
          <Link to="/scanner" className="home-primary-button">
            Launch AI Scanner <ArrowRight size={18} />
          </Link>
        </div>
        <div className="home-cta-decoration">
          <Leaf size={170} strokeWidth={0.8} />
        </div>
      </section>

      <footer className="home-footer">
        <div className="container home-footer-inner">
          <div className="home-footer-brand">
            <Leaf size={20} /> LeafGuard AI
          </div>
          <p>
            Deep Learning Plant Disease Prediction · Experimental Research Project
          </p>
        </div>
      </footer>
    </main>
  );
}
