import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";

import DashboardSidebar from "./components/dashboard/DashboardSidebar";
import DashboardNavbar from "./components/dashboard/DashboardNavbar";

import "./assets/css/dashboard.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function FeaturePage({ title, description }) {
  return (
    <DashboardLayout>
      <section className="dashboard-section">
        <div className="dashboard-card">
          <h1>{title}</h1>

          <p>
            {description}
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Dashboard feature pages */}
      <Route
        path="/resume"
        element={
          <FeaturePage
            title="Resume Analyzer"
            description="Analyze your resume and get practical suggestions to improve it."
          />
        }
      />

      <Route
        path="/interviews"
        element={
          <DashboardLayout>
            <Interviews />
          </DashboardLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <FeaturePage
            title="Performance"
            description="Track your interview performance and preparation progress."
          />
        }
      />

      <Route
        path="/coding"
        element={
          <FeaturePage
            title="Coding Practice"
            description="Practice coding problems and prepare for technical interviews."
          />
        }
      />

      <Route
        path="/emotion"
        element={
          <FeaturePage
            title="AI Analysis"
            description="Review AI-powered analysis of your interview performance."
          />
        }
      />

      <Route
        path="/roadmap"
        element={
          <FeaturePage
            title="Career Roadmap"
            description="Follow a structured roadmap for your career preparation."
          />
        }
      />

      <Route
        path="/company-prep"
        element={
          <FeaturePage
            title="Company Prep"
            description="Prepare for company-specific interview patterns and topics."
          />
        }
      />

      <Route
        path="/placement"
        element={
          <FeaturePage
            title="Placement"
            description="Manage your placement preparation and career activities."
          />
        }
      />

      <Route
        path="/profile"
        element={
          <FeaturePage
            title="My Profile"
            description="View and manage your PrepSphere profile."
          />
        }
      />

      <Route
        path="/settings"
        element={
          <FeaturePage
            title="Settings"
            description="Manage your PrepSphere account settings."
          />
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;