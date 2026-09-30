import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

function getCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
}

const VoteArrow = ({ direction, active, onClick }) => {
    const isUp = direction === 'up';
    return (
        <button
            onClick={onClick}
            className={`p-1.5 rounded-lg transition-all ${
                active
                    ? isUp ? 'text-[#00E887] bg-[#00E887]/10' : 'text-[#FF5C5C] bg-[#FF5C5C]/10'
                    : 'text-[#505866] hover:text-[#EAEDF0] hover:bg-white/[0.03]'
            }`}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isUp ? 'none' : 'rotate(180deg)' }}>
                <path d="M12 4l-8 8h5v8h6v-8h5z" />
            </svg>
        </button>
    );
};

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [status, setStatus] = useState('loading');
    const [confirming, setConfirming] = useState(false);
    const currentUser = getCurrentUser();

    const fetchPost = useCallback(async () => {
        try {
            const res = await api.get(`/api/posts/${id}`);
            setPost(res.data);
            setStatus('ready');
        } catch (err) {
            setStatus(err.response?.status === 404 ? 'not_found' : 'error');
        }
    }, [id]);

    useEffect(() => { fetchPost(); }, [fetchPost]);

    const handleVote = async (value) => {
        if (!currentUser) return;
        try {
            const res = await api.post(`/api/posts/${id}/vote`, { value });
            setPost(prev => ({ ...prev, ...res.data }));
        } catch (e) {
            console.error('Vote failed:', e);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/posts/${id}`);
            navigate('/community');
        } catch (e) {
            console.error('Delete failed:', e);
        }
    };

    if (status === 'loading') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 route-transition">
                <div className="glass-card p-8 space-y-4">
                    <div className="h-6 w-2/3 bg-[#141920] animate-pulse rounded" />
                    <div className="h-4 w-1/3 bg-[#141920] animate-pulse rounded" />
                    <div className="h-32 w-full bg-[#141920]/50 animate-pulse rounded mt-6" />
                </div>
            </div>
        );
    }

    if (status === 'not_found') {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 route-transition">
                <div className="glass-card border-dashed border-white/[0.06] py-20 text-center">
                    <div className="text-4xl mb-4 opacity-50">📝</div>
                    <p className="text-lg text-[#EAEDF0] font-medium mb-2">Post not found</p>
                    <p className="text-sm text-[#8891A0] mb-6">This post may have been deleted.</p>
                    <Link to="/community" className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-all">
                        Back to Community
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'error' || !post) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 route-transition">
                <div className="glass-card border-dashed border-white/[0.06] py-14 text-center">
                    <p className="text-sm text-[#EAEDF0]">Failed to load post. Please try again.</p>
                </div>
            </div>
        );
    }

    const isOwn = currentUser && post.user_id === currentUser.userId;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 route-transition">
            {/* Back link */}
            <Link to="/community" className="inline-flex items-center gap-1.5 text-sm text-[#8891A0] hover:text-[#EAEDF0] transition-colors mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Community
            </Link>

            <div className="glass-card p-8 flex gap-6">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 pt-2 shrink-0">
                    <VoteArrow direction="up" active={post.user_vote === 1} onClick={() => handleVote(1)} />
                    <span className={`text-lg font-bold min-w-[24px] text-center ${
                        post.score > 0 ? 'text-[#00E887]' : post.score < 0 ? 'text-[#FF5C5C]' : 'text-[#505866]'
                    }`}>
                        {post.score}
                    </span>
                    <VoteArrow direction="down" active={post.user_vote === -1} onClick={() => handleVote(-1)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        {post.avatar_url ? (
                            <img src={post.avatar_url} alt={post.username} className="w-10 h-10 rounded-full object-cover border border-white/[0.08]" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#141920] border border-white/[0.08] text-[#00E887] flex items-center justify-center font-bold text-base">
                                {post.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div>
                            <Link to={`/profile/${post.username}`} className="text-sm font-semibold text-[#EAEDF0] hover:text-[#00E887] transition-colors">
                                {post.username}
                            </Link>
                            <p className="text-[11px] text-[#505866] font-mono">{timeAgo(post.created_at)}</p>
                        </div>
                        {isOwn && (
                            <button
                                onClick={() => confirming ? handleDelete() : setConfirming(true)}
                                onBlur={() => setConfirming(false)}
                                className={`ml-auto text-xs font-mono px-3 py-1 rounded-lg border transition-all ${
                                    confirming
                                        ? 'text-[#FF5C5C] border-[#FF5C5C]/30 bg-[#FF5C5C]/10'
                                        : 'text-[#505866] border-white/[0.06] hover:text-[#FF5C5C] hover:border-[#FF5C5C]/30'
                                }`}
                            >
                                {confirming ? 'Confirm delete?' : 'Delete'}
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-[#EAEDF0] mb-4 leading-snug">{post.title}</h1>

                    {/* Body */}
                    <div className="text-sm text-[#8891A0] leading-relaxed whitespace-pre-wrap break-words">
                        {post.content}
                    </div>

                    {/* Footer stats */}
                    <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-4 text-[11px] font-mono text-[#505866]">
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                            {post.upvotes} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            {post.downvotes} downvotes
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
