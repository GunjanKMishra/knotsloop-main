import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is Knotsloop?',
      answer: 'Knotsloop transforms YouTube content into structured learning experiences. Creators can organize their videos into comprehensive courses with clear paths, while learners get a distraction-free environment focused on actual progress.'
    },
    {
      question: 'How is this different from YouTube playlists?',
      answer: 'Unlike YouTube playlists, Knotsloop provides semantic organization, progress tracking, note-taking tools, and direct creator access. We remove algorithmic distractions and create a true learning management system from your existing content.'
    },
    {
      question: 'Do I need to re-upload my videos?',
      answer: 'No! Knotsloop works with your existing YouTube content. Simply import your channel or playlists, and we\'ll help you organize them into structured learning paths.'
    },
    {
      question: 'Who is this for?',
      answer: 'Knotsloop is perfect for educational content creators who want to build their own platform and learners who are serious about completing courses without distractions. If you\'re tired of building YouTube\'s authority instead of your own, this is for you.'
    },
    {
      question: 'When will Knotsloop launch?',
      answer: 'We\'re planning to launch in early 2026. Join the waitlist to get early access and be among the first creators to transform your content into a professional learning academy.'
    },
    {
      question: 'How much will it cost?',
      answer: 'Pricing details will be announced closer to launch. We\'re committed to offering a fair model that supports both individual creators and learners building their educational platforms.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-brand-light via-white to-brand-light relative overflow-hidden">
      <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-10 left-1/2 w-36 h-36 opacity-8">
        <path d="M 50 110 Q 80 60 110 110 Q 140 160 170 110" stroke="#71C6D9" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M 50 110 Q 80 160 110 110 Q 140 60 170 110" stroke="#71C6D9" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="110" r="10" fill="#71C6D9"/>
        <circle cx="170" cy="110" r="10" fill="#71C6D9"/>
      </svg>

      <svg viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-1/4 right-8 w-28 h-28 opacity-12">
        <circle cx="85" cy="85" r="60" stroke="#71C6D9" strokeWidth="8" fill="none" strokeDasharray="15 10"/>
        <circle cx="85" cy="25" r="9" fill="#71C6D9"/>
      </svg>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-handwriting text-brand-blue text-xl">
            (everything you need to know)
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-brand-blue/40 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-brand-blue" />
                  ) : (
                    <Plus className="w-5 h-5 text-brand-blue" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
