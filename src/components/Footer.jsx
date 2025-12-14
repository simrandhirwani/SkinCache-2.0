import React from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-dark px-4 pb-10 pt-14 text-white">
      <div className="mx-auto max-w-6xl space-y-10 md:px-6 lg:px-0">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#FACC15] bg-transparent shadow-lg shadow-brand-gold-end/30">
                <img src="/logo.png" alt="Skincache logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-heading text-xl">SkinCache</span>
            </div>
            <p className="text-sm text-white/70">
              Skincache isn&apos;t just a platform; it&apos;s the bridge between clinical
              dermatology and your daily routine. We believe.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-widest text-white/70">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <a href="/home" className="hover:text-white">
                Home
              </a>
              <a href="/skin-report" className="hover:text-white">
                Skin Report
              </a>
              <a href="/ingredient-analyzer" className="hover:text-white">
                Ingredient Analyzer
              </a>
              <a href="/community" className="hover:text-white">
                Community
              </a>
              <a href="/challenges" className="hover:text-white">
                Challenges
              </a>
              <a href="/future-me" className="hover:text-white">
                Future Me
              </a>
              <a href="/contact" className="hover:text-white">
                HealthBridge
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-widest text-white/70">Social Media</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon) => (
                <a
                  key={Icon.displayName || Icon.name}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:border-white/40"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-sm text-white/60">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>Copyright © 2026. SkinCache </span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

