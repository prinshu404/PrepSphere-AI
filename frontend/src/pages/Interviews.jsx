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
  const [subject, setSubject] = useState("Python");
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const subjectOptions = {
    Technical: [
      "Python",
      "Java",
      "JavaScript",
      "React",
      "Django",
      "Web Development",
      "Database",
      "Data Structures",
      "Algorithms",
    ],
    HR: [
      "HR Interview",
      "Communication",
      "Leadership",
      "Teamwork",
      "Problem Solving",
    ],
    Behavioral: [
      "Behavioral Interview",
      "Communication",
      "Leadership",
      "Teamwork",
      "Problem Solving",
    ],
    Coding: [
      "Python",
      "Java",
      "JavaScript",
      "Data Structures",
      "Algorithms",
    ],
  };

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

  useEffect(() => {
    const subjects = subjectOptions[interviewType] || [];

    if (subjects.length > 0 && !subjects.includes(subject)) {
      setSubject(subjects[0]);
    }
  }, [interviewType]);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter an interview title.");
      return;
    }

    if (!subject) {
      setError("Please select a subject.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await createInterview({
        title: title.trim(),
        interview_type: interviewType,
        subject,
        difficulty,
      });

      setInterviews((current) => [response.data, ...current]);

      setTitle("");
      setInterviewType("Technical");
      setSubject("Python");
      setDifficulty("Medium");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create interview."
      );
    } finally {
      setCreating(false);
    }
  };

  const currentSubjects = subjectOptions[interviewType] || [];

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
            Create an AI-powered mock interview with 50 unique
            multiple-choice questions.
          </p>

          <form onSubmit={handleCreate}>
            <label>
              Interview Title

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Python Developer Interview"
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

            <label>
              Subject

              <select
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
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
                {currentSubjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Difficulty

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
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
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>

            <div
              style={{
                marginTop: "14px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#f6f7ff",
                color: "#4b4b5a",
                fontSize: "14px",
              }}
            >
              <strong>Test format:</strong> 50 MCQ questions ·
              5 pages · 10 questions per page
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <button type="submit" disabled={creating}>
              {creating ? (
                <>
                  <LoaderCircle
                    size={17}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Generating 50 Questions...
                </>
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
                Create your first AI-powered interview practice
                session above.
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
                    {interview.subject || "General"} ·{" "}
                    {interview.difficulty || "Medium"}
                  </p>

                  <p>
                    Status: {interview.status}
                  </p>

                  <strong>
                    Questions: {interview.question_count || 50}
                  </strong>

                  <div
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    <strong>
                      Score: {interview.score}%
                    </strong>
                  </div>
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

