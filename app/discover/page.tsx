'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, Heart, Sparkles } from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/mockData';
import { ATTACHMENT_INFO, getCompatibilityScore } from '@/lib/attachmentStyles';
import { ProfileCard } from '@/components/ProfileCard';
import { Navigation } from '@/components/Navigation';
import { AttachmentBadge } from '@/components/AttachmentBadge';
import type { Profile, AttachmentStyle, UserProfile } from '@/lib/types';

type FilterStyle = AttachmentStyle | 'all';

const FILTER_OPTIONS: { value: FilterStyle; label: string }[] = [
  { value: 'all',          label: 'All Styles' },
  { value: 'secure',       label: '🌿 Secure' },
  { value: 'anxious',      label: '🌊 Anxious' },
  { value: 'avoidant',     label: '🏔️ Avoidant' },
  { value: 'disorganized', label: '🌀 Disorganized' },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles]     = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter]         = useState<FilterStyle>('all');
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [passedIds, setPassedIds]   = useState<Set<string>>(new Set());
  const [matchAnimation, setMatchAnimation] = useState<Profile | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [cardKey, setCardKey]       = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('am_profile');
    if (saved) setUserProfile(JSON.parse(saved));

    const savedMatches = localStorage.getItem('am_matches');
    if (savedMatches) {
      const arr: { profile: Profile }[] = JSON.parse(savedMatches);
      setMatchedIds(new Set(arr.map((m) => m.profile.id)));
    }

    const savedPassed = localStorage.getItem('am_passed');
    if (savedPassed) setPassedIds(new Set(JSON.parse(savedPassed)));
  }, []);

  // Sort profiles by compatibility
  const filteredProfiles = MOCK_PROFILES.filter((p) => {
    if (matchedIds.has(p.id) || passedIds.has(p.id)) return false;
    if (filter !== 'all' && p.attachmentStyle !== filter) return false;
    return true;
  }).sort((a, b) => {
    if (!userProfile) return 0;
    return (
      getCompatibilityScore(userProfile.attachmentStyle, b.attachmentStyle) -
      getCompatibilityScore(userProfile.attachmentStyle, a.attachmentStyle)
    );
  });

  const currentProfile = filteredProfiles[0];

  function handleLike() {
    if (!currentProfile) return;

    // Simulate a match ~50% of the time
    const isMatch = Math.random() > 0.5;

    const savedMatches = localStorage.getItem('am_matches');
    const existingMatches = savedMatches ? JSON.parse(savedMatches) : [];

    if (isMatch) {
      const newMatch = {
        profile:          currentProfile,
        matchedAt:        new Date().toISOString(),
        compatibilityScore: userProfile
          ? getCompatibilityScore(userProfile.attachmentStyle, currentProfile.attachmentStyle)
          : 75,
        isNew: true,
      };
      localStorage.setItem('am_matches', JSON.stringify([...existingMatches, newMatch]));
      setMatchedIds((prev) => new Set([...prev, currentProfile.id]));
      setMatchAnimation(currentProfile);
      setTimeout(() => setMatchAnimation(null), 3000);
    } else {
      // Just liked, not matched
      setMatchedIds((prev) => new Set([...prev, currentProfile.id]));
    }
    setCardKey((k) => k + 1);
  }

  function handlePass() {
    if (!currentProfile) return;
    const saved = localStorage.getItem('am_passed');
    const existing: string[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('am_passed', JSON.stringify([...existing, currentProfile.id]));
    setPassedIds((prev) => new Set([...prev, currentProfile.id]));
    setCardKey((k) => k + 1);
  }

  const userStyle = userProfile?.attachmentStyle;
  const userInfo  = userStyle ? ATTACHMENT_INFO[userStyle] : null;

  return (
    <div className="min-h-screen bg-brand-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-brand-50/95 backdrop-blur-sm px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">
              Attach<span className="text-brand-600">Match</span>
            </h1>
            {userInfo && (
              <p className="text-xs text-gray-400 font-medium">
                Showing best matches for{' '}
                <span className="font-semibold" style={{ color: userInfo.color }}>
                  {userInfo.emoji} {userInfo.label}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
              showFilter || filter !== 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter chips */}
        {showFilter && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                  filter === value
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card feed */}
      <div className="px-4">
        {currentProfile ? (
          <div key={cardKey} className="card-enter">
            <ProfileCard
              profile={currentProfile}
              userStyle={userStyle}
              onLike={handleLike}
              onPass={handlePass}
            />
            {/* Remaining count */}
            <p className="text-center text-xs text-gray-400 font-medium mt-3 mb-2">
              {filteredProfiles.length - 1} more profile{filteredProfiles.length - 1 !== 1 ? 's' : ''} nearby
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="text-5xl mb-4">🌸</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">You've seen everyone!</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Check your matches or come back later for new profiles.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('am_passed');
                setPassedIds(new Set());
                setCardKey((k) => k + 1);
              }}
              className="px-6 py-3 bg-brand-500 text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Match animation */}
      {matchAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="bg-white rounded-4xl p-8 text-center shadow-2xl max-w-xs w-full">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-100 flex items-center justify-center match-pulse">
              <Heart className="w-10 h-10 text-brand-500 fill-brand-500" />
            </div>
            <div className="flex justify-center gap-3 mb-4">
              {userProfile?.photos?.[0] && (
                <img
                  src={userProfile.photos[0]}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border-3 border-brand-400"
                />
              )}
              <Sparkles className="w-6 h-6 text-amber-400 self-center" />
              <img
                src={matchAnimation.photos[0]}
                alt=""
                className="w-14 h-14 rounded-full object-cover border-3 border-brand-400"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              It's a Match! 🎉
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              You and{' '}
              <strong className="text-gray-900">{matchAnimation.name}</strong> liked each other
            </p>
            <AttachmentBadge style={matchAnimation.attachmentStyle} size="sm" />
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setMatchAnimation(null)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl text-sm active:scale-95 transition-transform"
              >
                Keep Browsing
              </button>
              <button
                onClick={() => {
                  setMatchAnimation(null);
                  router.push('/matches');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform shadow-md"
              >
                View Match
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
