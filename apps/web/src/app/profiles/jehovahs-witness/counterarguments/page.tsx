'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Objection {
  objection: string;
  why: string;
  response: string;
}

const EXAMPLES = [
  'Jesus is called "the Son of God" — God doesn\'t call himself his own Son. That proves they are separate beings.',
  'In John 1:1, the original Greek says "a god", not "God" — your Bible has been changed.',
  'Jehovah is God\'s personal name and appears over 7,000 times in the original scriptures. Removing it is dishonest.',
  'The Holy Spirit is not a person — it\'s God\'s active force, like electricity. The Bible never says to pray to it.',
];

export default function CounterargumentsPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = searchParams.level ?? 'beginner';

  const [statement, setStatement] = useState('');
  const [loading, setLoading] = useState(false);
  const [objections, setObjections] = useState<Objection[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simulate() {
    if (!statement.trim() || loading) return;
    setLoading(true);
    setObjections(null);
    setError(null);

    try {
      const res = await fetch('/api/counterarguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: statement.trim(), level }),
      });
      const text = await res.text();
      let data: { error?: string; objections?: Objection[] };
      try {
        data = JSON.parse(text);
      } catch {
        setError(`Server returned invalid JSON (status ${res.status}): ${text.slice(0, 200)}`);
        return;
      }
      if (data.error || !data.objections) {
        setError(data.error ?? 'No objections returned');
      } else {
        setObjections(data.objections);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStatement('');
    setObjections(null);
    setError(null);
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/profiles/jehovahs-witness?level=${level}`}
            className="text-slate-500 hover:text-slate-300 text-sm inline-flex items-center gap-1 transition-colors mb-6"
          >
            ← Back to profile
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔁</span>
            <h1 className="text-2xl font-bold text-white">Counterargument Simulator</h1>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Type what you just said to the Jehovah&apos;s Witness. Berean will predict the 3–4 strongest objections they&apos;ll raise next — and show you how to respond to each one.
          </p>
        </div>

        {/* Input area */}
        {!objections && (
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide block mb-2">
                What did you just say to them?
              </label>
              <textarea
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm resize-none outline-none placeholder-slate-600 transition-colors leading-relaxed"
                placeholder="e.g. &quot;Jesus is called the Son of God, which proves he and the Father are distinct persons within one God...&quot;"
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) simulate();
                }}
              />
              <p className="text-slate-700 text-xs mt-1.5">⌘ + Enter to simulate</p>
            </div>

            {/* Example prompts */}
            {!statement && (
              <div>
                <p className="text-slate-600 text-xs uppercase tracking-wide font-semibold mb-2">Or try an example:</p>
                <div className="grid gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setStatement(ex)}
                      className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-4 py-3 text-slate-400 text-sm transition-all"
                    >
                      &ldquo;{ex}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={simulate}
              disabled={!statement.trim() || loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {loading ? 'Simulating…' : 'Simulate objections →'}
            </button>

            {loading && (
              <div className="flex justify-center gap-1.5 py-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {error && (
              <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                <p className="text-red-400 text-xs font-mono break-all">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {objections && (
          <div className="space-y-5">
            {/* What you said */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">You said</p>
              <p className="text-slate-300 text-sm leading-relaxed italic">&ldquo;{statement}&rdquo;</p>
            </div>

            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide">
              Expect these objections next:
            </p>

            {objections.map((obj, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Objection */}
                <div className="px-5 py-4 border-b border-slate-800">
                  <div className="flex gap-3 items-start">
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5">
                      JW {i + 1}
                    </span>
                    <p className="text-white text-sm leading-relaxed font-medium">&ldquo;{obj.objection}&rdquo;</p>
                  </div>
                  {obj.why && (
                    <p className="text-slate-500 text-xs leading-relaxed mt-2 pl-10">{obj.why}</p>
                  )}
                </div>

                {/* Response */}
                <div className="px-5 py-4 bg-slate-800/30">
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-2">Your response</p>
                  <p className="text-slate-200 text-sm leading-relaxed">{obj.response}</p>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl py-3 text-sm transition-colors"
              >
                Try another statement
              </button>
              <Link
                href={`/profiles/jehovahs-witness/practice?level=${level}`}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl py-3 text-sm transition-colors text-center"
              >
                Practice in full conversation →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
