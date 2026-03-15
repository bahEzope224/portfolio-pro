import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout  from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

// Public pages
import HomePage        from '@/pages/public/HomePage'
import ProjectsPage    from '@/pages/public/ProjectsPage'
import ExperiencesPage from '@/pages/public/ExperiencesPage'
import SkillsPage      from '@/pages/public/SkillsPage'
import CVPage          from '@/pages/public/CVPage'
import ContactPage     from '@/pages/public/ContactPage'
import ReviewsPage     from '@/pages/public/ReviewsPage'

// Admin pages
import LoginPage            from '@/pages/admin/LoginPage'
import DashboardPage        from '@/pages/admin/DashboardPage'
import AdminProjectsPage    from '@/pages/admin/AdminProjectsPage'
import AdminExperiencesPage from '@/pages/admin/AdminExperiencesPage'
import AdminSkillsPage      from '@/pages/admin/AdminSkillsPage'
import AdminCVPage          from '@/pages/admin/AdminCVPage'
import AdminReviewsPage     from '@/pages/admin/AdminReviewsPage'

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/"            element={<HomePage />} />
        <Route path="/projects"    element={<ProjectsPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/skills"      element={<SkillsPage />} />
        <Route path="/cv"          element={<CVPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/reviews"     element={<ReviewsPage />} />
      </Route>

      {/* ── Admin login ── */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ── Protected admin routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"             element={<DashboardPage />} />
          <Route path="/admin/projects"    element={<AdminProjectsPage />} />
          <Route path="/admin/experiences" element={<AdminExperiencesPage />} />
          <Route path="/admin/skills"      element={<AdminSkillsPage />} />
          <Route path="/admin/cv"          element={<AdminCVPage />} />
          <Route path="/admin/reviews"     element={<AdminReviewsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
