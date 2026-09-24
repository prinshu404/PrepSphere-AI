import api from "../../api";

const resumeApi = {
  analyzeResume: (formData) =>
    api.post("/resume/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default resumeApi;