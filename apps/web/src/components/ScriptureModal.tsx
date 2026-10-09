'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScriptureModalProps {
  reference: string;
  translationId: string;
  onClose: () => void;
}

export function ScriptureModal({ reference, translationId, onClose }: ScriptureModalProps) {
  const [verse, setVerse] = useState<{ text: string; translation: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setVerse(null);
    fetch(`/api/scripture?ref=${encodeURIComponent(reference)}&translation=${translationId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setVerse({ text: data.text, translation: data.translation });
      })
      .catch(() => setError('Failed to load verse'))
      .finally(() => setLoading(false));
  }, [reference, translationId]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-amber-400 font-semibold text-lg">{reference}</h2>
            {verse && (
              <span className="text-slate-500 text-xs">{verse.translation}</span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors ml-4 mt-0.5">
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex gap-1 justify-center py-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center py-4">{error}</p>}

        {verse && !loading && (
          <blockquote className="text-slate-200 text-base leading-relaxed italic border-l-2 border-amber-500 pl-4">
            {verse.text}
          </blockquote>
        )}

        <p className="text-slate-600 text-xs text-center mt-4">Press Esc or click outside to close</p>
      </div>
    </div>
  );
}
