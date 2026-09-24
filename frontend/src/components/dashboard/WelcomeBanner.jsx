import React from "react";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/welcome-banner.css";

export default function WelcomeBanner({ user }) {
  const navigate = useNavigate();
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "there";
  return (
    <div className="welcome-banner">
      <div className="welcome-banner-content">
        <div className="welcome-banner-badge"><Sparkles size={14} /><span>AI-Powered Career Preparation</span></div>
        <h1>Welcome back, <span>{firstName}!</span></h1>
        <p>Keep building your skills and stay interview-ready. Your AI career coach is here to help you improve every step.</p>
        <div className="welcome-banner-actions">
          <button type="button" className="welcome-primary-button" onClick={() => navigate("/interviews")}><PlayCircle size={17} />Start Mock Interview</button>
          <button type="button" className="welcome-secondary-button" onClick={() => navigate("/roadmap")}>View Career Roadmap<ArrowRight size={16} /></button>
        </div>
      </div>
      <div className="welcome-banner-visual">
        <div className="welcome-orbit welcome-orbit-one"></div><div className="welcome-orbit welcome-orbit-two"></div>
        <div className="welcome-ai-circle"><Sparkles size={34} /></div>
        <div className="welcome-floating-card welcome-floating-card--top"><span className="floating-card-dot"></span><div><strong>Interview Ready</strong><small>Personalized for you</small></div></div>
        <div className="welcome-floating-card welcome-floating-card--bottom"><span className="floating-score">{user?.readiness ?? 0}%</span><div><strong>Readiness</strong><small>Based on your skills</small></div></div>
      </div>
    </div>
  );
}
