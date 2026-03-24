import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/common/AppLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import TimetablePage from "./pages/TimetablePage";
import AttendancePage from "./pages/AttendancePage";
import ResultsPage from "./pages/ResultsPage";
import EventsPage from "./pages/EventsPage";
import ClubsPage from "./pages/ClubsPage";
import NoticesPage from "./pages/NoticesPage";
import StudyToolsPage from "./pages/StudyToolsPage";
import PlacementPage from "./pages/PlacementPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="studytools" element={<StudyToolsPage />} />
          <Route path="placement" element={<PlacementPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
