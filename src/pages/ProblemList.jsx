import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const DIFFICULTY_STYLES = {
    easy: { dot: 'bg-[#00E887] shadow-[0_0_8px_0_rgba(0,232,135,0.5)]', text: 'text-[#00E887]', border: 'border-[rgba(0,232,135,0.3)]' },
    medium: { dot: 'bg-[#FFB224] shadow-[0_0_8px_0_rgba(255,178,36,0.5)]', text: 'text-[#FFB224]', border: 'border-[rgba(255,178,36,0.3)]' },
    hard: { dot: 'bg-[#FF5C5C] shadow-[0_0_8px_0_rgba(255,92,92,0.5)]', text: 'text-[#FF5C5C]', border: 'border-[rgba(255,92,92,0.3)]' },
};
const DEFAULT_STYLE = { dot: 'bg-[#8891A0]', text: 'text-[#8891A0]', border: 'border-white/[0.06]' };

function ProblemList() {
    const [problems, setProblems] = useState([]);
    const [solvedIds, setSolvedIds] = useState(new Set());
    const [status, setStatus] = useState('loading');
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [difficulty, setDifficulty] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');

    useEffect(() => {
        Promise.all([
            api.get('/api/problems'),
            api.get('/api/user/solved'),
        ])
            .then(([probRes, solvedRes]) => {
                setProblems(probRes.data);
                setSolvedIds(new Set(solvedRes.data.solvedIds || []));
                setStatus('ready');
            })
            .catch(error => {
                console.error("Error fetching problems:", error);
                setStatus('error');
            });
    }, []);

    // Extract unique tags
    const allTags = Array.from(new Set(problems.flatMap(p => p.tags || []))).sort();

    // Filter problems by search term, difficulty, and tag
    const filteredProblems = problems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficulty === 'All' || (p.difficulty && p.difficulty.toLowerCase() === difficulty.toLowerCase());
        const matchesTag = selectedTag === 'All' || (p.tags && p.tags.includes(selectedTag));
        return matchesSearch && matchesDifficulty && matchesTag;
    });

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold gradient-text tracking-tight mb-1">Problemset</h2>
                        <p className="text-sm text-[#8891A0]">Write the module. Pass the testbench. Get judged.</p>
                    </div>

                    {/* Search & Filter */}
                    {status === 'ready' && problems.length > 0 && (
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:flex-grow-0">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8891A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-glass pl-9 pr-3 py-1.5 text-sm placeholder-[#505866] w-full md:w-48"
                                />
                            </div>
                            <select 
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="input-glass px-3 py-1.5 text-sm cursor-pointer"
                            >
                                <option value="All" className="bg-[#0C1015] text-[#EAEDF0]">All Tags</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag} className="bg-[#0C1015] text-[#EAEDF0]">{tag}</option>
                                ))}
                            </select>
                            <select 
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="input-glass px-3 py-1.5 text-sm cursor-pointer"
                            >
                                <option value="All" className="bg-[#0C1015] text-[#EAEDF0]">All Levels</option>
                                <option value="easy" className="bg-[#0C1015] text-[#EAEDF0]">Easy</option>
                                <option value="medium" className="bg-[#0C1015] text-[#EAEDF0]">Medium</option>
                                <option value="hard" className="bg-[#0C1015] text-[#EAEDF0]">Hard</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="border-t border-white/[0.06] mb-6" />

                {status === 'loading' && (
                    <div className="glass-card rounded-lg overflow-hidden border border-white/[0.06]">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-white/[0.06] last:border-0">
                                <span className="h-4 w-1/3 bg-[#141920] animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {status === 'error' && (
                    <div className="glass-card p-8 text-center rounded-lg border border-white/[0.06]">
                        <h3 className="text-base font-semibold text-[#EAEDF0] mb-1">Couldn't load problems</h3>
                        <p className="text-sm text-[#8891A0]">Check that the backend is running, then try again.</p>
                    </div>
                )}

                {status === 'ready' && problems.length === 0 && (
                    <div className="glass-card p-8 text-center rounded-lg border border-white/[0.06]">
                        <h3 className="text-base font-semibold text-[#EAEDF0] mb-1">No problems yet</h3>
                        <p className="text-sm text-[#8891A0]">New problems will show up here.</p>
                    </div>
                )}

                {/* Empty state */}
                {status === 'ready' && problems.length > 0 && filteredProblems.length === 0 && (
                    <div className="glass-card p-8 text-center rounded-lg border border-white/[0.06]">
                        <h3 className="text-base font-semibold text-[#EAEDF0] mb-1">No matches found</h3>
                        <p className="text-sm text-[#8891A0]">Try adjusting your search query.</p>
                    </div>
                )}

                {status === 'ready' && filteredProblems.length > 0 && (
                    <div className="glass-card rounded-lg overflow-hidden">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#06080A]/50 text-left font-mono text-[11px] font-medium text-[#8891A0] uppercase tracking-wider border-b border-white/[0.06]">
                                <tr>
                                    <th className="px-4 py-4 font-semibold w-10">Status</th>
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Tags</th>
                                    <th className="px-6 py-4 font-semibold w-32">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                                {filteredProblems.map((p, idx) => {
                                    const style = DIFFICULTY_STYLES[p.difficulty?.toLowerCase()] || DEFAULT_STYLE;
                                    const isSolved = solvedIds.has(p.id);
                                    return (
                                        <tr key={p.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer row-enter" style={{ '--row-delay': `${idx * 35}ms` }} onClick={() => window.location.href=`/problem/${p.slug}`}>
                                            <td className="px-4 py-4 text-center">
                                                {isSolved ? (
                                                    <svg className="w-5 h-5 text-[#00E887] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span className="w-4 h-4 rounded-full border border-white/[0.1] block mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                <Link
                                                    to={`/problem/${p.slug}`}
                                                    className="text-[#EAEDF0] group-hover:text-[#00E887] transition-colors no-underline block"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {p.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.tags && p.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-1 text-[11px] font-medium text-[#8891A0] bg-white/[0.04] border border-white/[0.06] rounded-md"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide rounded-full border ${style.border} ${style.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                    {p.difficulty}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProblemList;