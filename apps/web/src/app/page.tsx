import Link from 'next/link';

const levels = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'New to apologetics. I need step-by-step guidance and simple explanations.',
    icon: '✦',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Some experience. I want structured talking points with theological depth.',
    icon: '✦✦',
  },
  {
    id: 'experienced',
    label: 'Experienced',
    description: 'Seasoned apologist. Give me concise, advanced arguments and full doctrine breakdowns.',
    icon: '✦✦✦',
  },
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            Acts 17:11
          </p>
          <h1 className="text-5xl font-bold text-white mb-4">Berean</h1>
          <p className="text-slate-400 text-lg">
            Equipping Christians to engage, defend, and share the faith.
          </p>
        </div>

        <p className="text-slate-300 text-center mb-8 font-medium">
          Select your experience level to get started
        </p>

        <div className="grid gap-4">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/profiles?level=${level.id}`}
              className="group block bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-xl p-6 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-amber-400 text-lg mt-0.5">{level.icon}</span>
                <div>
                  <h2 className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">
                    {level.label}
                  </h2>
                  <p className="text-slate-400 mt-1 text-sm leading-relaxed">
                    {level.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-10">
          "Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have." — 1 Peter 3:15
        </p>
      </div>
    </main>
  );
}
