import React from 'react';

const WaitlistBlock = () => {
  return (
    <section id="waitlist" className="bg-brand-lilac px-4 pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl md:px-6 lg:px-0">
        <h2 className="text-center font-heading text-3xl text-brand-dark md:text-4xl">
          Waitlist Block
        </h2>
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-brand-dark px-6 py-8 shadow-[0_25px_70px_-45px_rgba(26,11,46,0.8)] md:mt-10 md:px-10 md:py-12">
          <div className="flex flex-col gap-8 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="space-y-4 text-white">
              <h3 className="font-heading text-3xl">Waitlist Block</h3>
              <p className="text-white/70">
                Skincache isn&apos;t just a platform; it&apos;s the bridge between clinical
                dermatology and your daily routine. We believe your skin deserves science, not just
                marketing.
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-gold-start focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-brand-gold-start focus:outline-none"
                />
              </div>
              <button type="submit" className="button-gold w-full">
                Join Waitlist
              </button>
            </form>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-brand-gold-start/15 via-transparent to-brand-gold-end/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default WaitlistBlock;

