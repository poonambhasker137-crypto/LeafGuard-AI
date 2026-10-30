
import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import "./PagePlaceholder.css";

export default function PagePlaceholder({
  title = "Coming Soon",
  description = "We're working on this feature.",
}) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">
          <Construction size={35} />
        </div>

        <span className="placeholder-badge">
          LEAFGUARD AI • COMING SOON
        </span>

        <h1>{title}</h1>

        <p>{description}</p>

        <Link to="/" className="placeholder-home-btn">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
