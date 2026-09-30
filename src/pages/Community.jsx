import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const VERILOG_TIPS = [
  "Use non-blocking assignments (<=) in sequential always blocks.",
  "Use blocking assignments (=) in combinational always blocks.",
  "Never mix blocking and non-blocking assignments in the same always block.",
  "Assign all variables in all branches of a combinational block to avoid inferred latches.",
  "Wire types cannot store values; they only connect elements.",
  "A reg doesn't always imply a hardware register—it's just a variable in an always block.",
  "Use a default case in case statements to prevent unintentional latches.",
  "Synchronous resets are safer than asynchronous ones for most modern FPGA designs.",
  "Avoid combinational loops; they cause unpredictable hardware behavior."
];

function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sz = size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  if (!user) return <div className={`${sz} rounded-full bg-[#141920] border border-white/[0.08] ${className}`} />;
  const avatarUrl = user.avatar_url || user.avatar;
  if (avatarUrl) {
    return <img src={avatarUrl} alt={user.username} className={`${sz} rounded-full object-cover border border-white/[0.08] ${className}`} />;
  }
  return (
    <div className={`${sz} rounded-full bg-[#141920] border border-white/[0.08] text-[#00E887] flex items-center justify-center font-bold ${className}`}>
      {user.username?.[0]?.toUpperCase()}
    </div>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#141920] rounded ${className}`} />
);

// ─── Vote Arrow ──────────────────────────────────────────────────────────────

const VoteArrow = ({ direction, active, onClick }) => {
  const isUp = direction === 'up';
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded transition-all ${
        active
          ? isUp ? 'text-[#00E887]' : 'text-[#FF5C5C]'
          : 'text-[#505866] hover:text-[#EAEDF0]'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isUp ? 'none' : 'rotate(180deg)' }}>
        <path d="M12 4l-8 8h5v8h6v-8h5z" />
      </svg>
    </button>
  );
};

// ─── Post Card ───────────────────────────────────────────────────────────────

const PostCard = ({ post, onVote, onDelete, currentUserId, delay }) => {
  const isOwn = currentUserId && post.user_id === currentUserId;
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="glass-card p-5 flex gap-4 row-enter" style={{ '--row-delay': delay }}>
      {/* Vote column */}
      <div className="flex flex-col items-center gap-0.5 pt-1">
        <VoteArrow direction="up" active={post.user_vote === 1} onClick={() => onVote(post.id, 1)} />
        <span className={`text-sm font-bold min-w-[20px] text-center ${
          post.score > 0 ? 'text-[#00E887]' : post.score < 0 ? 'text-[#FF5C5C]' : 'text-[#505866]'
        }`}>
          {post.score}
        </span>
        <VoteArrow direction="down" active={post.user_vote === -1} onClick={() => onVote(post.id, -1)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Avatar user={post} size="sm" />
          <Link to={`/profile/${post.username}`} className="text-sm font-medium text-[#EAEDF0] hover:text-[#00E887] transition-colors">
            {post.username}
          </Link>
          <span className="text-[11px] text-[#505866] font-mono">{timeAgo(post.created_at)}</span>
          {isOwn && (
            <button
              onClick={() => confirming ? onDelete(post.id) : setConfirming(true)}
              onBlur={() => setConfirming(false)}
              className={`ml-auto text-[10px] font-mono transition-colors ${
                confirming ? 'text-[#FF5C5C]' : 'text-[#505866] hover:text-[#FF5C5C]'
              }`}
            >
              {confirming ? 'confirm?' : 'delete'}
            </button>
          )}
        </div>
        <Link to={`/post/${post.id}`} className="text-[15px] font-semibold text-[#EAEDF0] hover:text-[#00E887] transition-colors mb-1.5 block">{post.title}</Link>
        <p className="text-sm text-[#8891A0] leading-relaxed whitespace-pre-wrap break-words line-clamp-4">{post.content}</p>
        {post.content && post.content.length > 300 && (
          <Link to={`/post/${post.id}`} className="text-xs text-[#00E887] hover:underline mt-2 inline-block font-medium">Read more →</Link>
        )}
      </div>
    </div>
  );
};

// ─── Leaderboard Row ─────────────────────────────────────────────────────────

const LbRow = ({ user, rank, maxSolved, delay }) => {
  const pct = Math.max(5, ((user.problems_solved || 0) / maxSolved) * 100);
  
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/[0.06] last:border-0 row-enter group" style={{ '--row-delay': delay }}>
      <div className="w-6 text-center font-bold text-[#505866]">
        {rank}
      </div>
      <Avatar user={user} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <Link to={`/profile/${user.username}`} className="text-sm font-medium text-[#EAEDF0] truncate hover:text-[#00E887] transition-colors">
            {user.username}
          </Link>
          <span className="text-xs font-bold text-[#EAEDF0]">{user.problems_solved || 0} <span className="text-[#8891A0] font-normal">pts</span></span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#00E887] rounded-full transition-all duration-1000 ease-out group-hover:brightness-110" 
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);

  // New post form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  const currentUser = getCurrentUser();
  const { addToast } = useToast();

  const todayUnixDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const tipIndex = todayUnixDay % VERILOG_TIPS.length;

  const fetchAll = useCallback(async (search = '') => {
    try {
      const postsUrl = search ? `/api/posts?search=${encodeURIComponent(search)}` : '/api/posts';
      const [postsRes, lbRes] = await Promise.all([
        api.get(postsUrl),
        api.get('/api/leaderboard')
      ]);
      setPosts(postsRes.data || []);
      setLeaderboard(lbRes.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      if (loading) setError('Failed to load community data. Please try again.');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If cleared, fetch all
      if (!loading) {
        setSearching(true);
        fetchAll('');
      }
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetchAll(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const maxSolved = leaderboard.length > 0 ? Math.max(...leaderboard.map(u => u.problems_solved || 0), 1) : 1;

  // ─── Post Actions ────────────────────────────────────────────────────────

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim() || posting) return;
    setPosting(true);
    setPostError('');
    try {
      const res = await api.post('/api/posts', { title: newTitle.trim(), content: newContent.trim() });
      setPosts(prev => [res.data, ...prev]);
      setNewTitle('');
      setNewContent('');
      setShowForm(false);
      addToast('Post published!', 'success');
    } catch (e) {
      setPostError(e.response?.data?.error || 'Failed to create post.');
      addToast(e.response?.data?.error || 'Failed to create post.', 'error');
    } finally {
      setPosting(false);
    }
  };

  const handleVote = async (postId, value) => {
    if (!currentUser) {
        addToast('Log in to vote', 'error');
        return;
    }
    try {
      const res = await api.post(`/api/posts/${postId}/vote`, { value });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...res.data } : p));
    } catch (e) {
      console.error('Vote failed:', e);
      addToast('Failed to vote', 'error');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      addToast('Post deleted', 'success');
    } catch (e) {
      console.error('Delete failed:', e);
      addToast('Failed to delete post', 'error');
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96 lg:col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <div className="mb-6 p-4 border border-[#FF5C5C]/30 bg-[#FF5C5C]/10 text-[#FF5C5C] rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 row-enter" style={{ '--row-delay': '0ms' }}>
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-[#00E887] rounded-full" />
          <h1 className="text-xl font-bold text-[#EAEDF0]">Community</h1>
        </div>
        {currentUser && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-all"
          >
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showForm && (
        <div className="glass-card p-6 mb-6 row-enter" style={{ '--row-delay': '100ms' }}>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Post title..."
            maxLength={200}
            className="w-full bg-transparent text-[#EAEDF0] placeholder-[#505866] text-base font-semibold outline-none border-b border-white/[0.06] pb-3 mb-4"
          />
          <textarea
            value={newContent}
            onChange={e => { setNewContent(e.target.value); setPostError(''); }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost(); }}
            placeholder="Write your thoughts, share solutions, ask questions..."
            maxLength={5000}
            rows={5}
            className="w-full bg-transparent text-sm text-[#EAEDF0] placeholder-[#505866] resize-none outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <span className={`text-[10px] font-mono ${newContent.length > 4500 ? 'text-[#FFB224]' : 'text-[#505866]'}`}>
              {newContent.length}/5000 · Ctrl+Enter to post
            </span>
            <button
              onClick={handleCreatePost}
              disabled={posting || !newTitle.trim() || !newContent.trim()}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#00E887] text-[#06080A] hover:bg-[#00D47A] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {posting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
          {postError && <p className="text-xs text-[#FF5C5C] mt-2 font-mono">{postError}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Blog Posts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Bar */}
          <div className="relative row-enter" style={{ '--row-delay': '150ms' }}>
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8891A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 pr-4 py-2.5 text-sm placeholder-[#505866]"
            />
            {searching && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#00E887]/30 border-t-[#00E887] rounded-full animate-spin" />
            )}
          </div>

          {posts.length > 0 ? (
            posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                onVote={handleVote}
                onDelete={handleDeletePost}
                currentUserId={currentUser?.userId}
                delay={`${300 + i * 50}ms`}
              />
            ))
          ) : searchTerm.trim() ? (
            <div className="glass-card p-12 text-center border border-dashed border-white/[0.06]">
              <div className="text-3xl mb-3 opacity-50">🔍</div>
              <p className="text-sm text-[#EAEDF0] font-medium">No posts found for "{searchTerm}"</p>
              <p className="text-xs text-[#8891A0] mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="glass-card p-12 text-center border border-dashed border-white/[0.06]">
              <div className="text-3xl mb-3 opacity-50">📝</div>
              <p className="text-sm text-[#EAEDF0] font-medium">No posts yet</p>
              <p className="text-xs text-[#8891A0] mt-1">Be the first to share something with the community.</p>
            </div>
          )}

          {/* Tip of the Day */}
          <div className="glass-card p-6 row-enter flex items-center justify-between" style={{ '--row-delay': '500ms' }}>
            <div>
              <h3 className="text-md font-bold text-[#EAEDF0] mb-1">Verilog Tip of the Day</h3>
              <p className="text-sm text-[#8891A0] transition-opacity duration-300 min-h-[40px] flex items-center">
                {VERILOG_TIPS[tipIndex]}
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#FFB224]">
              💡
            </div>
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 row-enter" style={{ '--row-delay': '350ms' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#EAEDF0]">Leaderboard</h2>
            </div>
            
            <div className="space-y-2">
              {leaderboard.length > 0 ? (
                <>
                  <div className="flex items-end justify-center gap-2 mb-8 mt-4">
                    {/* Rank 2 */}
                    {leaderboard[1] && (
                      <div className="flex flex-col items-center animate-[route-enter_500ms_both]" style={{ animationDelay: '400ms' }}>
                        <Link to={`/profile/${leaderboard[1].username}`} className="flex flex-col items-center hover:opacity-80 transition-opacity">
                            <Avatar user={leaderboard[1]} size="md" className="mb-2" />
                            <span className="text-xs font-bold text-[#EAEDF0] truncate w-16 text-center">{leaderboard[1].username}</span>
                        </Link>
                        <span className="text-[10px] text-[#8891A0] mb-2">{leaderboard[1].problems_solved || 0} pts</span>
                        <div className="w-16 h-16 bg-white/[0.02] border-t-2 border-x border-white/[0.08] rounded-t-xl shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)]">
                        </div>
                      </div>
                    )}
                    {/* Rank 1 */}
                    {leaderboard[0] && (
                      <div className="flex flex-col items-center animate-[route-enter_500ms_both]" style={{ animationDelay: '300ms' }}>
                        <Link to={`/profile/${leaderboard[0].username}`} className="flex flex-col items-center hover:opacity-80 transition-opacity">
                            <Avatar user={leaderboard[0]} size="lg" className="mb-2 ring-2 ring-[#00E887] ring-offset-2 ring-offset-[#0C1015]" />
                            <span className="text-sm font-bold text-[#EAEDF0] truncate w-20 text-center">{leaderboard[0].username}</span>
                        </Link>
                        <span className="text-xs text-[#00E887] font-bold mb-2">{leaderboard[0].problems_solved || 0} pts</span>
                        <div className="w-20 h-24 bg-gradient-to-t from-[#00E887]/10 to-[#00E887]/5 border-t-2 border-x border-[#00E887]/40 rounded-t-xl shadow-[inset_0_4px_20px_rgba(0,232,135,0.1)] relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-[#00E887]/20 to-transparent opacity-50 blur-md"></div>
                        </div>
                      </div>
                    )}
                    {/* Rank 3 */}
                    {leaderboard[2] && (
                      <div className="flex flex-col items-center animate-[route-enter_500ms_both]" style={{ animationDelay: '500ms' }}>
                        <Link to={`/profile/${leaderboard[2].username}`} className="flex flex-col items-center hover:opacity-80 transition-opacity">
                            <Avatar user={leaderboard[2]} size="md" className="mb-2" />
                            <span className="text-xs font-bold text-[#EAEDF0] truncate w-16 text-center">{leaderboard[2].username}</span>
                        </Link>
                        <span className="text-[10px] text-[#8891A0] mb-2">{leaderboard[2].problems_solved || 0} pts</span>
                        <div className="w-16 h-12 bg-white/[0.02] border-t-2 border-x border-white/[0.08] rounded-t-xl shadow-[inset_0_4px_20px_rgba(255,255,255,0.02)]">
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {leaderboard.slice(3, 10).map((user, i) => (
                    <LbRow 
                      key={user.id || user.username} 
                      user={user} 
                      rank={i + 4} 
                      maxSolved={maxSolved}
                      delay={`${600 + i * 50}ms`} 
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-10 text-[#8891A0] text-sm">No rankings yet</div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <Link 
                to="/"
                className="w-full block text-center py-2 rounded-lg border border-[#00E887]/30 text-[#00E887] bg-[#00E887]/10 hover:bg-[#00E887]/20 transition-colors text-sm font-medium"
              >
                Solve Problems to Rank Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
