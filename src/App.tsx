import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ── Auth context & guards ──────────────────────────────────────────────────────
import { AuthProvider }    from './context/AuthContext'
import ProtectedRoute      from './components/auth/ProtectedRoute'

// ── Layouts ───────────────────────────────────────────────────────────────────
import MainLayout  from './components/layout/MainLayout'
import AuthLayout  from './components/layout/AuthLayout'

// ── Public pages ──────────────────────────────────────────────────────────────
import LandingPage from './pages/landing/LandingPage'
import AboutPage   from './pages/about/AboutPage'
import ContactPage from './pages/contact/ContactPage'

// ── Auth pages ────────────────────────────────────────────────────────────────
import LoginPage          from './pages/auth/LoginPage'
import RegisterPage       from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// ── Protected app pages ───────────────────────────────────────────────────────
import DashboardPage      from './pages/dashboard/DashboardPage'
import RoadmapsPage       from './pages/roadmaps/RoadmapsPage'
import RoadmapDetailsPage from './pages/roadmaps/RoadmapDetailsPage'
import PracticePage       from './pages/practice/PracticePage'
import ProblemDetailsPage from './pages/practice/ProblemDetailsPage'
import AptitudePage       from './pages/aptitude/AptitudePage'
import InterviewPage      from './pages/interview/InterviewPage'
import ResumeBuilderPage  from './pages/resume/ResumeBuilderPage'
import CompaniesPage      from './pages/companies/CompaniesPage'
import ProgressPage       from './pages/progress/ProgressPage'
import ProfilePage        from './pages/profile/ProfilePage'
import SettingsPage       from './pages/settings/SettingsPage'
import NotificationsPage  from './pages/notifications/NotificationsPage'
import LeaderboardPage    from './pages/leaderboard/LeaderboardPage'
import CommunityPage      from './pages/community/CommunityPage'
import PostDetailsPage    from './pages/community/PostDetailsPage'
import ResourcesPage      from './pages/resources/ResourcesPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

// ── 404 ───────────────────────────────────────────────────────────────────────
import NotFoundPage from './pages/NotFoundPage'

/**
 * App — root router.
 *
 * Route groups:
 *  Public (MainLayout)        → Landing, About, Contact, Leaderboard, Community
 *  Auth   (AuthLayout)        → Login, Register, ForgotPassword
 *  Protected (ProtectedRoute) → All app pages requiring auth
 *  *                          → 404
 *
 * AuthProvider is placed inside BrowserRouter so it can call useNavigate.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public pages — no auth required ── */}
          <Route element={<MainLayout />}>
            <Route index             element={<LandingPage />} />
            <Route path="about"      element={<AboutPage />} />
            <Route path="contact"    element={<ContactPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="community"  element={<CommunityPage />} />
            <Route path="community/:id" element={<PostDetailsPage />} />
            <Route path="resources"  element={<ResourcesPage />} />
            {/* Public preview of roadmaps/companies */}
            <Route path="roadmaps"          element={<RoadmapsPage />} />
            <Route path="roadmaps/:slug"    element={<RoadmapDetailsPage />} />
            <Route path="companies"         element={<CompaniesPage />} />
            <Route path="companies/:slug"   element={<CompaniesPage />} />
          </Route>

          {/* ── Auth pages — split branding layout ── */}
          <Route element={<AuthLayout />}>
            <Route path="login"           element={<LoginPage />} />
            <Route path="register"        element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* ── Protected pages — must be logged in ── */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard"     element={<DashboardPage />} />
              <Route path="practice"      element={<PracticePage />} />
              <Route path="practice/:id"  element={<ProblemDetailsPage />} />
              <Route path="aptitude"      element={<AptitudePage />} />
              <Route path="interview"     element={<InterviewPage />} />
              <Route path="resume"        element={<ResumeBuilderPage />} />
              <Route path="progress"      element={<ProgressPage />} />
              <Route path="profile"       element={<ProfilePage />} />
              <Route path="settings"      element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="admin"         element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* ── 404 catch-all ── */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
