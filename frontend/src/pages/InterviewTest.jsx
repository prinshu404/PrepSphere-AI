import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Send } from "lucide-react";

import api from "../../api";

function InterviewTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const QUESTIONS_PER_PAGE = 10;
  const TOTAL_PAGES = 5;

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/interviews?id=${id}`);

        setInterview(response.data.interview);
        setQuestions(response.data.questions || []);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load the interview."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  const handleAnswer = (questionNumber, option) => {
    setAnswers((current) => ({
      ...current,
      [questionNumber]: option,
    }));
  };

  const startIndex =
    (currentPage - 1) * QUESTIONS_PER_PAGE;

  const endIndex =
    startIndex + QUESTIONS_PER_PAGE;

  const currentQuestions = questions.slice(
    startIndex,
    endIndex
  );

  const goToNextPage = () => {
    if (currentPage < TOTAL_PAGES) {
      setCurrentPage((page) => page + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = () => {
    const unansweredCount = questions.filter(
      (_, index) => !answers[index + 1]
    ).length;

    const confirmed = window.confirm(
      unansweredCount > 0
        ? `You have ${unansweredCount} unanswered question(s). Do you want to submit the interview?`
        : "Are you sure you want to submit the interview?"
    );

    if (!confirmed) return;

    alert(
      "Interview submission will be connected in the next step."
    );
  };

  if (loading) {
    return (
      <div className="dashboard-section">
        <div className="dashboard-card">
          <LoaderCircle size={22} />
          <p>Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-section">
        <div className="dashboard-card">
          <h2>Unable to load the interview</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/interviews")}
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => navigate("/interviews")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#f1f5f9",
            color: "#1e293b",
            fontWeight: "600",
          }}
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </button>
      </div>

      {/* Interview Header */}
      <div className="dashboard-card">
        <h1>
          {interview?.title || "Mock Interview"}
        </h1>

        <p>
          {interview?.interview_type || "Technical"}{" "}
          ·{" "}
          {interview?.subject || "General"}{" "}
          ·{" "}
          {interview?.difficulty || "Medium"}
        </p>

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <strong>
            Page {currentPage} of {TOTAL_PAGES}
          </strong>

          <span>
            Questions {startIndex + 1}–{Math.min(endIndex, questions.length)}{" "}
            of {questions.length}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "20px",
        }}
      >
        {currentQuestions.map((item) => {
          const questionNumber = item.question_number;

          const selectedAnswer =
            answers[questionNumber] || "";

          const options = [
            {
              key: "A",
              text: item.option_a,
            },
            {
              key: "B",
              text: item.option_b,
            },
            {
              key: "C",
              text: item.option_c,
            },
            {
              key: "D",
              text: item.option_d,
            },
          ];

          return (
            <div
              className="dashboard-card"
              key={item.id || questionNumber}
            >
              <h3
                style={{
                  marginBottom: "12px",
                }}
              >
                Question {questionNumber}
              </h3>

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.7",
                  fontWeight: "600",
                  marginBottom: "20px",
                }}
              >
                {item.question}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {options.map((option) => (
                  <label
                    key={option.key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "14px 16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background:
                        selectedAnswer === option.key
                          ? "#eff6ff"
                          : "#ffffff",
                      borderColor:
                        selectedAnswer === option.key
                          ? "#3b82f6"
                          : "#e2e8f0",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${questionNumber}`}
                      value={option.key}
                      checked={
                        selectedAnswer === option.key
                      }
                      onChange={() =>
                        handleAnswer(
                          questionNumber,
                          option.key
                        )
                      }
                      style={{
                        width: "16px",
                        height: "16px",
                        minWidth: "16px",
                        marginTop: "3px",
                        cursor: "pointer",
                        accentColor: "#2563eb",
                      }}
                    />

                    <span
                      style={{
                        display: "flex",
                        gap: "8px",
                        lineHeight: "1.5",
                        fontSize: "15px",
                      }}
                    >
                      <strong>
                        {option.key}.
                      </strong>

                      <span>
                        {option.text}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginTop: "24px",
          marginBottom: "30px",
        }}
      >
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            cursor:
              currentPage === 1
                ? "not-allowed"
                : "pointer",
            background:
              currentPage === 1
                ? "#e2e8f0"
                : "#f1f5f9",
            color: "#1e293b",
            fontWeight: "600",
            opacity:
              currentPage === 1 ? 0.6 : 1,
          }}
        >
          ← Previous
        </button>

        {currentPage < TOTAL_PAGES ? (
          <button
            type="button"
            onClick={goToNextPage}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#2563eb",
              color: "#ffffff",
              fontWeight: "600",
            }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#16a34a",
              color: "#ffffff",
              fontWeight: "600",
            }}
          >
            <Send size={17} />
            Submit Interview
          </button>
        )}
      </div>
    </div>
  );
}

export default InterviewTest;