import React from "react";
import {
  FileSearch,
  Mic2,
  Code2,
  Map,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../assets/css/quick-actions.css";

const actions = [
  {
    id: 1,
    title: "Analyze Resume",
    description: "Get AI-powered resume feedback",
    icon: FileSearch,
    iconClass: "quick-action-icon--purple",
    path: "/resume",
  },
  {
    id: 2,
    title: "Mock Interview",
    description: "Practice with your AI interviewer",
    icon: Mic2,
    iconClass: "quick-action-icon--blue",
    path: "/interviews",
  },
  {
    id: 3,
    title: "Coding Practice",
    description: "Improve your coding skills",
    icon: Code2,
    iconClass: "quick-action-icon--green",
    path: "/coding",
  },
  {
    id: 4,
    title: "Career Roadmap",
    description: "Plan your career journey",
    icon: Map,
    iconClass: "quick-action-icon--orange",
    path: "/roadmap",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <div>
          <h2>Quick Actions</h2>
          <p>Jump back into your preparation.</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              type="button"
              className="quick-action-card"
              key={action.id}
              onClick={() => navigate(action.path)}
            >
              <div className={`quick-action-icon ${action.iconClass}`}>
                <Icon size={18} strokeWidth={2.1} />
              </div>

              <div className="quick-action-content">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </div>

              <ArrowRight
                className="quick-action-arrow"
                size={15}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;