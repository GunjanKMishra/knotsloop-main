import { useState } from 'react';
import { Sun, Eye, ChevronDown } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
  onCreateLoop: () => void;
}

export default function Hero({ onJoinWaitlist, onCreateLoop }: HeroProps) {
  const [isLightMode, setIsLightMode] = useState(true);

  return (
    <section className="min-h-screen bg-gray-50 relative">
      {/* Navigation Header */}
      <nav className="px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-brand-blue tracking-wider">KNOTLOOP</span>
        </div>

        <div className="flex items-center gap-10">
          <a href="#home" className="text-slate-900 font-medium hover:text-brand-blue transition-colors">
            Home
          </a>
          <a href="#explore" className="text-slate-500 font-medium hover:text-brand-blue transition-colors">
            Explore
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-gray-200 text-slate-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium flex items-center gap-1">
            En
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Combined Light/Reading Mode Toggle */}
          <div className="flex items-center rounded-lg overflow-hidden">
            <button
              onClick={() => setIsLightMode(true)}
              className={`p-2 transition-all ${
                isLightMode
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-200 text-slate-400'
              }`}
            >
              <Sun className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsLightMode(false)}
              className={`p-2 transition-all ${
                !isLightMode
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-200 text-slate-400'
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onCreateLoop}
            className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-blue mb-4 tracking-tight">
            From Videos to Learning
          </h1>
          <h2 className="text-2xl md:text-3xl font-handwriting text-slate-900 mb-6">
            Knot Your Content into Loops That Teach Better
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed text-base">
            With knotloops, creators can design structured courses using their YouTube content. Learners get clarity, progress tracking, and guided paths. Creators get a professional LMS experience without reinventing their workflow.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onCreateLoop}
              className="px-7 py-3 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md font-medium text-sm"
            >
              Create Your First Loop
            </button>
            <button className="px-7 py-3 bg-gray-300 text-slate-700 rounded-md hover:bg-gray-400 transition-all font-medium text-sm">
              Explore More
            </button>
          </div>
        </div>

        {/* Feature Boxes with Knot Pattern */}
        <img
          src="/feature_and_loops_section.svg"
          alt="Feature diagram showing Structured Loops, Guided Paths, Progress Tracking, and Creator Control connected by knot patterns"
          className="w-full max-w-4xl mx-auto mt-16"
        />
      </div>
    </section>
  );
}
