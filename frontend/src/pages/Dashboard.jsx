
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  Sprout,
  ShieldCheck,
  Activity,
  ArrowRight,
  History,
  BookOpen,
  AlertTriangle,
  BarChart3,
  TrendingUp
} from "lucide-react";
import "./Dashboard.css";

const STORAGE_KEY = "leafguard_scan_history";

function readHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getStats(scans) {
  const plants = new Set(
    scans.map((scan) => scan.plant).filter(Boolean)
  );

  const healthy = scans.filter((scan) => {
    const label = String(
      scan.predicted_class || scan.disease || ""
    ).toLowerCase();

    return label.includes("healthy");
  }).length;

  const validConfidences = scans
    .map((scan) => Number(scan.confidence))
    .filter(
      (value) =>
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 1
    );

  const averageConfidence = validConfidences.length
    ? (
        validConfidences.reduce((sum, n) => sum + n, 0) /
        validConfidences.length *
        100
      ).toFixed(1)
    : null;

  const diseaseCounts = {};

  scans.forEach((scan) => {
    const name = scan.disease || "Unknown";

    diseaseCounts[name] = (diseaseCounts[name] || 0) + 1;
  });

  const topDiseases = Object.entries(diseaseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    total: scans.length,
    plants: plants.size,
    healthy,
    unhealthy: scans.length - healthy,
    averageConfidence,
    topDiseases
  };
}

export default function Dashboard() {
  const [scans, setScans] = useState(readHistory);

  useEffect(() => {
    function refresh() {
      setScans(readHistory());
    }

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(
      "leafguard-history-updated",
      refresh
    );

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "leafguard-history-updated",
        refresh
      );
    };
  }, []);

  const stats = getStats(scans);
  const recent = [...scans]
    .sort(
      (a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    )
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Scans",
      value: stats.total,
      icon: ScanLine
    },
    {
      title: "Plants Scanned",
      value: stats.plants,
      icon: Sprout
    },
    {
      title: "Healthy Predictions",
      value: stats.healthy,
      icon: ShieldCheck
    },
    {
      title: "Avg. Confidence",
      value:
        stats.averageConfidence === null
          ? "—"
          : `${stats.averageConfidence}%`,
      icon: TrendingUp
    }
  ];

  return (
    <main className="dash-page">
      <section className="dash-hero">
        <div className="dash-container">
          <div className="dash-eyebrow">
            <LayoutDashboard size={16} />
            LEAFGUARD AI DASHBOARD
          </div>

          <h1>
            Your plant health
            <span> overview.</span>
          </h1>

          <p>
            Explore your saved AI scan activity, prediction
            patterns, and plant health records.
          </p>
        </div>
      </section>

      <section className="dash-container dash-content">
        <div className="dash-section-heading">
          <div>
            <span>YOUR SCAN SUMMARY</span>
            <h2>Overview</h2>
          </div>

          <Link to="/scanner" className="dash-primary">
            <ScanLine size={17} />
            New Scan
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="dash-stats-grid">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className="dash-stat-card"
                key={card.title}
              >
                <div className="dash-stat-icon">
                  <Icon size={23} />
                </div>

                <h3>{card.value}</h3>
                <p>{card.title}</p>
              </article>
            );
          })}
        </div>

        {scans.length === 0 && (
          <div className="dash-empty-banner">
            <Activity size={24} />
            <div>
              <h3>No scan data available yet</h3>
              <p>
                Analyze your first leaf image to populate
                the dashboard with real results.
              </p>
            </div>
            <Link to="/scanner">
              Start Scanning
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        <div className="dash-main-grid">
          <section className="dash-panel">
            <div className="dash-panel-heading">
              <div>
                <span>ACTIVITY</span>
                <h2>Recent Scans</h2>
              </div>
              <History size={22} />
            </div>

            {recent.length === 0 ? (
              <p className="dash-empty-text">
                No previous scans found.
              </p>
            ) : (
              <div className="dash-recent-list">
                {recent.map((scan) => (
                  <div
                    className="dash-recent-item"
                    key={scan.id}
                  >
                    <div className="dash-recent-icon">
                      <Sprout size={20} />
                    </div>

                    <div className="dash-recent-info">
                      <strong>
                        {scan.plant || "Unknown Plant"}
                      </strong>
                      <span>
                        {scan.disease || "Unknown Condition"}
                      </span>
                    </div>

                    <div className="dash-recent-date">
                      {scan.date &&
                      !Number.isNaN(Date.parse(scan.date))
                        ? new Date(
                            scan.date
                          ).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/history"
              className="dash-panel-link"
            >
              View Full History
              <ArrowRight size={17} />
            </Link>
          </section>

          <section className="dash-panel">
            <div className="dash-panel-heading">
              <div>
                <span>SCAN PATTERNS</span>
                <h2>Predicted Conditions</h2>
              </div>
              <BarChart3 size={22} />
            </div>

            {stats.topDiseases.length === 0 ? (
              <p className="dash-empty-text">
                Condition statistics will appear after
                your first successful scan.
              </p>
            ) : (
              <div className="dash-disease-list">
                {stats.topDiseases.map(
                  ([name, count]) => (
                    <div
                      className="dash-disease-item"
                      key={name}
                    >
                      <div className="dash-disease-label">
                        <span>{name}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="dash-bar-track">
                        <div
                          style={{
                            width: `${
                              (count / stats.total) * 100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        <div className="dash-section-heading dash-tools-heading">
          <div>
            <span>EXPLORE LEAFGUARD</span>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="dash-actions-grid">
          <Link to="/scanner" className="dash-action">
            <ScanLine size={27} />
            <h3>AI Leaf Scanner</h3>
            <p>Analyze a new leaf image.</p>
            <span>
              Open Scanner <ArrowRight size={16} />
            </span>
          </Link>

          <Link to="/diseases" className="dash-action">
            <BookOpen size={27} />
            <h3>Disease Library</h3>
            <p>Explore symptoms and prevention.</p>
            <span>
              Browse Diseases <ArrowRight size={16} />
            </span>
          </Link>

          <Link to="/history" className="dash-action">
            <History size={27} />
            <h3>Scan History</h3>
            <p>Review your previous predictions.</p>
            <span>
              View History <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <div className="dash-disclaimer">
          <AlertTriangle size={21} />
          <p>
            Dashboard statistics are calculated from
            predictions saved in this browser. They do
            not represent confirmed disease diagnoses.
            Model confidence is not a guarantee of accuracy.
          </p>
        </div>
      </section>
    </main>
  );
}
