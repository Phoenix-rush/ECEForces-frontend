import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ActivityCalendar } from 'react-activity-calendar';

function getHeatColor(count) {
    if (count === 0) return '#141920';
    const opacity = Math.min(count / 4, 1) * 0.75 + 0.25;
    return count >= 4 ? '#00E887' : `rgba(0, 232, 135, ${opacity})`;
}

// Build full year calendar data (fill empty days with 0)
function buildFullYearData(heatmapData, year) {
    const countByDate = {};
    heatmapData.forEach(item => {
        countByDate[item.date] = parseInt(item.count);
    });

    const days = [];
    const cursor = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    while (cursor <= end) {
        const dateStr = cursor.toISOString().slice(0, 10);
        const count = countByDate[dateStr] || 0;
        let level = 0;
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count === 3) level = 3;
        else if (count >= 4) level = 4;

        days.push({ date: dateStr, count, level });
        cursor.setDate(cursor.getDate() + 1);
    }

    return days;
}

// Stats builder
function computeStats(calendarData) {
    const activeDates = new Set(calendarData.filter(d => d.count > 0).map(d => d.date));

    let streak = 0;
    const cursor = new Date();
    while (true) {
        const dateStr = cursor.toISOString().slice(0, 10);
        if (activeDates.has(dateStr)) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        } else {
            break;
        }
    }

    return { activeDays: activeDates.size, streak };
}

function ProfileSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-10 route-transition">
            <div className="glass-card p-8 mb-8 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#141920] animate-pulse" />
                <div className="flex-1 flex flex-col gap-3">
                    <div className="h-5 w-40 rounded bg-[#141920] animate-pulse" />
                    <div className="h-3 w-56 rounded bg-[#141920] animate-pulse" />
                </div>
            </div>
            <div className="glass-card p-8 h-48 animate-pulse bg-[#141920]/40" />
        </div>
    );
}

function Profile() {
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState('loading');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/api/profile');
                setProfile(res.data);
                setStatus('ready');
            } catch (error) {
                console.error("Error loading profile:", error);
                setStatus('error');
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const res = await api.post('/api/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update profile state with new avatarUrl
            setProfile(prev => ({ ...prev, avatarUrl: res.data.avatarUrl }));
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Failed to upload profile picture.");
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!window.confirm("Are you sure you want to remove your profile photo?")) return;

        setUploading(true);
        try {
            await api.delete('/api/profile/avatar');
            setProfile(prev => ({ ...prev, avatarUrl: null }));
        } catch (error) {
            console.error("Error deleting avatar:", error);
            alert("Failed to remove profile picture.");
        } finally {
            setUploading(false);
        }
    };

    if (status === 'loading') return <ProfileSkeleton />;

    if (status === 'error') {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10 route-transition">
                <div className="glass-card border-dashed border-white/[0.06] py-14 text-center">
                    <p className="font-mono text-sm text-[#EAEDF0] mb-1">Couldn't load your profile</p>
                    <p className="text-sm text-[#8891A0]">Check your connection and try again.</p>
                </div>
            </div>
        );
    }

    const currentYear = new Date().getFullYear();
    const calendarData = buildFullYearData(profile.heatmapData, currentYear);
    const { activeDays, streak } = computeStats(calendarData);

    const customTheme = {
        light: [getHeatColor(0), getHeatColor(1), getHeatColor(2), getHeatColor(3), getHeatColor(4)],
        dark: [getHeatColor(0), getHeatColor(1), getHeatColor(2), getHeatColor(3), getHeatColor(4)],
    };

    const initials = profile.email.slice(0, 2).toUpperCase();
    const fullAvatarUrl = profile.avatarUrl 
        ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${api.defaults.baseURL}${profile.avatarUrl}`)
        : null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 route-transition">
            {/* Header Card */}
            <div className="glass-card p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <label className="relative group cursor-pointer">
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={uploading} />
                        <div className="w-32 h-32 rounded-xl bg-[#06080A] border-2 border-white/[0.08] flex items-center justify-center transition-colors group-hover:border-white/[0.16] overflow-hidden">
                            {uploading ? (
                                <span className="w-6 h-6 border-2 border-white/20 border-t-[#00E887] rounded-full animate-spin"></span>
                            ) : fullAvatarUrl ? (
                                <img src={fullAvatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/9.x/glass/svg?seed=${profile.email.split('@')[0]}`; }} />
                            ) : (
                                <span className="font-mono text-3xl font-semibold text-[#8891A0]">{initials}</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-[#06080A]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <span className="text-[11px] text-[#EAEDF0] font-medium uppercase tracking-wider text-center px-2">Update<br/>Photo</span>
                        </div>
                    </label>
                    {fullAvatarUrl && !uploading && (
                        <button 
                            onClick={handleAvatarDelete}
                            className="text-xs text-[#FF5C5C] hover:text-[#FF7B72] font-medium transition-colors"
                        >
                            Remove Photo
                        </button>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-[#EAEDF0] mb-1.5">{profile.email.split('@')[0]}</h1>
                    <p className="text-sm text-[#8891A0]">Member &middot; Joined {new Date(profile.joinedAt).toLocaleDateString()}</p>
                </div>

                {/* Stats Blocks */}
                <div className="flex gap-3">
                    <div className="glass-card hover:glow-amber transition-all px-5 py-3 text-center min-w-[88px]">
                        <p className="font-mono font-bold text-[#FFB224] text-xl leading-none">{profile.totalSolved}</p>
                        <p className="text-[11px] text-[#8891A0] uppercase tracking-wider mt-1.5">Problems</p>
                    </div>
                    <div className="glass-card transition-all px-5 py-3 text-center min-w-[88px]">
                        <p className="font-mono font-bold text-[#EAEDF0] text-xl leading-none">{activeDays}</p>
                        <p className="text-[11px] text-[#8891A0] uppercase tracking-wider mt-1.5">Active days</p>
                    </div>
                    <div className="glass-card hover:glow-green transition-all px-5 py-3 text-center min-w-[88px]">
                        <p className="font-mono font-bold text-[#00E887] text-xl leading-none">{streak}</p>
                        <p className="text-[11px] text-[#8891A0] uppercase tracking-wider mt-1.5">Day streak</p>
                    </div>
                    <div className="glass-card transition-all px-5 py-3 text-center min-w-[88px]">
                        <p className={`font-mono font-bold text-xl leading-none ${
                            (profile.contribution || 0) > 0 ? 'text-[#00E887]' : (profile.contribution || 0) < 0 ? 'text-[#FF5C5C]' : 'text-[#8891A0]'
                        }`}>
                            {(profile.contribution || 0) > 0 ? '+' : ''}{profile.contribution || 0}
                        </p>
                        <p className="text-[11px] text-[#8891A0] uppercase tracking-wider mt-1.5">Contribution</p>
                    </div>
                </div>
            </div>

            {/* Heatmap Matrix */}
            <div className="glass-card p-8 overflow-x-auto">
                <h2 className="text-lg font-bold text-[#EAEDF0] font-mono mb-6">Problems Solved Activity</h2>

                {activeDays > 0 ? (
                    <div className="min-w-[800px]">
                        <ActivityCalendar
                            data={calendarData}
                            theme={customTheme}
                            colorScheme="dark"
                            labels={{
                                tooltip: '<strong>{{count}} problems solved</strong> on {{date}}'
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-10 text-[#8891A0] border border-dashed border-white/[0.06] rounded-lg">
                        <p>No activity yet. Solve a unique problem to paint the board!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;