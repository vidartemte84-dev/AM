'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Edit3, RefreshCw, LogOut, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { AttachmentBadge } from '@/components/AttachmentBadge';
import { ATTACHMENT_INFO } from '@/lib/attachmentStyles';
import type { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const router  = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('am_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  function handleReset() {
    if (!confirm('Reset your profile? This will clear all data.')) return;
    localStorage.clear();
    router.push('/');
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center pb-24">
        <div className="text-center px-6">
          <p className="text-gray-500 text-sm mb-4">No profile found</p>
          <button
            onClick={() => router.push('/quiz')}
            className="px-6 py-3 bg-brand-500 text-white font-bold rounded-2xl text-sm"
          >
            Get Started
          </button>
        </div>
        <Navigation />
      </div>
    );
  }

  const info = ATTACHMENT_INFO[profile.attachmentStyle];

  return (
    <div className="min-h-screen bg-brand-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-gray-900">My Profile</h1>
        <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="px-5 space-y-4">
        {/* Profile header card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-card">
          <div className="aspect-[4/3] relative">
            {profile.photos?.[0] ? (
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <span className="text-6xl">😊</span>
              </div>
            )}
            <div className="absolute inset-0 photo-gradient" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-white font-extrabold text-2xl">
                {profile.name}, <span className="font-light">{profile.age}</span>
              </h2>
              <p className="text-white/80 text-sm">{profile.location}</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <AttachmentBadge style={profile.attachmentStyle} size="md" />
            <button
              onClick={() => router.push('/profile-setup')}
              className="flex items-center gap-1.5 text-brand-500 font-semibold text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Attachment style card */}
        <div className={`p-5 rounded-3xl bg-gradient-to-br ${info.gradient} text-white shadow-lg`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <p className="font-extrabold text-lg">{info.label}</p>
              <p className="text-white/80 text-xs">{info.tagline}</p>
            </div>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">{info.description}</p>
          <button
            onClick={() => router.push('/quiz')}
            className="mt-4 flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <RefreshCw className="w-3 h-3" />
            Retake Quiz
          </button>
        </div>

        {/* Prompts */}
        {profile.prompts?.map((p, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 shadow-card">
            <p className="text-[11px] font-bold text-brand-600 uppercase tracking-wide mb-1.5">
              {p.question}
            </p>
            <p className="text-gray-900 text-sm font-medium leading-relaxed">{p.answer || '—'}</p>
          </div>
        ))}

        {/* Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <p className="font-bold text-sm text-gray-900 mb-4">Activity</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Likes Given', value: '—' },
              { label: 'Matches',     value: '—' },
              { label: 'Profile Views', value: '—' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-brand-600">{stat.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          {[
            { label: 'Attachment Style Guide', icon: '📖' },
            { label: 'Notification Settings',  icon: '🔔' },
            { label: 'Privacy & Safety',        icon: '🔒' },
            { label: 'Help & Support',          icon: '💬' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Reset / logout */}
        <button
          onClick={handleReset}
          className="w-full py-4 rounded-2xl border-2 border-red-100 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-4 h-4" />
          Reset App Data
        </button>
      </div>

      <Navigation />
    </div>
  );
}
