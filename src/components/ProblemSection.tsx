'use client';

export default function ProblemSection() {
  const problems = [
    {
      title: 'Algorithm-driven distractions',
      description: 'YouTube prioritizes retention on their platform, not your learners\' success.'
    },
    {
      title: 'Loss of traffic',
      description: 'When visibility drops, you\'re forced to create content misaligned with your vision.'
    },
    {
      title: 'No brand ownership',
      description: 'You\'re building YouTube\'s authority instead of your own platform.'
    },
    {
      title: 'Lack of structure',
      description: 'Topics taught in isolation make it difficult to follow complete learning paths.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-5 left-5 w-20 h-20 opacity-10">
        <path d="M 30 75 C 30 50 50 30 75 30 C 100 30 120 50 120 75 C 120 100 100 120 75 120 C 50 120 30 100 30 75 Z" stroke="#71C6D9" strokeWidth="6" fill="none"/>
        <circle cx="75" cy="30" r="6" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-10 right-10 w-32 h-16 opacity-15">
        <path d="M 20 50 Q 60 20 100 50 Q 140 80 180 50" stroke="#71C6D9" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="50" r="5" fill="#71C6D9"/>
        <circle cx="180" cy="50" r="5" fill="#71C6D9"/>
      </svg>

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
          The problem with YouTube
        </h2>
        <p className="text-center font-handwriting text-brand-blue text-xl mb-12">
          (you already know this...)
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <svg viewBox="0 0 350 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
              <ellipse cx="175" cy="75" rx="55" ry="60" fill="#1a1a1a"/>
              <path d="M 145 65 Q 130 58 120 65" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
              <ellipse cx="175" cy="115" rx="60" ry="50" fill="#fff" stroke="#1a1a1a" strokeWidth="2.5"/>
              <path d="M 155 108 Q 150 103 145 108" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M 195 108 Q 200 103 205 108" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="155" cy="115" r="5" fill="#1a1a1a"/>
              <circle cx="195" cy="115" r="5" fill="#1a1a1a"/>
              <path d="M 165 135 Q 175 130 185 135" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M 175 165 Q 155 180 145 210 L 140 280" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 175 165 Q 195 180 205 210 L 210 280" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 150 195 Q 120 200 100 215 L 80 245" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 200 195 Q 230 200 250 215 L 270 245" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 140 280 Q 145 310 155 320" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 210 280 Q 205 310 195 320" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <ellipse cx="150" cy="328" rx="14" ry="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
              <ellipse cx="200" cy="328" rx="14" ry="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5"/>
              <path d="M 60 220 L 100 220 L 95 245 L 85 245 L 80 270 L 50 270 Z" fill="#CFF1F9" stroke="#1a1a1a" strokeWidth="2"/>
              <rect x="65" y="230" width="25" height="4" rx="1" fill="#71C6D9"/>
              <rect x="62" y="238" width="30" height="3" rx="1" fill="#71C6D9"/>
              <path d="M 250 220 L 290 220 L 295 245 L 285 245 L 290 270 L 260 270 Z" fill="#CFF1F9" stroke="#1a1a1a" strokeWidth="2"/>
              <rect x="260" y="230" width="25" height="4" rx="1" fill="#71C6D9"/>
              <rect x="258" y="238" width="30" height="3" rx="1" fill="#71C6D9"/>
              <path d="M 120 135 L 105 145 L 115 155 L 100 165" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M 230 135 L 245 145 L 235 155 L 250 165" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <div className="space-y-8">
            {problems.map((problem, index) => (
              <div key={index} className="border-l-4 border-brand-light pl-6">
                <h3 className="text-base font-semibold text-slate-900 mb-1">{problem.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
