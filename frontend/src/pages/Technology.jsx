
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  UploadCloud,
  Image as ImageIcon,
  Layers,
  ScanLine,
  ArrowRight,
  Database,
  Server,
  Code2,
  ShieldAlert,
  Cpu,
  Workflow,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import "./Technology.css";

const workflow = [
  {
    number: "01",
    title: "Upload Leaf Image",
    description:
      "The user selects a JPG, PNG, or WebP image through the React interface.",
    icon: UploadCloud
  },
  {
    number: "02",
    title: "Send to Backend",
    description:
      "The frontend sends the image to the FastAPI prediction endpoint.",
    icon: Server
  },
  {
    number: "03",
    title: "Image Preprocessing",
    description:
      "The backend prepares the image in the format expected by the trained CNN.",
    icon: ImageIcon
  },
  {
    number: "04",
    title: "CNN Prediction",
    description:
      "The model processes the image and generates scores for the 38 supported classes.",
    icon: BrainCircuit
  },
  {
    number: "05",
    title: "Display Results",
    description:
      "The website displays the predicted plant, condition, and model confidence.",
    icon: ScanLine
  },
  {
    number: "06",
    title: "Save Scan History",
    description:
      "The browser stores successful prediction records for the Dashboard and Analytics pages.",
    icon: Database
  }
];

const technologies = [
  {
    title: "React",
    type: "Frontend",
    description:
      "Builds the interactive website, scanner, dashboard, and navigation.",
    icon: Code2
  },
  {
    title: "Vite",
    type: "Development Tool",
    description:
      "Provides a fast development environment for the React frontend.",
    icon: Cpu
  },
  {
    title: "FastAPI",
    type: "Python Backend",
    description:
      "Receives uploaded images and returns model predictions through an API.",
    icon: Server
  },
  {
    title: "TensorFlow / Keras",
    type: "Deep Learning",
    description:
      "Loads and runs the trained convolutional neural network.",
    icon: BrainCircuit
  },
  {
    title: "PlantVillage",
    type: "Image Dataset",
    description:
      "Provides labeled plant leaf images for the classification task.",
    icon: Database
  },
  {
    title: "Browser Local Storage",
    type: "Scan Records",
    description:
      "Stores recent prediction results on the user's device for history and analytics.",
    icon: Layers
  }
];

const cnnStages = [
  {
    title: "Input Image",
    description:
      "A leaf photograph is converted into the model's required input format."
  },
  {
    title: "Convolutional Features",
    description:
      "Convolutional filters learn visual patterns such as edges, spots, and textures."
  },
  {
    title: "Feature Processing",
    description:
      "The network combines learned features to help distinguish leaf conditions."
  },
  {
    title: "Classification Output",
    description:
      "The model produces a score for each of the 38 classification categories."
  }
];

export default function Technology() {
  return (
    <main className="tech-page">
      <section className="tech-hero">
        <div className="tech-container">
          <div className="tech-eyebrow">
            <BrainCircuit size={16} />
            BEHIND THE INTELLIGENCE
          </div>

          <h1>
            The technology behind
            <span> LeafGuard AI.</span>
          </h1>

          <p>
            Explore the deep learning model, image
            processing pipeline, and software architecture
            powering our experimental leaf disease scanner.
          </p>

          <Link to="/scanner" className="tech-primary">
            Try AI Scanner
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="tech-container tech-content">
        <div className="tech-section-heading">
          <span>HOW IT WORKS</span>
          <h2>From Image to Prediction</h2>
          <p>
            Six connected steps turn a leaf image into
            an AI prediction and saved scan record.
          </p>
        </div>

        <div className="tech-workflow-grid">
          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <article
                className="tech-workflow-card"
                key={step.number}
              >
                <div className="tech-card-top">
                  <div className="tech-icon">
                    <Icon size={24} />
                  </div>
                  <span>{step.number}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>

        <div className="tech-section-heading tech-spaced">
          <span>DEEP LEARNING</span>
          <h2>Understanding the CNN</h2>
          <p>
            A Convolutional Neural Network learns
            visual patterns from labeled images.
          </p>
        </div>

        <div className="tech-cnn-panel">
          <div className="tech-cnn-header">
            <BrainCircuit size={29} />
            <div>
              <h3>CNN Classification Pipeline</h3>
              <p>
                Conceptual overview of image classification
              </p>
            </div>
          </div>

          <div className="tech-cnn-stages">
            {cnnStages.map((stage, index) => (
              <div className="tech-cnn-stage" key={stage.title}>
                <div className="tech-cnn-stage-number">
                  {index + 1}
                </div>
                <h4>{stage.title}</h4>
                <p>{stage.description}</p>
              </div>
            ))}
          </div>

          <p className="tech-cnn-note">
            This diagram explains the general CNN workflow.
            It is not an exact layer-by-layer visualization
            of the saved Keras model.
          </p>
        </div>

        <div className="tech-section-heading tech-spaced">
          <span>PROJECT ARCHITECTURE</span>
          <h2>Technology Stack</h2>
          <p>
            The tools and technologies used to connect
            the website with the AI model.
          </p>
        </div>

        <div className="tech-stack-grid">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <article className="tech-stack-card" key={item.title}>
                <div className="tech-icon">
                  <Icon size={24} />
                </div>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className="tech-section-heading tech-spaced">
          <span>MODEL INFORMATION</span>
          <h2>Project Facts</h2>
        </div>

        <div className="tech-facts-grid">
          <div className="tech-fact">
            <Database size={24} />
            <strong>54,305</strong>
            <span>PlantVillage images used</span>
          </div>

          <div className="tech-fact">
            <Layers size={24} />
            <strong>38</strong>
            <span>Classification categories</span>
          </div>

          <div className="tech-fact">
            <Workflow size={24} />
            <strong>70 / 15 / 15</strong>
            <span>Train / validation / test split</span>
          </div>

          <div className="tech-fact">
            <BarChart3 size={24} />
            <strong>24.05%</strong>
            <span>Recorded validation accuracy</span>
          </div>
        </div>

        <div className="tech-limitation">
          <ShieldAlert size={25} />
          <div>
            <h3>Experimental Model — Important Limitation</h3>
            <p>
              The current CNN achieved approximately
              24.05% validation accuracy in the recorded
              experiment. Its predictions may frequently
              be incorrect and should not be used as
              confirmed plant disease diagnoses.
              Confidence scores are not a substitute
              for measured model accuracy.
            </p>
          </div>
        </div>

        <div className="tech-section-heading tech-spaced">
          <span>PROJECT CAPABILITIES</span>
          <h2>What LeafGuard AI Can Do</h2>
        </div>

        <div className="tech-capabilities">
          {[
            "Upload and preview leaf images",
            "Generate CNN-based class predictions",
            "Display predicted plant and condition",
            "Show experimental model confidence",
            "Provide educational prevention and care guidance",
            "Save prediction history in the browser",
            "Visualize saved predictions in dashboards and charts"
          ].map((item) => (
            <div key={item}>
              <CheckCircle2 size={19} />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="tech-bottom-links">
          <Link to="/dataset">
            Explore Dataset
            <ArrowRight size={17} />
          </Link>

          <Link to="/analytics">
            View Analytics
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
