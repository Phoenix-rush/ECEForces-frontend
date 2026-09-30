import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ProblemList from './pages/ProblemList';
import ProblemDetail from './pages/ProblemDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Submissions from './pages/Submissions';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Contests from './pages/Contests';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import PublicProfile from './pages/PublicProfile';
import PostDetail from './pages/PostDetail';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';

const pageVariants = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route
            path="/submissions"
            element={<ProtectedRoute><Submissions /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
        <div className="min-h-screen bg-[#06080A] text-[#EAEDF0] font-sans antialiased selection:bg-accent-green/20 selection:text-accent-green relative">
          {/* Animated Gradient Mesh Background */}
          <div className="gradient-mesh" aria-hidden="true">
            <div className="blob-3" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
