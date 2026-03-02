'use client';

export default function SolutionSection() {
  const structure = [
    {
      title: 'Sections',
      description: 'Organize by subject',
      example: 'Philosophy, Psychology',
      svg: (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M 25 35 L 55 35 L 55 75 L 25 75 Z" stroke="#1a1a1a" strokeWidth="2.5" fill="#CFF1F9" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 65 35 L 95 35 L 95 75 L 65 75 Z" stroke="#1a1a1a" strokeWidth="2.5" fill="#CFF1F9" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="28" y="42" width="22" height="3" rx="1" fill="#71C6D9"/>
          <rect x="28" y="50" width="18" height="2" rx="1" fill="#71C6D9"/>
          <rect x="68" y="42" width="22" height="3" rx="1" fill="#71C6D9"/>
          <rect x="68" y="50" width="18" height="2" rx="1" fill="#71C6D9"/>
          <path d="M 25 85 L 55 85 L 53 92 L 27 92 Z" fill="#71C6D9" stroke="#1a1a1a" strokeWidth="2"/>
          <path d="M 65 85 L 95 85 L 93 92 L 67 92 Z" fill="#71C6D9" stroke="#1a1a1a" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: 'knots',
      description: 'Group related topics',
      example: 'Existentialism',
      svg: (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M 32 28 L 88 28 L 88 95 L 32 95 Z" stroke="#1a1a1a" strokeWidth="2.5" fill="#CFF1F9" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 40 40 L 80 40" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 40 52 L 75 52" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 40 64 L 78 64" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 40 76 L 70 76" stroke="#71C6D9" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="42" cy="40" r="2" fill="#1a1a1a"/>
          <circle cx="42" cy="52" r="2" fill="#1a1a1a"/>
          <circle cx="42" cy="64" r="2" fill="#1a1a1a"/>
          <circle cx="42" cy="76" r="2" fill="#1a1a1a"/>
        </svg>
      )
    },
    {
      title: 'Loops',
      description: 'Individual lessons',
      example: 'Sartre\'s Freedom',
      svg: (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M 28 35 L 92 35 L 92 80 L 28 80 Z" stroke="#1a1a1a" strokeWidth="2.5" fill="#CFF1F9" strokeLinecap="round" strokeLinejoin="round"/>
          <polygon points="50,52 50,68 68,60" fill="#71C6D9" stroke="#1a1a1a" strokeWidth="1.5"/>
          <circle cx="60" cy="98" r="10" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
          <path d="M 52 98 L 68 98" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-brand-light relative overflow-hidden">
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/4 right-5 w-28 h-28 opacity-10">
        <path d="M 40 90 Q 60 50 90 90 Q 120 130 140 90" stroke="#71C6D9" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <path d="M 40 90 Q 60 130 90 90 Q 120 50 140 90" stroke="#71C6D9" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="90" r="9" fill="#71C6D9"/>
        <circle cx="140" cy="90" r="9" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-10 left-8 w-24 h-24 opacity-15">
        <circle cx="70" cy="70" r="50" stroke="#71C6D9" strokeWidth="7" fill="none"/>
        <circle cx="70" cy="20" r="7" fill="#71C6D9"/>
      </svg>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
            A semantic structure for learning
          </h2>
          <p className="text-lg font-handwriting text-brand-blue mb-6">
            Three simple layers ↓
          </p>
          <p className="text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Transform your YouTube channel into an organized, searchable learning academy
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          {structure.map((item, index) => (
            <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-32 h-32 mx-auto mb-6">
                {item.svg}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 mb-2">{item.description}</p>
              <p className="text-xs text-slate-500 font-handwriting italic">{item.example}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border-4 border-brand-blue rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-serif text-slate-900 mb-4">
            Own your platform. Build your brand.
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Stop building YouTube's authority. Create your own learning ecosystem with complete control.
          </p>
        </div>
      </div>
    </section>
  );
}
