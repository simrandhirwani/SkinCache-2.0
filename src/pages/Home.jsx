import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValuePropositions from '../components/ValuePropositions';
import FeaturesGrid from '../components/FeaturesGrid';
import WaitlistBlock from '../components/WaitlistBlock';
import DataStory from '../components/DataStory';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-brand-lilac text-brand-dark">
      <Navbar />
      <main>
        <Hero />
        <ValuePropositions />
        <FeaturesGrid />
        <WaitlistBlock />
        <DataStory />
      </main>
      <Footer />
    </div>
  );
}

export default Home;

