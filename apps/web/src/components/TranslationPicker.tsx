'use client';

import { useState, useRef, useEffect } from 'react';
import { TRANSLATIONS, type Translation } from '@/lib/translations';

interface TranslationPickerProps {
  selected: Translation;
  onChange: (t: Translation) => void;
}

export function TranslationPicker({ selected, onChange }: TranslationPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
      >
        <span className="text-amber-400">{selected.abbreviation}</span>
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden">
          <p className="text-slate-500 text-xs px-3 pt-3 pb-1 uppercase tracking-wide font-semibold">
            Bible Translation
          </p>
          {TRANSLATIONS.map((t) => {
            const isSelected = t.id === selected.id;
            const isUnavailable = t.source === 'esv' && !process.env.NEXT_PUBLIC_ESV_AVAILABLE;
            return (
              <button
                key={t.id}
                disabled={isUnavailable}
                onClick={() => { onChange(t); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-amber-500/10 text-white'
                    : isUnavailable
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <span className={`font-semibold text-sm ${isSelected ? 'text-amber-400' : ''}`}>
                    {t.abbreviation}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">{t.name}</span>
                </div>
                {isSelected && <span className="text-amber-400 text-xs">✓</span>}
                {isUnavailable && <span className="text-slate-600 text-xs">key needed</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
