import Link from 'next/link';

export default function WebDevelopmentDetails() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold text-white mb-6">Web Development</h2>
      <p className="text-cyan-100/70 text-lg mb-12 max-w-3xl mx-auto">
        Modern, fast, AI-integrated web apps and websites.
      </p>
      <div className="text-6xl mb-8">Custom Projects — Let’s Build Yours</div>
      <Link breakpoints href="/#contact" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-semibold rounded-lg hover:from-purple-400 hover:to-pink-500 transition-all">
        Get Your Quote
      </Link>
    </div>
  );
}
