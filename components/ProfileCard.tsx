'use client';

import { useState } from 'react';
import { Heart, X, MapPin, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { Profile } from '@/lib/types';
import type { AttachmentStyle, UserProfile } from '@/lib/types';
import { ATTACHMENT_INFO, getCompatibilityScore, getCompatibilityInsight } from '@/lib/attachmentStyles';
import { AttachmentBadge } from './AttachmentBadge';
import { CompatibilityRing } from './CompatibilityRing';

interface Props {
  profile: Profile;
  userStyle?: AttachmentStyle;
  onLike: () => void;
  onPass: () => void;
  onSuperLike?: () => void;
}

export function ProfileCard({ profile, userStyle, onLike, onPass, onSuperLike }: Props) {
  const [photoIdx, setPhotoIdx]     = useState(0);
  const [expanded, setExpanded]     = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [showInsight, setShowInsight] = useState(false);

  const photos        = profile.photos;
  const styleInfo     = ATTACHMENT_INFO[profile.attachmentStyle];
  const compatScore   = userStyle ? getCompatibilityScore(userStyle, profile.attachmentStyle) : null;
  const insight       = userStyle ? getCompatibilityInsight(userStyle, profile.attachmentStyle) : null;

  function toggleLike(key: string) {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="bg-white rounded-4xl shadow-card overflow-hidden card-enter">
      {/* Photo section */}
      <div className="relative">
        <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
          <img
            key={photoIdx}
            src={photos[photoIdx]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 photo-gradient" />

          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 px-4">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i === photoIdx ? 'bg-white' : 'bg-white/40'
                  }`}
                  style={{ maxWidth: 60 }}
                />
              ))}
            </div>
          )}

          {/* Photo nav areas */}
          <div className="absolute inset-0 flex">
            <div className="flex-1" onClick={() => setPhotoIdx(Math.max(0, photoIdx - 1))} />
            <div className="flex-1" onClick={() => setPhotoIdx(Math.min(photos.length - 1, photoIdx + 1))} />
          </div>

          {/* Compatibility ring */}
          {compatScore !== null && (
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowInsight((v) => !v)}>
                <CompatibilityRing score={compatScore} />
              </button>
            </div>
          )}

          {/* Name & info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-white font-extrabold text-2xl leading-tight drop-shadow">
                  {profile.name}, <span className="font-light">{profile.age}</span>
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-white/80" />
                  <span className="text-white/80 text-xs font-medium">{profile.location}</span>
                </div>
              </div>
              <AttachmentBadge style={profile.attachmentStyle} size="sm" />
            </div>
          </div>
        </div>

        {/* Compatibility insight */}
        {showInsight && insight && (
          <div
            className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-10"
            onClick={() => setShowInsight(false)}
          >
            <div className="bg-white rounded-3xl p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-brand-500" />
                <p className="font-bold text-sm text-gray-900">Compatibility Insight</p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
              <button
                onClick={() => setShowInsight(false)}
                className="mt-4 w-full py-2 bg-brand-500 text-white text-sm font-bold rounded-xl"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-4">
        {/* Quick facts */}
        <div className="flex flex-wrap gap-2">
          {profile.job && (
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              💼 {profile.job}
            </span>
          )}
          {profile.height && (
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              📏 {profile.height}
            </span>
          )}
          {profile.pronouns && (
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {profile.pronouns}
            </span>
          )}
        </div>

        {/* Prompts */}
        {profile.prompts.map((prompt, i) => {
          const key  = `prompt-${i}`;
          const liked = likedItems.has(key);
          return (
            <div key={i} className="bg-brand-50 rounded-2xl p-4 relative group">
              <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wide mb-1.5">
                {prompt.question}
              </p>
              <p className="text-gray-900 text-sm font-medium leading-relaxed">{prompt.answer}</p>
              <button
                onClick={() => toggleLike(key)}
                className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  liked
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white text-gray-400 shadow-sm opacity-0 group-hover:opacity-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
              </button>
            </div>
          );
        })}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio if not in prompts */}
        {profile.bio && (
          <p className="text-sm text-gray-500 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-6 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onPass}
            className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-red-200 hover:text-red-400"
          >
            <X className="w-5 h-5" />
            Pass
          </button>
          <button
            onClick={onLike}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-brand-200"
          >
            <Heart className="w-5 h-5 fill-white" />
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
