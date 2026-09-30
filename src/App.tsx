import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'

import Home from './pages/Home'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminLogin from './admin/AdminLogin'

// Everything below is code-split so the public site stays tiny and fast
const AllProjects = lazy(() => import('./pages/AllProjects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AllBlog = lazy(() => import('./pages/AllBlog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const CertificationDetail = lazy(() => import('./pages/CertificationDetail'))
const AchievementDetail = lazy(() => import('./pages/AchievementDetail'))
const PreviewPage = lazy(() => import('./pages/PreviewPage'))

const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'))
const ProfilePage = lazy(() => import('./admin/pages/ProfilePage'))
const AboutPage = lazy(() => import('./admin/pages/AboutPage'))
const SitePage = lazy(() => import('./admin/pages/SitePage'))
const ProjectsPage = lazy(() => import('./admin/pages/ProjectsPage'))
const SkillsPage = lazy(() => import('./admin/pages/SkillsPage'))
const ExpertisePage = lazy(() => import('./admin/pages/ExpertisePage'))
const CertificationsPage = lazy(() => import('./admin/pages/CertificationsPage'))
const AchievementsPage = lazy(() => import('./admin/pages/AchievementsPage'))
const ExperiencePage = lazy(() => import('./admin/pages/ExperiencePage'))
const BlogPage = lazy(() => import('./admin/pages/BlogPage'))
const TestimonialsPage = lazy(() => import('./admin/pages/TestimonialsPage'))
const MessagesPage = lazy(() => import('./admin/pages/MessagesPage'))
const StatisticsPage = lazy(() => import('./admin/pages/StatisticsPage'))

function Loader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="w-5 h-5 border-2 border-[color:var(--border-hover)] border-t-[color:var(--accent)] rounded-full animate-spin" />
    </div>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function MainApp() {
  return (
    <DataProvider>
      <ThemeProvider>
        <ScrollManager />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Portfolio */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<AllBlog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/certifications/:id" element={<CertificationDetail />} />
            <Route path="/achievements/:id" element={<AchievementDetail />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="skills" element={<SkillsPage />} />
              <Route path="expertise" element={<ExpertisePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="certifications" element={<CertificationsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="experience" element={<ExperiencePage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="site" element={<SitePage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--bg-soft)', color: 'var(--text)', border: '1px solid var(--border-hover)',
              borderRadius: 0, fontSize: '13px', fontFamily: '"Inter Variable", Inter, sans-serif',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#0c0d0e' } },
          }}
        />
      </ThemeProvider>
    </DataProvider>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Live-preview frame used by the admin panel — no data fetching, driven by postMessage */}
        <Route path="/__preview" element={<PreviewPage />} />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Suspense>
  )
}