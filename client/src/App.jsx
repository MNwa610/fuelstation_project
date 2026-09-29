import { Routes, Route, Navigate } from "react-router-dom";
import StationsPage from "./pages/StationsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/stations" element={<StationsPage />} />
      <Route path="/" element={<Navigate to="/stations" replace />} />
    </Routes>
  );
}

export default App;
