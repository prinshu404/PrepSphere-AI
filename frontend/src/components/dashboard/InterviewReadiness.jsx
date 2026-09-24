import React from "react";
import {
  CheckCircle2,
  Clock3,
  Target,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/interview-readiness.css";

const labels = {
  technical: "Technical Knowledge",
  communication: "Communication",
  problemSolving: "Problem Solving",
  confidence: "Confidence",
};

export default function InterviewReadiness({
  skills = {},
  readiness = 0,
}) {
  const navigate = useNavigate();

  const items = Object.entries(labels).map(([key, label]) => ({
    key,
    label,
    score: Number(skills[key] || 0),
    status:
      Number(skills[key] || 0) >= 85
        ? "Strong"
        : Number(skills[key] || 0) >= 70
        ? "Good"
        : "Improve",
  }));

  const strong = items.filter((i) => i.score >= 85).length;
  const improve = items.filter((i) => i.score < 70).length;

  return (
    <div className="interview-readiness">

      {/* Header */}
      <div className="dashboard-section-header">
        <div>
          <h2 className="dashboard-section-heading">
            Interview Readiness
          </h2>

          <p className="dashboard-section-description">
            See how prepared you are for your next interview.
          </p>
        </div>

        <div className="readiness-status">
          <span className="readiness-status-dot"></span>
          {readiness >= 90
            ? "Interview Ready"
            : "Ready to improve"}
        </div>
      </div>

      {/* Main Readiness */}
      <div className="readiness-main">

        {/* Score */}
        <div className="readiness-score-wrapper">

          <div
            className="readiness-score-ring"
            style={{
              "--readiness-progress": `${readiness * 3.6}deg`,
            }}
          >
            <div className="readiness-score-inner">
              <strong>{readiness}</strong>
              <span>%</span>
            </div>
          </div>

          <div className="readiness-score-info">
            <h3>
              {readiness >= 90
                ? "Excellent Progress"
                : readiness >= 70
                ? "Good Progress"
                : "Keep Practicing"}
            </h3>

            <p>
              {readiness >= 90
                ? "You're ready to take on your next interview."
                : "Your readiness is calculated from your current skill scores."}
            </p>

            <span className="readiness-target">
              <Target size={13} />
              Target: 90%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="readiness-stats">

          <div className="readiness-stat">
            <div className="readiness-stat-icon readiness-stat-icon--green">
              <CheckCircle2 size={16} />
            </div>

            <div>
              <strong>{strong}</strong>
              <span>Strong Areas</span>
            </div>
          </div>

          <div className="readiness-stat">
            <div className="readiness-stat-icon readiness-stat-icon--orange">
              <Clock3 size={16} />
            </div>

            <div>
              <strong>{improve}</strong>
              <span>Areas to Improve</span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="readiness-footer">

          <button
            type="button"
            className="readiness-primary-button"
            onClick={() => navigate("/interviews")}
          >
            <PlayCircle size={15} />
            Practice Interview
          </button>

          <button
            type="button"
            className="readiness-secondary-button"
            onClick={() => navigate("/reports")}
          >
            View Detailed Report
            <ArrowRight size={14} />
          </button>

        </div>

      </div>

      {/* Skills */}
      <div className="readiness-skills">
        {items.map((item) => (
          <div
            className="readiness-skill"
            key={item.key}
          >
            <div className="readiness-skill-header">

              <span>{item.label}</span>

              <div className="readiness-skill-score">
                <strong>{item.score}%</strong>

                <span
                  className={`readiness-skill-status readiness-skill-status--${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>
              </div>

            </div>

            <div className="readiness-progress-track">
              <div
                className="readiness-progress-fill"
                style={{
                  width: `${item.score}%`,
                }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}