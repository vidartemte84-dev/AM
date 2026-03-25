'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { AttachmentBadge } from '@/components/AttachmentBadge';
import { CompatibilityRing } from '@/components/CompatibilityRing';
import { getCompatibilityInsight } from '@/lib/attachmentStyles';
import type { Profile, AttachmentStyle, UserProfile } from '@/lib/types';

interface MatchRecord {
  profile: Profile;
  matchedAt: string;
  compatibilityScore: number;
  isNew?: boolean;
}

const SAMPLE_MESSAGES = [
  'Hey! Excited to connect 😊',
  "Your attachment style resonates with me so much",
  'Would love to grab coffee sometime!',
  'I loved your answer about vulnerability',
  'Two secures walk into a bar… 😄',
];

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches]       = useState<MatchRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [message, setMessage]       = useState('');
  const [sent, setSent]             = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('am_matches');
    if (saved) setMatches(JSON.parse(saved));

    const profile = localStorage.getItem('am_profile');
    if (profile) setUserProfile(JSON.parse(profile));
  }, []);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setSelectedMatch(null);
    }, 2000);
  }

  const newMatches  = matches.filter((m) => m.isNew);
  const oldMatches  = matches.filter((m) => !m.isNew);
  const userStyle   = userProfile?.attachmentStyle;

  if (selectedMatch) {
    const p     = selectedMatch.profile;
    const insight = userStyle ? getCompatibilityInsight(userStyle, p.attachmentStyle) : '';

    return (
      <div className="min-h-screen bg-brand-50 pb-24">
        <div className="sticky top-0 z-40 bg-brand-50/95 backdrop-blur-sm px-5 pt-12 pb-4">
          <button
            onClick={() => setSelectedMatch(null)}
            className="flex items-center gap-2 text-brand-600 font-semibold text-sm mb-4"
          >
            ← Back to Matches
          </button>
          <div className="flex items-center gap-3">
            <img
              src={p.photos[0]}
              alt={p.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-brand-200"
            />
            <div>
              <h2 className="font-extrabold text-gray-900">{p.name}, {p.age}</h2>
              <AttachmentBadge style={p.attachmentStyle} size="sm" />
            </div>
          </div>
        </div>

        <div className="px-5 space-y-4">
          {/* Compatibility insight */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <CompatibilityRing score={selectedMatch.compatibilityScore} size={56} />
              <div>
                <p className="font-bold text-gray-900 text-sm">Compatibility Insight</p>
                <p className="text-xs text-gray-400">{p.attachmentStyle} + {userStyle}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
          </div>

          {/* Quick prompts */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Conversation Starters
            </p>
            <div className="space-y-2">
              {SAMPLE_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setMessage(msg)}
                  className="w-full text-left px-4 py-3 bg-brand-50 rounded-xl text-sm text-gray-700 font-medium active:scale-98 transition-transform hover:bg-brand-100"
                >
                  "{msg}"
                </button>
              ))}
            </div>
          </div>

          {/* Profile snippet */}
          {p.prompts.map((prompt, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 shadow-card">
              <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wide mb-1.5">
                {prompt.question}
              </p>
              <p className="text-gray-900 text-sm font-medium leading-relaxed">{prompt.answer}</p>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3">
          <div className="bg-white rounded-2xl shadow-card-hover flex items-center gap-3 p-3 border border-gray-100">
            {sent ? (
              <div className="flex-1 text-center text-brand-600 font-bold text-sm py-2">
                Message sent! 🎉
              </div>
            ) : (
              <>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${p.name}…`}
                  className="flex-1 text-sm outline-none text-gray-900 font-medium placeholder-gray-400 py-2"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                    message.trim()
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">Your Matches</h1>
        <p className="text-sm text-gray-400">
          {matches.length} connection{matches.length !== 1 ? 's' : ''} so far
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-brand-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">No matches yet</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Start liking profiles in the Discover tab and your matches will appear here.
          </p>
          <button
            onClick={() => router.push('/discover')}
            className="px-6 py-3 bg-brand-500 text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform"
          >
            Start Discovering
          </button>
        </div>
      ) : (
        <div className="px-5 space-y-5">
          {/* New matches */}
          {newMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  New Matches
                </p>
              </div>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {newMatches.map((m) => (
                  <button
                    key={m.profile.id}
                    onClick={() => setSelectedMatch(m)}
                    className="flex-shrink-0 flex flex-col items-center gap-2"
                  >
                    <div className="relative">
                      <img
                        src={m.profile.photos[0]}
                        alt={m.profile.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-brand-400 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Heart className="w-3 h-3 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{m.profile.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All matches list */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              All Connections
            </p>
            <div className="space-y-3">
              {matches.map((m) => {
                const score = m.compatibilityScore;
                return (
                  <button
                    key={m.profile.id}
                    onClick={() => setSelectedMatch(m)}
                    className="w-full bg-white rounded-3xl p-4 shadow-card flex items-center gap-4 active:scale-98 transition-transform text-left"
                  >
                    <img
                      src={m.profile.photos[0]}
                      alt={m.profile.name}
                      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 text-sm">{m.profile.name}, {m.profile.age}</p>
                        {m.isNew && (
                          <span className="text-[10px] bg-brand-500 text-white font-bold px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <AttachmentBadge style={m.profile.attachmentStyle} size="sm" />
                      <p className="text-xs text-gray-400 mt-1 truncate">{m.profile.location}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <CompatibilityRing score={score} size={48} />
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
