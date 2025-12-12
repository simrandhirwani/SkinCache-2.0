import React from 'react';

const DataStory = () => {
  return (
    <section className="bg-brand-dark px-4 py-16 text-white md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:gap-12 md:px-6 lg:px-0">
        <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_100px_-60px_rgba(0,0,0,0.7)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_35px_120px_-60px_rgba(0,0,0,0.8)] cursor-pointer">
          <img
            src="/founders.png"
            alt="Founders data visualization"
            className="h-full w-full object-cover min-h-[320px] transition-transform duration-300 ease-in-out"
          />
        </div>

        <div className="flex-1 space-y-5">
          <h2 className="font-heading text-3xl leading-tight md:text-4xl">
            Beauty, Backed by Data.
          </h2>
          <p className="text-white/70">
          Stop guessing. Start knowing. Skincache bridges the gap between the clinic and your vanity, replacing marketing hype with dermatological precision. Because your skin deserves evidence, not just influence
          </p>
          <p className="pt-2 font-script text-2xl text-white/80">The Founders</p>
        </div>
      </div>
    </section>
  );
};

export default DataStory;

