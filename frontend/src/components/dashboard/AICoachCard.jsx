import React from "react";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ai-coach-card.css";

const icons = {
  communication: MessageCircle,
  technical: Lightbulb,
  problemSolving: Lightbulb,
  confidence: TrendingUp,
  insights: Sparkles,
  consistency: TrendingUp,
  momentum: TrendingUp,
};

export default function AICoachCard({ recommendations = [] }) {
  const navigate = useNavigate();

  const focus = recommendations[0] || {
    title: "Start your first mock interview",
    description:
      "Complete a mock interview so PrepSphere can personalize your coaching and skill analysis.",
  };

  return (
    <div className="ai-coach-card">

      {/* Header */}
      <div className="ai-coach-header">
        <div className="ai-coach-title-wrapper">
          <div className="ai-coach-main-icon">
            <Sparkles size={19} strokeWidth={2.2} />
          </div>

          <div className="ai-coach-title-content">
            <div className="ai-coach-heading-row">
              <h2>AI Coach</h2>

              <span className="ai-coach-ai-badge">
                <Sparkles size={11} />
                AI Powered
              </span>
            </div>

            <p>Personalized recommendations for you</p>
          </div>
        </div>

        <span className="ai-coach-live">
          <span className="ai-coach-live-dot"></span>
          Active
        </span>
      </div>

      {/* Today's Focus */}
      <div className="ai-coach-message">
        <div className="ai-coach-message-glow"></div>

        <div className="ai-coach-message-icon">
          <Sparkles size={18} strokeWidth={2.1} />
        </div>

        <div className="ai-coach-message-content">
          <span className="ai-coach-message-label">
            TODAY'S FOCUS
          </span>

          <h3>{focus.title}</h3>

          <p>{focus.description}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="ai-recommendations">

        <div className="ai-recommendations-header">
          <div>
            <span className="ai-recommendations-title">
              Recommended for you
            </span>
            <small>Based on your recent activity</small>
          </div>

          <Sparkles size={16} />
        </div>

        <div className="ai-recommendations-list">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((item, index) => {
              const Icon = icons[item.type] || Sparkles;

              return (
                <div
                  className="ai-recommendation"
                  key={item.id || index}
                >
                  <div
                    className={`ai-recommendation-icon ai-recommendation-icon--${
                      index === 0
                        ? "purple"
                        : index === 1
                        ? "orange"
                        : "green"
                    }`}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </div>

                  <div className="ai-recommendation-content">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>

                  <div className="ai-recommendation-arrow">
                    <ChevronRight size={15} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="ai-empty-recommendation">
              <div className="ai-empty-icon">
                <Sparkles size={15} />
              </div>

              <div>
                <strong>Your AI coach is ready</strong>
                <span>
                  Complete a mock interview to unlock personalized
                  recommendations.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="ai-coach-footer">
        <button
          type="button"
          className="ai-coach-primary-button"
          onClick={() => navigate("/interviews")}
        >
          <PlayCircle size={16} strokeWidth={2.2} />
          <span>Practice with AI</span>
          <ArrowRight size={15} />
        </button>

        <button
          type="button"
          className="ai-coach-link-button"
          onClick={() => navigate("/reports")}
        >
          <span>View insights</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}