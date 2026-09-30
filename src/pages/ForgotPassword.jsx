import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        try {
            const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
            setMessage(res.data.message);
            setStatus('success');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 route-transition">
            <div className="w-full max-w-md">
                <div className="glass-card p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-[#EAEDF0] mb-2">Reset Password</h1>
                        <p className="text-sm text-[#8891A0]">
                            Enter your email address and we'll generate a reset link.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-4">
                            <div className="w-14 h-14 rounded-full bg-[#00E887]/10 border border-[#00E887]/30 flex items-center justify-center mx-auto">
                                <svg className="w-7 h-7 text-[#00E887]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-[#EAEDF0] font-medium">{message}</p>
                            <p className="text-xs text-[#8891A0] leading-relaxed">
                                Check the server console for the reset link.
                                <br />The link expires in 1 hour.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block mt-4 px-6 py-2.5 text-sm font-semibold rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-[#8891A0] uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-[#141920] border border-white/[0.06] rounded-lg text-sm text-[#EAEDF0] placeholder-[#505866] focus:outline-none focus:border-[#00E887]/40 focus:ring-1 focus:ring-[#00E887]/20 transition-all"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-3 border border-[#FF5C5C]/30 bg-[#FF5C5C]/10 text-[#FF5C5C] rounded-lg text-xs">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading' || !email.trim()}
                                className="w-full py-3 bg-[#00E887] text-[#06080A] font-bold rounded-lg hover:bg-[#00D47A] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-[#06080A]/30 border-t-[#06080A] rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : 'Send Reset Link'}
                            </button>

                            <p className="text-center text-sm text-[#8891A0]">
                                Remember your password?{' '}
                                <Link to="/login" className="text-[#00E887] hover:underline font-medium">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
