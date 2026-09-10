# IRSHAD — Portfolio + Admin Panel

React + TypeScript + Tailwind CSS + Supabase + AnimeJS

---

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
`.env` file তৈরি করো:
```env
VITE_SUPABASE_URL=https://kkbzmyyxfbitlovvpawx.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_key_here
```

### 3. Supabase Database Setup
Supabase dashboard → SQL Editor → `supabase_setup.sql` ফাইলের পুরো কোড paste করে Run করো।

### 4. Admin Account তৈরি
Supabase dashboard → Authentication → Users → "Add user" → তোমার email ও password দাও।

### 5. Dev Server Run
```bash
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── context/
│   └── DataContext.tsx        # Global data fetching
├── hooks/
│   └── useScrollReveal.ts     # Scroll animation hook
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── types.ts               # TypeScript types
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── sections/                  # Portfolio sections
│   ├── Hero.tsx               # AnimeJS splitText animation
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Certifications.tsx
│   ├── Achievements.tsx
│   ├── Projects.tsx           # 4-col desktop / 2-col mobile
│   ├── Experience.tsx
│   ├── Blog.tsx
│   ├── Testimonials.tsx
│   └── Contact.tsx
├── admin/
│   ├── AdminLogin.tsx
│   ├── AdminLayout.tsx        # Responsive sidebar
│   ├── ProtectedRoute.tsx
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── ProfilePage.tsx
│       ├── ProjectsPage.tsx
│       ├── SkillsPage.tsx
│       ├── CertificationsPage.tsx
│       ├── AchievementsPage.tsx
│       ├── ExperiencePage.tsx
│       ├── BlogPage.tsx
│       ├── TestimonialsPage.tsx
│       └── MessagesPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔗 Routes

| URL | Description |
|-----|-------------|
| `/` | Portfolio homepage |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard overview |
| `/admin/profile` | Edit profile info |
| `/admin/projects` | Manage projects |
| `/admin/skills` | Manage skills |
| `/admin/certifications` | Manage certifications |
| `/admin/achievements` | Manage achievements |
| `/admin/experience` | Manage work experience |
| `/admin/blog` | Manage blog posts |
| `/admin/testimonials` | Manage testimonials |
| `/admin/messages` | View contact messages |

---

## ✨ Animations (AnimeJS v4)

- **Hero Name**: `splitText` দিয়ে char-by-char bounce animation
- **Hero Subtitle**: word-by-word stagger fade-in
- **Sections**: CSS IntersectionObserver দিয়ে scroll reveal
- **Project Cards**: staggered reveal on scroll

---

## 📦 Build for Production
```bash
npm run build
```
`dist/` ফোল্ডার Vercel/Netlify তে deploy করো।
