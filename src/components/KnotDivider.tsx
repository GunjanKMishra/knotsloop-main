'use client';

export default function KnotDivider() {
  return (
    <div className="py-12 flex justify-center items-center">
      <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-auto">
        <path
          d="M 30 60 Q 75 20 120 60 Q 165 100 210 60 Q 255 20 270 60"
          stroke="#71C6D9"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 30 60 Q 75 100 120 60 Q 165 20 210 60 Q 255 100 270 60"
          stroke="#71C6D9"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="30" cy="60" r="6" fill="#71C6D9" opacity="0.8"/>
        <circle cx="270" cy="60" r="6" fill="#71C6D9" opacity="0.8"/>
        <circle cx="150" cy="60" r="8" fill="#CFF1F9" stroke="#71C6D9" strokeWidth="2"/>
      </svg>
    </div>
  );
}
