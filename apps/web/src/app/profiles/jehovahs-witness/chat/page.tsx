'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ScriptureModal } from '@/components/ScriptureModal';
import { LexiconPopover } from '@/components/LexiconPopover';
import { TranslationPicker } from '@/components/TranslationPicker';
import { SCRIPTURE_REGEX } from '@/lib/scripture-utils';
import { linkifyLexicon } from '@/lib/lexicon';
import { getTranslation, DEFAULT_TRANSLATION_ID, STORAGE_KEY, type Translation } from '@/lib/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function linkifyScriptures(text: string): string {
  SCRIPTURE_REGEX.lastIndex = 0;
  return text.replace(SCRIPTURE_REGEX, (match) => `[${match}](scripture:${encodeURIComponent(match)})`);
}

function prepareMessage(text: string): string {
  return linkifyLexicon(linkifyScriptures(text));
}

const CHAT_HISTORY_KEY = 'berean_chat_jw';

export default function ChatPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = (searchParams.level ?? 'beginner') as string;
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeScripture, setActiveScripture] = useState<string | null>(null);
  const [translation, setTranslation] = useState<Translation>(() => getTranslation(DEFAULT_TRANSLATION_ID));
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const openScripture = useCallback((ref: string) => setActiveScripture(ref), []);
  const closeScripture = useCallback(() => setActiveScripture(null), []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  function clearHistory() {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setTranslation(getTranslation(saved));
  }, []);

  function handleTranslationChange(t: Translation) {
    setTranslation(t);
    localStorage.setItem(STORAGE_KEY, t.id);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const levelLabel: Record<string, string> = {
    beginner: 'Beginner',
    moderate: 'Moderate',
    experienced: 'Experienced',
  };

  async function send() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          level,
          opponentProfile: 'jehovahs-witness',
          history: messages,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      // Add an empty assistant bubble to stream text into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User stopped — remove any partial assistant reply and restore the input
        setMessages((prev) => {
          const withoutAssistant =
            prev[prev.length - 1]?.role === 'assistant' ? prev.slice(0, -1) : prev;
          return withoutAssistant.slice(0, -1); // remove the user message too
        });
        setInput(userMessage);
      } else {
        setMessages((prev) => {
          const errorMsg: Message = { role: 'assistant', content: 'Something went wrong. Please try again.' };
          const last = prev[prev.length - 1];
          // Replace empty streaming bubble if present, otherwise append
          return last?.role === 'assistant' && !last.content
            ? [...prev.slice(0, -1), errorMsg]
            : [...prev, errorMsg];
        });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  const starters = [
    'They said Jesus is Michael the archangel. What should I say?',
    'They showed me John 1:1 from their Bible. How do I respond?',
    'They said the Trinity is a pagan teaching. How do I address this?',
    'They claim only 144,000 go to heaven. What does the Bible really say?',
  ];

  const markdownComponents = {
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (href?.startsWith('scripture:')) {
        const ref = decodeURIComponent(href.replace('scripture:', ''));
        return (
          <button
            onClick={() => openScripture(ref)}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/50 hover:decoration-amber-300 font-medium transition-colors cursor-pointer"
          >
            {children}
          </button>
        );
      }
      if (href?.startsWith('lexicon:')) {
        const word = decodeURIComponent(href.replace('lexicon:', ''));
        return <LexiconPopover word={word}>{children}</LexiconPopover>;
      }
      return <a href={href} className="text-amber-400 underline">{children}</a>;
    },
    p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic text-slate-300">{children}</em>,
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-300">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-sm font-bold text-amber-400 mt-3 mb-1 uppercase tracking-wide">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-sm font-semibold text-white mt-2 mb-1">{children}</h3>,
    hr: () => <hr className="border-slate-600 my-3" />,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-amber-500 pl-3 my-2 text-slate-400 italic">{children}</blockquote>
    ),
  };

  return (
    <div className="flex flex-col h-screen">
      {activeScripture && (
        <ScriptureModal reference={activeScripture} translationId={translation.id} onClose={closeScripture} />
      )}

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-3 flex items-center gap-4 shrink-0">
        <Link
          href={`/profiles/jehovahs-witness?level=${level}`}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-white font-semibold text-sm">Live Conversation</h1>
          <p className="text-slate-500 text-xs">Jehovah&apos;s Witnesses · {levelLabel[level]}</p>
        </div>
        <TranslationPicker selected={translation} onChange={handleTranslationChange} />
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2 py-1 rounded-full">
          AI Active
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto">
            <p className="text-slate-500 text-sm text-center mb-6">
              Type what they just said, or start with one of these:
            </p>
            <div className="grid gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center mr-2 mt-1 shrink-0 font-bold">
                  B
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={markdownComponents}
                    urlTransform={(url) => url}
                  >
                    {prepareMessage(msg.content)}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {/* Show dots only while waiting for the first chunk — once the assistant bubble appears they hide */}
          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center mr-2 mt-1 shrink-0 font-bold">
                B
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
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-3">
          <textarea
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm resize-none outline-none placeholder-slate-600 transition-colors"
            placeholder="What did they just say? Or ask for help with a specific argument…"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          {loading ? (
            <button
              onClick={stop}
              className="bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors shrink-0"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={send}
              disabled={!input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-xl px-5 py-3 text-sm transition-colors shrink-0"
            >
              Send
            </button>
          )}
        </div>
        <p className="text-slate-700 text-xs text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
