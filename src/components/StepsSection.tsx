'use client';

import { Link2, Puzzle, Target, MessageCircle } from 'lucide-react';

export default function StepsSection() {
  const steps = [
    {
      icon: Link2,
      title: 'Import Your Path',
      description: 'Bring in your favorite YouTube channels or specific educational playlists to start your transformation.',
    },
    {
      icon: Puzzle,
      title: 'Semantic Organization',
      description: 'Our system transforms isolated videos into a structured, SEO-optimized academy that follows a logical sequence.',
    },
    {
      icon: Target,
      title: 'Master the Content',
      description: 'Use integrated note-taking tools and direct 1:1 "concept clearing" sessions with creators to ensure you never stay stuck.',
    },
    {
      icon: MessageCircle,
      title: 'Discussion with Peers',
      description: 'Engage in discussions to find blind spots in your learning.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-20 right-20 w-24 h-24 opacity-10">
        <path d="M 40 90 Q 65 60 90 90 Q 115 120 140 90" stroke="#71C6D9" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M 40 90 Q 65 120 90 90 Q 115 60 140 90" stroke="#71C6D9" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <circle cx="40" cy="90" r="8" fill="#71C6D9"/>
        <circle cx="140" cy="90" r="8" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-24 left-16 w-20 h-20 opacity-10">
        <circle cx="75" cy="75" r="55" stroke="#71C6D9" strokeWidth="6" fill="none" strokeDasharray="12 8"/>
        <circle cx="75" cy="20" r="7" fill="#71C6D9"/>
      </svg>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-slate-900">
          From Video to Value in{' '}
          <span className="font-handwriting text-brand-blue">4 Steps</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-brand-light to-white border border-slate-200 rounded-xl p-6 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white border-2 border-brand-blue/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-blue" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
