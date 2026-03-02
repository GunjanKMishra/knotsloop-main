'use client';

export default function CoursifySection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-brand-light via-white to-white relative overflow-hidden">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-16 right-12 w-32 h-32 opacity-10">
        <path d="M 50 100 Q 75 60 100 100 Q 125 140 150 100" stroke="#71C6D9" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M 50 100 Q 75 140 100 100 Q 125 60 150 100" stroke="#71C6D9" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="100" r="10" fill="#71C6D9"/>
        <circle cx="150" cy="100" r="10" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-12 left-10 w-28 h-28 opacity-12">
        <circle cx="90" cy="90" r="60" stroke="#71C6D9" strokeWidth="8" fill="none" strokeDasharray="15 10"/>
        <circle cx="90" cy="30" r="9" fill="#71C6D9"/>
      </svg>

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 text-center">
          "Coursify" your content.
        </h2>
        <p className="text-lg text-slate-700 text-center mb-16 max-w-3xl mx-auto">
          We strip away the noise and add the structure you need to actually finish what you start.
        </p>

        <div className="relative mx-auto max-w-5xl">
          <div className="bg-white rounded-3xl p-3 shadow-2xl border-4 border-brand-blue">
            <div className="bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-200">
              <div className="grid md:grid-cols-[2fr,1fr] gap-0">
                <div className="relative bg-white aspect-video flex items-center justify-center p-12 border-r-2 border-slate-200">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-20 h-2 bg-slate-300 rounded-full"></div>
                    <div className="w-12 h-2 bg-slate-200 rounded-full"></div>
                  </div>

                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full border-4 border-brand-blue flex items-center justify-center bg-brand-light">
                      <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-brand-blue border-b-[14px] border-b-transparent ml-1"></div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Semantic CMS Interface</p>
                  </div>
                </div>

                <div className="bg-slate-100 p-6 flex flex-col gap-4">
                  <div className="bg-brand-light border-2 border-brand-blue rounded-lg h-20 flex items-center px-4">
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-brand-blue rounded-full w-3/4"></div>
                      <div className="h-1.5 bg-brand-blue opacity-60 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-slate-300 rounded-lg h-20 flex items-center px-4">
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-slate-300 rounded-full w-3/4"></div>
                      <div className="h-1.5 bg-slate-300 opacity-60 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-slate-300 rounded-lg h-20 flex items-center px-4">
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-slate-300 rounded-full w-3/4"></div>
                      <div className="h-1.5 bg-slate-300 opacity-60 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
