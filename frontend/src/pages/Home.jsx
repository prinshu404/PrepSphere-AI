
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  LoaderCircle,
  Map,
  Mic,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getHomeData } from "../services/homeApi";

const featureIcons = [
  Mic,
  FileText,
  Code2,
  BarChart3,
  Map,
  Building2,
];

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const data = await getHomeData();
        setHomeData(data);
      } catch (err) {
        setError(
          err.request
            ? "Unable to get data from the PrepSphere server. Please check the backend."
            : "Unable to load the home page."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="auth-page">
        <div style={{ textAlign: "center", color: "#635bff" }}>
          <LoaderCircle size={28} className="loading-icon" />
          <p style={{ fontSize: "12px", color: "#7d8395" }}>
            Loading PrepSphere...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div
            className="auth-brand"
            style={{ justifyContent: "center" }}
          >
            <Sparkles size={20} />
            Prep<span>Sphere</span> AI
          </div>

          <h1>Something went wrong</h1>
          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const platform = homeData?.platform || {};
  const stats = homeData?.stats || {};
  const features = homeData?.features || [];

  return (
    <div className="home-page">
      <header className="home-header">
        <nav className="home-navbar">
          <Link to="/" className="home-logo">
            <Sparkles size={21} />

            <span>
              Prep<span>Sphere</span> AI
            </span>
          </Link>

          <div className="home-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#why-prepsphere">Why PrepSphere</a>
          </div>

          <div className="home-nav-actions">
            <Link to="/login" className="nav-login">
              Student Login
            </Link>

            <Link to="/login" className="nav-register">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} />
              AI-powered interview preparation
            </div>

            <h1>
              {platform.tagline || "Prepare smarter. Perform better."}
              <br />
              <span>Build your career with confidence.</span>
            </h1>

            <p>
              {platform.description ||
                "AI-powered preparation tools for interviews, resumes and coding practice."}
            </p>

            <div className="hero-buttons">
              <Link to="/login" className="primary-button">
                Start Preparing
                <ArrowRight size={18} />
              </Link>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="hero-points">
              <span>
                <CheckCircle2 size={17} />
                Personalized practice
              </span>

              <span>
                <CheckCircle2 size={17} />
                AI feedback
              </span>

              <span>
                <CheckCircle2 size={17} />
                Placement focused
              </span>
            </div>

            <div className="home-live-stats">
              <div>
                <strong>{stats.students ?? 0}</strong>
                <span>Students</span>
              </div>

              <div>
                <strong>{stats.interviews ?? 0}</strong>
                <span>Interviews</span>
              </div>

              <div>
                <strong>{stats.questions ?? 0}</strong>
                <span>Questions</span>
              </div>

              <div>
                <strong>{stats.reports ?? 0}</strong>
                <span>Reports</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ai-preview-card">
              <div className="preview-header">
                <div className="preview-brand-icon">
                  <Brain size={22} />
                </div>

                <div>
                  <strong>AI Interview Coach</strong>
                  <small>Practice session</small>
                </div>

                <span className="status-dot" />
              </div>

              <div className="preview-question">
                <small>INTERVIEW QUESTION</small>

                <h3>
                  Tell me about yourself and your technical background.
                </h3>
              </div>

              <div className="preview-analysis">
                <div className="analysis-heading">
                  <Target size={17} />
                  <span>Performance overview</span>
                </div>

                <div className="score-row">
                  <span>Communication</span>
                  <strong>85%</strong>
                </div>

                <div className="score-bar">
                  <span style={{ width: "85%" }} />
                </div>

                <div className="score-row">
                  <span>Confidence</span>
                  <strong>78%</strong>
                </div>

                <div className="score-bar">
                  <span style={{ width: "78%" }} />
                </div>

                <div className="score-row">
                  <span>Technical clarity</span>
                  <strong>91%</strong>
                </div>

                <div className="score-bar">
                  <span style={{ width: "91%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="home-section features-section">
          <div className="section-heading">
            <span className="section-label">
              Everything in one place
            </span>

            <h2>
              Tools that make your
              <span> preparation easier</span>
            </h2>

            <p>
              {platform.description ||
                "Keep your important placement preparation tools together."}
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = featureIcons[index] || Sparkles;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={23} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <Link to="/login">
                    Explore
                    <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how-it-works" className="home-section steps-section">
          <div className="section-heading">
            <span className="section-label">How it works</span>

            <h2>
              A simple way to stay
              <span> consistent</span>
            </h2>

            <p>
              Follow a clear preparation routine and keep improving with
              measurable progress.
            </p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Build Your Profile</h3>

              <p>
                Add your academic details, skills and the role you are
                preparing for.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Start Practicing</h3>

              <p>
                Practice interviews, coding questions and improve your
                resume.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Review Your Progress</h3>

              <p>
                Use feedback and reports to understand where you need
                improvement.
              </p>
            </article>

            <article className="step-card">
              <span className="step-number">04</span>
              <h3>Prepare With Confidence</h3>

              <p>
                Follow your preparation roadmap consistently until you are
                ready.
              </p>
            </article>
          </div>
        </section>

        <section id="why-prepsphere" className="home-section why-section">
          <div className="why-content">
            <span className="section-label">Built for students</span>

            <h2>
              Turn preparation into
              <span> measurable progress</span>
            </h2>

            <p>
              {platform.description ||
                "PrepSphere helps students understand what to practice next and track their preparation."}
            </p>

            <div className="benefit-list">
              <div>
                <CheckCircle2 size={19} />
                <span>Structured interview preparation</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Actionable AI feedback</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Progress tracking</span>
              </div>

              <div>
                <CheckCircle2 size={19} />
                <span>Career-focused preparation</span>
              </div>
            </div>
          </div>

          <div className="progress-preview">
            <div className="progress-card">
              <div className="progress-card-top">
                <div>
                  <small>PLATFORM ACTIVITY</small>
                  <h3>PrepSphere overview</h3>
                </div>

                <BarChart3 size={23} />
              </div>

              <div className="progress-score">
                <strong>{stats.students ?? 0}</strong>
                <span>Registered students</span>
              </div>

              <div className="progress-track">
                <span
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(8, (stats.students || 0) * 10)
                    )}%`,
                  }}
                />
              </div>

              <div className="progress-stats">
                <div>
                  <strong>{stats.interviews ?? 0}</strong>
                  <span>Interviews</span>
                </div>

                <div>
                  <strong>{stats.questions ?? 0}</strong>
                  <span>Questions</span>
                </div>

                <div>
                  <strong>{stats.reports ?? 0}</strong>
                  <span>Reports</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <div className="cta-icon">
            <Sparkles size={27} />
          </div>

          <h2>Ready to start preparing?</h2>

          <p>
            Create your account and build a preparation routine that works
            for you.
          </p>

          <Link to="/login" className="cta-button">
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="home-logo">
              <Sparkles size={20} />

              <span>
                Prep<span>Sphere</span> AI
              </span>
            </Link>

            <p>
              A focused AI platform for interview and placement preparation.
            </p>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/login">Resume Analyzer</Link>
            <Link to="/login">Mock Interviews</Link>
            <Link to="/login">Coding Practice</Link>
            <Link to="/login">Reports</Link>
          </div>

          <div className="footer-column">
            <h4>Preparation</h4>
            <Link to="/login">Career Roadmap</Link>
            <Link to="/login">Company Prep</Link>
            <Link to="/login">Placement</Link>
          </div>

          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/login">Student Login</Link>
            <Link to="/login">Create Account</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 PrepSphere AI</span>
          <span>Built for smarter preparation.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
