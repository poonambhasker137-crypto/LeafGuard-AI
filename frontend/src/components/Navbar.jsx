
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Leaf, House, ScanSearch, LayoutDashboard,
  BookOpen, ShieldCheck, Sprout, History,
  ChartNoAxesCombined, BrainCircuit, Database,
  Info, CircleHelp, Menu, X, Sparkles
} from "lucide-react";
import "./Navbar.css";

const links = [
  { name: "Home", path: "/", icon: House },
  { name: "AI Scanner", path: "/scanner", icon: ScanSearch },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Disease Library", path: "/diseases", icon: BookOpen },
  { name: "Prevention", path: "/prevention", icon: ShieldCheck },
  { name: "Plant Care", path: "/plant-care", icon: Sprout },
  { name: "Scan History", path: "/history", icon: History },
  { name: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { name: "AI Technology", path: "/technology", icon: BrainCircuit },
  { name: "Dataset Explorer", path: "/dataset", icon: Database },
  { name: "About Project", path: "/about", icon: Info },
  { name: "Help & FAQ", path: "/help", icon: CircleHelp }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="lg-navbar">
        <div className="lg-nav-inner">
          <NavLink to="/" className="lg-brand" onClick={() => setMenuOpen(false)}>
            <span className="lg-brand-icon"><Leaf size={22} /></span>
            <span>LeafGuard <b>AI</b></span>
          </NavLink>

          <nav className="lg-desktop-links">
            {links.slice(0, 4).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `lg-nav-link ${isActive ? "active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <button
            className="lg-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
            <span>Menu</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="lg-menu-overlay" onClick={() => setMenuOpen(false)}>
          <aside
            className="lg-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lg-menu-title">
              <span><Sparkles size={17} /> EXPLORE LEAFGUARD</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <div className="lg-menu-list">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `lg-menu-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <p className="lg-menu-footer">
              LeafGuard AI · Experimental Plant Health Platform
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
