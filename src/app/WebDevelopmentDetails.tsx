import Link from 'next/link';

export default function WebDevelopmentDetails() {
  return (
    <div className="py-32 text-center">
      <h2 className="text-5xl font-bold text-white mb-8">Web Development</h2>
      <p className="text-2xl text-cyan-100/80 mb-12 max-w-3xl mx-auto">
        Fast, modern, AI-integrated websites & apps built for scale
      </p>
      <div className="text-6xl mb-8">Custom Projects — Let’s Build Yours</div>
      <Link
        href="/#contact"
        className="inline-block px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-400 hover:to-pink-500 transition-all"
      >
        Get Your Custom Quote
      </Link>
    </div>
  );
}
