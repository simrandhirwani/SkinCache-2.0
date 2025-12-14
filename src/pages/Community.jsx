"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Filter, X, ArrowRight, Beaker, User, PenTool, Heart, Droplets, Sun, Sparkles, MapPin, Star } from 'lucide-react';

// --- STATIC GUIDES DATA ---
const GUIDES = [
  {
    id: 101,
    name: "SkinCache Editorial",
    location: "Expert Guide",
    skinType: "Dry Skin • Healing",
    concerns: "Flaking, Tightness",
    heroIngredients: ["Hyaluronic Acid", "Ceramides", "Squalane"],
    title: "The Beginner's Guide to Dry Skin",
    fullStory: "Dry skin lacks oil/lipids. If your skin feels tight after washing, you likely have a compromised moisture barrier.\n\n**Strategy:**\n1. No Foaming Cleansers.\n2. Damp Skin Rule.\n3. Seal It In with occlusives.",
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
    heroIngredients: ["Niacinamide", "BHA", "Clay"],
    title: "Mastering Oily Skin Control",
    fullStory: "Oily skin is genetic but worsened by stripping. \n\n**Strategy:**\n1. Hydrate with gels.\n2. Niacinamide daily.\n3. Clay masks weekly.",
    icon: <Sun className="text-orange-500" size={24} />,
    color: "bg-orange-50",
    accent: "border-orange-100"
  },
];

export default function Community() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isBestMatchMode, setIsBestMatchMode] = useState(false); // To show "Best Match" badge

  // Form State
  const [newReview, setNewReview] = useState({
    name: '',
    skinType: 'Combination',
    location: 'Mumbai', // Default to common city
    title: '',
    review: ''
  });

  // Filter State
  const [filters, setFilters] = useState({
    skinType: "All",
    concern: "All",
    location: "All"
  });

  // --- FETCH DATA ---
  const fetchReviews = async () => {
    try {
      // ✅ CHANGED: Live Render URL
      const response = await fetch('https://skincache-2-0.onrender.com/reviews');
      const data = await response.json();
      
      const formattedData = data.map(item => ({
        ...item,
        // Backend might return defaults, ensuring array for ingredients
        heroIngredients: ["Community Verified", "User Routine"] 
      }));
      setReviews(formattedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- SMART FILTERING LOGIC (BEST MATCH ALGORITHM) ---
  const filteredReviews = useMemo(() => {
    setIsBestMatchMode(false); // Reset mode

    // 1. If no filters, show all
    if (filters.skinType === "All" && filters.concern === "All" && filters.location === "All") {
      return reviews;
    }

    // 2. Try EXACT MATCH first (Strict AND Logic)
    const exactMatches = reviews.filter(review => {
      const matchSkin = filters.skinType === "All" || (review.skinType && review.skinType.toLowerCase().includes(filters.skinType.toLowerCase()));
      const matchConcern = filters.concern === "All" || (review.concerns && review.concerns.toLowerCase().includes(filters.concern.toLowerCase()));
      const matchLocation = filters.location === "All" || (review.location && review.location.toLowerCase().includes(filters.location.toLowerCase()));
      return matchSkin && matchConcern && matchLocation;
    });

    // If we found exact matches, return them!
    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // 3. FALLBACK: SCORING SYSTEM (Best Match Logic)
    // If strict match failed, grade reviews by relevance
    const scoredReviews = reviews.map(review => {
      let score = 0;
      // Weight: Skin Type is most important (10 pts)
      if (filters.skinType !== "All" && review.skinType && review.skinType.toLowerCase().includes(filters.skinType.toLowerCase())) score += 10;
      // Weight: Concern is medium (5 pts)
      if (filters.concern !== "All" && review.concerns && review.concerns.toLowerCase().includes(filters.concern.toLowerCase())) score += 5;
      // Weight: Location is bonus (2 pts)
      if (filters.location !== "All" && review.location && review.location.toLowerCase().includes(filters.location.toLowerCase())) score += 2;
      
      return { ...review, score };
    });

    // Sort by score (Highest first)
    scoredReviews.sort((a, b) => b.score - a.score);

    // If the best score is 0, nothing matches at all. Return empty (or all).
    // Otherwise, return top results.
    if (scoredReviews.length > 0 && scoredReviews[0].score > 0) {
      setIsBestMatchMode(true); // Enable badge
      // Return only the items with the highest score (e.g., if two items both have score 10, show both)
      return scoredReviews.filter(r => r.score === scoredReviews[0].score);
    }

    return []; // Truly nothing found
  }, [reviews, filters]);

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      name: newReview.name || "Community User",
      skinType: newReview.skinType,
      location: newReview.location, // Sending location now!
      title: newReview.title,
      review: newReview.review,
      concerns: "User Story" // Placeholder for now
    };

    try {
      // ✅ CHANGED: Live Render URL
      await fetch('https://skincache-2-0.onrender.com/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      fetchReviews();
      setShowForm(false);
      setNewReview({ name: '', skinType: 'Combination', location: 'Mumbai', title: '', review: '' });
    } catch (error) {
      alert("Backend error (or server waking up). Please try again in 30s.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      <Navbar />

      {/* HEADER */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">Verified Skin Twins</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base">Real routines from people who match your profile.</p>
      </div>

      <div className="max-w-6xl mx-auto -mt-16 px-4 pb-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

          {/* LEFT CONTENT */}
          <div className="flex-1 p-6 bg-gray-50/50">
            
            {/* FILTER BAR */}
            <div className="bg-black rounded-xl p-4 mb-6 shadow-lg flex flex-wrap gap-3 items-center justify-center sticky top-0 z-10">
              <div className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Filter size={14} className="text-[#DCA637]"/> Filter By:
              </div>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, skinType: e.target.value})}>
                <option value="All">All Skin Types</option>
                <option value="Dry">Dry</option>
                <option value="Oily">Oily</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
              </select>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, concern: e.target.value})}>
                <option value="All">All Concerns</option>
                <option value="Acne">Acne</option>
                <option value="Redness">Redness</option>
                <option value="Dehydration">Dehydration</option>
              </select>
              <select className="bg-gray-900 text-white text-xs p-2.5 rounded-lg border border-gray-700 outline-none focus:border-[#DCA637]" onChange={(e) => setFilters({...filters, location: e.target.value})}>
                <option value="All">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
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
                    
                    {/* UPDATED: Skin Type Dropdown for Consistency */}
                    <select className="bg-gray-50 p-3 rounded-lg border text-sm focus:border-[#DCA637] outline-none" value={newReview.skinType} onChange={e => setNewReview({...newReview, skinType: e.target.value})}>
                        <option value="Combination">Combination</option>
                        <option value="Oily">Oily</option>
                        <option value="Dry">Dry</option>
                        <option value="Sensitive">Sensitive</option>
                    </select>
                  </div>
                  
                  {/* NEW: Location Dropdown */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <select className="w-full bg-gray-50 p-3 pl-10 rounded-lg border text-sm focus:border-[#DCA637] outline-none appearance-none" value={newReview.location} onChange={e => setNewReview({...newReview, location: e.target.value})}>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Pune">Pune</option>
                        <option value="Other">Other India</option>
                    </select>
                  </div>

                  <input required placeholder="Article Title" className="w-full bg-gray-50 p-3 rounded-lg border text-sm font-bold focus:border-[#DCA637] outline-none" value={newReview.title} onChange={e => setNewReview({...newReview, title: e.target.value})} />
                  <textarea required placeholder="Share your full journey..." className="w-full bg-gray-50 p-3 rounded-lg border text-sm h-32 focus:border-[#DCA637] outline-none leading-relaxed" value={newReview.review} onChange={e => setNewReview({...newReview, review: e.target.value})} />
                  <button type="submit" className="w-full bg-[#3D1132] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#2a0b22] shadow-md transition-all">Publish Article</button>
                </form>
              </div>
            )}

            {/* MESSAGE: Best Match Found */}
            {isBestMatchMode && filteredReviews.length > 0 && (
                <div className="mb-4 bg-yellow-50 border border-[#DCA637] text-[#8a661c] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                    <Star size={14} fill="currentColor" />
                    Exact match not found, but here are the best matches for your skin profile!
                </div>
            )}

            {/* REVIEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.length === 0 && (
                <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                   No articles found matching your criteria.
                </div>
              )}
              
              {filteredReviews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRoutine(item)}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 group relative overflow-hidden"
                >
                  {/* Highlight Badge if Best Match */}
                  {isBestMatchMode && (
                      <div className="absolute top-0 right-0 bg-[#DCA637] text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">
                          BEST MATCH
                      </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center text-[#3D1132] font-bold text-sm">
                        {item.name ? item.name[0] : "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                           <MapPin size={10} /> {item.location || "India"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-purple-50 text-[#3D1132] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      {item.skinType ? item.skinType.split('•')[0] : "Skin"}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-[#DCA637] mb-2 line-clamp-1">{item.title}</h4>
                  <div className="flex items-center text-[#3D1132] text-xs font-bold group-hover:underline mt-4">
                    Read Article <ArrowRight size={12} className="ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full md:w-80 bg-white border-l border-gray-100 p-6 hidden md:block">
             <div className="bg-gradient-to-br from-[#3D1132] to-[#5e1b4d] rounded-2xl p-6 text-white text-center mb-8 shadow-xl relative overflow-hidden">
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
             
             {/* Guides List */}
             <div className="space-y-4">
              {GUIDES.map((guide) => (
                <div key={guide.id} onClick={() => setSelectedRoutine(guide)} className={`p-4 rounded-xl border ${guide.accent} ${guide.color} cursor-pointer hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {guide.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{guide.skinType.split('•')[0]} Guide</h4>
                      <p className="text-xs text-gray-500">Heal & Balance</p>
                    </div>
                  </div>
                </div>
              ))}
             </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedRoutine(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48 overflow-hidden rounded-t-2xl bg-[#3D1132] p-6 text-white">
                <button onClick={() => setSelectedRoutine(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-2 rounded-full"><X size={20} /></button>
                <h2 className="text-2xl font-bold mt-10">{selectedRoutine.title}</h2>
                <div className="flex items-center gap-2 text-sm mt-2 text-purple-200"><User size={14} /> {selectedRoutine.name} • {selectedRoutine.location}</div>
            </div>
            <div className="p-8">
               <span className="bg-[#DCA637]/20 text-[#DCA637] px-3 py-1 rounded-full text-xs font-bold">{selectedRoutine.skinType}</span>
               <p className="text-gray-600 leading-relaxed whitespace-pre-line mt-6">{selectedRoutine.fullStory}</p>
               <div className="mt-8 flex justify-end">
                <button onClick={() => setSelectedRoutine(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm">Close</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}