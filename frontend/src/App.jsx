
import { Routes, Route, Navigate } from "react-router-dom";

// Navbar
import Navbar from "./components/Navbar";

// All 12 pages
import Home from "./pages/Home";
import Scanner from "./pages/Scanner";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import Prevention from "./pages/Prevention";
import PlantCare from "./pages/PlantCare";
import ScanHistory from "./pages/ScanHistory";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Technology from "./pages/Technology";
import DatasetExplorer from "./pages/DatasetExplorer";
import About from "./pages/About";
import Help from "./pages/Help";

// Main CSS
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        {/* Page 1 - Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Page 2 - AI Leaf Scanner */}
        <Route
          path="/scanner"
          element={<Scanner />}
        />

        {/* Page 3 - Disease Library */}
        <Route
          path="/diseases"
          element={<DiseaseLibrary />}
        />

        {/* Page 4 - Prevention Guide */}
        <Route
          path="/prevention"
          element={<Prevention />}
        />

        {/* Page 5 - Plant Care */}
        <Route
          path="/plant-care"
          element={<PlantCare />}
        />

        {/* Page 6 - Scan History */}
        <Route
          path="/history"
          element={<ScanHistory />}
        />

        {/* Page 7 - Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Page 8 - Analytics */}
        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* Page 9 - AI Technology */}
        <Route
          path="/technology"
          element={<Technology />}
        />

        {/* Page 10 - Dataset Explorer */}
        <Route
          path="/dataset"
          element={<DatasetExplorer />}
        />

        {/* Page 11 - About LeafGuard AI */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Page 12 - Help & FAQ */}
        <Route
          path="/help"
          element={<Help />}
        />

        {/* Redirect unknown URLs to Home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}



