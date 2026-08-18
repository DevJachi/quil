"use client";

export default function Hero() {
  return (
    <section className="flex flex-col items-start w-full max-w-4xl px-12">
      <h1 className="text-[clamp(46px,6vw,86px)] font-light leading-none tracking-[-0.04em] text-white mb-5">
        The simplest way to deploy your web app.
      </h1>
      <p className="text-[clamp(15px,2vw,18px)] font-normal text-[#888] tracking-[-0.01em] leading-relaxed">
        Just drop a public GitHub URL.
      </p>
    </section>
  );
}
