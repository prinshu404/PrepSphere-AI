import React, { useRef, useState } from "react";
import { Upload, FileText, X, Sparkles, CheckCircle2 } from "lucide-react";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import resumeApi from "../api/resumeApi";

import "../assets/css/resume.css";

const Resume = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setAnalysisResult(null);
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await resumeApi.analyzeResume(formData);

      setAnalysisResult(response.data);
    } catch (err) {
      console.error("Resume analysis error:", err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to analyze the resume. Please try again.";

      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getValue = (obj, keys, fallback = "Not available") => {
    for (const key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null) {
        return obj[key];
      }
    }

    return fallback;
  };

  const atsScore = getValue(
    analysisResult,
    ["ats_score", "atsScore", "score"],
    null
  );

  const skills = getValue(
    analysisResult,
    ["skills", "detected_skills", "detectedSkills"],
    []
  );

  const missingKeywords = getValue(
    analysisResult,
    ["missing_keywords", "missingKeywords", "missing_skills"],
    []
  );

  const suggestions = getValue(
    analysisResult,
    ["suggestions", "improvement_suggestions", "improvementSuggestions"],
    []
  );

  const summary = getValue(
    analysisResult,
    ["summary", "overall_summary", "overallSummary"],
    ""
  );

  const normalizeArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <div className="dashboard-page">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <main className="resume-page">
          <section className="resume-header">
            <div>
              <span className="resume-eyebrow">
                <Sparkles size={15} />
                AI-Powered Resume Review
              </span>

              <h1>Resume Analyzer</h1>

              <p>
                Upload your resume and get actionable insights to improve your
                profile for your target role.
              </p>
            </div>
          </section>

          <section className="resume-content">
            <div className="resume-upload-card">
              <div className="resume-card-heading">
                <div>
                  <h2>Upload your resume</h2>

                  <p>
                    Supported formats: PDF, DOC, and DOCX. Maximum file size:
                    5 MB.
                  </p>
                </div>
              </div>

              {!selectedFile ? (
                <div
                  className={`resume-dropzone ${
                    isDragging ? "resume-dropzone--active" : ""
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="resume-upload-icon">
                    <Upload size={25} />
                  </div>

                  <h3>Drag and drop your resume here</h3>

                  <p>or click to browse a file from your computer</p>

                  <button
                    type="button"
                    className="resume-browse-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Choose File
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    hidden
                  />
                </div>
              ) : (
                <div className="resume-selected-file">
                  <div className="resume-file-left">
                    <div className="resume-file-icon">
                      <FileText size={22} />
                    </div>

                    <div className="resume-file-info">
                      <h3>{selectedFile.name}</h3>

                      <p>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="resume-remove-button"
                    onClick={removeFile}
                    aria-label="Remove selected resume"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {error && <p className="resume-error">{error}</p>}

              {selectedFile && (
                <button
                  type="button"
                  className="resume-analyze-button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="resume-spinner" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Resume
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="resume-side-card">
              <div className="resume-side-icon">
                <Sparkles size={20} />
              </div>

              <h2>What you will get</h2>

              <div className="resume-benefit-list">
                <div>
                  <CheckCircle2 size={18} />
                  <span>ATS compatibility insights</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Skills and keyword analysis</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Resume strengths</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Missing skills and keywords</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Actionable improvement suggestions</span>
                </div>
              </div>
            </div>
          </section>

          {analysisResult && (
            <section className="resume-results">
              <div className="resume-results-header">
                <div>
                  <span className="resume-eyebrow">
                    <CheckCircle2 size={15} />
                    Analysis Complete
                  </span>

                  <h2>Your Resume Insights</h2>

                  <p>
                    Here are the insights generated from your uploaded resume.
                  </p>
                </div>
              </div>

              {summary && (
                <div className="resume-insight-card">
                  <h3>Resume Summary</h3>
                  <p>{summary}</p>
                </div>
              )}

              <div className="resume-result-grid">
                {atsScore !== null && (
                  <article className="resume-score-card">
                    <span>ATS Score</span>

                    <strong>
                      {typeof atsScore === "number"
                        ? `${atsScore}%`
                        : atsScore}
                    </strong>

                    <p>Resume compatibility score</p>
                  </article>
                )}

                <article className="resume-insight-card">
                  <h3>Detected Skills</h3>

                  <div className="resume-tags">
                    {normalizeArray(skills).length > 0 ? (
                      normalizeArray(skills).map((skill, index) => (
                        <span key={index}>{skill}</span>
                      ))
                    ) : (
                      <span>No skills detected</span>
                    )}
                  </div>
                </article>

                <article className="resume-insight-card">
                  <h3>Missing Keywords</h3>

                  <div className="resume-tags resume-tags--muted">
                    {normalizeArray(missingKeywords).length > 0 ? (
                      normalizeArray(missingKeywords).map((keyword, index) => (
                        <span key={index}>{keyword}</span>
                      ))
                    ) : (
                      <span>No missing keywords found</span>
                    )}
                  </div>
                </article>

                {normalizeArray(suggestions).length > 0 && (
                  <article className="resume-insight-card resume-insight-card--wide">
                    <h3>Improvement Suggestions</h3>

                    <ul>
                      {normalizeArray(suggestions).map(
                        (suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        )
                      )}
                    </ul>
                  </article>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Resume;