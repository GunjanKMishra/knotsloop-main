export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 bg-gradient-to-b from-white to-brand-light">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl font-serif text-slate-900">Knotsloop</span>
        </div>

        <p className="text-center text-sm text-slate-700 mb-8">
          A semantic learning management system for YouTube creators
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 mb-8">
          <a href="#" className="hover:text-brand-blue transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-blue transition-colors">Terms</a>
          <a href="mailto:hello@knotsloop.com" className="hover:text-brand-blue transition-colors">
            Contact
          </a>
        </div>

        <p className="text-center text-xs text-slate-500 font-handwriting">
          © {currentYear} Knotsloop ~ Launching Early 2026 ✨
        </p>
      </div>
    </footer>
  );
}
