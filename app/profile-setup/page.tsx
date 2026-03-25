'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Camera, Plus, X, Check } from 'lucide-react';
import { ATTACHMENT_INFO } from '@/lib/attachmentStyles';
import { PROMPT_OPTIONS, INTEREST_OPTIONS } from '@/lib/mockData';
import type { AttachmentStyle, UserProfile } from '@/lib/types';

type Step = 'basics' | 'photos' | 'prompts' | 'interests' | 'done';
const STEPS: Step[] = ['basics', 'photos', 'prompts', 'interests', 'done'];

const PLACEHOLDER_PHOTOS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('basics');
  const [attachmentStyle, setAttachmentStyle] = useState<AttachmentStyle>('secure');

  // Form state
  const [name, setName]         = useState('');
  const [age, setAge]           = useState('');
  const [location, setLocation] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [job, setJob]           = useState('');
  const [height, setHeight]     = useState('');
  const [bio, setBio]           = useState('');

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<{ question: string; answer: string }[]>([
    { question: PROMPT_OPTIONS[0], answer: '' },
    { question: PROMPT_OPTIONS[1], answer: '' },
  ]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('am_quiz_result');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAttachmentStyle(parsed.style);
    }
  }, []);

  const stepIndex  = STEPS.indexOf(step);
  const progress   = ((stepIndex + 1) / STEPS.length) * 100;
  const styleInfo  = ATTACHMENT_INFO[attachmentStyle];

  function nextStep() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function prevStep() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else router.back();
  }

  function togglePhoto(url: string) {
    setSelectedPhotos((prev) =>
      prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url].slice(0, 6)
    );
  }

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest].slice(0, 8)
    );
  }

  function updatePrompt(idx: number, field: 'question' | 'answer', value: string) {
    setSelectedPrompts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function handleFinish() {
    const profile: UserProfile = {
      id:              'me',
      name:            name || 'You',
      age:             parseInt(age) || 25,
      location:        location || 'New York, NY',
      photos:          selectedPhotos.length > 0 ? selectedPhotos : [PLACEHOLDER_PHOTOS[0]],
      attachmentStyle,
      bio,
      prompts:         selectedPrompts.filter((p) => p.answer.trim()),
      interests,
      pronouns,
      job,
      height,
    };
    localStorage.setItem('am_profile', JSON.stringify(profile));
    router.push('/discover');
  }

  /* ------------------------------------------------------------------ */
  /*  STEP RENDERS                                                        */
  /* ------------------------------------------------------------------ */

  const renderBasics = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 shadow-card">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-4">
          Your Attachment Style
        </p>
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${styleInfo.gradient}`}
        >
          <span className="text-3xl">{styleInfo.emoji}</span>
          <div>
            <p className="font-bold text-white text-lg">{styleInfo.label}</p>
            <p className="text-white/80 text-xs">{styleInfo.tagline}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/quiz')}
          className="mt-3 text-xs text-brand-500 font-semibold underline"
        >
          Retake quiz
        </button>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">About You</p>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">First Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Age *</label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              placeholder="25"
              min={18}
              max={99}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Height</label>
            <input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={`5'6"`}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Brooklyn, NY"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Pronouns</label>
            <input
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="She/Her"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Job</label>
            <input
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Designer"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A little about yourself…"
            rows={3}
            maxLength={200}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-400 transition-colors resize-none"
          />
          <p className="text-right text-xs text-gray-300 mt-1">{bio.length}/200</p>
        </div>
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 shadow-card">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
          Your Photos
        </p>
        <p className="text-xs text-gray-400 mb-4">Select up to 6 photos for your profile</p>
        <div className="grid grid-cols-3 gap-3">
          {PLACEHOLDER_PHOTOS.map((url, i) => {
            const selected = selectedPhotos.includes(url);
            return (
              <button
                key={i}
                onClick={() => togglePhoto(url)}
                className={`aspect-square rounded-2xl overflow-hidden relative border-3 transition-all ${
                  selected ? 'ring-4 ring-brand-500 ring-offset-2' : 'ring-0'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {selected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
          <button className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 active:scale-95 transition-transform">
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Upload</span>
          </button>
        </div>
        {selectedPhotos.length === 0 && (
          <p className="text-xs text-amber-500 font-medium mt-3 text-center">
            Select at least one photo to continue
          </p>
        )}
      </div>

      <div className="bg-brand-50 rounded-3xl p-4">
        <p className="text-xs text-brand-600 font-medium">
          💡 Profiles with 3+ photos get 5× more matches. Be authentic!
        </p>
      </div>
    </div>
  );

  const renderPrompts = () => (
    <div className="space-y-4">
      <div className="bg-brand-50 rounded-3xl p-4">
        <p className="text-xs text-brand-600 font-medium">
          ✍️ Prompts let people see your personality. Be real — that's what attachment-aware people love.
        </p>
      </div>

      {selectedPrompts.map((prompt, i) => (
        <div key={i} className="bg-white rounded-3xl p-5 shadow-card">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-3">
            Prompt {i + 1}
          </p>
          <select
            value={prompt.question}
            onChange={(e) => updatePrompt(i, 'question', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-brand-400 transition-colors mb-3 bg-white"
          >
            {PROMPT_OPTIONS.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
          <textarea
            value={prompt.answer}
            onChange={(e) => updatePrompt(i, 'answer', e.target.value)}
            placeholder="Your honest answer…"
            rows={3}
            maxLength={150}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors resize-none"
          />
          <p className="text-right text-xs text-gray-300 mt-1">{prompt.answer.length}/150</p>
        </div>
      ))}

      {selectedPrompts.length < 3 && (
        <button
          onClick={() =>
            setSelectedPrompts((prev) => [
              ...prev,
              { question: PROMPT_OPTIONS[prev.length + 1] ?? PROMPT_OPTIONS[0], answer: '' },
            ])
          }
          className="w-full py-4 border-2 border-dashed border-brand-200 text-brand-600 font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Another Prompt
        </button>
      )}
    </div>
  );

  const renderInterests = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 shadow-card">
        <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
          Interests
        </p>
        <p className="text-xs text-gray-400 mb-4">Pick up to 8 that feel like you</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all active:scale-95 ${
                  selected
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDone = () => (
    <div className="space-y-4">
      <div className="text-center py-6">
        <div className="text-6xl mb-4">{styleInfo.emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {name ? `${name}, you're ready!` : "You're all set!"}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed px-4">
          Your <strong>{styleInfo.label}</strong> attachment style will help us surface the
          most compatible matches for you.
        </p>
      </div>

      <div className={`p-5 rounded-3xl bg-gradient-to-br ${styleInfo.gradient} text-white`}>
        <p className="font-bold text-lg mb-1">Your Style</p>
        <p className="text-sm opacity-90">{styleInfo.description}</p>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-card space-y-2">
        <p className="font-bold text-sm text-gray-900 mb-3">✅ Profile Summary</p>
        {[
          { label: 'Name', value: name || '—' },
          { label: 'Age',  value: age  || '—' },
          { label: 'Location', value: location || '—' },
          { label: 'Photos', value: `${selectedPhotos.length} selected` },
          { label: 'Prompts', value: `${selectedPrompts.filter((p) => p.answer).length} answered` },
          { label: 'Interests', value: interests.length > 0 ? interests.slice(0, 3).join(', ') : '—' },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-400">{item.label}</span>
            <span className="font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const canProceed = () => {
    if (step === 'basics')    return name.trim().length > 0 && age.length > 0;
    if (step === 'photos')    return true; // optional
    if (step === 'prompts')   return true; // optional
    if (step === 'interests') return true;
    return true;
  };

  const stepLabels: Record<Step, string> = {
    basics:    'The Basics',
    photos:    'Your Photos',
    prompts:   'Your Prompts',
    interests: 'Your Interests',
    done:      'All Done!',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={prevStep}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <p className="text-sm font-bold text-gray-900">{stepLabels[step]}</p>
          </div>
          <div className="w-9" />
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4 pb-2 overflow-y-auto hide-scrollbar">
        {step === 'basics'    && renderBasics()}
        {step === 'photos'    && renderPhotos()}
        {step === 'prompts'   && renderPrompts()}
        {step === 'interests' && renderInterests()}
        {step === 'done'      && renderDone()}
      </div>

      {/* Footer button */}
      <div className="px-6 pb-10 pt-4">
        {step === 'done' ? (
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Start Discovering Matches
          </button>
        ) : (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`w-full py-4 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
              canProceed()
                ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
