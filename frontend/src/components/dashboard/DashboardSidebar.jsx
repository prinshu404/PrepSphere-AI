import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileText,
  Mic2,
  BarChart3,
  Code2,
  BrainCircuit,
  Map,
  Building2,
  BriefcaseBusiness,
  UserRound,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../../assets/css/sidebar.css";

const mainMenu = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analyzer",
    path: "/resume",
    icon: FileText,
  },
  {
    label: "Mock Interviews",
    path: "/interviews",
    icon: Mic2,
  },
  {
    label: "Performance",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Coding Practice",
    path: "/coding",
    icon: Code2,
  },
  {
    label: "AI Analysis",
    path: "/emotion",
    icon: BrainCircuit,
  },
  {
    label: "Career Roadmap",
    path: "/roadmap",
    icon: Map,
  },
  {
    label: "Company Prep",
    path: "/company-prep",
    icon: Building2,
  },
  {
    label: "Placement",
    path: "/placement",
    icon: BriefcaseBusiness,
  },
];

const bottomMenu = [
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const DashboardSidebar = ({ open = false, onClose = () => {} }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");

    window.location.href = "/login";
  };

  return (
    <aside
      className={`dashboard-sidebar ${
        collapsed ? "dashboard-sidebar--collapsed" : ""
      } ${open ? "dashboard-sidebar--open" : ""}`}
    >
      <div className="sidebar-logo-wrapper">
        <NavLink to="/dashboard" className="sidebar-logo">
          <span className="sidebar-logo-icon">
            <img
              src="/src/assets/images/logo.png"
              alt="PrepSphere"
            />
          </span>

          {!collapsed && (
            <span className="sidebar-logo-text">
              Prep<span>Sphere</span>
            </span>
          )}
        </NavLink>
      </div>

      <div className="sidebar-scroll-area">
        <div className="sidebar-section">
          {!collapsed && (
            <p className="sidebar-section-title">Workspace</p>
          )}

          <nav className="sidebar-navigation">
            {mainMenu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${
                      isActive ? "sidebar-nav-item--active" : ""
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-nav-icon">
                    <Icon size={19} strokeWidth={2} />
                  </span>

                  {!collapsed && (
                    <span className="sidebar-nav-label">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="sidebar-ai-card">
            <div className="sidebar-ai-icon">
              <span>AI</span>
            </div>

            <div className="sidebar-ai-content">
              <span className="sidebar-ai-title">
                AI Coach
              </span>

              <p>
                Get personalized tips to improve your interview
                performance.
              </p>

              <NavLink
                to="/interviews"
                className="sidebar-ai-link"
                onClick={onClose}
              >
                Start practicing <span>→</span>
              </NavLink>
            </div>
          </div>
        )}

        <div className="sidebar-bottom">
          <div className="sidebar-bottom-menu">
            {bottomMenu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${
                      isActive ? "sidebar-nav-item--active" : ""
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="sidebar-nav-icon">
                    <Icon size={19} strokeWidth={2} />
                  </span>

                  {!collapsed && (
                    <span className="sidebar-nav-label">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <span className="sidebar-nav-icon">
              <LogOut size={19} strokeWidth={2} />
            </span>

            {!collapsed && (
              <span className="sidebar-nav-label">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="sidebar-collapse-button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={
          collapsed ? "Expand sidebar" : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight size={17} />
        ) : (
          <ChevronLeft size={17} />
        )}
      </button>
    </aside>
  );
};

export default DashboardSidebar;