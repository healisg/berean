import Link from 'next/link';
import { jwProfile } from '@/lib/jw-profile';

export default function JWProfilePage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = searchParams.level ?? 'beginner';

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/profiles?level=${level}`}
          className="text-slate-500 hover:text-slate-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors"
        >
          ← Back to profiles
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
            Opponent Profile
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">{jwProfile.name}</h1>
          <p className="text-slate-500 text-sm">{jwProfile.organization}</p>
          <p className="text-slate-400 mt-4 leading-relaxed">{jwProfile.overview}</p>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <Link
            href={`/profiles/jehovahs-witness/chat?level=${level}`}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl px-5 py-3 text-center transition-colors text-sm"
          >
            ⚡ Live Conversation
          </Link>
          <Link
            href={`/profiles/jehovahs-witness/practice?level=${level}`}
            className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold rounded-xl px-5 py-3 text-center transition-colors text-sm"
          >
            🎯 Debate Practice
          </Link>
          <Link
            href={`/profiles/jehovahs-witness/counterarguments?level=${level}`}
            className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold rounded-xl px-5 py-3 text-center transition-colors text-sm"
          >
            🔁 Counterarguments
          </Link>
          <button className="bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-xl px-5 py-3 text-center text-sm opacity-60 cursor-not-allowed">
            📖 Study Mode (soon)
          </button>
        </div>

        {/* Doctrines */}
        <h2 className="text-white font-bold text-xl mb-4">Key Doctrinal Differences</h2>
        <div className="grid gap-6">
          {jwProfile.doctrines.map((doctrine) => (
            <div
              key={doctrine.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-amber-400 font-semibold text-lg mb-1">{doctrine.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{doctrine.summary}</p>

              {/* NWT Issue */}
              {doctrine.nwtIssue && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-3 mb-4">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-1">
                    NWT Translation Issue
                  </p>
                  <p className="text-red-200 text-sm">{doctrine.nwtIssue}</p>
                </div>
              )}

              {/* Talking Points */}
              <div className="mb-4">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
                  Talking Points
                </p>
                <ul className="space-y-2">
                  {doctrine.talkingPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                      <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scriptures */}
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">
                  Key Scriptures
                </p>
                <div className="space-y-2">
                  {doctrine.scriptures.map((s, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg px-3 py-2">
                      <span className="text-amber-400 text-xs font-semibold">{s.ref} ({s.translation}) </span>
                      <span className="text-slate-300 text-sm italic">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
