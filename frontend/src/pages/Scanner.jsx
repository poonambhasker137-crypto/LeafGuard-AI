
import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  ScanLine,
  Leaf,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  History,
  ArrowRight,
  X,
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
  Sprout
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDiseaseGuidance } from "../data/diseaseGuidance";
import "./Scanner.css";

const API_URL = "http://127.0.0.1:8000/predict";
const HISTORY_KEY = "leafguard_scan_history";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

function saveScan(data) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    const newScan = {
      id: crypto.randomUUID(),
      plant: data.plant,
      disease: data.disease,
      predicted_class: data.predicted_class,
      confidence: Number(data.confidence),
      date: new Date().toISOString()
    };

    const history = [
      newScan,
      ...(Array.isArray(saved) ? saved : [])
    ].slice(0, 100);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );

    window.dispatchEvent(
      new Event("leafguard-history-updated")
    );
  } catch (error) {
    console.warn("Could not save scan history:", error);
  }
}

const guidanceSections = [
  {
    key: "symptoms",
    title: "Disease Symptoms",
    icon: Stethoscope,
    description: "Common signs associated with this condition"
  },
  {
    key: "prevention",
    title: "Prevention Methods",
    icon: ShieldCheck,
    description: "Ways to reduce disease risk"
  },
  {
    key: "management",
    title: "Disease Management",
    icon: HeartHandshake,
    description: "General next steps and precautions"
  },
  {
    key: "care",
    title: "Plant Care Tips",
    icon: Sprout,
    description: "Support healthier growing conditions"
  }
];

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFile(selectedFile) {
    if (!selectedFile || loading) return;

    setError("");
    setResult(null);

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Image size must be 10 MB or less.");
      return;
    }

    setFile(selectedFile);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function resetScanner() {
    setFile(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function analyzeLeaf() {
    if (!file || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from FastAPI server.");
      }

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Prediction failed. Please try again."
        );
      }

      if (
        typeof data.plant !== "string" ||
        typeof data.disease !== "string"
      ) {
        throw new Error("Incomplete prediction response.");
      }

      setResult(data);
      saveScan(data);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot connect to the FastAPI server. Check that the backend is running."
          : err.message || "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const confidence = result
    ? Number(result.confidence)
    : NaN;

  const confidenceText = Number.isFinite(confidence)
    ? `${(confidence * 100).toFixed(2)}%`
    : "Unavailable";

  const guidance = result
    ? getDiseaseGuidance(result.predicted_class)
    : null;

  return (
    <main className="lg-scanner">
      <section className="lg-scanner-hero">
        <span className="lg-scanner-eyebrow">
          <ScanLine size={16} />
          AI-POWERED LEAF ANALYSIS
        </span>

        <h1>
          Discover your plant's
          <span> health condition.</span>
        </h1>

        <p>
          Upload a leaf image and explore an experimental
          CNN prediction with educational plant care guidance.
        </p>
      </section>

      <section className="lg-scanner-container">
        <div className="lg-scanner-layout">
          <div className="lg-scanner-panel">
            <div className="lg-scanner-panel-heading">
              <UploadCloud size={25} />
              <div>
                <h2>Upload Leaf Image</h2>
                <p>JPG, PNG, or WebP • Maximum 10 MB</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(event) =>
                handleFile(event.target.files?.[0])
              }
            />

            {!preview ? (
              <div
                className={`lg-scanner-dropzone ${
                  dragging ? "dragging" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!loading) setDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragging(false);
                }}
                onDrop={handleDrop}
              >
                <div className="lg-scanner-upload-icon">
                  <UploadCloud size={34} />
                </div>

                <h3>Drag & drop your leaf image</h3>
                <p>or select an image from your device</p>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="lg-scanner-preview">
                <img src={preview} alt="Selected leaf" />

                <button
                  className="lg-scanner-remove"
                  type="button"
                  onClick={resetScanner}
                  disabled={loading}
                  aria-label="Remove selected image"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {file && (
              <div className="lg-scanner-file-info">
                <Leaf size={17} />
                <span>{file.name}</span>
                <CheckCircle2 size={18} />
              </div>
            )}

            <button
              className="lg-scanner-analyze"
              type="button"
              disabled={!file || loading}
              onClick={analyzeLeaf}
            >
              {loading ? (
                <>
                  <RefreshCcw
                    size={18}
                    className="lg-spin"
                  />
                  Analyzing Leaf...
                </>
              ) : (
                <>
                  <ScanLine size={18} />
                  Analyze Leaf
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {error && (
              <div className="lg-scanner-error" role="alert">
                <AlertCircle size={19} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="lg-scanner-panel lg-scanner-results">
            <div className="lg-scanner-panel-heading">
              <ScanLine size={25} />
              <div>
                <h2>Analysis Results</h2>
                <p>Your AI prediction appears here</p>
              </div>
            </div>

            {!result ? (
              <div className="lg-scanner-empty">
                <div className="lg-scanner-empty-icon">
                  <Leaf size={40} />
                </div>

                <h3>Ready to analyze</h3>
                <p>
                  Upload a clear leaf image to begin
                  the prediction process.
                </p>
              </div>
            ) : (
              <div className="lg-scanner-result-content">
                <div className="lg-scanner-result-status">
                  <CheckCircle2 size={19} />
                  Analysis completed
                </div>

                <div className="lg-scanner-result-item">
                  <span>Predicted plant</span>
                  <h3>{result.plant}</h3>
                </div>

                <div className="lg-scanner-result-item">
                  <span>Predicted condition</span>
                  <h3>{result.disease}</h3>
                </div>

                <div className="lg-scanner-result-item">
                  <span>Model confidence</span>
                  <h3>{confidenceText}</h3>

                  {Number.isFinite(confidence) && (
                    <div className="lg-scanner-confidence-track">
                      <div
                        style={{
                          width: `${
                            Math.max(
                              0,
                              Math.min(100, confidence * 100)
                            )
                          }%`
                        }}
                      />
                    </div>
                  )}
                </div>

                {result.warning && (
                  <div className="lg-scanner-warning">
                    <ShieldAlert size={18} />
                    <p>{result.warning}</p>
                  </div>
                )}

                <Link
                  to="/history"
                  className="lg-scanner-history-link"
                >
                  <History size={17} />
                  View Scan History
                  <ArrowRight size={17} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {result && guidance && (
          <section className="lg-guidance">
            <div className="lg-guidance-heading">
              <span>PLANT HEALTH GUIDANCE</span>
              <h2>
                Understanding {result.disease}
              </h2>
              <p>
                {guidance.specific
                  ? "Educational guidance associated with the predicted condition."
                  : "General plant health guidance. A disease-specific guide is not yet available for this prediction."}
              </p>
            </div>

            <div className="lg-guidance-grid">
              {guidanceSections.map((section) => {
                const Icon = section.icon;

                return (
                  <article
                    className="lg-guidance-card"
                    key={section.key}
                  >
                    <div className="lg-guidance-card-icon">
                      <Icon size={25} />
                    </div>

                    <h3>{section.title}</h3>
                    <p>{section.description}</p>

                    <ul>
                      {guidance[section.key].map(
                        (item) => (
                          <li key={item}>{item}</li>
                        )
                      )}
                    </ul>
                  </article>
                );
              })}
            </div>

            <div className="lg-guidance-links">
              <Link to="/diseases">
                Explore Disease Library
                <ArrowRight size={17} />
              </Link>

              <Link to="/prevention">
                More Prevention Tips
                <ArrowRight size={17} />
              </Link>

              <Link to="/plant-care">
                Plant Care Guides
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        )}

        <div className="lg-scanner-disclaimer">
          <ShieldAlert size={21} />
          <p>
            LeafGuard AI is an educational prototype.
            Its CNN predictions may be incorrect, and
            symptoms can overlap across different diseases.
            Do not treat the prediction as a confirmed
            diagnosis or apply chemicals solely because
            of the model's output.
          </p>
        </div>
      </section>
    </main>
  );
}
