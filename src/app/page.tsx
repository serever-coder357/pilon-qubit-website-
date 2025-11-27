<section className="bg-[#04061a]">
  <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
      {/* LEFT: text + CTAs */}
      <div className="space-y-6 max-w-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Where Frontier Technology Meets Operator{" "}
          <span className="text-cyan-400">Grit</span>
        </h1>

        <p className="text-base text-slate-200 sm:text-lg">
          We partner with visionary founders and forward-thinking enterprises to transform bold
          ideas into market-ready products. Combining venture perspective with hands-on
          engineering, we deliver AI and quantum solutions that ship fast, scale reliably, and
          drive measurable business impact.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04061a]"
          >
            Start Building
          </a>

          <a
            href="#services"
            className="inline-flex items-center justify-center rounded-md border border-cyan-500 px-6 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04061a]"
          >
            See Our Approach
          </a>
        </div>
      </div>

      {/* RIGHT: hero video */}
      <div className="w-full lg:max-w-xl">
        <div className="relative w-full overflow-hidden rounded-3xl shadow-lg aspect-[16/9]">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            {/* IMPORTANT: set src to the SAME video file your old hero used */}
            <source src="/REPLACE_WITH_YOUR_EXISTING_HERO_VIDEO.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
</section>
