'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pin, PinOff, Plus, Search, Trash2, NotebookPen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Note } from '@/lib/types';
import { newId, useStore } from '@/lib/store';

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NotesPage() {
  const { data, update, hydrated } = useStore();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody]   = useState('');
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...data.notes];
    list.sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    if (!q) return list;
    return list.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [data.notes, query]);

  function openNew() {
    const n: Note = {
      id: newId(),
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditing(n);
    setTitle('');
    setBody('');
  }

  function openEdit(n: Note) {
    setEditing(n);
    setTitle(n.title);
    setBody(n.body);
  }

  function save() {
    if (!editing) return;
    const trimmedTitle = title.trim();
    const trimmedBody  = body.trim();
    // If both empty, discard
    if (!trimmedTitle && !trimmedBody) {
      setEditing(null);
      return;
    }
    const isNew = !data.notes.some((n) => n.id === editing.id);
    const updated: Note = {
      ...editing,
      title: trimmedTitle || 'Untitled',
      body: trimmedBody,
      updatedAt: new Date().toISOString(),
    };
    update((d) => ({
      ...d,
      notes: isNew ? [updated, ...d.notes] : d.notes.map((n) => (n.id === updated.id ? updated : n)),
    }));
    setEditing(null);
  }

  function remove(id: string) {
    update((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }));
    if (editing?.id === id) setEditing(null);
  }

  function togglePin(id: string) {
    update((d) => ({
      ...d,
      notes: d.notes.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }

  useEffect(() => {
    if (editing && !title && bodyRef.current) {
      // focus body when adding a brand-new note
    }
  }, [editing, title]);

  if (!hydrated) return null;

  return (
    <>
      <Header
        title="Notes"
        subtitle={`${data.notes.length} ${data.notes.length === 1 ? 'note' : 'notes'}`}
        right={
          <button
            onClick={openNew}
            className="w-10 h-10 rounded-full bg-brand-600 text-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
            aria-label="New note"
          >
            <Plus className="w-5 h-5" strokeWidth={2.6} />
          </button>
        }
      />

      <div className="px-5">
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-ink-100 text-sm focus:border-brand-400 outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-ink-200">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-3">
              <NotebookPen className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-ink-900">
              {data.notes.length === 0 ? 'No notes yet' : 'No matches'}
            </h3>
            <p className="text-sm text-ink-500 mt-1">
              {data.notes.length === 0
                ? 'Jot down a thought, a quote, an idea.'
                : 'Try a different search term.'}
            </p>
            {data.notes.length === 0 && (
              <button
                onClick={openNew}
                className="mt-4 inline-flex items-center gap-1.5 bg-brand-600 text-white font-bold text-sm px-4 py-2.5 rounded-2xl active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" /> New note
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => openEdit(n)}
                className="card-enter group bg-white rounded-2xl p-4 shadow-card border border-ink-100/60 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {n.pinned && <Pin className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />}
                      <p className="font-bold text-ink-900 text-sm truncate">{n.title}</p>
                    </div>
                    {n.body && (
                      <p className="text-sm text-ink-600 mt-1 line-clamp-2 whitespace-pre-wrap">{n.body}</p>
                    )}
                    <p className="text-[11px] text-ink-400 mt-2">{formatWhen(n.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(n.id); }}
                    className="w-8 h-8 rounded-lg text-ink-400 hover:text-brand-600 flex items-center justify-center"
                    aria-label={n.pinned ? 'Unpin' : 'Pin'}
                  >
                    {n.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!editing} onClose={save} title={editing && data.notes.some((n) => n.id === editing.id) ? 'Edit note' : 'New note'}>
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-xl font-bold text-ink-900 bg-transparent px-1 py-2 border-b border-ink-100 focus:border-brand-400 outline-none"
          />
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Start writing…"
            rows={10}
            className="w-full text-base text-ink-900 bg-transparent px-1 py-2 outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between pt-2">
            {editing && data.notes.some((n) => n.id === editing.id) ? (
              <button
                onClick={() => editing && remove(editing.id)}
                className="text-sm font-semibold text-red-500 inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : <span />}
            <button
              onClick={save}
              className="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-2xl text-sm active:scale-95 transition-transform"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
