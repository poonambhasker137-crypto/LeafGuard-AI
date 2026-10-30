
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Activity,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Sprout,
  ArrowRight,
  PieChart,
  CalendarDays
} from "lucide-react";
import "./Analytics.css";

const STORAGE_KEY = "leafguard_scan_history";

function loadScans() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function isHealthy(scan) {
  const label = String(
    scan.predicted_class || scan.disease || ""
  ).toLowerCase();

  return label.includes("healthy");
}

function getCounts(scans, field) {
  const counts = {};

  scans.forEach((scan) => {
    const name = String(scan[field] || "Unknown");
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts).sort(
    (a, b) => b[1] - a[1]
  );
}

function getLastSevenDays(scans) {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");

    const count = scans.filter((scan) => {
      if (!scan.date) return false;

      const scanDate = new Date(scan.date);
      if (Number.isNaN(scanDate.getTime())) return false;

      const scanKey = [
        scanDate.getFullYear(),
        String(scanDate.getMonth() + 1).padStart(2, "0"),
        String(scanDate.getDate()).padStart(2, "0")
      ].join("-");

      return scanKey === key;
    }).length;

    days.push({
      label: date.toLocaleDateString("en-US", {
        weekday: "short"
      }),
      date: date.toLocaleDateString(),
      count
    });
  }

  return days;
}

export default function Analytics() {
  const [scans, setScans] = useState(loadScans);

  useEffect(() => {
    const refresh = () => setScans(loadScans());

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

  const analytics = useMemo(() => {
    const total = scans.length;
    const healthy = scans.filter(isHealthy).length;
    const other = total - healthy;

    const confidences = scans
      .map((scan) => Number(scan.confidence))
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0 &&
          value <= 1
      );

    const avgConfidence = confidences.length
      ? (
          (confidences.reduce((a, b) => a + b, 0) /
            confidences.length) *
          100
        ).toFixed(1)
      : null;

    return {
      total,
      healthy,
      other,
      avgConfidence,
      plants: getCounts(scans, "plant"),
      diseases: getCounts(scans, "disease"),
      weekly: getLastSevenDays(scans)
    };
  }, [scans]);

  const maxWeekly = Math.max(
    1,
    ...analytics.weekly.map((day) => day.count)
  );

  const statCards = [
    {
      label: "Total Scans",
      value: analytics.total,
      icon: ScanLine
    },
    {
      label: "Healthy Predictions",
      value: analytics.healthy,
      icon: ShieldCheck
    },
    {
      label: "Other Predictions",
      value: analytics.other,
      icon: Activity
    },
    {
      label: "Avg. Confidence",
      value:
        analytics.avgConfidence === null
          ? "—"
          : `${analytics.avgConfidence}%`,
      icon: TrendingUp
    }
  ];

  return (
    <main className="analytics-page">
      <section className="analytics-hero">
        <div className="analytics-container">
          <span className="analytics-eyebrow">
            <BarChart3 size={16} />
            AI PREDICTION INSIGHTS
          </span>

          <h1>
            Plant Health <span>Analytics.</span>
          </h1>

          <p>
            Understand your saved leaf scan activity,
            prediction patterns, and model confidence
            through interactive visual insights.
          </p>
        </div>
      </section>

      <section className="analytics-container analytics-content">
        <div className="analytics-heading">
          <div>
            <span>YOUR DATA</span>
            <h2>Prediction Overview</h2>
          </div>

          <Link to="/scanner" className="analytics-primary">
            <ScanLine size={17} />
            New Scan
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="analytics-stats">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className="analytics-stat"
                key={card.label}
              >
                <div className="analytics-stat-icon">
                  <Icon size={23} />
                </div>
                <h3>{card.value}</h3>
                <p>{card.label}</p>
              </article>
            );
          })}
        </div>

        {analytics.total === 0 && (
          <div className="analytics-empty">
            <Activity size={24} />
            <div>
              <h3>No analytics data yet</h3>
              <p>
                Complete your first AI scan to generate
                charts from real predictions.
              </p>
            </div>
            <Link to="/scanner">
              Start Scanning <ArrowRight size={17} />
            </Link>
          </div>
        )}

        <div className="analytics-grid">
          <section className="analytics-panel">
            <div className="analytics-panel-title">
              <div>
                <span>LAST 7 DAYS</span>
                <h2>Scan Activity</h2>
              </div>
              <CalendarDays size={23} />
            </div>

            <div className="analytics-weekly-chart">
              {analytics.weekly.map((day) => (
                <div
                  className="analytics-day"
                  key={day.date}
                  title={`${day.date}: ${day.count} scans`}
                >
                  <strong>{day.count}</strong>
                  <div className="analytics-bar-area">
                    <div
                      className="analytics-weekly-bar"
                      style={{
                        height:
                          day.count === 0
                            ? "0%"
                            : `${
                                (day.count / maxWeekly) * 100
                              }%`
                      }}
                    />
                  </div>
                  <span>{day.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="analytics-panel">
            <div className="analytics-panel-title">
              <div>
                <span>PREDICTION DISTRIBUTION</span>
                <h2>Healthy vs. Other</h2>
              </div>
              <PieChart size={23} />
            </div>

            {analytics.total > 0 ? (
              <>
                <div
                  className="analytics-donut"
                  style={{
                    background: `conic-gradient(
                      #ad78ff 0% ${
                        (analytics.healthy /
                          analytics.total) *
                        100
                      }%,
                      #55326f ${
                        (analytics.healthy /
                          analytics.total) *
                        100
                      }% 100%
                    )`
                  }}
                >
                  <div>
                    <strong>{analytics.total}</strong>
                    <span>Total Scans</span>
                  </div>
                </div>

                <div className="analytics-legend">
                  <div>
                    <span className="analytics-dot healthy" />
                    Healthy predictions
                    <strong>{analytics.healthy}</strong>
                  </div>

                  <div>
                    <span className="analytics-dot other" />
                    Other predictions
                    <strong>{analytics.other}</strong>
                  </div>
                </div>
              </>
            ) : (
              <p className="analytics-no-data">
                No prediction distribution available.
              </p>
            )}
          </section>

          <section className="analytics-panel">
            <div className="analytics-panel-title">
              <div>
                <span>PLANT DISTRIBUTION</span>
                <h2>Plants Scanned</h2>
              </div>
              <Sprout size={23} />
            </div>

            {analytics.plants.length ? (
              <div className="analytics-ranked-list">
                {analytics.plants.slice(0, 8).map(
                  ([plant, count]) => (
                    <div
                      className="analytics-ranked-item"
                      key={plant}
                    >
                      <div className="analytics-ranked-label">
                        <span>{plant}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="analytics-track">
                        <div
                          style={{
                            width: `${
                              (count / analytics.total) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="analytics-no-data">
                No plant data available.
              </p>
            )}
          </section>

          <section className="analytics-panel">
            <div className="analytics-panel-title">
              <div>
                <span>TOP PREDICTED CONDITIONS</span>
                <h2>Disease Insights</h2>
              </div>
              <BarChart3 size={23} />
            </div>

            {analytics.diseases.length ? (
              <div className="analytics-ranked-list">
                {analytics.diseases.slice(0, 8).map(
                  ([disease, count]) => (
                    <div
                      className="analytics-ranked-item"
                      key={disease}
                    >
                      <div className="analytics-ranked-label">
                        <span>{disease}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="analytics-track">
                        <div
                          style={{
                            width: `${
                              (count / analytics.total) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="analytics-no-data">
                No disease predictions available.
              </p>
            )}
          </section>
        </div>

        <div className="analytics-bottom-links">
          <Link to="/dashboard">
            View Dashboard <ArrowRight size={17} />
          </Link>

          <Link to="/history">
            View Scan History <ArrowRight size={17} />
          </Link>
        </div>

        <div className="analytics-disclaimer">
          <AlertTriangle size={21} />
          <p>
            Analytics are calculated from AI predictions
            saved in this browser, not confirmed diagnoses.
            Healthy and other categories describe model
            labels only. Model confidence is not the same
            as verified prediction accuracy.
          </p>
        </div>
      </section>
    </main>
  );
}
