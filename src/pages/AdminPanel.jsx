import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = {
    slug: '', title: '', statement: '', difficulty: 'easy',
    tags: '', time_limit: 5000, required_module_name: '',
    constraints: '', sample_examples: '', editorial: '',
};

function AdminPanel() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [isAdmin, setIsAdmin] = useState(null); // null = loading
    const [problems, setProblems] = useState([]);
    const [view, setView] = useState('list'); // list | form
    const [editing, setEditing] = useState(null); // problem id or null (new)
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    // Check admin on mount
    useEffect(() => {
        api.get('/api/admin/check')
            .then(() => setIsAdmin(true))
            .catch(() => setIsAdmin(false));
    }, []);

    const fetchProblems = useCallback(async () => {
        try {
            const res = await api.get('/api/admin/problems');
            setProblems(res.data);
        } catch (e) {
            addToast('Failed to load problems', 'error');
        }
    }, [addToast]);

    useEffect(() => {
        if (isAdmin) fetchProblems();
    }, [isAdmin, fetchProblems]);

    const handleEdit = async (id) => {
        try {
            const res = await api.get(`/api/admin/problems/${id}`);
            const p = res.data;
            setForm({
                slug: p.slug || '',
                title: p.title || '',
                statement: p.statement || '',
                difficulty: p.difficulty || 'easy',
                tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
                time_limit: p.time_limit || 5000,
                required_module_name: p.required_module_name || '',
                constraints: p.constraints || '',
                sample_examples: p.sample_examples || '',
                editorial: p.editorial || '',
            });
            setEditing(id);
            setView('form');
        } catch {
            addToast('Failed to load problem details', 'error');
        }
    };

    const handleNew = () => {
        setForm({ ...EMPTY_FORM });
        setEditing(null);
        setView('form');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.slug.trim() || !form.title.trim() || !form.statement.trim()) {
            addToast('Slug, title and statement are required', 'error');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                time_limit: parseInt(form.time_limit, 10) || 5000,
            };

            if (editing) {
                await api.put(`/api/admin/problems/${editing}`, payload);
                addToast('Problem updated', 'success');
            } else {
                await api.post('/api/admin/problems', payload);
                addToast('Problem created', 'success');
            }
            setView('list');
            fetchProblems();
        } catch (err) {
            addToast(err.response?.data?.error || 'Save failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/admin/problems/${id}`);
            addToast('Problem deleted', 'success');
            setProblems(prev => prev.filter(p => p.id !== id));
            setDeleting(null);
        } catch {
            addToast('Delete failed', 'error');
            setDeleting(null);
        }
    };

    const setField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

    // Loading state
    if (isAdmin === null) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="glass-card p-12 text-center">
                    <span className="w-6 h-6 border-2 border-[#00E887]/30 border-t-[#00E887] rounded-full animate-spin inline-block" />
                    <p className="text-sm text-[#8891A0] mt-4">Checking admin access...</p>
                </div>
            </div>
        );
    }

    // Not admin
    if (!isAdmin) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="glass-card p-12 text-center border border-dashed border-[#FF5C5C]/30">
                    <div className="text-4xl mb-4 opacity-50">🔒</div>
                    <h2 className="text-lg font-bold text-[#EAEDF0] mb-2">Access Denied</h2>
                    <p className="text-sm text-[#8891A0] mb-6">
                        You don't have admin privileges. Add your email to <code className="text-[#FFB224]">ADMIN_EMAILS</code> in the backend <code className="text-[#FFB224]">.env</code> file.
                    </p>
                    <button onClick={() => navigate('/')} className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-all">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // ─── Form View ─────────────────────────────────────────────────────────

    if (view === 'form') {
        return (
            <div className="max-w-4xl mx-auto p-6 route-transition">
                <button onClick={() => setView('list')} className="inline-flex items-center gap-1.5 text-sm text-[#8891A0] hover:text-[#EAEDF0] transition-colors mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to List
                </button>

                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold text-[#EAEDF0] mb-6">
                        {editing ? 'Edit Problem' : 'Create New Problem'}
                    </h2>

                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Slug" value={form.slug} onChange={v => setField('slug', v)} placeholder="e.g. mux-2to1" required />
                            <Field label="Title" value={form.title} onChange={v => setField('title', v)} placeholder="e.g. 2-to-1 Multiplexer" required />
                        </div>

                        <FieldTextarea label="Problem Statement" value={form.statement} onChange={v => setField('statement', v)} placeholder="Full problem description..." rows={8} required />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-[#8891A0] uppercase tracking-wider mb-2">Difficulty</label>
                                <select
                                    value={form.difficulty}
                                    onChange={e => setField('difficulty', e.target.value)}
                                    className="w-full input-glass px-4 py-2.5 text-sm cursor-pointer"
                                >
                                    <option value="easy" className="bg-[#0C1015]">Easy</option>
                                    <option value="medium" className="bg-[#0C1015]">Medium</option>
                                    <option value="hard" className="bg-[#0C1015]">Hard</option>
                                </select>
                            </div>
                            <Field label="Tags (comma-sep)" value={form.tags} onChange={v => setField('tags', v)} placeholder="Combinational, Mux" />
                            <Field label="Time Limit (ms)" type="number" value={form.time_limit} onChange={v => setField('time_limit', v)} placeholder="5000" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Field label="Required Module Name" value={form.required_module_name} onChange={v => setField('required_module_name', v)} placeholder="e.g. mux2to1" />
                            <Field label="Constraints" value={form.constraints} onChange={v => setField('constraints', v)} placeholder="e.g. Behavioral only" />
                        </div>

                        <FieldTextarea label="Sample Examples" value={form.sample_examples} onChange={v => setField('sample_examples', v)} placeholder="Input/output examples..." rows={4} />
                        <FieldTextarea label="Editorial (optional)" value={form.editorial} onChange={v => setField('editorial', v)} placeholder="Solution walkthrough..." rows={4} />

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 text-sm font-bold rounded-lg bg-[#00E887] text-[#06080A] hover:bg-[#00D47A] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving && <span className="w-4 h-4 border-2 border-[#06080A]/30 border-t-[#06080A] rounded-full animate-spin" />}
                                {editing ? 'Update Problem' : 'Create Problem'}
                            </button>
                            <button type="button" onClick={() => setView('list')} className="px-6 py-2.5 text-sm font-medium rounded-lg border border-white/[0.06] text-[#8891A0] hover:text-[#EAEDF0] transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ─── List View ─────────────────────────────────────────────────────────

    const diffColor = { easy: 'text-[#00E887]', medium: 'text-[#FFB224]', hard: 'text-[#FF5C5C]' };

    return (
        <div className="max-w-5xl mx-auto p-6 route-transition">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-[#FFB224] rounded-full" />
                    <h1 className="text-xl font-bold text-[#EAEDF0]">Admin Panel</h1>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#FFB224] border border-[#FFB224]/30 rounded bg-[#FFB224]/10">
                        {problems.length} problems
                    </span>
                </div>
                <button onClick={handleNew} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00E887] text-[#06080A] hover:bg-[#00D47A] transition-all">
                    + New Problem
                </button>
            </div>

            <div className="glass-card rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-[#06080A]/50 text-left font-mono text-[11px] font-medium text-[#8891A0] uppercase tracking-wider border-b border-white/[0.06]">
                        <tr>
                            <th className="px-5 py-3.5 font-semibold w-12">ID</th>
                            <th className="px-5 py-3.5 font-semibold">Title</th>
                            <th className="px-5 py-3.5 font-semibold w-20">Difficulty</th>
                            <th className="px-5 py-3.5 font-semibold">Tags</th>
                            <th className="px-5 py-3.5 font-semibold w-28 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {problems.map(p => (
                            <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                                <td className="px-5 py-3.5 text-[#505866] font-mono">{p.id}</td>
                                <td className="px-5 py-3.5 font-medium text-[#EAEDF0]">{p.title}</td>
                                <td className={`px-5 py-3.5 font-mono text-xs uppercase ${diffColor[p.difficulty] || 'text-[#8891A0]'}`}>{p.difficulty}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex flex-wrap gap-1">
                                        {(p.tags || []).map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 text-[10px] font-medium text-[#8891A0] bg-white/[0.04] border border-white/[0.06] rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => handleEdit(p.id)} className="px-3 py-1 text-xs font-medium rounded border border-[#5B7FFF]/30 text-[#5B7FFF] hover:bg-[#5B7FFF]/10 transition-all">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleting === p.id ? handleDelete(p.id) : setDeleting(p.id)}
                                            onBlur={() => setDeleting(null)}
                                            className={`px-3 py-1 text-xs font-medium rounded border transition-all ${
                                                deleting === p.id
                                                    ? 'border-[#FF5C5C]/50 text-[#FF5C5C] bg-[#FF5C5C]/10'
                                                    : 'border-white/[0.06] text-[#8891A0] hover:text-[#FF5C5C] hover:border-[#FF5C5C]/30'
                                            }`}
                                        >
                                            {deleting === p.id ? 'Confirm?' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {problems.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-sm text-[#8891A0]">No problems yet. Click "+ New Problem" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Reusable Field Components ──────────────────────────────────────────────

const Field = ({ label, value, onChange, placeholder, type = 'text', required }) => (
    <div>
        <label className="block text-xs font-medium text-[#8891A0] uppercase tracking-wider mb-2">
            {label}{required && <span className="text-[#FF5C5C]"> *</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-2.5 bg-[#141920] border border-white/[0.06] rounded-lg text-sm text-[#EAEDF0] placeholder-[#505866] focus:outline-none focus:border-[#00E887]/40 focus:ring-1 focus:ring-[#00E887]/20 transition-all"
        />
    </div>
);

const FieldTextarea = ({ label, value, onChange, placeholder, rows = 4, required }) => (
    <div>
        <label className="block text-xs font-medium text-[#8891A0] uppercase tracking-wider mb-2">
            {label}{required && <span className="text-[#FF5C5C]"> *</span>}
        </label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full px-4 py-2.5 bg-[#141920] border border-white/[0.06] rounded-lg text-sm text-[#EAEDF0] placeholder-[#505866] resize-y focus:outline-none focus:border-[#00E887]/40 focus:ring-1 focus:ring-[#00E887]/20 transition-all font-mono leading-relaxed"
        />
    </div>
);

export default AdminPanel;
