
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";
import InterviewTest from "./pages/InterviewTest";
import InterviewResult from "./pages/InterviewResult";
import Resume from "./pages/Resume";

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
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* Interviews */}
        <Route
          path="/interviews"
          element={
            <DashboardLayout>
              <Interviews />
            </DashboardLayout>
          }
        />

        <Route
          path="/interviews/:id"
          element={
            <DashboardLayout>
              <InterviewTest />
            </DashboardLayout>
          }
        />

        <Route
          path="/interviews/:id/result"
          element={
            <DashboardLayout>
              <InterviewResult />
            </DashboardLayout>
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/resume"
          element={
            <DashboardLayout>
              <Resume />
            </DashboardLayout>
          }
        />

        {/* Default route */}
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

