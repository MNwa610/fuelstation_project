import { Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./components/AuthProvider.jsx";
import Header from "./components/Header.jsx";
import AdminRoute from "./pages/AdminRoute.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StationDetailPage from "./pages/StationDetailPage.jsx";
import StationsPage from "./pages/StationsPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/stations" element={<StationsPage />} />
        <Route path="/stations/:id" element={<StationDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/stations" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
