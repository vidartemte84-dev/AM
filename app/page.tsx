'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Sparkles, ShieldCheck, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Discover Your Style',
    desc: 'Take our science-backed quiz to uncover your attachment pattern.',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Compatibility',
    desc: 'Our algorithm surfaces profiles with the highest relational compatibility.',
  },
  {
    icon: Users,
    title: 'Real Connections',
    desc: 'No games — just honest, attachment-aware people ready for something real.',
  },
];

const BUBBLES = [
  { style: 'Secure',       color: 'bg-green-100 text-green-800',   x: '8%',  y: '18%', delay: 0 },
  { style: 'Anxious',      color: 'bg-amber-100 text-amber-800',   x: '68%', y: '12%', delay: 0.3 },
  { style: 'Avoidant',     color: 'bg-blue-100 text-blue-800',     x: '75%', y: '72%', delay: 0.6 },
  { style: 'Disorganized', color: 'bg-purple-100 text-purple-800', x: '5%',  y: '68%', delay: 0.9 },
];

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If user already has a profile, go to discover
    const profile = localStorage.getItem('am_profile');
    if (profile) {
      router.replace('/discover');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white relative overflow-hidden">
      {/* Decorative floating bubbles */}
      {BUBBLES.map((b) => (
        <div
          key={b.style}
          className={`absolute hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${b.color}`}
          style={{
            left: b.x,
            top:  b.y,
            animation: `float ${3 + b.delay}s ease-in-out infinite alternate`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {b.style}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-12px); }
        }
      `}</style>

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-400 rounded-3xl flex items-center justify-center shadow-lg shadow-brand-200 rotate-3">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Attach<span className="text-brand-600">Match</span>
        </h1>
        <p className="text-sm font-semibold text-brand-500 tracking-widest uppercase mb-4">
          Love, Understood
        </p>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm">
          The first dating app built around <strong>attachment theory</strong>.
          Know yourself, understand your matches, and build lasting connection.
        </p>

        {/* Attachment styles preview */}
        <div className="flex gap-2 mt-6 flex-wrap justify-center">
          {[
            { label: '🌿 Secure',        bg: 'bg-green-100',  text: 'text-green-800' },
            { label: '🌊 Anxious',       bg: 'bg-amber-100',  text: 'text-amber-800' },
            { label: '🏔️ Avoidant',     bg: 'bg-blue-100',   text: 'text-blue-800' },
            { label: '🌀 Disorganized', bg: 'bg-purple-100', text: 'text-purple-800' },
          ].map((s) => (
            <span
              key={s.label}
              className={`${s.bg} ${s.text} text-xs font-semibold px-3 py-1.5 rounded-full`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-6 space-y-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-card">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <f.icon className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 space-y-3">
        <button
          onClick={() => router.push('/quiz')}
          className="w-full py-4 bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-200 active:scale-95 transition-transform"
        >
          Discover My Attachment Style
        </button>
        <button
          onClick={() => router.push('/discover')}
          className="w-full py-3 border-2 border-brand-200 text-brand-700 font-semibold text-sm rounded-2xl active:scale-95 transition-transform"
        >
          Browse Profiles (Demo)
        </button>
        <p className="text-center text-xs text-gray-400">
          Free to use · Attachment-science backed
        </p>
      </div>
    </div>
  );
}
