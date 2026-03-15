import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

import HomePage from '@/pages/public/HomePage'
import ProjectsPage from '@/pages/public/ProjectsPage'
import ExperiencesPage from '@/pages/public/ExperiencesPage'
import SkillsPage from '@/pages/public/SkillsPage'
import CVPage from '@/pages/public/CVPage'
import ContactPage from '@/pages/public/ContactPage'
import ReviewsPage from '@/pages/public/ReviewsPage'
import ReviewFormPage from '@/pages/public/ReviewFormPage'
import BlogPage from '@/pages/public/BlogPage'
import BlogPostPage from '@/pages/public/BlogPostPage'

import LoginPage from '@/pages/admin/LoginPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage'
import AdminExperiencesPage from '@/pages/admin/AdminExperiencesPage'
import AdminSkillsPage from '@/pages/admin/AdminSkillsPage'
import AdminCVPage from '@/pages/admin/AdminCVPage'
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage'
import AdminInvitationsPage from '@/pages/admin/AdminInvitationsPage'
import AdminBlogPage from '@/pages/admin/AdminBlogPage'


export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/cv" element={<CVPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      {/* ── Formulaire client standalone (pas de navbar) ── */}
      <Route path="/review/:token" element={<ReviewFormPage />} />

      {/* ── Admin login ── */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ── Protected admin routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/experiences" element={<AdminExperiencesPage />} />
          <Route path="/admin/skills" element={<AdminSkillsPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/invitations" element={<AdminInvitationsPage />} />
          <Route path="/admin/cv" element={<AdminCVPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />

        </Route>
      </Route>
    </Routes>
  )
}
