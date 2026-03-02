'use client';

export default function FeaturesSection() {
  const creatorFeatures = [
    { title: 'Custom subdomain', description: 'yourname.knotsloop.com' },
    { title: 'Analytics dashboard', description: 'Track progress and engagement' },
    { title: 'Direct connection', description: 'Own your audience relationships' },
    { title: 'Blind spot discovery', description: 'Community feedback reveals gaps in content you didn\'t know existed' }
  ];

  const studentFeatures = [
    { title: 'Distraction-free', description: 'No recommendations or endless scrolling' },
    { title: 'Progress tracking', description: 'Visual learning journey' },
    { title: 'Meaningful reports', description: 'Real progress over certificates' },
    { title: 'Blind spot discovery', description: 'Community discussions expose the "unknown unknowns" in your learning' }
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/3 left-10 w-24 h-24 opacity-10">
        <circle cx="80" cy="80" r="55" stroke="#71C6D9" strokeWidth="8" fill="none" strokeDasharray="12 8"/>
        <circle cx="80" cy="25" r="8" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 190 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-20 right-12 w-32 h-20 opacity-12">
        <path d="M 30 50 Q 65 15 95 50 Q 125 85 160 50" stroke="#71C6D9" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="50" r="6" fill="#71C6D9"/>
        <circle cx="160" cy="50" r="6" fill="#71C6D9"/>
      </svg>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
          Built for creators and students
        </h2>
        <p className="text-center font-handwriting text-brand-blue text-xl mb-16">
          (everyone wins!)
        </p>

        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <div className="mb-8">
              <svg viewBox="0 0 250 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-auto mx-auto">
                <ellipse cx="125" cy="60" rx="45" ry="52" fill="#1a1a1a"/>
                <path d="M 95 50 Q 85 45 75 52" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="125" cy="100" rx="52" ry="48" fill="#fff" stroke="#1a1a1a" strokeWidth="2.5"/>
                <circle cx="110" cy="95" r="4" fill="#1a1a1a"/>
                <circle cx="140" cy="95" r="4" fill="#1a1a1a"/>
                <path d="M 115 115 Q 125 120 135 115" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <ellipse cx="105" cy="100" rx="9" ry="13" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
                <ellipse cx="145" cy="100" rx="9" ry="13" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
                <path d="M 125 148 Q 105 163 95 190 L 90 240" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 125 148 Q 145 163 155 190 L 160 240" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 100 175 Q 70 180 55 195 L 40 220" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 150 175 Q 180 180 195 195 L 210 220" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <rect x="30" y="210" width="55" height="40" rx="3" fill="#CFF1F9" stroke="#1a1a1a" strokeWidth="2"/>
                <rect x="38" y="222" width="40" height="6" rx="2" fill="#71C6D9"/>
                <rect x="38" y="232" width="35" height="5" rx="2" fill="#71C6D9"/>
                <path d="M 165 210 L 180 198 L 195 210" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M 175 205 L 175 225" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 90 240 Q 95 265 105 272" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 160 240 Q 155 265 145 272" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="110" cy="278" rx="13" ry="19" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="140" cy="278" rx="13" ry="19" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-brand-light text-center">
              For Creators
            </h3>
            <div className="space-y-5">
              {creatorFeatures.map((feature, index) => (
                <div key={index} className="bg-brand-light bg-opacity-30 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-slate-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <svg viewBox="0 0 250 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-auto mx-auto">
                <ellipse cx="125" cy="55" rx="48" ry="55" fill="#1a1a1a"/>
                <path d="M 155 45 Q 165 40 175 47" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="125" cy="100" rx="55" ry="50" fill="#fff" stroke="#1a1a1a" strokeWidth="2.5"/>
                <path d="M 107 92 Q 102 87 97 92" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M 143 92 Q 148 87 153 92" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="107" cy="100" r="5" fill="#1a1a1a"/>
                <circle cx="143" cy="100" r="5" fill="#1a1a1a"/>
                <path d="M 115 118 Q 125 123 135 118" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M 125 150 Q 105 165 95 195 L 88 245" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 125 150 Q 145 165 155 195 L 162 245" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 100 178 Q 70 183 55 198 L 38 228" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 150 178 Q 180 183 195 198 L 212 228" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <rect x="30" y="218" width="60" height="45" rx="3" fill="#CFF1F9" stroke="#1a1a1a" strokeWidth="2"/>
                <rect x="38" y="228" width="44" height="5" rx="2" fill="#71C6D9"/>
                <rect x="38" y="238" width="38" height="4" rx="2" fill="#71C6D9"/>
                <rect x="38" y="247" width="40" height="4" rx="2" fill="#71C6D9"/>
                <path d="M 88 245 Q 93 268 103 276" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M 162 245 Q 157 268 147 276" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="108" cy="283" rx="14" ry="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
                <ellipse cx="142" cy="283" rx="14" ry="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-brand-light text-center">
              For Students
            </h3>
            <div className="space-y-5">
              {studentFeatures.map((feature, index) => (
                <div key={index} className="bg-brand-light bg-opacity-30 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-slate-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
