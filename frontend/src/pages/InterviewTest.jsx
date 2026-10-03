
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  LoaderCircle,
  Send,
} from "lucide-react";

import api from "../../api";
import "../assets/css/InterviewTest.css";

function InterviewTest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const QUESTIONS_PER_PAGE = 10;
  const TOTAL_PAGES = 5;

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/interviews?id=${id}`);

        setInterview(response.data);
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

  const handleSubmit = async () => {
    if (submitting) return;

    const unansweredCount = questions.filter(
      (_, index) => !answers[index + 1]
    ).length;

    const confirmed = window.confirm(
      unansweredCount > 0
        ? `You have ${unansweredCount} unanswered question(s). Do you want to submit the interview?`
        : "Are you sure you want to submit the interview?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");
      console.log("SUBMIT ANSWERS:", answers);
      const response = await api.post(
        `/interviews/${id}/submit`,
        {
          answers,
        }
      );

      navigate(`/interviews/${id}/result`, {
        state: {
          result: response.data,
          interview,
        },
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to submit the interview. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="interview-loading">
        <LoaderCircle size={22} />
        <span>Loading interview questions...</span>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="interview-error">
        <h2>Unable to load the interview</h2>

        <p>{error}</p>

        <button
          type="button"
          className="interview-back-button"
          onClick={() => navigate("/interviews")}
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </button>
      </div>
    );
  }

  return (
    <div className="interview-test-page">
      <button
        type="button"
        className="interview-back-button"
        onClick={() => navigate("/interviews")}
      >
        <ArrowLeft size={17} />
        Back to Interviews
      </button>

      <div className="interview-header-card">
        <h1>
          {interview?.title || "Mock Interview"}
        </h1>

        <p>
          {interview?.interview_type || "Technical"}
          {" · "}
          {interview?.subject || "General"}
          {" · "}
          {interview?.difficulty || "Medium"}
        </p>

        <div className="interview-progress">
          <strong>
            Page {currentPage} of {TOTAL_PAGES}
          </strong>

          <span>
            Questions {startIndex + 1}–
            {Math.min(endIndex, questions.length)} of{" "}
            {questions.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="interview-error">
          <p>{error}</p>
        </div>
      )}

      <div className="interview-questions">
        {currentQuestions.map((item) => {
          const questionNumber = item.question_number;

          const selectedAnswer =
            answers[questionNumber] || "";

          const options = [
            {
              key: "A",
              text:
                item.options?.A ||
                item.option_a ||
                "",
            },
            {
              key: "B",
              text:
                item.options?.B ||
                item.option_b ||
                "",
            },
            {
              key: "C",
              text:
                item.options?.C ||
                item.option_c ||
                "",
            },
            {
              key: "D",
              text:
                item.options?.D ||
                item.option_d ||
                "",
            },
          ];

          return (
            <div
              className="interview-question-card"
              key={item.id || questionNumber}
            >
              <h3 className="interview-question-number">
                Question {questionNumber}
              </h3>

              <p className="interview-question-text">
                {item.question}
              </p>

              <div className="interview-options">
                {options.map((option) => (
                  <label
                    key={option.key}
                    className={`interview-option ${
                      selectedAnswer === option.key
                        ? "selected"
                        : ""
                    }`}
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
                    />

                    <span className="interview-option-content">
                      <strong className="interview-option-letter">
                        {option.key}.
                      </strong>

                      <span className="interview-option-text">
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

      <div className="interview-navigation">
        <button
          type="button"
          className="interview-nav-button interview-prev-button"
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || submitting}
        >
          ← Previous
        </button>

        {currentPage < TOTAL_PAGES ? (
          <button
            type="button"
            className="interview-nav-button interview-next-button"
            onClick={goToNextPage}
            disabled={submitting}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="interview-submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoaderCircle
                  size={17}
                  className="interview-submit-spinner"
                />
                Submitting...
              </>
            ) : (
              <>
                <Send size={17} />
                Submit Interview
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default InterviewTest;
