import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="border-t border-white/[0.06] bg-[#06080A]/80 backdrop-blur-xl mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#00E887]/20 to-[#5B7FFF]/20 border border-white/[0.08] flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-[#00E887]" />
                            </div>
                            <span className="font-bold tracking-tight text-lg">
                                <span className="text-[#EAEDF0]">ECE</span>
                                <span className="text-[#505866]">Forces</span>
                            </span>
                        </Link>
                        <p className="text-xs text-[#505866] leading-relaxed max-w-[200px]">
                            The competitive programming platform for Verilog and Digital Logic.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-xs font-semibold text-[#8891A0] uppercase tracking-widest mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">Problems</Link></li>
                            <li><Link to="/community" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">Community</Link></li>
                            <li><Link to="/contests" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">Contests</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xs font-semibold text-[#8891A0] uppercase tracking-widest mb-4">Resources</h4>
                        <ul className="space-y-2.5">
                            <li><a href="https://hdlbits.01xz.net" target="_blank" rel="noopener noreferrer" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">HDLBits</a></li>
                            <li><a href="https://makerchip.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">Makerchip IDE</a></li>
                            <li><a href="https://www.chipverify.com/verilog/verilog-tutorial" target="_blank" rel="noopener noreferrer" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors">Verilog Tutorial</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-xs font-semibold text-[#8891A0] uppercase tracking-widest mb-4">Connect</h4>
                        <ul className="space-y-2.5">
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                GitHub
                            </a></li>
                            <li><a href="mailto:contact@eceforces.com" className="text-sm text-[#505866] hover:text-[#EAEDF0] transition-colors flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                Contact
                            </a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-[#505866]">
                        © {new Date().getFullYear()} ECEForces. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#505866]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E887] animate-pulse" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
