import React, { useRef, useState } from "react";
import { Upload, FileText, X, Sparkles, CheckCircle2 } from "lucide-react";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import "../assets/css/resume.css";

const Resume = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setSelectedFile(file);
    setAnalysisComplete(false);
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
    setAnalysisComplete(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 1200);
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

          {analysisComplete && (
            <section className="resume-results">
              <div className="resume-results-header">
                <div>
                  <span className="resume-eyebrow">
                    <CheckCircle2 size={15} />
                    Analysis Complete
                  </span>

                  <h2>Your Resume Insights</h2>

                  <p>
                    Here is a preview of the insights generated from your
                    uploaded resume.
                  </p>
                </div>
              </div>

              <div className="resume-result-grid">
                <article className="resume-score-card">
                  <span>ATS Score</span>

                  <strong>78%</strong>

                  <p>Good compatibility</p>
                </article>

                <article className="resume-insight-card">
                  <h3>Detected Skills</h3>

                  <div className="resume-tags">
                    <span>Python</span>
                    <span>React</span>
                    <span>Django</span>
                    <span>SQL</span>
                    <span>Git</span>
                  </div>
                </article>

                <article className="resume-insight-card">
                  <h3>Missing Keywords</h3>

                  <div className="resume-tags resume-tags--muted">
                    <span>REST API</span>
                    <span>Testing</span>
                    <span>Docker</span>
                  </div>
                </article>

                <article className="resume-insight-card resume-insight-card--wide">
                  <h3>Improvement Suggestions</h3>

                  <ul>
                    <li>
                      Add measurable achievements to your project
                      descriptions.
                    </li>
                    <li>
                      Include more role-specific technical keywords.
                    </li>
                    <li>
                      Keep experience descriptions concise and
                      result-focused.
                    </li>
                  </ul>
                </article>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Resume;