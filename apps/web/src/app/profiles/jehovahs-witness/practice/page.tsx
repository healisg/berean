'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Gap {
  moment: string;
  issue: string;
  betterResponse: string;
}

interface Evaluation {
  score: number;
  scoreLabel: string;
  strongestMoment: string;
  gaps: Gap[];
  focusArea: string;
}

function scoreColor(score: number) {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(score: number) {
  if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/30';
  if (score >= 6) return 'bg-amber-500/10 border-amber-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

const STARTERS = [
  'Good morning! We\'re sharing something wonderful from the Bible today. Do you have a moment?',
  'I\'d like to show you what the Bible really says about God\'s name. Did you know God has a personal name?',
  'The Bible teaches that Jesus is God\'s Son — not God himself. Can I show you some scriptures?',
  'We believe the Trinity is a man-made doctrine not found in the Bible. Would you like to discuss that?',
];

export default function PracticePage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = searchParams.level ?? 'beginner';
  const PRACTICE_KEY = 'berean_practice_jw';

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(PRACTICE_KEY) ?? '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(PRACTICE_KEY + '_ended') === 'true';
  });
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [evalError, setEvalError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    try { localStorage.setItem(PRACTICE_KEY + '_ended', String(sessionEnded)); } catch {}
  }, [sessionEnded]);

  // If the page reloads into an ended session with no evaluation, auto-retry
  useEffect(() => {
    if (sessionEnded && messages.length >= 2 && !evaluation && !evaluating) {
      endSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, evaluation]);

  async function send() {
    if (!input.trim() || loading || sessionEnded) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage, history: messages, profile: 'jehovahs-witness' }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function endSession() {
    if (messages.length < 2 || evaluating) return;
    setSessionEnded(true);
    setEvaluating(true);
    setEvalError(false);
    setEvaluation(null);

    try {
      const res = await fetch('/api/practice/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages }),
      });
      const data = await res.json();
      if (data.error) {
        setEvalError(true);
      } else {
        setEvaluation(data);
        // Save to Supabase if signed in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('practice_sessions').insert({
            user_id: user.id,
            profile: 'jehovahs-witness',
            score: data.score,
            score_label: data.scoreLabel,
            strongest_moment: data.strongestMoment,
            gaps: data.gaps,
            focus_area: data.focusArea,
            message_count: Math.floor(messages.length / 2),
          });
        }
      }
    } catch {
      setEvalError(true);
    } finally {
      setEvaluating(false);
    }
  }

  function restart() {
    setMessages([]);
    setInput('');
    setSessionEnded(false);
    setEvaluating(false);
    setEvaluation(null);
    setEvalError(false);
    try {
      localStorage.removeItem(PRACTICE_KEY);
      localStorage.removeItem(PRACTICE_KEY + '_ended');
    } catch {}
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-3 flex items-center gap-4 shrink-0">
        <Link
          href={`/profiles/jehovahs-witness?level=${level}`}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-white font-semibold text-sm">Debate Practice</h1>
          <p className="text-slate-500 text-xs">Jehovah&apos;s Witnesses · AI in role</p>
        </div>
        {messages.length >= 2 && !sessionEnded && (
          <button
            onClick={endSession}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 rounded-full transition-colors font-medium"
          >
            End &amp; Get Feedback
          </button>
        )}
        {sessionEnded && (
          <button
            onClick={restart}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-full transition-colors"
          >
            New Session
          </button>
        )}
        <Link href="/progress" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
          My Progress
        </Link>
        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-1 rounded-full shrink-0">
          Practice
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto">
            <div className="bg-slate-900 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-1">How this works</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                The AI will play the role of a Jehovah&apos;s Witness. Respond as you would in a real conversation.
                When you&apos;re done, click <span className="text-red-400 font-medium">End &amp; Get Feedback</span> for a full coaching report.
              </p>
            </div>
            <p className="text-slate-500 text-sm text-center mb-4">Start with one of these opening lines from the JW:</p>
            <div className="grid gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setMessages([{ role: 'assistant', content: s }]);
                  }}
                  className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm transition-all"
                >
                  <span className="text-blue-400 text-xs font-semibold mr-2">JW:</span>{s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center mr-2 mt-1 shrink-0 font-bold">
                  JW
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center mr-2 mt-1 shrink-0 font-bold">
                JW
              </span>
              <div className="bg-slate-800 rounded-2xl px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          {/* Evaluation */}
          {sessionEnded && (
            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="text-slate-500 text-xs text-center uppercase tracking-widest mb-6">— Session ended —</p>

              {evaluating && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-slate-400 text-sm mb-3">Berean is reviewing your session…</p>
                  <span className="flex gap-1 justify-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              )}

              {evalError && (
                <div className="bg-red-950/30 border border-red-900/40 rounded-2xl p-6 text-center space-y-3">
                  <p className="text-red-400 text-sm">Could not load feedback. Your conversation is still intact.</p>
                  <button
                    onClick={endSession}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {evaluation && !evaluating && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className={`border rounded-2xl p-5 ${scoreBg(evaluation.score)}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-5xl font-bold ${scoreColor(evaluation.score)}`}>
                        {evaluation.score}<span className="text-2xl text-slate-600">/10</span>
                      </span>
                      <div>
                        <p className={`font-semibold ${scoreColor(evaluation.score)}`}>{evaluation.scoreLabel}</p>
                        <p className="text-slate-500 text-xs mt-0.5">Overall apologetic effectiveness</p>
                      </div>
                    </div>
                  </div>

                  {/* Strongest moment */}
                  <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-5">
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-2">Strongest Moment</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{evaluation.strongestMoment}</p>
                  </div>

                  {/* Gaps */}
                  {evaluation.gaps.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                      <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide mb-4">Gaps &amp; Missed Opportunities</p>
                      <div className="space-y-5">
                        {evaluation.gaps.map((gap, i) => (
                          <div key={i} className="border-l-2 border-slate-700 pl-4">
                            <p className="text-slate-400 text-xs italic mb-1">{gap.moment}</p>
                            <p className="text-slate-300 text-sm mb-3">{gap.issue}</p>
                            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                              <p className="text-emerald-400 text-xs font-semibold mb-1">Better response:</p>
                              <p className="text-slate-300 text-sm leading-relaxed">{gap.betterResponse}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus area */}
                  <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-5">
                    <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-2">Focus Area for Next Session</p>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      <ReactMarkdown>{evaluation.focusArea}</ReactMarkdown>
                    </p>
                  </div>

                  <button
                    onClick={restart}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl py-3 text-sm transition-colors"
                  >
                    Start New Session
                  </button>
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      {!sessionEnded && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 shrink-0">
          <div className="max-w-2xl mx-auto flex gap-3">
            <textarea
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm resize-none outline-none placeholder-slate-600 transition-colors"
              placeholder={messages.length === 0 ? 'Choose an opening above to begin…' : 'Your response…'}
              rows={2}
              value={input}
              disabled={messages.length === 0}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim() || messages.length === 0}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl px-5 py-3 text-sm transition-colors shrink-0"
            >
              Send
            </button>
          </div>
          <p className="text-slate-700 text-xs text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      )}
    </div>
  );
}
