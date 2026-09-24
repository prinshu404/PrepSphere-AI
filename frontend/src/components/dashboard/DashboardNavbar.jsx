import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  Command,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";

import "../../assets/css/navbar.css";

const DashboardNavbar = ({ onMenu }) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Get registered/logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = user.name || "User";

  // Create initials from user's name
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/interviews?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        {/* Mobile menu button */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={onMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search className="navbar-search-icon" size={18} />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search interviews, reports, skills..."
            aria-label="Search dashboard"
          />

          <span className="navbar-search-shortcut">
            <Command size={12} />
            <span>K</span>
          </span>
        </form>
      </div>

      <div className="navbar-right">
        {/* AI Coach button */}
        <button
          type="button"
          className="navbar-ai-button"
          onClick={() => navigate("/interviews")}
        >
          <Sparkles size={16} />
          <span>AI Coach</span>
        </button>

        {/* Notification */}
        <div className="navbar-action-wrapper">
          <button
            type="button"
            className="navbar-icon-button"
            onClick={() => {
              setShowNotifications((value) => !value);
              setShowProfileMenu(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="navbar-notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="navbar-dropdown notification-dropdown">
              <div className="dropdown-header">
                <div>
                  <h4>Notifications</h4>
                  <p>You have new updates</p>
                </div>

                <span className="notification-count">3</span>
              </div>

              <div className="notification-list">
                <button
                  type="button"
                  className="notification-item"
                  onClick={() => navigate("/reports")}
                >
                  <span className="notification-item-icon notification-item-icon--purple">
                    <Sparkles size={15} />
                  </span>

                  <span>
                    <strong>AI performance report</strong>
                    <small>Your latest interview analysis is ready.</small>
                  </span>
                </button>

                <button
                  type="button"
                  className="notification-item"
                  onClick={() => navigate("/interviews")}
                >
                  <span className="notification-item-icon notification-item-icon--blue">
                    <Bell size={15} />
                  </span>

                  <span>
                    <strong>Mock interview reminder</strong>
                    <small>Continue your interview preparation.</small>
                  </span>
                </button>

                <button
                  type="button"
                  className="notification-item"
                  onClick={() => navigate("/roadmap")}
                >
                  <span className="notification-item-icon notification-item-icon--green">
                    <Sparkles size={15} />
                  </span>

                  <span>
                    <strong>Roadmap updated</strong>
                    <small>Your career roadmap has new suggestions.</small>
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="dropdown-footer-button"
                onClick={() => navigate("/reports")}
              >
                View all activity
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="navbar-profile-wrapper">
          <button
            type="button"
            className="navbar-profile-button"
            onClick={() => {
              setShowProfileMenu((value) => !value);
              setShowNotifications(false);
            }}
          >
            {/* Dynamic Avatar */}
            <span className="navbar-avatar">
              {userInitials}
            </span>

            {/* Dynamic User Name */}
            <span className="navbar-profile-info">
              <strong>{userName}</strong>
              <small>Student</small>
            </span>

            <ChevronDown
              className="navbar-profile-chevron"
              size={16}
            />
          </button>

          {showProfileMenu && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="profile-dropdown-header">
                {/* Dynamic Avatar */}
                <span className="navbar-avatar navbar-avatar--large">
                  {userInitials}
                </span>

                <div>
                  {/* Dynamic User Name */}
                  <strong>{userName}</strong>
                  <span>Student</span>
                </div>
              </div>

              <div className="profile-dropdown-divider"></div>

              <NavLink
                to="/profile"
                className="profile-dropdown-item"
                onClick={() => setShowProfileMenu(false)}
              >
                <UserRound size={17} />
                <span>My Profile</span>
              </NavLink>

              <NavLink
                to="/settings"
                className="profile-dropdown-item"
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings size={17} />
                <span>Settings</span>
              </NavLink>

              <div className="profile-dropdown-divider"></div>

              <button
                type="button"
                className="profile-dropdown-item profile-dropdown-item--logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;