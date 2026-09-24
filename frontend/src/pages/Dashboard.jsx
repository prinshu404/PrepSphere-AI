import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatsGrid from "../components/dashboard/StatsGrid";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";
import SkillSnapshot from "../components/dashboard/SkillSnapshot";
import InterviewReadiness from "../components/dashboard/InterviewReadiness";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import QuickActions from "../components/dashboard/QuickActions";
import AICoachCard from "../components/dashboard/AICoachCard";
import { getDashboard } from "../services/dashboardApi";
import "../assets/css/dashboard.css";

const emptyData = {
  user:
    JSON.parse(localStorage.getItem("user") || "null") || {
      name: "there",
    },

  stats: {
    overallScore: 0,
    interviewsCompleted: 0,
    skillsImproved: 0,
    readiness: 0,
    interviewsThisMonth: 0,
    interviewsLastMonth: 0,
    performanceChange: 0,

    students: 0,
    logins: 0,
    failed_logins: 0,
    interviews: 0,
    completed: 0,
    reports: 0,
  },

  skills: {
    technical: 0,
    communication: 0,
    problemSolving: 0,
    confidence: 0,
  },

  performance: Array.from({ length: 7 }, (_, i) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
    score: 0,
  })),

  recentInterviews: [],
  recommendations: [],
};

export default function Dashboard() {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDashboard();

      setData((current) => ({
        ...current,
        ...response,

        stats: {
          ...current.stats,
          ...response.stats,
        },
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load your dashboard."
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }

    load();
  }, []);

  const dashboardStats = {
    ...data.stats,

    interviewsCompleted:
      data.stats.completed ?? data.stats.interviewsCompleted ?? 0,

    interviewsThisMonth:
      data.stats.interviews ?? data.stats.interviewsThisMonth ?? 0,
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {mobileOpen && (
        <button
          className="dashboard-mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="dashboard-main">
        <DashboardNavbar
          onMenu={() => setMobileOpen(true)}
        />

        <main className="dashboard-content">
          {error && (
            <div className="dashboard-api-error">
              <span>{error}</span>

              <button type="button" onClick={load}>
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <div className="dashboard-spinner"></div>
              <p>
                Loading your personalized dashboard...
              </p>
            </div>
          ) : (
            <>
              <section className="dashboard-section">
                <WelcomeBanner
                  user={{
                    ...data.user,
                    readiness: dashboardStats.readiness,
                  }}
                />
              </section>

              <section className="dashboard-section">
                <StatsGrid stats={dashboardStats} />
              </section>

              <section className="dashboard-section dashboard-analytics-grid">
                <div className="dashboard-card performance-card">
                  <PerformanceOverview
                    data={data.performance}
                    score={dashboardStats.overallScore}
                    change={dashboardStats.performanceChange}
                  />
                </div>

                <div className="dashboard-card skill-card">
                  <SkillSnapshot
                    skills={data.skills}
                  />
                </div>
              </section>

              <section className="dashboard-section dashboard-two-column">
                <div className="dashboard-card">
                  <InterviewReadiness
                    skills={data.skills}
                    readiness={dashboardStats.readiness}
                  />
                </div>

                <div className="dashboard-card">
                  <AICoachCard
                    recommendations={data.recommendations}
                  />
                </div>
              </section>

              <section className="dashboard-section">
                <div className="dashboard-card">
                  <RecentInterviews
                    interviews={data.recentInterviews}
                  />
                </div>
              </section>

              <section className="dashboard-section">
                <QuickActions />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}