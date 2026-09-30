import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import socket from '../api/socket';
import Editor from '@monaco-editor/react';
import { useToast } from '../context/ToastContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return `${diff}s ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

function getCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES = {
    easy:   { text: 'text-[#00E887]', border: 'border-[#00E887]/30', dot: 'bg-[#00E887]' },
    medium: { text: 'text-[#FFB224]', border: 'border-[#FFB224]/30', dot: 'bg-[#FFB224]' },
    hard:   { text: 'text-[#FF5C5C]', border: 'border-[#FF5C5C]/30', dot: 'bg-[#FF5C5C]' },
};
const DEFAULT_DIFFICULTY = { text: 'text-[#8891A0]', border: 'border-white/[0.06]', dot: 'bg-[#505866]' };

const VERDICT_STYLES = {
    AC: 'bg-[#00E887]/10 text-[#00E887] border-[#00E887]/30',
    WA: 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
    CE: 'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/30',
    TLE: 'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/30',
    RE: 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
    PENDING: 'bg-[#5B7FFF]/10 text-[#5B7FFF] border-[#5B7FFF]/30',
    Error: 'bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/30',
};
const DEFAULT_VERDICT_STYLE = 'bg-[#141920]/60 text-[#8891A0] border-white/[0.06]';

const TABS = ['Statement', 'Discussion', 'Editorial'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({ username, url }) {
    if (url) return <img src={url} alt={username} className="w-8 h-8 rounded-full object-cover border border-white/[0.08] flex-shrink-0" />;
    return (
        <div className="w-8 h-8 rounded-full bg-[#141920] border border-white/[0.08] flex items-center justify-center font-mono text-xs font-bold text-[#00E887] flex-shrink-0">
            {(username || '?')[0].toUpperCase()}
        </div>
    );
}

function CommentItem({ comment, onDelete, currentUserId }) {
    const [confirming, setConfirming] = useState(false);
    const isOwn = currentUserId && comment.user_id === currentUserId;

    return (
        <div className="flex gap-3 py-3 border-b border-white/[0.06] last:border-0 group animate-fade-in">
            <Avatar username={comment.username} url={comment.avatar_url} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#EAEDF0]">{comment.username}</span>
                        <span className="text-[11px] font-mono text-[#505866]">{timeAgo(comment.created_at)}</span>
                    </div>
                    {isOwn && (
                        <button
                            onClick={() => confirming ? onDelete(comment.id) : setConfirming(true)}
                            onBlur={() => setConfirming(false)}
                            className={`text-[10px] font-mono transition-colors flex-shrink-0 ${
                                confirming ? 'text-[#FF5C5C]' : 'text-[#505866] hover:text-[#FF5C5C]'
                            }`}
                        >
                            {confirming ? 'confirm?' : 'delete'}
                        </button>
                    )}
                </div>
                <p className="text-[13px] text-[#8891A0] mt-1 leading-relaxed break-words">{comment.content}</p>
            </div>
        </div>
    );
}

function DiscussionPanel({ problemId, onCountChange }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [postError, setPostError] = useState('');
    const currentUser = getCurrentUser();

    const loadComments = useCallback(async () => {
        if (!problemId) return;
        setLoading(true);
        try {
            const res = await api.get(`/api/comments/${problemId}`);
            setComments(res.data);
            if (onCountChange) onCountChange(res.data.length);
        } catch (e) {
            console.error('Failed to load comments:', e);
        } finally {
            setLoading(false);
        }
    }, [problemId, onCountChange]);

    useEffect(() => { loadComments(); }, [loadComments]);

    const handlePost = async () => {
        if (!newComment.trim() || posting) return;
        setPosting(true);
        setPostError('');
        try {
            const res = await api.post(`/api/comments/${problemId}`, { content: newComment.trim() });
            setComments(prev => {
                const updated = [res.data, ...prev];
                if (onCountChange) onCountChange(updated.length);
                return updated;
            });
            setNewComment('');
        } catch (e) {
            setPostError(e.response?.data?.error || 'Failed to post. Try again.');
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await api.delete(`/api/comments/${commentId}`);
            setComments(prev => {
                const updated = prev.filter(c => c.id !== commentId);
                if (onCountChange) onCountChange(updated.length);
                return updated;
            });
        } catch (e) {
            console.error('Failed to delete comment:', e);
        }
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
            {/* Post box */}
            {currentUser ? (
                <div className="glass-card p-4 border border-white/[0.06]">
                    <div className="flex gap-3 items-start">
                        <Avatar username={currentUser.email?.split('@')[0]} />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={e => { setNewComment(e.target.value); setPostError(''); }}
                                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost(); }}
                                placeholder="Share your approach, ask for hints, drop observations..."
                                maxLength={500}
                                rows={3}
                                className="w-full bg-transparent text-sm text-[#EAEDF0] placeholder-[#505866] resize-none outline-none border-0 font-sans leading-relaxed"
                            />
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                                <span className={`text-[10px] font-mono ${newComment.length > 450 ? 'text-[#FFB224]' : 'text-[#505866]'}`}>
                                    {newComment.length}/500 · Ctrl+Enter to post
                                </span>
                                <button
                                    onClick={handlePost}
                                    disabled={posting || !newComment.trim()}
                                    className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {posting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                            {postError && <p className="text-xs text-[#FF5C5C] mt-2 font-mono">{postError}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card px-4 py-6 text-center border border-white/[0.06]">
                    <p className="text-sm text-[#8891A0]">
                        <Link to="/login" className="text-[#00E887] hover:underline font-medium">Log in</Link> to join the discussion.
                    </p>
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="space-y-4 pt-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-[#141920] animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-[#141920] animate-pulse rounded" />
                                <div className="h-2.5 w-full bg-[#141920]/50 animate-pulse rounded" />
                                <div className="h-2.5 w-2/3 bg-[#141920]/50 animate-pulse rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="py-12 text-center glass-card border border-dashed border-white/[0.06]">
                    <div className="text-2xl mb-3 opacity-50">💬</div>
                    <p className="text-sm text-[#EAEDF0] font-medium">No discussion yet</p>
                    <p className="text-xs text-[#8891A0] mt-1">Be the first to drop a comment.</p>
                </div>
            ) : (
                <div className="glass-card p-4">
                    <p className="text-[11px] font-mono text-[#505866] mb-4 uppercase tracking-widest">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
                    <div className="space-y-1">
                        {comments.map(c => (
                            <CommentItem key={c.id} comment={c} onDelete={handleDelete} currentUserId={currentUser?.userId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function EditorialPanel({ problem }) {
    return (
        <div className="space-y-4 animate-fade-in">
            {problem?.editorial ? (
                <div className="glass-card p-6 text-sm text-[#EAEDF0] leading-relaxed whitespace-pre-wrap">
                    {problem.editorial}
                </div>
            ) : (
                <>
                    {/* Hints from constraints if available */}
                    {problem?.constraints && (
                        <div className="glass-card p-5">
                            <div className="text-[11px] font-mono text-[#00E887] tracking-widest uppercase mb-3">Constraints</div>
                            <p className="text-sm text-[#8891A0] leading-relaxed">{problem.constraints}</p>
                        </div>
                    )}

                    {/* Placeholder */}
                    <div className="glass-card p-8 text-center border border-dashed border-white/[0.06]">
                        <div className="text-3xl mb-4 opacity-50 select-none">🔬</div>
                        <p className="text-sm font-medium text-[#EAEDF0]">Editorial not published yet.</p>
                        <p className="text-xs text-[#8891A0] mt-2 leading-relaxed max-w-xs mx-auto">
                            Try solving it first — then check the Discussion tab for community hints and approaches.
                        </p>
                    </div>

                    {/* Approach hints card */}
                    <div className="glass-card p-5">
                        <div className="text-[11px] font-mono text-[#00E887] tracking-widest uppercase mb-4">General Approach</div>
                        <div className="space-y-3">
                            {[
                                'Read the required module name carefully — spelling matters.',
                                'Start by writing the module skeleton, then fill in the logic.',
                                'Use the sample examples to verify your output before submitting.',
                                'For sequential problems, handle reset conditions explicitly.',
                            ].map((h, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="font-mono text-[11px] text-[#5B7FFF] font-bold mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                    <p className="text-sm text-[#8891A0] leading-relaxed">{h}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ProblemDetail() {
    const { slug } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('// Write your Verilog code here...\n\nmodule top(input a, input b, output out);\n\nendmodule');
    const [verdict, setVerdict] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Tab state
    const [activeTab, setActiveTab] = useState('statement');
    const [commentCount, setCommentCount] = useState(null);
    const { addToast } = useToast();

    const activeSubmissionId = useRef(null);
    const [editorInstance, setEditorInstance] = useState(null);
    const [monacoInstance, setMonacoInstance] = useState(null);

    useEffect(() => {
        api.get(`/api/problems/${slug}`)
            .then(res => setProblem(res.data))
            .catch(err => {
                console.error(err);
                addToast('Failed to load problem', 'error');
            });
    }, [slug, addToast]);

    useEffect(() => {
        if (!problem) return;
        api.get(`/api/comments/${problem.id}`)
            .then(res => setCommentCount(res.data.length))
            .catch(() => {});
    }, [problem]);

    useEffect(() => {
        socket.connect();
        const handleVerdict = (data) => {
            if (data.submissionId !== activeSubmissionId.current) return;
            setVerdict(data);
            setLoading(false);
            if (data.verdict === 'AC') {
                addToast('Accepted! Well done.', 'success');
            } else if (data.verdict !== 'PENDING' && data.verdict !== 'RUNNING') {
                addToast(`Submission failed: ${data.verdict}`, 'error');
            }
        };
        socket.on('verdict', handleVerdict);
        return () => { socket.off('verdict', handleVerdict); socket.disconnect(); };
    }, [addToast]);

    const handleEditorMount = (editor, monaco) => { 
        setEditorInstance(editor); 
        setMonacoInstance(monaco); 
    };

    useEffect(() => {
        if (!monacoInstance || !editorInstance) return;
        const model = editorInstance.getModel();
        if (!model) return;
        monacoInstance.editor.setModelMarkers(model, 'compiler', []);
        if (verdict?.verdict === 'CE' && verdict.message) {
            const match = verdict.message.match(/module\.v:(\d+):/);
            if (match) {
                const line = parseInt(match[1], 10);
                monacoInstance.editor.setModelMarkers(model, 'compiler', [{
                    startLineNumber: line, startColumn: 1,
                    endLineNumber: line, endColumn: 1000,
                    message: verdict.message,
                    severity: monacoInstance.MarkerSeverity.Error,
                }]);
            }
        }
    }, [verdict, monacoInstance, editorInstance]);

    const handleSubmit = async () => {
        setLoading(true);
        setVerdict({ verdict: 'PENDING', message: 'Queued — waiting for judge...' });
        try {
            const res = await api.post('/api/submit', { problemSlug: slug, code });
            activeSubmissionId.current = res.data.submissionId;
            socket.emit('subscribe', res.data.submissionId);
        } catch (error) {
            const msg = error.response?.data?.error || 'Server connection failed.';
            setVerdict({ verdict: 'Error', message: msg });
            setLoading(false);
            addToast(msg, 'error');
        }
    };

    if (!problem) {
        return (
            <div className="route-transition min-h-[calc(100vh-64px)] flex items-center justify-center">
                <p className="font-mono text-sm text-[#8891A0]">Loading problem...</p>
            </div>
        );
    }

    const diffStyle = DIFFICULTY_STYLES[problem.difficulty?.toLowerCase()] || DEFAULT_DIFFICULTY;
    const verdictStyle = verdict ? (VERDICT_STYLES[verdict.verdict] || DEFAULT_VERDICT_STYLE) : '';

    return (
        <div className="route-transition min-h-[calc(100vh-64px)] max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-64px)]">
            {/* Left Panel */}
            <div className="w-full md:w-1/3 flex flex-col overflow-hidden">
                
                {/* Tabs */}
                <div className="flex border-b border-white/[0.06] mb-5 shrink-0">
                    {TABS.map(tab => {
                        const key = tab.toLowerCase();
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(key)}
                                className={`relative px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                                    isActive
                                        ? 'text-[#EAEDF0] border-[#00E887]'
                                        : 'text-[#8891A0] border-transparent hover:text-[#EAEDF0] hover:border-white/[0.1]'
                                }`}
                            >
                                {tab}
                                {tab === 'Discussion' && commentCount !== null && commentCount > 0 && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-white/[0.03] text-[#00E887] border border-[#00E887]/20 rounded-full">
                                        {commentCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Statement */}
                    {activeTab === 'statement' && (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <h2 className="text-3xl font-bold text-[#EAEDF0] tracking-tight">{problem.title}</h2>

                            <div className="flex gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide rounded-full border ${diffStyle.border} ${diffStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
                                    {problem.difficulty}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide rounded-full border border-white/[0.06] text-[#8891A0]">
                                    Time limit: {problem.time_limit}s
                                </span>
                            </div>

                            <div className="text-sm text-[#8891A0] leading-relaxed mt-2 space-y-4">
                                <p>{problem.statement}</p>
                            </div>

                            {problem.required_module_name && (
                                <div className="mt-2 glass-card p-4 border border-[#FFB224]/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FFB224]/10 flex items-center justify-center shrink-0">
                                        <span className="text-[#FFB224]">⚙️</span>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] text-[#FFB224] tracking-widest uppercase mb-0.5">Required Module Name</div>
                                        <code className="font-mono text-sm text-[#EAEDF0]">{problem.required_module_name}</code>
                                    </div>
                                </div>
                            )}

                            {problem.constraints && (
                                <div className="mt-2 glass-card p-4">
                                    <div className="font-mono text-[11px] text-[#00E887] tracking-widest uppercase mb-2">Constraints</div>
                                    <p className="text-[#8891A0] text-sm leading-relaxed">{problem.constraints}</p>
                                </div>
                            )}

                            {problem.sample_examples && (
                                <div className="mt-2 glass-card p-4">
                                    <div className="font-mono text-[11px] text-[#00E887] tracking-widest uppercase mb-2">Sample Examples</div>
                                    <pre className="font-mono text-xs text-[#EAEDF0] whitespace-pre-wrap">{
                                        typeof problem.sample_examples === 'string'
                                            ? problem.sample_examples
                                            : JSON.stringify(problem.sample_examples, null, 2)
                                    }</pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Discussion */}
                    {activeTab === 'discussion' && (
                        <DiscussionPanel
                            problemId={problem.id}
                            onCountChange={setCommentCount}
                        />
                    )}

                    {/* Editorial */}
                    {activeTab === 'editorial' && (
                        <EditorialPanel problem={problem} />
                    )}
                </div>
            </div>

            {/* Right Panel - Editor */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                <div className="glass-card overflow-hidden flex-1 min-h-[400px] border border-white/[0.06]">
                    <Editor
                        height="100%"
                        defaultLanguage="verilog"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        onMount={handleEditorMount}
                        options={{ fontSize: 14, minimap: { enabled: false }, fontFamily: 'JetBrains Mono', padding: { top: 16 } }}
                    />
                </div>

                <div className="glass-card p-4 flex justify-between items-center mt-auto shrink-0 border border-white/[0.06]">
                    <div className="flex-1 overflow-hidden pr-4">
                        {verdict && (
                            <div className={`px-4 py-2.5 font-mono font-medium rounded-lg text-sm border overflow-x-auto whitespace-pre-wrap ${verdictStyle}`}>
                                {verdict.verdict}: {verdict.message || "Execution completed"}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#FFB224] hover:bg-[#E5A020] text-[#06080A] font-bold py-2.5 px-6 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,178,36,0.4)] disabled:opacity-50 flex items-center gap-2 shrink-0"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-[#06080A]/30 border-t-[#06080A] rounded-full animate-spin"></span>
                                Judging...
                            </>
                        ) : 'Submit Code'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProblemDetail;