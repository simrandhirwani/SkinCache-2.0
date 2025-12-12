import React from 'react';
import { FileText, Search, Activity, Users, Trophy, Sparkles } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Skin Report',
    description: 'Seamless skin reports combining your daily routine and clinical insight.',
  },
  {
    icon: Search,
    title: 'Ingredient Analyzer',
    description: 'Preview science-backed intelligence across ingredients and routines.',
  },
  {
    icon: Activity,
    title: 'HealthBridge',
    description: 'Monitor progress with data that connects lifestyle and dermatology.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with thousands of skincare enthusiasts sharing their journeys, tips, and success stories.',
  },
  {
    icon: Trophy,
    title: 'Challenges',
    description: 'Transform your skincare routine with daily challenges. Track your progress and earn achievements.',
  },
  {
    icon: Sparkles,
    title: 'Future Me',
    description: 'See what your skin could look like if You did not step into your skincare jounrey now.',
  },
];

const FeaturesGrid = () => {
  return (
    <section className="bg-brand-lilac px-4 pb-14 md:pb-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:px-6 lg:px-0">
        <h2 className="text-center font-heading text-3xl text-brand-dark md:text-4xl">
          Features Grid
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow-[0_18px_60px_-45px_rgba(26,11,46,0.45)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_25px_80px_-45px_rgba(26,11,46,0.55)] cursor-pointer"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold-start/15 text-brand-dark shadow-inner">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
              <p className="mt-2 text-sm text-brand-dark/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

