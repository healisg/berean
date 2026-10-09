'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface LexiconEntry {
  word: string;
  transliteration: string;
  language: 'greek' | 'hebrew';
  definition: string;
  strongs?: string;
  source: 'dictionary' | 'claude';
}

interface Props {
  word: string;
  children: React.ReactNode;
}

export function LexiconPopover({ word, children }: Props) {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState<LexiconEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

  const fetchEntry = useCallback(async () => {
    if (entry || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/lexicon?word=${encodeURIComponent(word)}`);
      const data = await res.json();
      if (data.error) setError(true);
      else setEntry(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [word, entry, loading]);

  const openPopover = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const w = 288;
    let left = rect.left;
    let top = rect.bottom + 8;
    if (left + w > window.innerWidth - 16) left = window.innerWidth - w - 16;
    if (left < 16) left = 16;
    if (top + 160 > window.innerHeight - 16) top = rect.top - 168;
    setPos({ top, left });
    setOpen(true);
    fetchEntry();
  }, [fetchEntry]);

  const closePopover = useCallback(() => {
    clearTimeout(hoverTimer.current);
    setOpen(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(openPopover, 280);
  }, [openPopover]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimeout(hoverTimer.current);
    if (open) closePopover(); else openPopover();
  }, [open, openPopover, closePopover]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) closePopover();
    };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [open, closePopover]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  return (
    <>
      <button
        ref={btnRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="text-teal-400 hover:text-teal-300 underline underline-offset-2 decoration-teal-500/40 font-medium cursor-pointer"
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4"
          style={{ top: pos.top, left: pos.left }}
          onMouseEnter={() => clearTimeout(hoverTimer.current)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-white font-semibold text-base leading-none">{entry?.word ?? word}</span>
              {entry?.transliteration && (
                <span className="text-slate-400 text-xs ml-2 italic">{entry.transliteration}</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {entry?.strongs && (
                <span className="text-slate-500 text-xs font-mono">{entry.strongs}</span>
              )}
              <button onClick={closePopover} className="text-slate-600 hover:text-slate-400 text-xs leading-none">✕</button>
            </div>
          </div>

          {loading && (
            <div className="flex gap-1 py-2">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}

          {error && !loading && (
            <p className="text-slate-500 text-sm italic">Could not look up this word.</p>
          )}

          {entry && !loading && (
            <>
              <p className="text-slate-200 text-sm leading-relaxed">{entry.definition}</p>
              <p className="text-slate-600 text-xs mt-3">
                {entry.language === 'greek' ? 'Greek' : 'Hebrew'} · {entry.source === 'claude' ? 'AI lookup' : 'Lexicon'}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
