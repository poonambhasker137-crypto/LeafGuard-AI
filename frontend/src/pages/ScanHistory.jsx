
import { useEffect, useState } from "react";
import {
  History, Search, Trash2, CalendarDays,
  Leaf, ScanLine, ArrowRight, ShieldAlert
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ScanHistory.css";

const STORAGE_KEY = "leafguard_scan_history";

function loadHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function ScanHistory() {
  const [scans, setScans] = useState(loadHistory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function refreshHistory() {
      setScans(loadHistory());
    }

    window.addEventListener("focus", refreshHistory);
    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener("focus", refreshHistory);
      window.removeEventListener("storage", refreshHistory);
    };
  }, []);

  function deleteScan(id) {
    const updated = scans.filter((scan) => scan.id !== id);
    setScans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function clearHistory() {
    if (!window.confirm("Delete all saved scan history?")) {
      return;
    }

    setScans([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  const filtered = scans.filter((scan) =>
    `${scan.plant} ${scan.disease} ${scan.predicted_class}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="history-page">
      <section className="history-hero">
        <div className="history-container">
          <div className="history-eyebrow">
            <History size={16} />
            LEAFGUARD AI SCAN HISTORY
          </div>

          <h1>
            Your plant health
            <span> journey.</span>
          </h1>

          <p>
            Review previous AI predictions, explore your
            scan records, and keep track of analyzed leaves.
          </p>
        </div>
      </section>

      <section className="history-container history-content">
        <div className="history-summary">
          <div className="history-summary-icon">
            <ScanLine size={27} />
          </div>

          <div>
            <span>TOTAL SAVED SCANS</span>
            <h2>{scans.length}</h2>
          </div>

          <Link to="/scanner" className="history-new-scan">
            New Scan <ArrowRight size={17} />
          </Link>
        </div>

        <div className="history-toolbar">
          <div className="history-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search plants or diseases..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {scans.length > 0 && (
            <button
              className="history-clear"
              onClick={clearHistory}
            >
              <Trash2 size={17} />
              Clear History
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <Leaf size={35} />
            </div>

            <h2>
              {scans.length === 0
                ? "No scans saved yet"
                : "No matching scans"}
            </h2>

            <p>
              {scans.length === 0
                ? "Your successful AI predictions will appear here after you scan a leaf."
                : "Try searching for another plant or disease."}
            </p>

            {scans.length === 0 && (
              <Link to="/scanner">
                Start Your First Scan
                <ArrowRight size={17} />
              </Link>
            )}
          </div>
        ) : (
          <div className="history-grid">
            {filtered.map((scan) => (
              <article
                className="history-card"
                key={scan.id}
              >
                <div className="history-card-top">
                  <div className="history-leaf-icon">
                    <Leaf size={24} />
                  </div>

                  <button
                    aria-label="Delete scan"
                    title="Delete scan"
                    onClick={() => deleteScan(scan.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <span className="history-card-label">
                  AI PREDICTION
                </span>

                <h3>{scan.plant || "Unknown Plant"}</h3>

                <p className="history-disease">
                  {scan.disease || "Unknown Condition"}
                </p>

                <div className="history-confidence">
                  <span>Model confidence</span>
                  <strong>
                    {typeof scan.confidence === "number"
                      ? `${(scan.confidence * 100).toFixed(1)}%`
                      : "N/A"}
                  </strong>
                </div>

                <div className="history-card-bottom">
                  <CalendarDays size={16} />
                  <span>
                    {scan.date
                      ? new Date(scan.date).toLocaleString()
                      : "Date unavailable"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="history-disclaimer">
          <ShieldAlert size={20} />
          <p>
            LeafGuard AI predictions are experimental and
            should not be treated as confirmed plant disease
            diagnoses. Saved scans are stored only in this
            browser, not in an online account.
          </p>
        </div>
      </section>
    </main>
  );
}
