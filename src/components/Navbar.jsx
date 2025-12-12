import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

const links = [
  { name: 'HOME', path: '/home' },
  { name: 'SKIN REPORT', path: '/skin-report' },
  { name: 'INGREDIENT ANALYZER', path: '/ingredient-analyzer' },
  { name: 'COMMUNITY', path: '/community' },
  { name: 'CHALLENGES', path: '/challenges' },
  { name: 'FUTURE ME', path: '/future-me' },
  { name: 'HEALTHBRIDGE', path: '/healthbridge' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (item) => {
    navigate(item.path);
  };

  const getActiveLink = () => {
    const currentPath = location.pathname;
    const activeLink = links.find(link => currentPath === link.path || (link.path === '/home' && currentPath === '/'));
    return activeLink ? activeLink.name : 'HOME';
  };

  const active = getActiveLink();

  return (
    <nav className="fixed top-0 z-50 h-20 w-full bg-[#120218]/75 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-2 md:px-6">
        {/* Left: logo + wordmark */}
        <div 
          className="flex min-w-[170px] items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/home')}
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#FACC15] bg-transparent shadow-[0_0_10px_rgba(250,204,21,0.25)]">
            <img src="/logo.png" alt="Skincache logo" className="h-full w-full object-contain" />
          </div>
          <span className="text-lg font-serif text-white tracking-wide">SkinCache</span>
        </div>

        {/* Center: nav */}
        <div className="flex flex-1 items-center justify-center px-1">
          <div className="hidden lg:flex items-center gap-3.5">
            {links.map((item, index) => {
              const isActive = item.name === active;
              return (
                <React.Fragment key={item.name}>
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item)}
                    className={`relative flex h-20 items-center justify-center px-1.5 cursor-pointer focus:outline-none ${
                      isActive ? 'text-[#FACC15]' : ''
                    }`}
                  >
                    <span
                      className={`text-[9px] md:text-[10px] font-medium tracking-widest uppercase transition-colors duration-200 ${
                        isActive ? 'text-[#FACC15]' : 'text-gray-300 hover:text-[#FACC15]'
                      }`}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="pointer-events-none absolute bottom-2 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FACC15] to-[#CA8A04] shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                    )}
                  </button>
                  {index !== links.length - 1 && <span className="text-white/30 text-[11px]">|</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="hidden lg:flex items-center">
          <a
            href="#waitlist"
            className="rounded-md bg-gradient-to-r from-[#FACC15] to-[#CA8A04] px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1A0B2E] shadow-[0_0_20px_rgba(250,204,21,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:scale-105"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile */}
        <div className="lg:hidden ml-auto">
          <button className="text-white hover:text-[#FACC15]">
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;