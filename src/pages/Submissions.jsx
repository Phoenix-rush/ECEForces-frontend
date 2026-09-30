import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VerdictBadge from '../components/VerdictBadge';

function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get('/api/submissions');
                setSubmissions(res.data);
            } catch (err) {
                setError('Failed to fetch submissions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#EAEDF0] gradient-text mb-1">My Submissions</h1>
                <p className="text-sm text-[#8891A0]">View your past problem attempts and their results.</p>
            </div>
            
            <div className="border-t border-white/[0.06] mb-6" />

            {loading && (
                <div className="glass-card rounded-lg overflow-hidden border border-white/[0.06]">
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-white/[0.06] last:border-0">
                            <span className="h-4 w-1/4 bg-[#141920] animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="glass-card p-8 text-center rounded-lg border border-white/[0.06]">
                    <h3 className="text-base font-semibold text-[#FF5C5C] mb-1">Error Loading Submissions</h3>
                    <p className="text-sm text-[#8891A0]">{error}</p>
                </div>
            )}

            {!loading && !error && submissions.length === 0 && (
                <div className="glass-card p-10 text-center rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-[#8891A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-[#EAEDF0] mb-1">No submissions yet</h3>
                    <p className="text-sm text-[#8891A0]">Go solve some problems to see your history here.</p>
                </div>
            )}

            {!loading && !error && submissions.length > 0 && (
                <div className="glass-card rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#06080A]/50 border-b border-white/[0.06] text-[#505866]">
                                <th className="px-6 py-3 font-semibold">Time</th>
                                <th className="px-6 py-3 font-semibold">Problem</th>
                                <th className="px-6 py-3 font-semibold">Verdict</th>
                                <th className="px-6 py-3 font-semibold text-right">Exec Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                            {submissions.map((sub, idx) => (
                                <tr key={sub.id} className="hover:bg-white/[0.03] transition-colors row-enter" style={{ '--row-delay': `${idx * 35}ms` }}>
                                    <td className="px-6 py-4 text-[#8891A0]">
                                        {new Date(sub.created_at).toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <Link to={`/problem/${sub.slug}`} className="text-[#EAEDF0] hover:text-[#00E887] transition-colors">
                                            {sub.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <VerdictBadge verdict={sub.verdict} size="sm" />
                                    </td>
                                    <td className="px-6 py-4 text-[#8891A0] text-right font-mono">
                                        {sub.execution_time ? `${sub.execution_time}s` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Submissions;
