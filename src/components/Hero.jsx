import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBannerClick = (e) => {
    e.preventDefault();
    
    if (location.pathname !== '/home' && location.pathname !== '/') {
      navigate('/home');
      setTimeout(() => {
        const element = document.getElementById('waitlist');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById('waitlist');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative bg-brand-dark pt-24 pb-12 md:pt-20 md:pb-12">
      <div className="mx-auto w-full max-w-6xl px-2 md:px-0">
        <div className="overflow-hidden rounded-[18px] md:rounded-none border border-white/10 md:border-0 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.7)] cursor-pointer">
          <a 
            href="#waitlist" 
            onClick={handleBannerClick}
            aria-label="Scroll to Waitlist"
            className="block"
          >
            <img
              src="/banner.jpg"
              alt="Your Skin Decoded"
              className="block w-full h-auto object-cover md:object-cover md:h-[400px] aspect-video md:aspect-auto transition-transform duration-300 hover:scale-[1.02]"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;