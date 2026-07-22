import { Routes, Route, Navigate } from "react-router-dom";
import LoadingPage from "@/pages/LoadingPage";
import SignupPage from "@/pages/SignupPage";
import Loginpage from "@/pages/LoginPage";
import GuestPage from "@/pages/TryasguestPage";
export default function AppRouter() {
  return (
    <Routes>
      {/* Sets HomePage as the absolute default view */}
      <Route path="/" element={<LoadingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/try-as-guest" element={<GuestPage />} />
      {/* Optional fallback: Redirects unknown URLs back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
