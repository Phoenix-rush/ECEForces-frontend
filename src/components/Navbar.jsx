import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { addToast } = useToast();

    const handleLogout = () => {
        logout();
        addToast('Logged out successfully', 'success');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `relative py-1 text-sm font-medium transition-colors duration-200 ${
            isActive(path)
                ? 'text-[#EAEDF0]'
                : 'text-[#8891A0] hover:text-[#EAEDF0]'
        }`;

    const activeBar = (path) =>
        isActive(path)
            ? 'absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E887] to-[#5B7FFF] rounded-full'
            : 'hidden';

    return (
        <header className="sticky top-0 z-50 bg-[#06080A]/60 backdrop-blur-2xl border-b border-white/[0.06]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#00E887]/20 to-[#5B7FFF]/20 border border-white/[0.08] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#00E887] animate-glow-pulse" />
                        <div className="absolute inset-0 rounded-lg bg-[#00E887]/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-bold tracking-tight text-lg">
                        <span className="text-[#EAEDF0]">ECE</span>
                        <span className="text-[#505866]">Forces</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <div className="relative">
                        <Link to="/problems" className={navLinkClass('/problems')}>Problems</Link>
                        <span className={activeBar('/problems')} />
                    </div>
                    <div className="relative">
                        <Link to="/community" className={navLinkClass('/community')}>Community</Link>
                        <span className={activeBar('/community')} />
                    </div>
                    <div className="relative">
                        <Link to="/contests" className={navLinkClass('/contests')}>Contests</Link>
                        <span className={activeBar('/contests')} />
                    </div>
                    {isAuthenticated && (
                        <div className="relative">
                            <Link to="/submissions" className={navLinkClass('/submissions')}>Submissions</Link>
                            <span className={activeBar('/submissions')} />
                        </div>
                    )}
                    <div className="relative">
                        <Link to="/profile" className={navLinkClass('/profile')}>Profile</Link>
                        <span className={activeBar('/profile')} />
                    </div>

                    <div className="w-px h-5 bg-white/[0.06] mx-1" />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-[#00E887]/10 text-[#00E887] border border-[#00E887]/20 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00E887] animate-pulse" />
                                Pro
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-[#8891A0] hover:text-[#FF5C5C] transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-[#00E887]/10 text-[#00E887] border border-[#00E887]/20 hover:bg-[#00E887]/20 transition-all"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden w-9 h-9 flex items-center justify-center text-[#8891A0] hover:text-[#EAEDF0] transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/[0.06] bg-[#06080A]/90 backdrop-blur-2xl">
                    <nav className="px-4 py-4 flex flex-col gap-2">
                        <Link to="/problems" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                            Problems
                        </Link>
                        <Link to="/community" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                            Community
                        </Link>
                        <Link to="/contests" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                            Contests
                        </Link>
                        {isAuthenticated && (
                            <Link to="/submissions" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                                Submissions
                            </Link>
                        )}
                        <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                            Profile
                        </Link>
                        <div className="border-t border-white/[0.06] my-2" />
                        {isAuthenticated ? (
                            <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#FF5C5C] hover:bg-white/[0.04] transition-colors">
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8891A0] hover:text-[#EAEDF0] hover:bg-white/[0.04] transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)} className="mx-3 mt-1 text-center text-sm font-semibold px-4 py-2 bg-[#00E887]/10 text-[#00E887] border border-[#00E887]/20 rounded-lg hover:bg-[#00E887]/20 transition-colors">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;