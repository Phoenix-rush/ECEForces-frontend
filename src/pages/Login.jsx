import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            // Login via AuthContext — updates both localStorage and app state
            login(res.data.token);
            addToast('Welcome back to ECEForces!', 'success');
            // Redirect to problem list after login
            navigate('/problems');
        } catch (err) {
            setError(err.response?.data?.error || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <div className="glass-card p-8 rounded-xl w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="relative w-5 h-5 rounded-md bg-gradient-to-br from-[#00E887]/20 to-[#5B7FFF]/20 border border-white/[0.08] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E887] shadow-[0_0_8px_rgba(0,232,135,0.8)]" />
                    </div>
                    <span className="font-mono text-xs font-semibold tracking-[0.15em] text-[#8891A0] uppercase">ECEForces</span>
                </div>
                <h2 className="text-2xl font-bold text-[#EAEDF0] mb-6 text-center tracking-tight">Login to your account</h2>

                {error && (
                    <div className="mb-4 p-3 bg-[#FF5C5C]/10 text-[#FF5C5C] border border-[#FF5C5C]/20 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-[#8891A0] mb-1.5">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full input-glass px-4 py-2.5 text-[#EAEDF0] transition-colors placeholder-[#505866]"
                            placeholder="student@bitmesra.ac.in"
                        />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-[#8891A0] mb-1.5">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full input-glass px-4 py-2.5 text-[#EAEDF0] transition-colors placeholder-[#505866]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full flex justify-center items-center gap-2 bg-[#00E887] hover:bg-[#00CC75] text-[#06080A] font-semibold py-2.5 rounded-lg btn-glow btn-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,232,135,0.2)]"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#06080A]/30 border-t-[#06080A] rounded-full animate-spin" />
                                Logging in...
                            </>
                        ) : 'Enter Arena'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#8891A0]">
                    Don't have beta access? <Link to="/signup" className="text-[#00E887] font-medium hover:underline">Apply here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;