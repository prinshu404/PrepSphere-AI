import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  createInterview,
  getInterviews,
} from "../services/interviewApi";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [title, setTitle] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadInterviews = async () => {
    try {
      setError("");

      const response = await getInterviews();
      setInterviews(response.data);
    } catch (err) {
      setError(
        err.request
          ? "Unable to connect to the PrepSphere server."
          : "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an interview title.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await createInterview({
        title: title.trim(),
        interview_type: interviewType,
      });

      setInterviews((current) => [response.data, ...current]);
      setTitle("");
      setInterviewType("Technical");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create interview."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="auth-page">
      <div
        style={{
          width: "min(900px, 92%)",
          margin: "40px auto",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "24px",
            color: "#635bff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div
          className="auth-card"
          style={{
            width: "100%",
            maxWidth: "none",
            boxSizing: "border-box",
          }}
        >
          <div className="auth-brand">
            <Sparkles size={20} />
            Prep<span>Sphere</span> AI
          </div>

          <h1>Mock Interviews</h1>

          <p>
            Create an interview practice session and track your
            preparation.
          </p>

          <form onSubmit={handleCreate}>
            <label>
              Interview Title

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Frontend Developer Interview"
              />
            </label>

            <label>
              Interview Type

              <select
                value={interviewType}
                onChange={(event) =>
                  setInterviewType(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Coding">Coding</option>
              </select>
            </label>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button type="submit" disabled={creating}>
              {creating ? (
                "Creating..."
              ) : (
                <>
                  <Plus size={17} />
                  Create Interview
                </>
              )}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h2>My Interviews</h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <LoaderCircle size={28} />
              <p>Loading interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div
              className="auth-card"
              style={{
                width: "100%",
                maxWidth: "none",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              <CalendarDays
                size={32}
                style={{ color: "#635bff" }}
              />

              <h3>No interviews yet</h3>

              <p>
                Create your first interview practice session above.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "18px",
              }}
            >
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="auth-card"
                  style={{
                    width: "100%",
                    maxWidth: "none",
                    boxSizing: "border-box",
                    margin: 0,
                  }}
                >
                  <h3>{interview.title}</h3>

                  <p>
                    {interview.interview_type} ·{" "}
                    {interview.status}
                  </p>

                  <strong>
                    Score: {interview.score}%
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interviews;