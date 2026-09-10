import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'

// Portfolio layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemePicker from './components/ThemePicker'

// Portfolio sections
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Achievements from './sections/Achievements'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Blog from './sections/Blog'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'

// Portfolio pages
import AllProjects from './pages/AllProjects'
import ProjectDetail from './pages/ProjectDetail'
import AllBlog from './pages/AllBlog'
import BlogDetail from './pages/BlogDetail'

// Admin
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import ProtectedRoute from './admin/ProtectedRoute'
import DashboardPage from './admin/pages/DashboardPage'
import ProfilePage from './admin/pages/ProfilePage'
import ProjectsPage from './admin/pages/ProjectsPage'
import SkillsPage from './admin/pages/SkillsPage'
import CertificationsPage from './admin/pages/CertificationsPage'
import AchievementsPage from './admin/pages/AchievementsPage'
import ExperiencePage from './admin/pages/ExperiencePage'
import BlogPage from './admin/pages/BlogPage'
import TestimonialsPage from './admin/pages/TestimonialsPage'
import MessagesPage from './admin/pages/MessagesPage'
import StatisticsPage from './admin/pages/StatisticsPage'

// Analytics
import { trackPageVisit } from './lib/analytics'

function Portfolio() {
  useEffect(() => {
    trackPageVisit()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Achievements />
        <Projects />
        <Experience />
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ThemePicker />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Routes>
          {/* Portfolio */}
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects" element={<><Navbar /><AllProjects /><Footer /></>} />
          <Route path="/projects/:slug" element={<><Navbar /><ProjectDetail /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><AllBlog /><Footer /></>} />
          <Route path="/blog/:slug" element={<><Navbar /><BlogDetail /><Footer /></>} />

          {/* Admin */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
          >
            <Route path="dashboard"      element={<DashboardPage />} />
            <Route path="profile"        element={<ProfilePage />} />
            <Route path="projects"       element={<ProjectsPage />} />
            <Route path="skills"         element={<SkillsPage />} />
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="achievements"   element={<AchievementsPage />} />
            <Route path="experience"     element={<ExperiencePage />} />
            <Route path="blog"           element={<BlogPage />} />
            <Route path="testimonials"   element={<TestimonialsPage />} />
            <Route path="messages"       element={<MessagesPage />} />
            <Route path="statistics"     element={<StatisticsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#111',
              color: '#f5f5f5',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          }}
        />
      </DataProvider>
    </ThemeProvider>
  )
}
