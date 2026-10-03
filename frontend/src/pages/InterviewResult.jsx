
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Download,
} from "lucide-react";

import "../assets/css/InterviewResult.css";

function InterviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const interview = location.state?.interview;

  if (!result) {
    return (
      <div className="interview-result-page">
        <div className="interview-result-empty">
          <h2>Result not available</h2>

          <p>
            The interview result could not be loaded.
          </p>

          <button
            type="button"
            className="interview-result-back-button"
            onClick={() => navigate("/interviews")}
          >
            <ArrowLeft size={17} />
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  const score = Number(result.score || 0);
  const percentage = Number(result.percentage || 0);
  const correct = Number(result.correct || 0);
  const wrong = Number(result.wrong || 0);
  const unanswered = Number(result.unanswered || 0);

  const analysis = Array.isArray(result.analysis)
    ? result.analysis
    : [];

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="interview-result-page">
      <div className="interview-result-topbar">
        <button
          type="button"
          className="interview-result-back-button"
          onClick={() => navigate("/interviews")}
        >
          <ArrowLeft size={17} />
          Back to Interviews
        </button>

        <button
          type="button"
          className="interview-result-pdf-button"
          onClick={handleDownloadPdf}
        >
          <Download size={17} />
          Download PDF
        </button>
      </div>

      <section className="interview-result-header">
        <div>
          <span className="interview-result-eyebrow">
            Interview Completed
          </span>

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
        </div>
      </section>

      <section className="interview-result-score-card">
        <div className="interview-result-main-score">
          <span>Final Score</span>

          <strong>{score}</strong>

          <small>
            {percentage.toFixed(1)}%
          </small>
        </div>

        <div className="interview-result-stat correct">
          <CheckCircle2 size={22} />

          <div>
            <strong>{correct}</strong>
            <span>Correct</span>
          </div>
        </div>

        <div className="interview-result-stat wrong">
          <XCircle size={22} />

          <div>
            <strong>{wrong}</strong>
            <span>Wrong</span>
          </div>
        </div>

        <div className="interview-result-stat unanswered">
          <MinusCircle size={22} />

          <div>
            <strong>{unanswered}</strong>
            <span>Unanswered</span>
          </div>
        </div>
      </section>

      <section className="interview-result-analysis">
        <div className="interview-result-section-heading">
          <div>
            <span className="interview-result-eyebrow">
              Detailed Analysis
            </span>

            <h2>
              Question-wise Solutions
            </h2>

            <p>
              Review your answers against the correct answers
              and solutions.
            </p>
          </div>
        </div>

        <div className="interview-result-question-list">
          {analysis.map((item, index) => {
            const selectedOption =
              item.selected_option || "";

            const correctOption =
              item.correct_option || "";

            const isUnanswered =
              !selectedOption;

            const isCorrect =
              selectedOption === correctOption;

            return (
              <article
                className="interview-result-question-card"
                key={item.question_number || index}
              >
                <div className="interview-result-question-header">
                  <span>
                    Question{" "}
                    {item.question_number ||
                      index + 1}
                  </span>

                  {isUnanswered ? (
                    <span className="interview-result-status unanswered">
                      <MinusCircle size={16} />
                      Unanswered
                    </span>
                  ) : isCorrect ? (
                    <span className="interview-result-status correct">
                      <CheckCircle2 size={16} />
                      Correct
                    </span>
                  ) : (
                    <span className="interview-result-status wrong">
                      <XCircle size={16} />
                      Wrong
                    </span>
                  )}
                </div>

                <h3>
                  {item.question}
                </h3>

                <div className="interview-result-answer-grid">
                  <div
                    className={`interview-result-answer-box ${
                      isCorrect
                        ? "is-correct"
                        : isUnanswered
                        ? "is-unanswered"
                        : "is-wrong"
                    }`}
                  >
                    <span>Your Answer</span>

                    <strong>
                      {selectedOption
                        ? `${selectedOption}. ${
                            item.selected_text || ""
                          }`
                        : "Not answered"}
                    </strong>
                  </div>

                  <div className="interview-result-answer-box is-correct">
                    <span>Correct Answer</span>

                    <strong>
                      {correctOption}.{" "}
                      {item.correct_text || ""}
                    </strong>
                  </div>
                </div>

                {item.explanation && (
                  <div className="interview-result-explanation">
                    <strong>Solution</strong>

                    <p>
                      {item.explanation}
                    </p>
                  </div>
                )}

                <div className="interview-result-marks">
                  Marks:{" "}
                  <strong>
                    {Number(item.marks || 0) > 0
                      ? `+${item.marks}`
                      : item.marks}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default InterviewResult;
