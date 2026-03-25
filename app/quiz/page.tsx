'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { QUIZ_QUESTIONS, calculateAttachmentStyle, ATTACHMENT_INFO } from '@/lib/attachmentStyles';

const SCALE = [
  { value: 1, label: 'Strongly\nDisagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly\nAgree' },
];

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [current, setCurrent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateAttachmentStyle> | null>(null);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');

  const question = QUIZ_QUESTIONS[current];
  const answered = answers[current] !== null;
  const progress = ((current + (answered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  function handleAnswer(value: number) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
  }

  function goNext() {
    if (current < QUIZ_QUESTIONS.length - 1) {
      setAnimDir('right');
      setCurrent((c) => c + 1);
    } else {
      // Calculate result
      const filled = answers.map((a) => a ?? 3) as number[];
      const res = calculateAttachmentStyle(filled);
      setResult(res);
      setShowResult(true);
      // Save to localStorage
      localStorage.setItem('am_quiz_result', JSON.stringify(res));
    }
  }

  function goPrev() {
    if (current > 0) {
      setAnimDir('left');
      setCurrent((c) => c - 1);
    }
  }

  function handleContinue() {
    router.push('/profile-setup');
  }

  if (showResult && result) {
    const info = ATTACHMENT_INFO[result.style];
    const styleEntries = Object.entries(result.scores) as [keyof typeof result.scores, number][];

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 text-center">
          <div className="text-5xl mb-3">{info.emoji}</div>
          <p className="text-sm font-semibold text-brand-500 uppercase tracking-widest mb-1">
            Your Attachment Style
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{info.label}</h1>
          <p className="text-brand-600 font-semibold">{info.tagline}</p>
        </div>

        <div className="flex-1 px-6 space-y-4 pb-6">
          {/* Description card */}
          <div className={`p-5 rounded-3xl bg-gradient-to-br ${info.gradient} text-white shadow-lg`}>
            <p className="text-sm leading-relaxed opacity-95">{info.description}</p>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <p className="font-bold text-gray-900 mb-3 text-sm">Your Scores</p>
            <div className="space-y-3">
              {styleEntries
                .sort(([, a], [, b]) => b - a)
                .map(([style, score]) => {
                  const s = ATTACHMENT_INFO[style];
                  return (
                    <div key={style}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {s.emoji} {s.label}
                        </span>
                        <span className="text-xs font-bold" style={{ color: s.color }}>
                          {score}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full progress-bar"
                          style={{ width: `${score}%`, background: s.color }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Strengths & Challenges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl p-4 shadow-card">
              <p className="font-bold text-gray-900 text-xs mb-2">✨ Strengths</p>
              <ul className="space-y-1">
                {info.strengths.slice(0, 3).map((s) => (
                  <li key={s} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-card">
              <p className="font-bold text-gray-900 text-xs mb-2">🌱 Growing</p>
              <ul className="space-y-1">
                {info.challenges.map((c) => (
                  <li key={c} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* In relationships */}
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <p className="font-bold text-gray-900 text-sm mb-2">💑 In Relationships</p>
            <p className="text-sm text-gray-600 leading-relaxed">{info.inRelationship}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-10">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-brand-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Build My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
      {/* Top bar */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (current === 0 ? router.back() : goPrev())}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-xs font-semibold text-gray-400">
            {current + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <div className="w-9" />
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="bg-white rounded-3xl p-6 shadow-card mb-8">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-3">
            Statement {current + 1}
          </p>
          <p className="text-xl font-bold text-gray-900 leading-snug">{question.text}</p>
        </div>

        {/* Scale */}
        <p className="text-xs text-center text-gray-400 mb-4 font-medium">
          How much do you agree with this statement?
        </p>
        <div className="flex justify-between gap-2">
          {SCALE.map((s) => {
            const selected = answers[current] === s.value;
            return (
              <button
                key={s.value}
                onClick={() => handleAnswer(s.value)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  selected
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-100 bg-white hover:border-brand-200'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                    selected
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {s.value}
                </div>
                <span
                  className={`text-center leading-tight text-[10px] font-medium whitespace-pre-line ${
                    selected ? 'text-brand-600' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category hint */}
        <div className="mt-6 text-center">
          <span className="text-xs text-gray-300 font-medium">
            Reflect honestly — there are no wrong answers
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-10 pt-4 flex gap-3">
        {current > 0 && (
          <button
            onClick={goPrev}
            className="flex-1 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl active:scale-95 transition-transform"
          >
            Back
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!answered}
          className={`flex-1 py-4 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
            answered
              ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {current === QUIZ_QUESTIONS.length - 1 ? 'See My Results' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
