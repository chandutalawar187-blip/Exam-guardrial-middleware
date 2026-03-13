// dashboard/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ExamGuardrail Dashboard</title>
    <!-- FONT: old-font -> new-font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```
---
// dashboard/tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        "depth": "#001D39",
        "ocean": "#0A4174",
        "steel": "#49769F",
        "teal": "#4E8EA2",
        "muted-teal": "#6EA2B3",
        "sky": "#7BBDE8",
        "pale": "#BDD8E9"
      },
      fontFamily: {
        "display": ["Outfit", "system-ui", "sans-serif"],
        "body": ["DM Sans", "system-ui", "sans-serif"],
        "mono": ["JetBrains Mono", "Courier New", "monospace"]
      },
      letterSpacing: {
        "tightest": "-0.04em",
        "tighter": "-0.02em",
        "tight": "-0.01em",
        "wide-sm": "0.04em",
        "wide": "0.06em",
        "wider": "0.08em"
      }
    }
  },
  plugins: [],
}

```
---
// dashboard/src/index.css
```css
/* dashboard/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-depth-navy: #001D39; /* COLOR: #001D39/* COLOR: #0B1F3B -> #001D39 */ -> #001D39 */
  --color-ocean-blue: #0A4174; /* COLOR: #0A4174/* COLOR: #2563EB -> #0A4174 */ -> #0A4174 */
  --color-steel-blue: #49769F; /* COLOR: #49769F/* COLOR: #64748B -> #49769F */ -> #49769F */
  --color-teal-blue: #4E8EA2;  /* COLOR: #4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */ -> #4E8EA2 */
  --color-muted-teal: #6EA2B3; /* COLOR: muted teal replacements -> #6EA2B3 */
  --color-sky-blue: #7BBDE8;   /* COLOR: light blue highlights -> #7BBDE8 */
  --color-pale-sky: #BDD8E9;   /* COLOR: #BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */ -> #BDD8E9 */
  --color-white: #FFFFFF;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;

  --bg-primary: #001D39;
  --bg-secondary: #0A4174;
  --bg-surface: #BDD8E9;
  --bg-card: #FFFFFF;

  --font-body text-[12px]/* FONT: Inter -> DM Sans */rimary: #001D39;
  --text-secondary: #49769F;
  --text-muted: #6EA2B3;
  --text-inverse: #BDD8E9;
  --text-on-dark: #BDD8E9;

  --border-light: #7BBDE8;
  --border-medium: #49769F;
  --border-dark: #0A4174;

  --btn-primary-bg: #0A4174;
  --btn-primary-hover: #001D39;
  --btn-primary-text: #BDD8E9;

  --sentinel-active: #4E8EA2;
  --violation-red: #EF4444;

  --font-display: 'Outfit', system-ui, sans-serif; /* FONT: Inter -> Outfit */
  --font-body: 'DM Sans', system-ui, sans-serif;   /* FONT: Inter -> DM Sans */
  --font-mono/* FONT: default-mono -> font-mono */: 'JetBrains Mono', 'Courier New', monospace;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--font-body text-[12px]/* FONT: Inter -> DM Sans */rimary);
  background-color: var(--bg-surface);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--font-body text-[12px]/* FONT: Inter -> DM Sans */rimary);
}

button {
  font-family: var(--font-display);
  font-weight: 600;
}

input, select, textarea {
  font-family: var(--font-body);
}

code, pre, kbd {
  font-family: var(--font-mono/* FONT: default-mono -> font-mono */);
}

.font-mono/* FONT: default-mono -> font-mono */ {
  font-family: var(--font-mono/* FONT: default-mono -> font-mono */);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-surface);
}
::-webkit-scrollbar-thumb {
  background: var(--color-steel-blue);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-ocean-blue);
}

/* Animations */
@keyframes pulse-teal {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.5); opacity: 0.05; }
}

.animate-pulse-teal {
  animation: pulse-teal 4s ease-in-out infinite;
}

/* Auth Backdrop Rings */
.ring-overlay {
  position: absolute;
  width: 600px;
  height: 600px;
  border: 2px solid var(--color-teal-blue);
  border-radius: 50%;
  pointer-events: none;
}

```
---
// dashboard/src/pages/LoginPage.jsx
```javascript
// dashboard/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoDark from '../assets/logo/Cognivigil_logo_full_dark.svg';

export default function LoginPage() {
  const [role, setRole] = useState('Student'); // Student | Admin
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (role === 'Admin') {
      if (uid === 'ADMIN001' && password === 'cognivigil@admin') {
        login('admin', uid, 'dummy-admin-token');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid Admin credentials.');
      }
      setIsLoading(false);
      return;
    }

    // Student Login
    try {
      const res = await fetch('http://localhost:8000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, password })
      });
      const data = await res.json();
      if (res.ok) {
        login('student', uid, data.token);
        navigate('/exam/waiting');
      } else {
        setError(data.error || 'Invalid credentials. Please check your Student ID and Password.');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body /* FONT: Inter -> DM Sans */">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#001D39 /* COLOR: changed */] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Animated Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="ring-overlay animate-pulse-teal" style={{ width: '400px', height: '400px' }}></div>
          <div className="ring-overlay animate-pulse-teal" style={{ width: '600px', height: '600px', animationDelay: '1s' }}></div>
          <div className="ring-overlay animate-pulse-teal" style={{ width: '800px', height: '800px', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <img src={logoDark} alt="Cognivigil Logo" className="h-24 mx-auto mb-6" />
          <p className="text-[#4E8EA2 /* COLOR: changed */] uppercase font-body text-[18px] font-normal tracking-[0.2em] /* FONT: Inter -> DM Sans */ mb-12">
            Intelligent Exam Integrity. Powered by AI.
          </p>
          <div className="flex gap-4 justify-center">
            <FeaturePill text="🛡 Sentinel Protection" />
            <FeaturePill text="🧠 AI Monitoring" />
            <FeaturePill text="📊 Instant Reports" />
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 bg-[#BDD8E9 /* COLOR: changed */] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[sky] /* COLOR: changed */">
          {/* Role Toggle */}
          <div className="flex bg-[pale] /* COLOR: changed */ p-1 rounded-full mb-8 relative">
            <button 
              onClick={() => setRole('Student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase /* FONT: Inter -> Outfit */ tracking-wider transition-all z-10 ${
                role === 'Student' ? 'text-white' : 'text-[#49769F /* COLOR: changed */]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              Student
            </button>
            <button 
              onClick={() => setRole('Admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase /* FONT: Inter -> Outfit */ tracking-wider transition-all z-10 ${
                role === 'Admin' ? 'text-white' : 'text-[#49769F /* COLOR: changed */]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Admin
            </button>
            {/* Toggle Background Slide */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-200 ${
                role === 'Student' ? 'left-1 bg-[#0A4174 /* COLOR: changed */]' : 'left-[calc(50%+2px)] bg-[#001D39 /* COLOR: changed */]'
              }`}
            ></div>
          </div>

          <h2 className="text-[28px] /* FONT: UI -> Outfit */ font-display font-display font-semibold/* FONT: UI -> Outfit */ /* FONT: UI -> Outfit */ text-[#001D39 /* COLOR: changed */] mb-2">{role} Access</h2>
          <p className="text-[#49769F /* COLOR: changed */] font-body text-[14px] mb-6 /* FONT: UI -> DM Sans */">
            Please enter your credentials to {role === 'Student' ? 'enter the exam room' : 'access the portal'}.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#49769F /* COLOR: changed */] font-display text-[12px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase /* FONT: UI -> Outfit */ tracking-[0.06em] mb-1.5">
                {role === 'Student' ? 'Student UID' : 'Admin ID'}
              </label>
              <input 
                type="text" 
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder={role === 'Student' ? "Enter your unique exam ID" : "ADMIN001"}
                className="w-full border border-[sky] /* COLOR: changed */ rounded-lg px-4 py-3 font-body text-[14px]/* FONT: Inter -> DM Sans */ font-body font-normal /* FONT: UI -> DM Sans */ focus:border-[#0A4174 /* COLOR: changed */] focus:ring-2 focus:ring-[#0A4174 /* COLOR: changed */]/10 outline-none transition-all placeholder:text-[muted-teal] /* COLOR: changed */"
                required
              />
            </div>

            <div>
              <label className="block text-[#49769F /* COLOR: changed */] font-display text-[12px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase /* FONT: UI -> Outfit */ tracking-[0.06em] mb-1.5">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[sky] /* COLOR: changed */ rounded-lg px-4 py-3 font-body text-[14px]/* FONT: Inter -> DM Sans */ font-body font-normal /* FONT: UI -> DM Sans */ focus:border-[#0A4174 /* COLOR: changed */] focus:ring-2 focus:ring-[#0A4174 /* COLOR: changed */]/10 outline-none transition-all placeholder:text-[muted-teal] /* COLOR: changed */"
                required
              />
            </div>

            {error && (
              <p className="text-[#EF4444] font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-display font-semibold/* FONT: UI -> Outfit */ /* FONT: UI -> Outfit */ mt-2 leading-tight">
                ⚠️ {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg text-white font-display font-display font-semibold/* FONT: UI -> Outfit */ /* FONT: UI -> Outfit */ font-body text-[14px]/* FONT: Inter -> DM Sans */ tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                role === 'Student' ? 'bg-[#0A4174 /* COLOR: changed */] hover:bg-[depth] /* COLOR: changed */' : 'bg-[#001D39 /* COLOR: changed */] hover:bg-[depth] /* COLOR: changed */'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {role === 'Student' ? 'Enter Exam Room' : 'Access Admin Portal'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center text-[muted-teal] /* COLOR: changed */ font-body text-[12px] /* FONT: Inter -> DM Sans */ font-body font-normal /* FONT: UI -> DM Sans */ tracking-wide">
            COGNIVIGIL V2.0 — SECURE EXAM PLATFORM
          </footer>
        </div>
      </div>
    </div>
  );
}

function FeaturePill({ text }) {
  return (
    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
      <span className="text-white font-body text-[13px] font-body font-normal/* FONT: UI -> DM Sans */ /* FONT: Inter -> DM Sans */">{text}</span>
    </div>
  );
}

```
---
// dashboard/src/pages/admin/AdminDashboard.jsx
```javascript
// dashboard/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */]">
      {/* Top Navbar */}
      <nav className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] px-8 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-8" />
          <div className="flex gap-8 font-body text-[14px]/* FONT: Inter -> DM Sans */ font-display font-semibold/* FONT: UI -> Outfit */ tracking-wide h-16">
            <NavLink to="/admin/dashboard" label="Dashboard" active />
            <NavLink to="/admin/create-exam" label="Create Exam" />
            <NavLink to="/admin/students" label="Students" />
            <NavLink to="/admin/reports" label="Reports" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] px-3 py-1 rounded text-[10px] font-black uppercase">ADMIN001</div>
          <button onClick={() => navigate('/')} className="text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">Welcome back, Administrator</h1>
            <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-body text-[14px]/* FONT: Inter -> DM Sans */ mt-1">Monitor exam status and manage academic integrity in real-time.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/create-exam" className="bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white px-6 py-2.5 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ font-body text-[14px]/* FONT: Inter -> DM Sans */ shadow-md hover:bg-[#001D39/* COLOR: #1D4ED8 -> #001D39 */] transition-all">
              Create New Exam
            </Link>
            <Link to="/admin/reports" className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white px-6 py-2.5 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ font-body text-[14px]/* FONT: Inter -> DM Sans */ shadow-md hover:bg-[#001D39/* COLOR: #1E3A5F -> #001D39 */] transition-all">
              View All Reports
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Exams Created" value="12" icon="📋" color="#0A4174/* COLOR: #2563EB -> #0A4174 */" />
          <StatCard label="Active Students" value="84" icon="👥" color="#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */" />
          <StatCard label="Exams In Progress" value="3" icon="⏳" color="#F59E0B" />
          <StatCard label="Reports Generated" value="142" icon="📊" color="#001D39/* COLOR: #0B1F3B -> #001D39 */" />
        </div>

        {/* Recent Exams Table */}
        <div className="bg-white rounded-xl border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] flex justify-between items-center">
            <h2 className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">Recent Examination Schedules</h2>
            <button className="text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase/* FONT: Inter -> Outfit */ hover:underline">See All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] text-[11px] uppercase tracking-widest text-[#49769F/* COLOR: #64748B -> #49769F */] font-display font-bold/* FONT: UI -> Outfit */">
              <tr>
                <th className="px-6 py-4">Exam Title</th>
                <th className="px-6 py-4">Subject Code</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] font-body text-[14px]/* FONT: Inter -> DM Sans */">
              <ExamRow title="Data Structures Advanced" code="CS301" date="Oct 24, 2025" students="45" status="active" />
              <ExamRow title="OS Theory Finals" code="CS402" date="Oct 23, 2025" students="32" status="completed" />
              <ExamRow title="Database Management" code="CS205" date="Oct 26, 2025" students="28" status="published" />
              <ExamRow title="AI Fundamentals" code="CS501" date="Nov 02, 2025" students="120" status="draft" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function NavLink({ to, label, active = false }) {
  return (
    <Link to={to} className={`flex items-center px-4 transition-all border-b-2 ${
      active ? 'border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */]' : 'border-transparent text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */]'
    }`}>
      {label}
    </Link>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] border-l-4 shadow-sm" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-black text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{value}</span>
      </div>
      <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase/* FONT: Inter -> Outfit */ tracking-widest">{label}</p>
    </div>
  );
}

function ExamRow({ title, code, date, students, status }) {
  const statusStyles = {
    active: 'bg-[#EFF6FF] text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] border-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/20 animate-pulse',
    completed: 'bg-[#BDD8E9/* COLOR: #F1F5F9 -> #BDD8E9 */] text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] border-[#001D39/* COLOR: #0B1F3B -> #001D39 */]/20',
    published: 'bg-[#F0FDFA] text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]/20',
    draft: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/20'
  };

  return (
    <tr className="hover:bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] transition-colors">
      <td className="px-6 py-4 font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{title}</td>
      <td className="px-6 py-4 font-mono/* FONT: default-mono -> font-mono */ font-body text-[12px]/* FONT: Inter -> DM Sans */s">{code}</td>
      <td className="px-6 py-4 text-[#49769F/* COLOR: #64748B -> #49769F */]">{date}</td>
      <td className="px-6 py-4 text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] font-body font-normal/* FONT: UI -> DM Sans */">{students} Pupils</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
      </td>
    </tr>
  );
}

```
---
// dashboard/src/pages/admin/CreateExamPage.jsx
```javascript
// dashboard/src/pages/admin/CreateExamPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [examConfig, setExamConfig] = useState({
    title: '', subjectCode: '', description: '', durationPerQuestion: 60,
    startTime: '', endTime: '', maxStudents: 30
  });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A', marks: 1
  });
  const [credentials, setCredentials] = useState(null);

  // REMOVED: AI generation logic — admin manual input only

  const addQuestion = (e) => {
    e.preventDefault();
    if (!currentQ.question_text) return;
    setQuestions([...questions, { ...currentQ, id: Date.now() }]);
    setCurrentQ({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', marks: 1 });
  };

  const generateCredentials = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/exams/${Date.now()}/students/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: examConfig.maxStudents })
      });
      const data = await res.json();
      setCredentials(data.credentials || []);
      setStep(4);
    } catch (err) {
      // Fallback for hackathon demo if backend is offline
      const mock = Array.from({ length: examConfig.maxStudents }, (_, i) => ({
        student_uid: `COG-ST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        plain_password: Math.random().toString(36).substr(2, 8)
      }));
      setCredentials(mock);
      setStep(4);
    }
  };

  const publishExam = async () => {
    try {
      await fetch(`http://localhost:8000/api/exams/${Date.now()}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      alert(`Exam "${examConfig.title}" published successfully. Students have been notified.`);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(`Published: ${examConfig.title} has been finalized.`);
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] flex flex-col">
       <nav className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white px-8 h-16 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-6" />
          <h1 className="font-body text-[14px]/* FONT: Inter -> DM Sans */ font-display font-bold/* FONT: UI -> Outfit */ uppercase tracking-widest text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]">Create Examination</h1>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-white">CANCEL & EXIT</button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Progress Sidebar */}
        <aside className="w-64 bg-white border-r border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] p-8 flex flex-col gap-6 shrink-0">
          <StepIndicator number={1} label="Exam Details" active={step === 1} completed={step > 1} />
          <StepIndicator number={2} label="Add Questions" active={step === 2} completed={step > 2} />
          <StepIndicator number={3} label="Student Setup" active={step === 3} completed={step > 3} />
          <StepIndicator number={4} label="Review & Publish" active={step === 4} completed={false} />
        </aside>

        {/* Form Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-3xl mx-auto">
            
            {/* Step 1: Details */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] mb-2 text-center">1. Examination Details</h2>
                <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-body text-[14px]/* FONT: Inter -> DM Sans */ mb-8 text-center text-balance leading-relaxed">
                  Provide core configuration for the session. Total exam time will be calculated based on question count.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2"><Label>Exam Title</Label><Input value={examConfig.title} onChange={e => setExamConfig({...examConfig, title: e.target.value})} placeholder="e.g. Data Structures Mid-Term" /></div>
                  <div><Label>Subject Code</Label><Input value={examConfig.subjectCode} onChange={e => setExamConfig({...examConfig, subjectCode: e.target.value})} placeholder="e.g. CS301" /></div>
                  <div><Label>Duration Per Question (s)</Label><Input type="number" value={examConfig.durationPerQuestion} onChange={e => setExamConfig({...examConfig, durationPerQuestion: e.target.value})} /></div>
                  <div><Label>Start Time</Label><Input type="datetime-local" value={examConfig.startTime} onChange={e => setExamConfig({...examConfig, startTime: e.target.value})} /></div>
                  <div><Label>End Time</Label><Input type="datetime-local" value={examConfig.endTime} onChange={e => setExamConfig({...examConfig, endTime: e.target.value})} /></div>
                  <div className="col-span-2"><Label>Max Students</Label><Input type="number" value={examConfig.maxStudents} onChange={e => setExamConfig({...examConfig, maxStudents: e.target.value})} /></div>
                </div>
                <button onClick={() => setStep(2)} disabled={!examConfig.title} className="mt-8 bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white w-full py-3 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ disabled:opacity-50">Next: Build Question Bank</button>
              </div>
            )}

            {/* Step 2: Questions */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] mb-8">2. Question Bank</h2>
                {/* Manual Question Form */}
                <form onSubmit={addQuestion} className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] p-6 rounded-xl border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] mb-8">
                  <Label>Question Text</Label>
                  <textarea value={currentQ.question_text} onChange={e => setCurrentQ({...currentQ, question_text: e.target.value})} className="w-full border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] rounded-lg p-3 font-body text-[14px]/* FONT: Inter -> DM Sans */ min-h-[100px] mb-4 outline-none focus:ring-2 focus:ring-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/10 focus:border-[#0A4174/* COLOR: #2563EB -> #0A4174 */]" placeholder="Enter the MCQ question..."></textarea>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div><Label>Option A</Label><Input value={currentQ.option_a} onChange={e => setCurrentQ({...currentQ, option_a: e.target.value})} /></div>
                    <div><Label>Option B</Label><Input value={currentQ.option_b} onChange={e => setCurrentQ({...currentQ, option_b: e.target.value})} /></div>
                    <div><Label>Option C</Label><Input value={currentQ.option_c} onChange={e => setCurrentQ({...currentQ, option_c: e.target.value})} /></div>
                    <div><Label>Option D</Label><Input value={currentQ.option_d} onChange={e => setCurrentQ({...currentQ, option_d: e.target.value})} /></div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                    <div className="flex gap-2">
                       {['A','B','C','D'].map(o => (
                         <button key={o} type="button" onClick={() => setCurrentQ({...currentQ, correct_answer: o})} className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold/* FONT: UI -> Outfit */ font-body text-[12px]/* FONT: Inter -> DM Sans */s border transition-all ${currentQ.correct_answer === o ? 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] text-white' : 'bg-white border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] text-[#49769F/* COLOR: #64748B -> #49769F */]'}`}>{o}</button>
                       ))}
                    </div>
                    <button type="submit" className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white px-8 py-2.5 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ font-body text-[14px]/* FONT: Inter -> DM Sans */ shadow-md">+ Add Question</button>
                  </div>
                </form>

                {/* Question List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] uppercase tracking-widest px-1">
                    <span>Questions ({questions.length})</span>
                    <span>Total Marks: {questions.reduce((a,b)=>a+parseInt(b.marks), 0)}</span>
                  </div>
                  {questions.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] rounded-xl text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] font-body text-[14px]/* FONT: Inter -> DM Sans */">
                      Your question bank is empty. Add a manual MCQ to begin.
                    </div>
                  ) : (
                    questions.map((q, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] flex justify-between items-center group">
                        <div className="flex-1">
                          <p className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] font-body text-[14px]/* FONT: Inter -> DM Sans */">Q{idx+1}. {q.question_text}</p>
                          <p className="text-[10px] text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] font-black uppercase mt-1">Correct Answer: {q.correct_answer}</p>
                        </div>
                        <button onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))} className="text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button onClick={() => setStep(1)} className="bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] text-[#49769F/* COLOR: #64748B -> #49769F */] px-8 py-3 rounded-lg font-display font-bold/* FONT: UI -> Outfit */">Back</button>
                  <button onClick={() => setStep(3)} disabled={questions.length === 0} className="bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white flex-1 py-3 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ disabled:opacity-50">Next: Student Setup</button>
                </div>
              </div>
            )}

            {/* Step 3: Students */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] mb-4">3. Student Access Control</h2>
                <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#F59E0B]/30 flex gap-4 items-start mb-8 text-[#92400E]">
                   <span className="text-[28px] font-display font-display font-bold/* FONT: UI -> Outfit *//* FONT: UI -> Outfit */">⚠️</span>
                   <div>
                      <p className="font-body text-[14px]/* FONT: Inter -> DM Sans */ font-display font-bold/* FONT: UI -> Outfit */">Important Access Policy</p>
                      <p className="font-body text-[12px]/* FONT: Inter -> DM Sans */s opacity-80 leading-relaxed font-body font-normal/* FONT: UI -> DM Sans */">Click generate to create unique credentials for {examConfig.maxStudents} student slots. You must download the CSV immediately as passwords are encrypted thereafter.</p>
                   </div>
                </div>

                {!credentials ? (
                  <button onClick={generateCredentials} className="w-full bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white py-12 rounded-xl border-2 border-dashed border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] hover:border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] flex flex-col items-center justify-center transition-all group">
                     <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔑</span>
                     <span className="font-display font-bold/* FONT: UI -> Outfit */ font-display text-[18px]/* FONT: Outfit */">Generate Student Credentials</span>
                     <span className="font-body text-[12px]/* FONT: Inter -> DM Sans */s text-[#49769F/* COLOR: #64748B -> #49769F */] mt-2">Required for {examConfig.maxStudents} student slots.</span>
                  </button>
                ) : (
                  <div className="bg-white rounded-xl border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] overflow-hidden">
                     <div className="p-4 bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] border-b border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] flex justify-between items-center">
                        <span className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] uppercase tracking-widest">Active Credentials</span>
                        <button className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] hover:underline">Download CSV</button>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left">
                           <thead className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] text-[10px] font-display font-bold/* FONT: UI -> Outfit */ text-gray-400 border-b border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                             <tr><th className="px-4 py-3">UID</th><th className="px-4 py-3">PASSWORD</th><th className="px-4 py-3 text-right">STATUS</th></tr>
                           </thead>
                           <tbody className="divide-y divide-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                              {credentials.map((c, i) => (
                                <tr key={i} className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-mono/* FONT: default-mono -> font-mono */">
                                   <td className="px-4 py-3 text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{c.student_uid}</td>
                                   <td className="px-4 py-3 text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] font-display font-bold/* FONT: UI -> Outfit */">{c.plain_password}</td>
                                   <td className="px-4 py-3 text-right"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span></td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                <div className="mt-12 flex gap-4">
                  <button onClick={() => setStep(2)} className="bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] text-[#49769F/* COLOR: #64748B -> #49769F */] px-8 py-3 rounded-lg font-display font-bold/* FONT: UI -> Outfit */">Back</button>
                  <button onClick={() => setStep(4)} disabled={!credentials} className="bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white flex-1 py-3 rounded-lg font-display font-bold/* FONT: UI -> Outfit */ disabled:opacity-50">Review & Publish</button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="animate-in slide-in-from-right-4 duration-300 text-center">
                 <div className="text-6xl mb-6">🚀</div>
                 <h2 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] mb-8">Ready to Go Live?</h2>
                 
                 <div className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] rounded-2xl p-8 mb-12 text-left grid grid-cols-2 gap-y-6">
                    <div><Label>Title</Label><p className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{examConfig.title}</p></div>
                    <div><Label>Subject</Label><p className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] font-mono/* FONT: default-mono -> font-mono */">{examConfig.subjectCode}</p></div>
                    <div><Label>Total Duration</Label><p className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{ (examConfig.durationPerQuestion * questions.length) / 60 } Minutes</p></div>
                    <div><Label>Enrollment</Label><p className="font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{examConfig.maxStudents} Students</p></div>
                    <div className="col-span-2 border-t border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] pt-6">
                       <Label>Policy</Label>
                       <p className="font-body text-[12px]/* FONT: Inter -> DM Sans */s text-[#49769F/* COLOR: #64748B -> #49769F */] leading-relaxed">
                         By publishing, you enable the Cognivigil Sentinel AI proctoring suite for this session. Students will be required to maintain fullscreen mode and zero-tab compliance throughout the duration.
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                  <button onClick={() => setStep(3)} className="bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] text-[#49769F/* COLOR: #64748B -> #49769F */] px-8 py-4 rounded-lg font-display font-bold/* FONT: UI -> Outfit */">Go Back</button>
                  <button onClick={publishExam} className="bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white flex-1 py-4 rounded-lg font-black font-display text-[18px]/* FONT: Outfit */ shadow-xl shadow-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/40 active:scale-[0.98] transition-all">FINISH & PUBLISH EXAM</button>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex items-center gap-4 transition-all opacity-100">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold/* FONT: UI -> Outfit */ font-body text-[12px]/* FONT: Inter -> DM Sans */s shadow-sm transition-all duration-300 ${
        active ? 'bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white ring-4 ring-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/10' : 
        completed ? 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] text-white' : 'bg-[#BDD8E9/* COLOR: #F1F5F9 -> #BDD8E9 */] text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */]'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`text-[13px] font-display font-bold/* FONT: UI -> Outfit */ tracking-tight transition-all duration-300 ${
        active ? 'text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]' : 'text-[#49769F/* COLOR: #64748B -> #49769F */]'
      }`}>{label}</span>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-[10px] font-display font-bold/* FONT: UI -> Outfit */ uppercase tracking-[0.08em] text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] mb-1.5">{children}</label>;
}

function Input(props) {
  return <input {...props} className="w-full bg-white border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] rounded-lg px-4 py-2.5 font-body text-[14px]/* FONT: Inter -> DM Sans */ font-body font-normal/* FONT: UI -> DM Sans */ outline-none focus:border-[#0A4174/* COLOR: #2563EB -> #0A4174 */] focus:ring-2 focus:ring-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/10 transition-all placeholder:text-[#6EA2B3/* COLOR: #cbd5e1 -> #6EA2B3 */]" />;
}

```
---
// dashboard/src/pages/admin/AdminReportsPage.jsx
```javascript
// dashboard/src/pages/admin/AdminReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';
// Import SheetJS from CDN for Excel export (v0.19.3)
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch mock/real reports from backend
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/exams/DEFAULT_EXAM/reports');
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        // Fallback for demo
        setReports([
          { student_uid: 'COG-ST-A1B2C3', raw_score: 18, total_violations: 0, final_score: 90, submitted_at: new Date().toISOString(), ai_overlay_status: 'CLEAN' },
          { student_uid: 'COG-ST-X9Y8Z7', raw_score: 14, total_violations: 4, final_score: 65, submitted_at: new Date().toISOString(), ai_overlay_status: 'CONFIRMED' },
          { student_uid: 'COG-ST-M4N5O6', raw_score: 16, total_violations: 1, final_score: 80, submitted_at: new Date().toISOString(), ai_overlay_status: 'CLEAN' }
        ]);
      } finally {
         setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportToExcel = () => {
    // Sheet 1: Student Scores
    const scoreData = reports.map(r => ({
      'Student UID': r.student_uid,
      'Raw Score': r.raw_score,
      'Total Violations': r.total_violations,
      'Mark Deductions': r.total_violations > 3 ? r.total_violations - 3 : 0,
      'Final Score': r.final_score,
      'AI Analysis': r.ai_overlay_status,
      'Submission Time': new Date(r.submitted_at).toLocaleString()
    }));

    // Sheet 2: Exam Summary
    const summaryData = [{
      'Exam Title': 'Data Structures Finals',
      'Subject Code': 'CS301',
      'Total Students': reports.length,
      'Average Score': (reports.reduce((a,b)=>a+b.final_score,0)/reports.length).toFixed(2),
      'Violation Rate': (reports.filter(r=>r.total_violations > 0).length / reports.length * 100).toFixed(0) + '%'
    }];

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(scoreData);
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    
    // Set column widths
    const wscols = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
    ws1['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws1, "Student Scores");
    XLSX.utils.book_append_sheet(wb, ws2, "Exam Summary");

    XLSX.writeFile(wb, `Cognivigil_Report_CS301_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */]">
       <nav className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white px-8 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-6" />
          <h1 className="font-body text-[14px]/* FONT: Inter -> DM Sans */ font-display font-bold/* FONT: UI -> Outfit */ uppercase tracking-widest text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]">Admin Reports</h1>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-white">BACK TO DASHBOARD</button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">Violation Audit Reports</h1>
            <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-body text-[14px]/* FONT: Inter -> DM Sans */ mt-1">Export detailed forensic analysis of student sessions to Microsoft Excel.</p>
          </div>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] text-white px-6 py-3 rounded-xl font-black font-body text-[14px]/* FONT: Inter -> DM Sans */ shadow-lg shadow-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Violation Report (Excel)
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] text-[11px] uppercase tracking-widest font-black text-[#49769F/* COLOR: #64748B -> #49769F */] border-b border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                <tr>
                  <th className="px-8 py-5">Student UID</th>
                  <th className="px-8 py-5">Raw Score</th>
                  <th className="px-8 py-5">Violations</th>
                  <th className="px-8 py-5">AI Overlay</th>
                  <th className="px-8 py-5">Final Score</th>
                  <th className="px-8 py-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-8 py-20 text-center text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] font-display font-bold/* FONT: UI -> Outfit */">Loading analytical data...</td></tr>
                ) : (
                  reports.map((r, i) => (
                    <tr key={i} className={`hover:bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] transition-colors ${r.total_violations >= 3 ? 'bg-[#FEF2F2]' : r.total_violations > 0 ? 'bg-[#FFFBEB]' : ''}`}>
                      <td className="px-8 py-5 font-mono/* FONT: default-mono -> font-mono */ font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{r.student_uid}</td>
                      <td className="px-8 py-5 font-body text-[14px]/* FONT: Inter -> DM Sans */ font-body font-normal/* FONT: UI -> DM Sans */">{r.raw_score} marks</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.total_violations >= 3 ? 'bg-[#EF4444] text-white' : 'bg-[#BDD8E9/* COLOR: #F1F5F9 -> #BDD8E9 */] text-[#49769F/* COLOR: #64748B -> #49769F */]'}`}>
                          {r.total_violations} Breaches
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${r.ai_overlay_status === 'CONFIRMED' ? 'text-[#EF4444]' : 'text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]'}`}>
                           <span className={`w-2 h-2 rounded-full ${r.ai_overlay_status === 'CONFIRMED' ? 'bg-[#EF4444]' : 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]'}`}></span>
                           {r.ai_overlay_status}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-display text-[18px]/* FONT: Outfit */ font-black text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]">{r.final_score}%</td>
                      <td className="px-8 py-5 text-right"><button className="text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] font-display font-bold/* FONT: UI -> Outfit */ font-body text-[12px]/* FONT: Inter -> DM Sans */s hover:underline">View Forensic Log</button></td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}

```
---
// dashboard/src/pages/student/StudentWaitingRoom.jsx
```javascript
// dashboard/src/pages/student/StudentWaitingRoom.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function StudentWaitingRoom() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState('02:14'); // Initial placeholder
  const studentUid = 'COG-ST-A1B2C3'; // Mock retrieval from context

  useEffect(() => {
    // 5-second status polling
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8000/api/exams/DEFAULT_EXAM/status');
        const data = await res.json();
        if (data.status === 'published') {
           setIsReady(true);
           clearInterval(interval);
           playNotification();
        }
      } catch (err) {
        // Mock behavior: autostart after 10s for demo
      }
    }, 5000);

    setTimeout(() => { setIsReady(true); playNotification(); }, 15000); // Demo fallback

    return () => clearInterval(interval);
  }, []);

  const playNotification = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
  };

  const startExam = () => {
    navigate('/exam/room');
  };

  return (
    <div className="min-h-screen bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         <div className="ring-overlay animate-pulse-teal" style={{ width: '400px', height: '400px' }}></div>
      </div>

      <div className="max-w-md w-full bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] rounded-[24px] overflow-hidden shadow-2xl relative z-10 p-10 text-center">
        <img src={logoDark} alt="Cognivigil" className="h-10 mx-auto mb-8" />
        
        <h2 className="text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-[28px] font-display font-display font-bold/* FONT: UI -> Outfit *//* FONT: UI -> Outfit */ font-display font-bold/* FONT: UI -> Outfit */ mb-1 italic tracking-tight">Welcome, {studentUid}</h2>
        <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase/* FONT: Inter -> Outfit */ tracking-widest mb-10">Data Structures Advanced • CS301</p>

        <div className="bg-white border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] rounded-2xl p-6 mb-8 py-10 shadow-sm">
           <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] text-[10px] font-black uppercase tracking-widest mb-2">Exam starts in</p>
           <p className="text-4xl font-black text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] tracking-tighter mb-4">{countdown}</p>
           <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] shadow-[0_0_8px_#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]' : 'bg-[#49769F/* COLOR: #64748B -> #49769F */] animate-pulse'}`}></span>
              <span className={`text-[11px] font-display font-bold/* FONT: UI -> Outfit */ uppercase tracking-widest ${isReady ? 'text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]' : 'text-[#49769F/* COLOR: #64748B -> #49769F */]'}`}>
                {isReady ? 'Exam is Ready' : 'Waiting for examiner...'}
              </span>
           </div>
        </div>

        {isReady && (
          <div className="animate-bounce mb-6">
             <div className="bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mx-auto inline-block">Proctor Link Established</div>
          </div>
        )}

        <button
          onClick={startExam}
          disabled={!isReady}
          className={`w-full py-4 rounded-xl font-black font-body text-[14px]/* FONT: Inter -> DM Sans */ tracking-widest uppercase transition-all transform active:scale-95 shadow-lg ${
            isReady ? 'bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white shadow-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/30 hover:bg-[#001D39/* COLOR: #1D4ED8 -> #001D39 */]' : 'bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] cursor-not-allowed'
          }`}
        >
          START EXAMINATION
        </button>

        <p className="mt-8 text-[10px] text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] leading-relaxed italic px-4">
          Do not close this window. The exam will transition to secure proctored mode automatically once started.
        </p>
      </div>
    </div>
  );
}

```
---
// dashboard/src/pages/student/ExamRoomPage.jsx
```javascript
// dashboard/src/pages/student/ExamRoomPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function ExamRoomPage() {
  const navigate = useNavigate();
  const [init, setInit] = useState(false);
  const [curr, setCurr] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(3600); // 60 mins
  const [violations, setViolations] = useState(0);
  const [showWarn, setShowWarn] = useState(false);

  const studentUid = 'COG-ST-A1B2C3';
  const examTitle = 'Data Structures Advanced';
  const questions = [
    { id: 1, text: 'Which data structure is best for BFS implementation?', a: 'Stack', b: 'Queue', c: 'Heap', d: 'Tree', ans: 'B' },
    { id: 2, text: 'Time complexity of Merge Sort in average case?', a: 'O(n)', b: 'O(n²)', c: 'O(n log n)', d: 'O(log n)', ans: 'C' }
  ];

  // ── SENTINEL ACTIVATION ────────────────────────────────────
  useEffect(() => {
    const activateSentinel = () => {
      if (window.chrome?.runtime?.sendMessage) {
        window.chrome.runtime.sendMessage({ 
          type: 'SENTINEL_ACTIVATE', 
          sessionId: 'SES-99231', 
          studentUid 
        }, (res) => {
          if (res?.sentinelActive) setTimeout(() => setInit(true), 1500);
        });

        // Listen for violations from background
        const vListener = (msg) => {
          if (msg.type === 'VIOLATION_COUNT_UPDATE') {
            setViolations(msg.count);
            if (msg.count === 3) setShowWarn(true);
          }
        };
        window.chrome.runtime.onMessage.addListener(vListener);
        return () => window.chrome.runtime.onMessage.removeListener(vListener);
      } else {
        // Mock init for dev without extension
        setTimeout(() => setInit(true), 2000);
      }
    };
    activateSentinel();
  }, []);

  // ── TIMER ──────────────────────────────────────────────────
  useEffect(() => {
    if (!init) return;
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [init]);

  const handleSubmit = async () => {
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage({ type: 'SENTINEL_DEACTIVATE' });
    }
    navigate('/exam/submitted');
  };

  if (!init) {
    return (
      <div className="min-h-screen bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="ring-overlay animate-pulse-teal" style={{ width: '500px', height: '500px' }}></div>
        </div>
        <img src={logoLight} alt="Cognivigil" className="h-16 mb-8 relative z-10 animate-pulse" />
        <div className="flex flex-col items-center relative z-10">
           <div className="w-10 h-10 border-4 border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] border-t-transparent rounded-full animate-spin mb-4"></div>
           <h2 className="text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] text-[28px] font-display font-display font-bold/* FONT: UI -> Outfit *//* FONT: UI -> Outfit */ font-black italic tracking-tighter">Initialising Secure Proctored Environment...</h2>
           <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-display text-[14px] font-display font-semibold/* FONT: UI -> Outfit */ uppercase/* FONT: Inter -> Outfit */ tracking-[0.2em] mt-2">Connecting to Sentinel AI Suite</p>
        </div>
      </div>
    );
  }

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-body/* FONT: font-inter -> font-body */">
      {/* Top Bar */}
      <header className="h-20 bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] text-white flex items-center justify-between px-8 border-b-2 border-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] shrink-0">
        <div className="flex items-center gap-4">
          <img src={logoLight} alt="Icon" className="h-6" />
          <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
          <div>
            <h1 className="font-body text-[14px]/* FONT: Inter -> DM Sans */ font-black italic">{examTitle}</h1>
            <p className="text-[10px] font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] tracking-widest">CS301 • MID-TERM</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#49769F/* COLOR: #64748B -> #49769F */] mb-1">Time Remaining</p>
            <p className={`text-2xl font-black tabular-nums tracking-tighter ${timer < 300 ? 'text-[#EF4444] animate-pulse' : 'text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]'}`}>{fmtTime(timer)}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[9px] font-black uppercase text-[#49769F/* COLOR: #64748B -> #49769F */]">UID</p>
              <p className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-mono/* FONT: default-mono -> font-mono */ font-display font-bold/* FONT: UI -> Outfit */">{studentUid}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border shadow-lg flex items-center gap-2 ${violations > 2 ? 'bg-[#EF4444] border-[#EF4444] animate-bounce' : 'bg-white/10 border-white/20'}`}>
              <div className={`w-2 h-2 rounded-full ${violations > 2 ? 'bg-white' : 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] animate-pulse'}`}></div>
              <span className="font-body text-[12px]/* FONT: Inter -> DM Sans */s font-black uppercase tracking-widest">{violations} Breaches</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigator Sidebar */}
        <aside className="w-[200px] border-r border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] p-6 shrink-0 bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */]">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] mb-6">Question Navigator</p>
           <div className="grid grid-cols-4 gap-2">
             {questions.map((_, i) => (
               <button 
                  key={i} 
                  onClick={() => setCurr(i)}
                  className={`h-9 rounded-lg font-black text-[11px] transition-all ${
                    curr === i ? 'bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white shadow-lg shadow-[#0A4174/* COLOR: #2563EB -> #0A4174 */]/40 scale-110' : 
                    answers[questions[i].id] ? 'bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */] text-white' : 'bg-white text-[#49769F/* COLOR: #64748B -> #49769F */] border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]'
                  }`}
               >
                 {i+1}
               </button>
             ))}
           </div>
           <button onClick={handleSubmit} className="mt-12 w-full bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] hover:bg-[#001D39/* COLOR: #1E3A5F -> #001D39 */] text-white py-3 rounded-xl font-black font-body text-[12px]/* FONT: Inter -> DM Sans */s uppercase tracking-widest transition-all shadow-md">Submit Exam</button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center">
          <div className="max-w-2xl w-full">
             <div className="flex items-center gap-3 mb-4">
               <span className="text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] font-black font-body text-[14px]/* FONT: Inter -> DM Sans */ tracking-tighter">QUESTION {curr+1} / {questions.length}</span>
               <div className="h-[1px] flex-1 bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]"></div>
             </div>
             
             <h2 className="text-[22px] font-display font-bold/* FONT: UI -> Outfit */ text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] leading-[1.4] mb-12">{questions[curr].text}</h2>
             
             <div className="space-y-4">
               {['a','b','c','d'].map(opt => (
                 <button
                    key={opt}
                    onClick={() => setAnswers({...answers, [questions[curr].id]: opt.toUpperCase()})}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      answers[questions[curr].id] === opt.toUpperCase() 
                      ? 'bg-[#EFF6FF] border-[#0A4174/* COLOR: #2563EB -> #0A4174 */] border-2 shadow-sm' 
                      : 'bg-white border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] hover:border-[#CBD5E1]'
                    }`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black font-body text-[14px]/* FONT: Inter -> DM Sans */ ${
                         answers[questions[curr].id] === opt.toUpperCase() ? 'bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white' : 'bg-[#BDD8E9/* COLOR: #F1F5F9 -> #BDD8E9 */] text-[#49769F/* COLOR: #64748B -> #49769F */] group-hover:bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]'
                       }`}>{opt.toUpperCase()}</div>
                       <span className={`font-display font-semibold/* FONT: UI -> Outfit */ font-body text-[16px]/* FONT: Inter -> DM Sans */ ${answers[questions[curr].id] === opt.toUpperCase() ? 'text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]' : 'text-[#49769F/* COLOR: #64748B -> #49769F */]'}`}>{questions[curr][opt]}</span>
                    </div>
                    {answers[questions[curr].id] === opt.toUpperCase() && (
                      <div className="w-5 h-5 bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] rounded-full flex items-center justify-center">
                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                 </button>
               ))}
             </div>

             <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]">
                <button onClick={() => setCurr(v => Math.max(0, v-1))} disabled={curr === 0} className="flex items-center gap-2 font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] hover:text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] disabled:opacity-20 transition-all uppercase tracking-widest"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Previous</button>
                <div className="flex gap-2">
                   {questions.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${curr === i ? 'w-8 bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */]' : 'w-1.5 bg-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */]'}`}></div>)}
                </div>
                <button onClick={() => setCurr(v => Math.min(questions.length-1, v+1))} disabled={curr === questions.length-1} className="flex items-center gap-2 font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] hover:text-[#001D39/* COLOR: #1D4ED8 -> #001D39 */] disabled:opacity-0 transition-all uppercase tracking-widest">Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
             </div>
          </div>
        </main>
      </div>

      {/* ── VIOLATION WARNING MODAL ── */}
      {showWarn && (
        <div className="fixed inset-0 bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */]/80 backdrop-blur-md z-[2147483645] flex items-center justify-center p-6">
           <div className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] border-t-8 border-[#F59E0B] p-10 rounded-[28px] max-w-sm text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
              <div className="text-6xl mb-6 scale-125 animate-bounce">⚠️</div>
              <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Warning</h2>
              <p className="text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] font-display font-bold/* FONT: UI -> Outfit */ font-body text-[14px]/* FONT: Inter -> DM Sans */ mb-6 leading-relaxed">
                THREE VIOLATIONS DETECTED. EVERY FURTHER ACTION WILL RESULT IN A MANDATORY -1 MARK DEDUCTION.
              </p>
              <div className="bg-[#001D39/* COLOR: #1E3A5F -> #001D39 */] p-4 rounded-xl font-body text-[12px]/* FONT: Inter -> DM Sans */s text-[#F59E0B] font-display font-bold/* FONT: UI -> Outfit */ uppercase tracking-widest mb-8 border border-[#F59E0B]/20">
                 DEDUCTIONS ARE ACTIVE
              </div>
              <button 
                onClick={() => setShowWarn(false)}
                className="w-full bg-[#0A4174/* COLOR: #2563EB -> #0A4174 */] text-white py-4 rounded-xl font-black font-body text-[14px]/* FONT: Inter -> DM Sans */ tracking-widest uppercase hover:bg-[#001D39/* COLOR: #1D4ED8 -> #001D39 */] transition-all active:scale-95"
              >
                I Understand — PROCEED
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

```
---
// dashboard/src/pages/student/ExamSubmittedPage.jsx
```javascript
// dashboard/src/pages/student/ExamSubmittedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function ExamSubmittedPage() {
  const navigate = useNavigate();
  const summary = {
    uid: 'COG-ST-A1B2C3',
    violations: 4,
    raw: 18,
    deductions: 1,
    final: 85,
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="min-h-screen bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] flex items-center justify-center p-8 font-body/* FONT: font-inter -> font-body */">
      <div className="max-w-xl w-full bg-white rounded-[32px] border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] shadow-2xl overflow-hidden p-12 text-center">
        
        <div className="mb-10 relative">
           <div className="w-24 h-24 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
           </div>
           <div className="absolute inset-x-0 top-0 flex items-center justify-center bg-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]/5 animate-ping w-24 h-24 rounded-full mx-auto -z-10"></div>
        </div>

        <h1 className="text-3xl font-black text-[#001D39/* COLOR: #0B1F3B -> #001D39 */] tracking-tighter mb-2 italic uppercase">Submission Successful</h1>
        <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] font-body text-[14px]/* FONT: Inter -> DM Sans */ mb-12">Your responses have been securely logged and analyzed for integrity.</p>

        <div className="grid grid-cols-2 gap-4 mb-12">
           <Record label="Student UID" value={summary.uid} mono />
           <Record label="Time" value={summary.timestamp} />
           <Record label="Proctoring Log" value={`${summary.violations} Breaches Recorded`} danger={summary.violations > 0} />
           <Record label="Status" value="VERIFIED" success />
        </div>

        {/* Score Card */}
        <div className="bg-[#001D39/* COLOR: #0B1F3B -> #001D39 */] rounded-2xl p-8 mb-12 flex items-center justify-between shadow-xl">
           <div className="text-left">
              <p className="text-[#49769F/* COLOR: #64748B -> #49769F */] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Performance</p>
              <h2 className="text-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] text-4xl font-black">{summary.final}%</h2>
           </div>
           <div className="text-right space-y-1">
              <p className="text-white/40 text-[10px] font-display font-bold/* FONT: UI -> Outfit */">Raw Score: {summary.raw}/20</p>
              <p className="text-[#EF4444] text-[10px] font-display font-bold/* FONT: UI -> Outfit */ italic">Deductions: -{summary.deductions}</p>
           </div>
        </div>

        <button 
           onClick={() => navigate('/')}
           className="text-[11px] font-black uppercase tracking-widest text-[#0A4174/* COLOR: #2563EB -> #0A4174 */] hover:tracking-[0.3em] transition-all"
        >
           Return to Terminal Screen
        </button>

        <div className="mt-12 flex items-center justify-center gap-4 border-t border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] pt-8 grayscale opacity-50">
           <img src={logoDark} alt="Cognivigil" className="h-5" />
           <p className="text-[9px] font-display font-bold/* FONT: UI -> Outfit */ text-[#49769F/* COLOR: #64748B -> #49769F */] uppercase tracking-widest">Powered by Sentinel AI</p>
        </div>
      </div>
    </div>
  );
}

function Record({ label, value, mono, danger, success }) {
  return (
    <div className="bg-[#BDD8E9/* COLOR: #F8FAFC -> #BDD8E9 */] border border-[#7BBDE8/* COLOR: #E2E8F0 -> #7BBDE8 */] p-4 rounded-xl text-left">
       <p className="text-[9px] font-black uppercase text-[#6EA2B3/* COLOR: #94A3B8 -> #6EA2B3 */] tracking-widest mb-1.5">{label}</p>
       <p className={`font-body text-[12px]/* FONT: Inter -> DM Sans */s font-display font-bold/* FONT: UI -> Outfit */ ${mono ? 'font-mono/* FONT: default-mono -> font-mono */' : ''} ${danger ? 'text-[#EF4444]' : success ? 'text-[#4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */]' : 'text-[#001D39/* COLOR: #0B1F3B -> #001D39 */]'}`}>{value}</p>
    </div>
  );
}

```
---
// browser-extension/content.js
```javascript
// browser-extension/content.js

// REMOVED: All Google Forms specific workarounds.
// NEW: Initialisation check and physical input blocker when inactive.

let sentinelActive = false;

function runtimeSend(message, callback) {
  if (!chrome?.runtime?.id) return;
  try {
    if (callback) chrome.runtime.sendMessage(message, callback);
    else chrome.runtime.sendMessage(message);
  } catch (err) {}
}

const host = document.createElement('div');
host.id = '__sentinel_host__';
host.style.cssText = 'position:fixed;top:0;left:0;width:100%;z-index:2147483647;pointer-events:none;';
const shadow = host.attachShadow({ mode: 'closed' });

function updateBanner(active) {
  if (!active) {
    shadow.innerHTML = '';
    return;
  }
  shadow.innerHTML = `
    <style>
      .banner {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        padding: 8px 16px; background: #001D39/* COLOR: #0B1F3B -> #001D39 */; border-bottom: 2px solid #4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */;
        color: #4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */; font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 700;
        letter-spacing: 0.05em; text-transform: uppercase;
      }
      .dot { width: 8px; height: 8px; border-radius: 50%; background: #4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */; animation: blink 1s infinite; box-shadow: 0 0 8px #4E8EA2/* COLOR: #14B8A6 -> #4E8EA2 */; }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    </style>
    <div class="banner">
      <div class="dot"></div>
      🛡 Cognivigil Sentinel Active — Integrity Monitored
    </div>
  `;
}

// NEW: Input blocker when Sentinel is inactive but on the exam route
const blocker = document.createElement('div');
blocker.id = '__sentinel_blocker__';
blocker.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;pointer-events:all;background:rgba(11,31,59,0.4);backdrop-filter:blur(2px);display:none;cursor:not-allowed;';
document.body?.appendChild(blocker);

function setSentinelState(active) {
  sentinelActive = active;
  updateBanner(active);
  if (active) {
    if (!document.body.contains(host)) document.body.appendChild(host);
    blocker.style.display = 'none';
  } else {
    // Only show blocker if we are detected to be on the exam path 
    if (window.location.pathname.startsWith('/exam')) {
       blocker.style.display = 'block';
    }
  }
}

// Initial handshake
runtimeSend({ type: 'STORAGE_GET', key: 'sentinelActive' }, (res) => {
  setSentinelState(!!res?.value);
});

// Listener for activation from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SENTINEL_STATE_CHANGE') {
    setSentinelState(msg.active);
  }
});

function reportViolation(type, severity = 'HIGH') {
  if (!sentinelActive) return;
  
  runtimeSend({ type: 'STORAGE_GET', key: 'violationCount' }, (res) => {
    const nextCount = (res?.value || 0) + 1;
    runtimeSend({ type: 'STORAGE_SET', key: 'violationCount', value: nextCount });
    runtimeSend({
      type: 'VIOLATION',
      violationType: type,
      severity: severity,
      timestamp: new Date().toISOString(),
      count: nextCount
    });
  });
}

// Event Listeners
document.addEventListener('visibilitychange', () => {
  if (document.hidden) reportViolation('TAB_HIDDEN');
});

window.addEventListener('blur', () => reportViolation('WINDOW_FOCUS_LOST'));

document.addEventListener('contextmenu', (e) => {
  if (sentinelActive) { e.preventDefault(); reportViolation('RIGHT_CLICK', 'MEDIUM'); }
});

['copy', 'cut', 'paste'].forEach(ev => {
  document.addEventListener(ev, (e) => {
    if (sentinelActive) { e.preventDefault(); reportViolation('CLIPBOARD_ATTEMPT'); }
  });
});

document.addEventListener('keydown', (e) => {
  if (!sentinelActive) return;
  const isDevTools = e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u');
  if (isDevTools) {
    e.preventDefault();
    reportViolation('DEVTOOLS_ATTEMPT', 'CRITICAL');
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && sentinelActive) {
    reportViolation('FULLSCREEN_EXIT', 'CRITICAL');
  }
});

// Re-injection guard
const obs = new MutationObserver(() => {
  if (sentinelActive && !document.body.contains(host)) document.body.appendChild(host);
  if (!sentinelActive && window.location.pathname.startsWith('/exam') && !document.body.contains(blocker)) document.body.appendChild(blocker);
});
obs.observe(document.body, { childList: true });

console.log('[Sentinel] Content script active');
```
---
// dashboard/src/assets/logo/Cognivigil_logo_full_dark.svg
```xml
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <title>Cognivigil Logo Full Dark</title>
  <desc>Cognivigil brand logo for dark navy backgrounds</desc>
  <!-- Shield Icon -->
  <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="#BDD8E9" stroke-width="2.5"/>
  <path d="M15 25 C 15 15, 45 15, 45 25 L 45 40 L 15 40 Z" fill="#0A4174" />
  <ellipse cx="30" cy="30" rx="9" ry="5" fill="#4E8EA2" />
  <circle cx="30" cy="30" r="4" fill="#001D39" />
  <!-- Wordmark -->
  <text x="60" y="38" font-family="Inter, sans-serif" font-weight="700" font-size="28" fill="#BDD8E9" letter-spacing="-0.03em">Cognivigil</text>
  <text x="60" y="52" font-family="Inter, sans-serif" font-weight="400" font-size="11" fill="#4E8EA2" letter-spacing="0.08em" text-transform="uppercase">EXAM INTEGRITY PLATFORM</text>
</svg>

```
---
// dashboard/src/assets/logo/Cognivigil_logo_full_light.svg
```xml
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <title>Cognivigil Logo Full Light</title>
  <desc>Cognivigil brand logo for light backgrounds</desc>
  <!-- Shield Icon -->
  <rect x="10" y="10" width="40" height="40" rx="4" fill="none" stroke="#001D39" stroke-width="2.5"/>
  <path d="M15 25 C 15 15, 45 15, 45 25 L 45 40 L 15 40 Z" fill="#0A4174" />
  <ellipse cx="30" cy="30" rx="9" ry="5" fill="#4E8EA2" />
  <circle cx="30" cy="30" r="4" fill="#BDD8E9" />
  <!-- Wordmark -->
  <text x="60" y="38" font-family="Inter, sans-serif" font-weight="700" font-size="28" fill="#001D39" letter-spacing="-0.03em">Cognivigil</text>
  <text x="60" y="52" font-family="Inter, sans-serif" font-weight="400" font-size="11" fill="#4E8EA2" letter-spacing="0.08em" text-transform="uppercase">EXAM INTEGRITY PLATFORM</text>
</svg>

```
---
// dashboard/src/assets/logo/Cognivigil_icon_dark.svg
```xml
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <title>Cognivigil Icon Dark</title>
  <rect x="4" y="4" width="40" height="40" rx="4" fill="none" stroke="#BDD8E9" stroke-width="3"/>
  <ellipse cx="24" cy="24" rx="14" ry="8" fill="#4E8EA2" />
  <circle cx="24" cy="24" r="5" fill="#001D39" />
</svg>

```
---
// dashboard/src/assets/logo/Cognivigil_icon_light.svg
```xml
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <title>Cognivigil Icon Light</title>
  <rect x="4" y="4" width="40" height="40" rx="4" fill="none" stroke="#001D39" stroke-width="3"/>
  <ellipse cx="24" cy="24" rx="14" ry="8" fill="#4E8EA2" />
  <circle cx="24" cy="24" r="5" fill="#BDD8E9" />
</svg>

```
---