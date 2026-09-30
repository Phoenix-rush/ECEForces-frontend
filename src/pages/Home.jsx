import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-20 animate-fade-in relative overflow-hidden">
            
            {/* Background glowing blobs specific to home */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00E887]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5B7FFF]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="max-w-4xl mx-auto text-center z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#00E887] shadow-[0_0_8px_rgba(0,232,135,0.8)] animate-pulse" />
                    <span className="text-xs font-mono font-medium tracking-wide text-[#EAEDF0]">ECEForces v1.0 is Live</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#EAEDF0] mb-6">
                    Master Hardware Design.<br />
                    <span className="gradient-text">One module at a time.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-[#8891A0] mb-12 max-w-2xl mx-auto leading-relaxed">
                    The ultimate competitive programming platform for Verilog and Digital Logic. 
                    Write modules, pass testbenches, and climb the leaderboard.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        to="/problems" 
                        className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#00E887] hover:bg-[#00D47A] text-[#06080A] font-bold transition-all shadow-[0_0_20px_rgba(0,232,135,0.2)] hover:shadow-[0_0_30px_rgba(0,232,135,0.4)] flex items-center justify-center gap-2"
                    >
                        Start Solving
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </Link>
                    
                    {!isAuthenticated ? (
                        <Link 
                            to="/signup" 
                            className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[#EAEDF0] font-medium transition-all flex items-center justify-center"
                        >
                            Create Account
                        </Link>
                    ) : (
                        <Link 
                            to="/community" 
                            className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[#EAEDF0] font-medium transition-all flex items-center justify-center"
                        >
                            Join Community
                        </Link>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 z-10 w-full">
                <div className="glass-card p-6 border-t-2 border-t-[#00E887]/50 transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-[#00E887]/10 flex items-center justify-center text-xl mb-4">⚡</div>
                    <h3 className="text-lg font-bold text-[#EAEDF0] mb-2">Live Cloud Judging</h3>
                    <p className="text-sm text-[#8891A0] leading-relaxed">
                        Web-socket powered backend. Submit your Verilog code and get compilation and execution verdicts in milliseconds.
                    </p>
                </div>
                <div className="glass-card p-6 border-t-2 border-t-[#5B7FFF]/50 transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-[#5B7FFF]/10 flex items-center justify-center text-xl mb-4">🏆</div>
                    <h3 className="text-lg font-bold text-[#EAEDF0] mb-2">Global Leaderboard</h3>
                    <p className="text-sm text-[#8891A0] leading-relaxed">
                        Compete with peers, track your solved problems, and build your digital design profile portfolio.
                    </p>
                </div>
                <div className="glass-card p-6 border-t-2 border-t-[#FFB224]/50 transition-transform hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-lg bg-[#FFB224]/10 flex items-center justify-center text-xl mb-4">💬</div>
                    <h3 className="text-lg font-bold text-[#EAEDF0] mb-2">Active Community</h3>
                    <p className="text-sm text-[#8891A0] leading-relaxed">
                        Share approaches, discuss testbench corner cases, and read comprehensive editorials for every problem.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
