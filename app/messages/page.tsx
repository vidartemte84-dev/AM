'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-50 pb-24">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">Messages</h1>
        <p className="text-sm text-gray-400">Your conversations</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-10 h-10 text-brand-400" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">No messages yet</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          When you match with someone, you can start a conversation from your Matches tab.
        </p>
        <button
          onClick={() => router.push('/matches')}
          className="px-6 py-3 bg-brand-500 text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform"
        >
          View Matches
        </button>
      </div>

      <Navigation />
    </div>
  );
}
