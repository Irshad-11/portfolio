-- ============================================================
-- IRSHAD PORTFOLIO — FULL DATABASE SETUP v2
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Drop existing tables (fresh start)
DROP TABLE IF EXISTS page_visits CASCADE;
DROP TABLE IF EXISTS section_visits CASCADE;
DROP TABLE IF EXISTS message_drafts CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS experience CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- ============================================================
-- CORE CONTENT TABLES
-- ============================================================

CREATE TABLE profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT DEFAULT 'Irshad',
  title TEXT DEFAULT 'Full Stack Developer',
  tagline TEXT DEFAULT 'Building digital experiences that matter',
  bio TEXT DEFAULT 'I am a passionate full-stack developer...',
  email TEXT DEFAULT 'hello@irshad.dev',
  phone TEXT,
  location TEXT DEFAULT 'Dhaka, Bangladesh',
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  years_experience INT DEFAULT 4,
  projects_count INT DEFAULT 20,
  clients_count INT DEFAULT 15,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT,
  credential_url TEXT,
  badge_url TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  date TEXT,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  npm_url TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'live' CHECK (status IN ('live', 'coming_soon', 'wip')),
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT,
  location TEXT,
  website TEXT,
  description TEXT[],
  tech_stack TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  tags TEXT[] DEFAULT '{}',
  read_time TEXT DEFAULT '5 min read',
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  company_url TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS TABLES
-- ============================================================

CREATE TABLE page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,  -- UUID stored in localStorage
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE section_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  section_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT,
  name_provided BOOLEAN DEFAULT FALSE,
  email_provided BOOLEAN DEFAULT FALSE,
  message_length INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_drafts ENABLE ROW LEVEL SECURITY;

-- Public read policies (only visible items for content)
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (visible = true);
CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (visible = true);
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (visible = true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (visible = true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (visible = true AND published = true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (visible = true);

-- Public insert for contact + analytics
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert page_visits" ON page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert section_visits" ON section_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert message_drafts" ON message_drafts FOR INSERT WITH CHECK (true);

-- Authenticated full access
CREATE POLICY "Auth all profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth all contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read page_visits" ON page_visits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read section_visits" ON section_visits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read message_drafts" ON message_drafts FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (Demo)
-- ============================================================

INSERT INTO profile (name, title, tagline, bio, email, location, github_url, linkedin_url, twitter_url, years_experience, projects_count, clients_count)
VALUES (
  'Irshad Ahmed',
  'Full Stack Developer',
  'Building digital experiences that deliver real impact',
  'I''m a passionate full-stack developer based in Dhaka, Bangladesh with 4+ years of experience building scalable web applications. I specialize in React, Node.js, and modern cloud architectures — turning complex problems into elegant, high-performance solutions. When I''m not coding, I''m exploring new technologies and contributing to open-source.',
  'hello@irshad.dev',
  'Dhaka, Bangladesh',
  'https://github.com/irshad',
  'https://linkedin.com/in/irshad',
  'https://twitter.com/irshad_dev',
  4,
  20,
  15
);

-- Skills
INSERT INTO skills (name, category, icon_url, sort_order, visible) VALUES
('JavaScript', 'Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', 1, true),
('TypeScript', 'Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg', 2, true),
('Python', 'Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', 3, true),
('HTML5', 'Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', 4, true),
('CSS3', 'Languages', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', 5, true),
('React', 'Frameworks & Libraries', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', 1, true),
('Next.js', 'Frameworks & Libraries', 'https://cdn.simpleicons.org/nextdotjs/white', 2, true),
('Node.js', 'Frameworks & Libraries', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', 3, true),
('Express', 'Frameworks & Libraries', 'https://cdn.simpleicons.org/express/white', 4, true),
('Tailwind CSS', 'Frameworks & Libraries', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', 5, true),
('PostgreSQL', 'Databases', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', 1, true),
('MongoDB', 'Databases', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', 2, true),
('Redis', 'Databases', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg', 3, true),
('Supabase', 'Databases', 'https://cdn.simpleicons.org/supabase/3ECF8E', 4, true),
('Git', 'Tools & Platforms', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', 1, true),
('Docker', 'Tools & Platforms', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', 2, true),
('AWS', 'Tools & Platforms', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', 3, true),
('Vercel', 'Tools & Platforms', 'https://cdn.simpleicons.org/vercel/white', 4, true),
('Linux', 'Tools & Platforms', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg', 5, true),
('Figma', 'Tools & Platforms', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', 6, true);

-- Certifications
INSERT INTO certifications (title, issuer, issue_date, credential_url, description, sort_order, visible) VALUES
('AWS Certified Solutions Architect – Associate', 'Amazon Web Services', 'Dec 2023', 'https://aws.amazon.com/certification/', 'Validates expertise in designing distributed systems on AWS including compute, networking, storage, and database services.', 1, true),
('Meta Front-End Developer Certificate', 'Meta (Coursera)', 'Aug 2023', 'https://coursera.org/certificates/meta-frontend', 'Comprehensive program covering React, JavaScript, UI/UX design principles, and modern web development workflows.', 2, true),
('Google IT Automation with Python', 'Google (Coursera)', 'Mar 2023', 'https://coursera.org/certificates/google-it-automation', 'Covers Python scripting, version control, debugging, configuration management, and Cloud automation fundamentals.', 3, true);

-- Achievements
INSERT INTO achievements (title, description, icon, date, sort_order, visible) VALUES
('Open Source Contributor', 'Contributed to 10+ open source projects with 200+ GitHub stars across repositories.', '⭐', '2024', 1, true),
('Hackathon Winner', 'Won 1st place at DevHacks 2023 — built a real-time disaster response coordination platform in 48 hours.', '🏆', '2023', 2, true),
('Top 5% Developer', 'Ranked in the top 5% of developers on Codewars with 1000+ kata challenges completed.', '🎯', '2023', 3, true),
('Speaker — DevConf BD', 'Delivered a talk on "Modern State Management in React" to 300+ developers at DevConf Bangladesh 2024.', '🎤', '2024', 4, true);

-- Projects
INSERT INTO projects (slug, title, description, long_description, tech_stack, live_url, github_url, image_url, status, featured, sort_order, visible) VALUES
('ecommerce-platform', 'ShopWave — E-Commerce Platform', 'A full-featured e-commerce platform with real-time inventory, AI product recommendations, and 99.9% uptime. Serving 10K+ monthly active users across Bangladesh and India.', 'ShopWave is a production-grade e-commerce platform built from the ground up with a focus on performance and reliability. The platform features real-time inventory management, AI-powered product recommendations, multi-vendor support, and a comprehensive admin dashboard. It handles thousands of concurrent users and processes payments through multiple gateways including bKash and Stripe.', ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Stripe'], 'https://shopwave.demo', 'https://github.com/irshad/shopwave', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'live', true, 1, true),
('ai-chat-app', 'NexChat — AI Messaging App', 'Real-time messaging platform with AI-powered smart replies, message translation, and end-to-end encryption. Built with WebSockets for sub-100ms message delivery.', 'NexChat reimagines messaging for the modern web. It combines the reliability of traditional chat with the intelligence of modern AI. Features include smart reply suggestions, automatic message translation across 50+ languages, thread summarization, and enterprise-grade end-to-end encryption. The backend handles 50K+ concurrent connections.', ARRAY['React', 'Socket.io', 'Node.js', 'OpenAI API', 'MongoDB', 'Redis', 'Docker'], 'https://nexchat.demo', 'https://github.com/irshad/nexchat', 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800', 'live', true, 2, true),
('task-management', 'TaskFlow — Project Management', 'A Notion-inspired task management tool with Kanban boards, time tracking, team collaboration, and detailed analytics dashboards. Used by 5+ startups.', 'TaskFlow provides teams with a clean, intuitive workspace to manage projects from idea to completion. It features drag-and-drop Kanban boards, Gantt chart view, time tracking with reports, custom fields, and team permissions. The real-time collaboration allows multiple users to work simultaneously with conflict-free updates powered by CRDTs.', ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Dnd-kit', 'Zustand'], 'https://taskflow.demo', 'https://github.com/irshad/taskflow', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800', 'live', false, 3, true),
('blog-engine', 'Quill — Modern Blog Engine', 'A lightning-fast, MDX-powered blog platform with built-in SEO optimization, code syntax highlighting, and a beautiful reading experience. Used by 50+ developers.', 'Quill is a developer-first blogging platform that makes it easy to write and publish technical content. It supports MDX for interactive components inside markdown, has built-in SEO optimization, automatic OG image generation, RSS feeds, and a powerful search powered by Algolia. The reading experience is carefully crafted for long-form technical content.', ARRAY['Next.js', 'MDX', 'TypeScript', 'Tailwind CSS', 'Algolia', 'Vercel'], 'https://getquill.demo', 'https://github.com/irshad/quill', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', 'live', false, 4, true),
('analytics-dashboard', 'MetricHub — Analytics Dashboard', 'A real-time analytics dashboard aggregating data from 10+ sources with interactive visualizations, custom alerts, and automated weekly reports.', 'MetricHub solves the problem of data fragmentation by pulling data from multiple sources (Google Analytics, Stripe, Mixpanel, etc.) into a single unified dashboard. It features custom chart building, anomaly detection, scheduled reports, and team sharing. The data pipeline processes millions of events per day using an event-driven architecture.', ARRAY['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Kafka', 'Docker'], '', 'https://github.com/irshad/metrichub', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'wip', false, 5, true),
('mobile-wallet', 'PayBridge — Digital Wallet', 'A cross-platform mobile wallet app with instant transfers, QR payments, split bills, and spending analytics. Currently in beta with 500+ testers.', 'PayBridge makes digital payments simple, secure, and social. Users can send money instantly, split bills with friends, set spending budgets, and earn cashback rewards. The app uses biometric authentication, device-level encryption, and is PCI-DSS compliant. Built with React Native for a truly native experience on both iOS and Android.', ARRAY['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'bKash API'], '', '', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800', 'coming_soon', false, 6, true);

-- Experience
INSERT INTO experience (company, role, period, location, website, description, tech_stack, sort_order, visible) VALUES
('TechNova Solutions', 'Senior Full Stack Developer', 'Jan 2024 – Present', 'Dhaka, Bangladesh', 'https://technova.io',
  ARRAY['Led development of a SaaS platform serving 10,000+ users, improving system performance by 40%', 'Architected microservices infrastructure reducing deployment time from 2 hours to 15 minutes', 'Mentored a team of 4 junior developers, conducting weekly code reviews and pair programming sessions', 'Implemented real-time features using WebSockets, achieving sub-100ms message delivery', 'Reduced AWS infrastructure costs by 30% through optimization and right-sizing'],
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis'], 1, true),
('ByteCraft Agency', 'Full Stack Developer', 'Mar 2022 – Dec 2023', 'Remote', 'https://bytecraft.agency',
  ARRAY['Built 12+ client projects spanning e-commerce, fintech, and healthcare sectors', 'Created a reusable component library used across all client projects, cutting development time by 35%', 'Integrated payment gateways (Stripe, bKash, Nagad) for Bangladeshi market clients', 'Improved Core Web Vitals scores from 45 to 95+ for a high-traffic news portal', 'Delivered projects 100% on time with zero critical post-launch bugs'],
  ARRAY['React', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Stripe'], 2, true),
('StartupBD', 'Frontend Developer', 'Jun 2021 – Feb 2022', 'Dhaka, Bangladesh', '',
  ARRAY['Built the customer-facing React application from scratch for an early-stage fintech startup', 'Implemented responsive designs from Figma mockups with pixel-perfect accuracy', 'Integrated REST APIs and managed complex state with Redux Toolkit', 'Collaborated with designers to improve UI/UX, increasing user engagement by 25%'],
  ARRAY['React', 'Redux Toolkit', 'JavaScript', 'CSS3', 'REST APIs'], 3, true),
('Freelance', 'Web Developer', 'Jan 2020 – May 2021', 'Remote', '',
  ARRAY['Delivered 20+ websites and web apps for clients across Bangladesh, India, and UAE', 'Specialized in converting PSD/Figma designs to pixel-perfect HTML/CSS/JS implementations', 'Built WordPress themes and custom plugins for various business clients'],
  ARRAY['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'PHP', 'MySQL'], 4, true);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, tags, read_time, image_url, published, sort_order, visible) VALUES
('Building Scalable React Apps: Patterns I Wish I Knew Earlier', 'scalable-react-patterns', 'After building 50+ React applications, I''ve collected the patterns and anti-patterns that actually matter in production — from component architecture to state management decisions.', '# Building Scalable React Apps

When I started building React applications, I made every mistake in the book...

## Component Composition over Configuration

The most powerful pattern in React is composition. Instead of passing dozens of props...

## State Colocation

Keep state as close to where it''s used as possible. Lifting state too high is one of the most common performance killers...

## Custom Hooks for Business Logic

Extract all business logic into custom hooks. This makes your components thin, your logic testable, and your codebase maintainable.', 
  ARRAY['React', 'Architecture', 'Best Practices'], '8 min read', 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800', true, 1, true),
('The Art of Writing Clean TypeScript: Beyond Basic Types', 'clean-typescript-guide', 'TypeScript is more than just adding types to JavaScript. This guide covers advanced patterns — discriminated unions, template literal types, and mapped types — that will transform how you write TS.', '# Clean TypeScript Patterns

TypeScript''s type system is incredibly powerful, but most developers only scratch the surface...

## Discriminated Unions for State Machines

Instead of boolean flags, model your state explicitly...

## Template Literal Types

These let you create powerful string-based types that catch errors at compile time rather than runtime.',
  ARRAY['TypeScript', 'JavaScript', 'Developer Tools'], '10 min read', 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=800', true, 2, true),
('PostgreSQL Performance Tuning: From Slow to Blazing Fast', 'postgresql-performance', 'Real-world techniques for identifying and fixing slow PostgreSQL queries — covering indexing strategies, query planning, connection pooling, and monitoring.', '# PostgreSQL Performance Tuning

I recently spent three weeks debugging a PostgreSQL database that was taking 30+ seconds for simple queries...

## Understanding EXPLAIN ANALYZE

The first step is always understanding what the query planner is doing...

## Strategic Indexing

Not all indexes are created equal. Here''s when to use B-tree, GIN, and partial indexes.',
  ARRAY['PostgreSQL', 'Performance', 'Backend'], '12 min read', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800', true, 3, true),
('Docker for Web Developers: A Practical Handbook', 'docker-web-developers', 'A no-nonsense guide to Docker for web developers — from running your first container to orchestrating multi-service applications with Docker Compose in production.', '# Docker for Web Developers

Docker changed how I think about software deployment. Let me show you what I wish someone had taught me...',
  ARRAY['Docker', 'DevOps', 'Infrastructure'], '15 min read', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800', true, 4, true),
('WebSockets vs Server-Sent Events vs Long Polling', 'realtime-web-comparison', 'A deep dive into the three main approaches for real-time web applications — when to use each, performance characteristics, and real-world implementation examples.', '# Real-Time Web: Choosing the Right Approach

Not every real-time feature needs WebSockets. Here''s how to choose the right tool.',
  ARRAY['WebSockets', 'Real-time', 'Architecture'], '7 min read', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', true, 5, true);

-- Testimonials
INSERT INTO testimonials (name, role, company, company_url, content, sort_order, visible) VALUES
('Rahim Chowdhury', 'CTO', 'TechNova Solutions', 'https://technova.io', 'Irshad is one of the most technically sharp developers I''ve worked with. He doesn''t just write code — he thinks deeply about architecture, scalability, and user experience. He led the rewrite of our core platform and delivered it ahead of schedule with measurably better performance. A rare combination of technical depth and excellent communication.', 1, true),
('Sarah Mitchell', 'Product Manager', 'ByteCraft Agency', 'https://bytecraft.agency', 'Working with Irshad was a pleasure from start to finish. He took complex requirements and turned them into clean, maintainable code. What impressed me most was his proactive communication — he''d flag potential issues before they became problems and always came with solutions, not just problems. Would hire again without hesitation.', 2, true),
('Abdullah Al-Mamun', 'Co-Founder', 'StartupBD', '', 'Irshad built our entire frontend from zero. He understood our vision immediately, asked all the right questions, and delivered a product our users genuinely love. He also pushed back on some of our initial ideas in the best way possible — suggesting better UX patterns that improved our conversion rate by 40%.', 3, true),
('Priya Sharma', 'Lead Engineer', 'DataFlow Inc', 'https://dataflow.io', 'I''ve reviewed a lot of code over the years, and Irshad''s stands out. It''s clean, well-documented, and written with the next developer in mind. He also has a great eye for catching edge cases that others miss. His work on our real-time data pipeline was instrumental to our Series A success.', 4, true);

-- Contact messages (demo)
INSERT INTO contact_messages (name, email, message, read) VALUES
('Karim Hassan', 'karim@example.com', 'Hi Irshad! I came across your portfolio and I''m really impressed with the ShopWave project. We''re a startup looking for a senior developer to help us build our e-commerce platform. Would you be open to a quick call this week?', false),
('Lisa Chen', 'lisa.chen@techcorp.com', 'Hello! I wanted to reach out about a potential collaboration. We''re building an AI-powered analytics dashboard and your background in both React and Python is exactly what we need. Let me know if you''re available to chat.', false),
('Ahmed Rahman', 'ahmed.r@gmail.com', 'Great portfolio! I''m a student learning web development and your blog post on React patterns was incredibly helpful. Would you consider doing a mentorship session?', true);


-- ============================================================
-- QUICK FIX: Run this alone to fix the AWS icon (no re-seed needed)
-- ============================================================
-- UPDATE skills SET icon_url = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' WHERE name = 'AWS';
