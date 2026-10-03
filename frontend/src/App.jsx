```jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardSidebar from "./components/dashboard/DashboardSidebar";
import DashboardNavbar from "./components/dashboard/DashboardNavbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";
import InterviewTest from "./pages/InterviewTest";
import InterviewResult from "./pages/InterviewResult";
import Resume from "./pages/Resume";

function DashboardPage({ children }) {
  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <main>{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage>
              <Dashboard />
            </DashboardPage>
          }
        />

        {/* Interviews */}
        <Route
          path="/interviews"
          element={
            <DashboardPage>
              <Interviews />
            </DashboardPage>
          }
        />

        <Route
          path="/interviews/:id"
          element={
            <DashboardPage>
              <InterviewTest />
            </DashboardPage>
          }
        />

        {/* Interview Result */}
        <Route
          path="/interviews/:id/result"
          element={
            <DashboardPage>
              <InterviewResult />
            </DashboardPage>
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/resume"
          element={
            <DashboardPage>
              <Resume />
            </DashboardPage>
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

