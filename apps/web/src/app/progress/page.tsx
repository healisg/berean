'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, type PracticeSession } from '@/lib/supabase';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score * 10}%` }} />
      </div>
      <span className={`text-xs font-bold w-6 text-right ${score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
        {score}
      </span>
    </div>
  );
}

function ScoreChart({ sessions }: { sessions: PracticeSession[] }) {
  if (sessions.length < 2) return null;
  const sorted = [...sessions].sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
  const w = 400;
  const h = 80;
  const pad = 8;
  const xs = sorted.map((_, i) => pad + (i / (sorted.length - 1)) * (w - pad * 2));
  const ys = sorted.map((s) => h - pad - ((s.score - 1) / 9) * (h - pad * 2));
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <polyline points={polyline} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill="#f59e0b" />
      ))}
    </svg>
  );
}

function profileLabel(profile: string) {
  const map: Record<string, string> = { 'jehovahs-witness': "Jehovah's Witnesses" };
  return map[profile] ?? profile;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProgressPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return; }
      setUserEmail(data.user.email ?? null);
      supabase
        .from('practice_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data: rows }) => {
          setSessions((rows as PracticeSession[]) ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  const avg = sessions.length ? Math.round(sessions.reduce((s, r) => s + r.score, 0) / sessions.length * 10) / 10 : null;
  const best = sessions.length ? Math.max(...sessions.map((s) => s.score)) : null;
  const trend = sessions.length >= 2
    ? sessions[0].score - sessions[sessions.length - 1].score
    : null;

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">← Home</Link>
            <h1 className="text-white font-bold text-2xl mt-2">My Progress</h1>
            {userEmail && <p className="text-slate-500 text-xs mt-0.5">{userEmail}</p>}
          </div>
          <button onClick={signOut} className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Sign out</button>
        </div>

        {loading && (
          <div className="flex gap-1 justify-center py-20">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-sm mb-1">No sessions recorded yet.</p>
            <p className="text-slate-600 text-xs mb-6">Complete a debate practice session to see your scores here.</p>
            <Link
              href="/profiles/jehovahs-witness/practice"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
            >
              Start Practice
            </Link>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Average Score', value: avg, suffix: '/10' },
                { label: 'Best Score', value: best, suffix: '/10' },
                { label: 'Sessions', value: sessions.length, suffix: '' },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <p className="text-amber-400 font-bold text-2xl">{value}<span className="text-slate-600 text-sm">{suffix}</span></p>
                  <p className="text-slate-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Trend */}
            {trend !== null && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
                <span className={`text-lg ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
                </span>
                <p className="text-slate-300 text-sm">
                  {trend > 0
                    ? `You've improved by ${trend} point${trend !== 1 ? 's' : ''} since your first session.`
                    : trend < 0
                    ? `Your score is down ${Math.abs(trend)} point${Math.abs(trend) !== 1 ? 's' : ''} from your first session — keep practising.`
                    : 'Your score is consistent across sessions.'}
                </p>
              </div>
            )}

            {/* Chart */}
            {sessions.length >= 2 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 pt-4 pb-3 mb-6">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">Score Over Time</p>
                <ScoreChart sessions={[...sessions].reverse()} />
                <div className="flex justify-between mt-1">
                  <span className="text-slate-700 text-xs">{formatDate(sessions[sessions.length - 1].created_at!)}</span>
                  <span className="text-slate-700 text-xs">{formatDate(sessions[0].created_at!)}</span>
                </div>
              </div>
            )}

            {/* Session list */}
            <h2 className="text-white font-semibold text-sm mb-3">Session History</h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id!)}
                    className="w-full px-4 py-4 flex items-center gap-4 text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      s.score >= 8 ? 'bg-emerald-500/15 text-emerald-400' : s.score >= 6 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                    }`}>
                      {s.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{s.score_label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{profileLabel(s.profile)} · {formatDate(s.created_at!)} · {s.message_count} exchanges</p>
                    </div>
                    <span className="text-slate-600 text-xs">{expanded === s.id ? '▲' : '▼'}</span>
                  </button>

                  {expanded === s.id && (
                    <div className="border-t border-slate-800 px-4 py-4 space-y-4">
                      <div>
                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-1">Strongest Moment</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{s.strongest_moment}</p>
                      </div>
                      {s.gaps?.length > 0 && (
                        <div>
                          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-2">Gaps Identified</p>
                          <ul className="space-y-1">
                            {s.gaps.map((g, i) => (
                              <li key={i} className="text-slate-400 text-sm flex gap-2">
                                <span className="text-slate-600 shrink-0">•</span>
                                {g.issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div>
                        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-1">Focus Area</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{s.focus_area}</p>
                      </div>
                      <ScoreBar score={s.score} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
