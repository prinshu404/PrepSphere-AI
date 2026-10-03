```jsx
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interviews from "./pages/Interviews";
import InterviewTest from "./pages/InterviewTest";
import InterviewResult from "./pages/InterviewResult";
import Resume from "./pages/Resume";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/interviews" element={<Interviews />} />

      <Route path="/interviews/:id" element={<InterviewTest />} />

      <Route
        path="/interviews/:id/result"
        element={<InterviewResult />}
      />

      <Route path="/resume" element={<Resume />} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
```
