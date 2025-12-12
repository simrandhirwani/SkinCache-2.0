import React from 'react';
import { Cpu, Code, Leaf } from 'lucide-react';

const items = [
  {
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Dermatologist-level accuracy. We see what the naked eye misses to give you the perfect routine.',
  },
  {
    icon: Code,
    title: 'Clean Code',
    description: 'Your face, your data. Our technology encrypts your photos so your privacy is 100% secure.',
  },
  {
    icon: Leaf,
    title: 'Environment',
    description: 'Good for you, good for the planet. We prioritize brands that use sustainable, clean ingredients.',
  },
];

const ValuePropositions = () => {
  return (
    <section className="bg-brand-lilac px-4 py-16 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:px-6 lg:px-0">
        <h2 className="text-center font-heading text-3xl text-brand-dark md:text-4xl">
          Value Propositions
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_20px_70px_-45px_rgba(26,11,46,0.4)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_25px_80px_-45px_rgba(26,11,46,0.5)] cursor-pointer"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold-start/15 text-brand-dark shadow-inner">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark">{title}</h3>
              <p className="text-sm text-brand-dark/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;

