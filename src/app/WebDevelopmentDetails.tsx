import Link from 'next/link';

export default function WebDevelopmentDetails() {
  return (
    <div className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white mb-6">Web Development</h2>
        <p className="text-2xl text-cyan-100/80 max-w-4xl mx-auto">
          Fast, modern, AI-integrated websites & apps built for scale
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {["Landing pages that convert", "Full-stack apps", "AI-native experiences"].map((highlight) => (
          <div
            key={highlight}
            className="bg-gradient-to-br from-[#1A1A4A] to-[#0A0A2A] border border-purple-500/40 rounded-2xl p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-3">{highlight}</h3>
            <p className="text-cyan-100/70">
              Performance, accessibility, and DX-first builds using modern frameworks.
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-2xl p-10 text-center">
        <div className="text-3xl font-bold text-white mb-4">Custom Projects — Let’s Build Yours</div>
        <p className="text-cyan-100/80 mb-6 max-w-3xl mx-auto">
          We ship production-ready sites, dashboards, and AI-powered experiences with clean code, strong SEO, and analytics set up from day one.
        </p>
        <Link
          href="/#contact"
          className="inline-block px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-400 hover:to-pink-500 transition-all"
        >
          Get Your Custom Quote
        </Link>
      </div>
    </div>
  );
}
