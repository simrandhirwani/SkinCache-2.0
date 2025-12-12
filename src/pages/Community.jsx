"use client";

import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Filter, X, ArrowRight, Beaker, User, PenTool, Heart, Droplets, Sun, Sparkles, Layers } from 'lucide-react';

// --- 1. USER REVIEWS DATA ---
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Simran",
    skinType: "Dry • Sensitive",
    concerns: "Dehydration, Redness",
    location: "Mumbai",
    rating: 5,
    heroIngredients: ["Ceramides", "Snail Mucin", "Hyaluronic Acid"],
    title: "How I fixed my damaged barrier in 2 weeks",
    fullStory: "Living in Mumbai's humidity usually means oily skin, but my office AC was wrecking my moisture barrier. I started noticing extreme redness and flaking around my nose. I realized I was over-exfoliating. \n\nMy fix was simple: I stopped all actives and focused on barrier support. The Laneige Cream Skin Refiner acted as a liquid moisturizer, and the Snail Mucin provided the deep hydration layer. Within 2 weeks, the stinging sensation stopped completely.",
    time: "2h ago"
  },
  {
    id: 2,
    name: "Rahul",
    skinType: "Oily • Acne-Prone",
    concerns: "Cystic Acne, Pores",
    location: "Bangalore",
    rating: 5,
    heroIngredients: ["Salicylic Acid (BHA)", "Niacinamide", "Green Tea"],
    title: "Stopping the breakout cycle without drying out",
    fullStory: "I used to think drying out my skin was the only way to stop acne. I was wrong. It only made my skin produce more oil to compensate. \n\nThe game changer was introducing Salicylic Acid only 2x a week and using Niacinamide daily. This combination unclogged my pores while regulating oil production. The Green Tea toner helps calm the active inflammation immediately after shaving.",
    time: "5h ago"
  },
  {
    id: 3,
    name: "Priya",
    skinType: "Combination",
    concerns: "T-Zone Oil, Dry Cheeks",
    location: "Delhi",
    rating: 4,
    heroIngredients: ["Glycolic Acid", "Glycerin", "Panthenol"],
    title: "Balancing the T-Zone in Delhi's Pollution",
    fullStory: "Delhi pollution is a nightmare for combination skin. My T-zone would get greasy and clogged, while my cheeks felt tight. \n\nI switched to 'Zone Treatment'. I use a clay mask only on my nose and forehead, and a heavy Panthenol cream on my cheeks. Double cleansing is non-negotiable for me now to get the pollution particles off before bed.",
    time: "1d ago"
  },
  {
    id: 4,
    name: "Ananya",
    skinType: "Sensitive • Rosacea",
    concerns: "Heat Sensitivity",
    location: "Pune",
    rating: 5,
    heroIngredients: ["Centella Asiatica (Cica)", "Azelaic Acid"],
    title: "Calming the heat flare-ups instantly",
    fullStory: "My Rosacea flares up the moment I step into the sun. My cheeks get hot and red. Most anti-aging products sting my face. \n\nI discovered Centella Asiatica (Cica) and it changed everything. I keep my sheet masks in the fridge. The Azelaic Acid helps with the redness long-term without the irritation that comes from Retinols. If you have heat sensitivity, keep your routine cold!",
    time: "2d ago"
  }
];

// --- 2. EDUCATIONAL GUIDES DATA (NEW) ---
const GUIDES = [
  {
    id: 101,
    name: "SkinCache Editorial",
    location: "Expert Guide",
    skinType: "Dry Skin • Healing",
    concerns: "Flaking, Tightness",
    heroIngredients: ["Hyaluronic Acid", "Ceramides", "Squalane"],
    title: "The Beginner's Guide to Dry Skin",
    fullStory: "Dry skin lacks oil/lipids, unlike dehydrated skin which lacks water. If your skin feels tight after washing, you likely have a compromised moisture barrier.\n\n**The Strategy:**\n1. **No Foaming Cleansers:** Switch to milky or cream cleansers.\n2. **Damp Skin Rule:** Always apply hydration products on damp skin to lock moisture in.\n3. **Seal It In:** Use an occlusive moisturizer (one that sits on top) at night to prevent water loss while you sleep.\n\nAvoid hot water showers as they strip your natural oils!",
    icon: <Droplets className="text-blue-500" size={24} />,
    color: "bg-blue-50",
    accent: "border-blue-100"
  },
  {
    id: 102,
    name: "SkinCache Editorial",
    location: "Expert Guide",
    skinType: "Oily Skin • Control",
    concerns: "Shine, Clogged Pores",
    heroIngredients: ["Niacinamide", "BHA (Salicylic)", "Clay"],
    title: "Mastering Oily Skin Control",
    fullStory: "Oily skin is often genetic, but it can be worsened by stripping your skin. When you dry out your skin too much, it panics and produces MORE oil.\n\n**The Strategy:**\n1. **Hydrate, Don't Dry:** Yes, oily skin needs moisturizer! Look for 'Gel-based' or 'Water-cream' textures.\n2. **The Niacinamide Magic:** This ingredient regulates sebum production over time. Use it daily.\n3. **Clay Masks:** Use a Kaolin clay mask 1x a week to pull deep impurities, but don't let it crack dry on your face.",
    icon: <Sun className="text-orange-500" size={24} />,
    color: "bg-orange-50",
    accent: "border-orange-100"
  },
];

export default function Community() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  // Form State
  const [newReview, setNewReview] = useState({
    name: '',
    skinType: '',
    title: '',
    review: ''
  });

  // Filter State
  const [filters, setFilters] = useState({
    skinType: "All",
    concern: "All",
    location: "All"
  });

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchSkin = filters.skinType === "All" || review.skinType.toLowerCase().includes(filters.skinType.toLowerCase());
      const matchConcern = filters.concern === "All" || review.concerns.toLowerCase().includes(filters.concern.toLowerCase());
      const matchLocation = filters.location === "All" || review.location === filters.location;
      return matchSkin && matchConcern && matchLocation;
    });
  }, [reviews, filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewToAdd = {
      id: Date.now(),
      name: newReview.name || "Community User",
      skinType: newReview.skinType || "Combination",
      concerns: "User Story",
      location: "India",
      rating: 5,
      heroIngredients: ["Community Pick"],
      title: newReview.title || "My Skin Journey",
      fullStory: newReview.review || "I wanted to share my experience...",
      time: "Just now"
    };
    setReviews([reviewToAdd, ...reviews]);
    setShowForm(false);
    setNewReview({ name: '', skinType: '', title: '', review: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      <Navbar />

      {/* HEADER */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">Verified Skin Twins</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base">Discover full routines that solved your exact problems.</p>
      </div>
      <div className="max-w-6xl mx-auto -mt-16 px-4 pb-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

          {/* --- LEFT: CONTENT FEED --- */}
          <div className="flex-1 p-6 bg-gray-50/50">

            {/* FILTER BAR */}
            <div className="bg-black rounded-xl p-4 mb-6 shadow-lg flex flex-wrap gap-3 items-center justify-center sticky top-0 z-10">
              <div className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Filter size={14} className="text-[#DCA637]"/> Filter By:
              </div>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none min-w-[130px] focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, skinType: e.target.value})}>
                <option value="All">All Skin Types</option>
                <option value="Dry">Dry</option>
                <option value="Oily">Oily</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
              </select>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none min-w-[140px] focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, concern: e.target.value})}>
                <option value="All">All Concerns</option>
                <option value="Acne">Acne</option>
                <option value="Redness">Redness</option>
                <option value="Dehydration">Dehydration</option>
              </select>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none min-w-[130px] focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, location: e.target.value})}>
                <option value="All">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            {/* FORM */}
            {showForm && (
              <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-[#DCA637] animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[#3D1132] text-lg flex items-center gap-2">
                    <PenTool size={18} /> Write an Article
                  </h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Your Name" className="bg-gray-50 p-3 rounded-lg border text-sm focus:border-[#DCA637] outline-none" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} />
                    <input required placeholder="Skin Type" className="bg-gray-50 p-3 rounded-lg border text-sm focus:border-[#DCA637] outline-none" value={newReview.skinType} onChange={e => setNewReview({...newReview, skinType: e.target.value})} />
                  </div>
                  <input required placeholder="Article Title" className="w-full bg-gray-50 p-3 rounded-lg border text-sm font-bold focus:border-[#DCA637] outline-none" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} />
                  <textarea required placeholder="Share your full journey..." className="w-full bg-gray-50 p-3 rounded-lg border text-sm h-32 focus:border-[#DCA637] outline-none leading-relaxed" value={newReview.review} onChange={e => setNewReview({...newReview, review: e.target.value})} />
                  <button type="submit" className="w-full bg-[#3D1132] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#2a0b22] shadow-md transition-all">Publish Article</button>
                </form>
              </div>
            )}
            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRoutine(item)}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
                >
                  <div className="pointer-events-none absolute -top-6 -right-8 w-28 h-28 bg-gradient-to-br from-[#f7e3c1] via-[#fdf7e9] to-transparent rounded-full opacity-60 blur-2xl"></div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center text-[#3D1132] font-bold text-sm">
                        {item.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 text-[#3D1132] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      {item.skinType.split('•')[0]}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-[#DCA637] mb-2 line-clamp-1">{item.title}</h4>
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Key Solvers:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.heroIngredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 flex items-center gap-1">
                          <Beaker size={8} /> {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-[#3D1132] text-xs font-bold group-hover:underline">
                    Read Article <ArrowRight size={12} className="ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: SIDEBAR (UPDATED) --- */}
          <div className="w-full md:w-80 bg-white border-l border-gray-100 p-6 hidden md:block">

             {/* CTA CARD */}
             <div className="bg-gradient-to-br from-[#3D1132] to-[#5e1b4d] rounded-2xl p-6 text-white text-center mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-4 w-16 h-16 bg-[#DCA637]/20 rounded-full blur-3xl"></div>
                <Heart className="mx-auto mb-3 text-[#DCA637]" size={28} fill="#DCA637" />
                <h3 className="font-bold text-lg mb-2">Help Your Skin Twin</h3>
                <p className="text-purple-100 text-xs mb-4 leading-relaxed">
                  Have you cracked the code for your skin type? Write an article to help others.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#DCA637] text-[#3D1132] py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors"
                >
                  Write an Article
                </button>
             </div>
             {/* BEGINNER GUIDES SECTION */}
             <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
               <Sparkles size={16} className="text-[#DCA637]"/> Beginner Guides
             </h3>
             <div className="space-y-4">
              {GUIDES.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedRoutine(guide)}
                  className={`p-4 rounded-xl border ${guide.accent} ${guide.color} group cursor-pointer hover:shadow-md transition-all relative overflow-hidden`}
                >
                  <div className="pointer-events-none absolute -top-6 -left-4 w-20 h-20 bg-gradient-to-br from-white/70 via-white/30 to-transparent rounded-full blur-xl"></div>
                  <div className="pointer-events-none absolute -bottom-10 -right-6 w-28 h-28 bg-gradient-to-tr from-[#dca6371a] via-[#3d113214] to-transparent rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-4 mb-3 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-white/60 rounded-full flex items-center justify-center shadow-sm">
                      {guide.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{guide.skinType.split('•')[0]} Guide</h4>
                      <p className="text-xs text-gray-500">Heal & Balance</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-black/5 pt-3 relative z-10">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Read Guide</span>
                     <div className="bg-white p-1 rounded-full text-gray-400 group-hover:text-[#3D1132] group-hover:bg-[#DCA637] transition-colors">
                       <ArrowRight size={12} />
                     </div>
                  </div>
                </div>
              ))}
             </div>
          </div>
        </div>
      </div>
      {/* --- ARTICLE MODAL --- */}
      {selectedRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRoutine(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3D1132] via-[#4b1540] to-[#DCA637] opacity-90"></div>
              <div className="absolute -left-10 -top-6 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -right-12 bottom-0 w-48 h-48 bg-[#DCA637]/20 rounded-full blur-3xl"></div>
              <button onClick={() => setSelectedRoutine(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors z-10"><X size={20} /></button>
              <div className="absolute bottom-4 left-6 text-white z-10">
                <h2 className="text-2xl font-bold">{selectedRoutine.title}</h2>
                <div className="flex items-center gap-2 text-sm mt-1 text-purple-100"><User size={14} /> {selectedRoutine.name}</div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex gap-2 mb-6">
                 <span className="bg-[#DCA637]/20 text-[#DCA637] px-3 py-1 rounded-full text-xs font-bold border border-[#DCA637]/30">{selectedRoutine.skinType}</span>
              </div>
               <h3 className="font-bold text-gray-900 text-lg mb-3">The Expert Strategy</h3>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">{selectedRoutine.fullStory}</p>

               <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="font-bold text-[#3D1132] mb-4 flex items-center gap-2">
                  <Beaker size={18} /> Recommended Ingredients
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedRoutine.heroIngredients.map((ing, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm text-sm font-medium text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#DCA637]"></div>
                      {ing}
                    </div>
                  ))}
                </div>
              </div>
               <div className="mt-8 flex justify-end">
                <button onClick={() => setSelectedRoutine(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm">Close Guide</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
