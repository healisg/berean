import Link from 'next/link';

const profiles = [
  {
    id: 'jehovahs-witness',
    name: "Jehovah's Witnesses",
    description: 'Watchtower Society doctrines, NWT issues, Trinity denial, and more.',
    available: true,
  },
  {
    id: 'islam',
    name: 'Islam',
    description: 'Quranic claims about Jesus, the nature of God, and biblical reliability.',
    available: false,
  },
  {
    id: 'unitarian',
    name: 'Unitarianism',
    description: 'Non-Trinitarian theology and the full deity of Christ.',
    available: false,
  },
  {
    id: 'mormonism',
    name: 'Mormonism (LDS)',
    description: 'Additional scriptures, nature of God, and the gospel of grace.',
    available: false,
  },
];

export default function ProfilesPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const level = searchParams.level ?? 'beginner';

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-300 text-sm mb-8 inline-flex items-center gap-1 transition-colors"
        >
          ← Back
        </Link>

        <div className="mb-10">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">
            Step 2 of 2
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">Who are you speaking with?</h1>
          <p className="text-slate-400">
            Select the belief system you are engaging.
          </p>
        </div>

        <div className="grid gap-4">
          {profiles.map((profile) =>
            profile.available ? (
              <Link
                key={profile.id}
                href={`/profiles/${profile.id}?level=${level}`}
                className="group block bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-xl p-6 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">
                      {profile.name}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">{profile.description}</p>
                  </div>
                  <span className="text-slate-600 group-hover:text-amber-400 text-xl transition-colors ml-4">
                    →
                  </span>
                </div>
              </Link>
            ) : (
              <div
                key={profile.id}
                className="block bg-slate-900/50 border border-slate-800 rounded-xl p-6 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-slate-400 font-semibold text-lg">{profile.name}</h2>
                    <p className="text-slate-600 text-sm mt-1">{profile.description}</p>
                  </div>
                  <span className="text-slate-700 text-xs font-medium ml-4">Coming soon</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
