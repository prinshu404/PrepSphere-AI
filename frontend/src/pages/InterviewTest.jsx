```jsx
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

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;

  const currentQuestions = questions.slice(startIndex, endIndex);

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

    alert("Interview submission will be connected in the next step.");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <LoaderCircle
          size={34}
          style={{
            animation: "spin 1s linear infinite",
          }}
        />

        <p>Loading interview questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <div className="auth-error">{error}</div>

        <button
          type="button"
          onClick={() => navigate("/interviews")}
          style={{
            marginTop: "16px",
          }}
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "min(900px, 92%)",
        margin: "30px auto",
        paddingBottom: "40px",
      }}
    >
      <button
        type="button"
        onClick={() => navigate("/interviews")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          marginBottom: "20px",
        }}
      >
        <ArrowLeft size={17} />
        Back to Interviews
      </button>

      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "none",
          boxSizing: "border-box",
        }}
      >
        <h1>{interview?.title || "Mock Interview"}</h1>

        <p>
          {interview?.interview_type || "Technical"} ·{" "}
          {interview?.subject || "General"} ·{" "}
          {interview?.difficulty || "Medium"}
        </p>

        <div
          style={{
            marginTop: "18px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#f6f7ff",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <strong>
            Page {currentPage} of {TOTAL_PAGES}
          </strong>

          <span>
            Questions {startIndex + 1}–{Math.min(endIndex, questions.length)}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "18px",
          marginTop: "20px",
        }}
      >
        {currentQuestions.map((item, index) => {
          const questionNumber = startIndex + index + 1;
          const selectedAnswer = answers[questionNumber];

          return (
            <div
              key={item.id || questionNumber}
              className="auth-card"
              style={{
                width: "100%",
                maxWidth: "none",
                boxSizing: "border-box",
                margin: 0,
              }}
            >
              <h3>
                Question {questionNumber}
              </h3>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                {item.question}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                {["A", "B", "C", "D"].map((option) => {
                  const optionText =
                    item[`option_${option.toLowerCase()}`];

                  const isSelected =
                    selectedAnswer === option;

                  return (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "12px",
                        border: isSelected
                          ? "2px solid #635bff"
                          : "1px solid #ddd",
                        borderRadius: "10px",
                        cursor: "pointer",
                        background: isSelected
                          ? "#f6f7ff"
                          : "#fff",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${questionNumber}`}
                        value={option}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswer(
                            questionNumber,
                            option
                          )
                        }
                        style={{
                          marginTop: "4px",
                        }}
                      />

                      <span>
                        <strong>{option}.</strong>{" "}
                        {optionText}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "none",
          boxSizing: "border-box",
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {currentPage < TOTAL_PAGES ? (
          <button
            type="button"
            onClick={goToNextPage}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
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

