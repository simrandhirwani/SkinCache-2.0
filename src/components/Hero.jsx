import React from 'react';

const Hero = () => {
  return (
    <section className="relative bg-brand-dark pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="overflow-hidden rounded-[18px] border border-white/10 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.7)]">
          <a href="#your-skin-decoded" aria-label="Your Skin Decoded">
            <img
              src="/banner.jpg"
              alt="Your Skin Decoded"
              className="block h-full w-full object-cover"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;