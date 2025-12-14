"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Trophy, Calendar, CheckCircle, Lock, Zap, Droplets, Sun, Moon, Shield, Award, Flame, Sparkles, Layers, User, BedDouble } from 'lucide-react';

// --- STATIC CATALOG (The Menu) ---
const CHALLENGES = [
  // === WEEKLY SPRINT (7 Days) ===
  {
    id: 1,
    title: "7-Day Hydration Hero",
    description: "Drink 3L water & use moisturizer twice daily. Rebuild your barrier.",
    category: "Weekly",
    duration: 7,
    reward: "Hydration Badge",
    xp: 500,
    icon: <Droplets className="text-blue-500" size={22} />,
    color: "bg-blue-50",
    apiName: "7-Day Hydration Hero"
  },
  {
    id: 2,
    title: "The Double Cleanse Week",
    description: "Oil cleanser + Water cleanser every night for deep pore clearing.",
    category: "Weekly",
    duration: 7,
    reward: "Pore Perfection",
    xp: 600,
    icon: <Sparkles className="text-purple-500" size={22} />,
    color: "bg-purple-50",
    apiName: "Double Cleanse Week"
  },
  {
    id: 3,
    title: "No-Sugar Sprint",
    description: "Avoid added sugars for 7 days to reduce insulin-related inflammation.",
    category: "Weekly",
    duration: 7,
    reward: "Detox Medal",
    xp: 700,
    icon: <Shield className="text-red-500" size={22} />,
    color: "bg-red-50",
    apiName: "No Sugar Sprint"
  },

  // === BI-WEEKLY HABITS (14 Days) ===
  {
    id: 4,
    title: "Pillowcase Patrol",
    description: "Change your pillowcase every 2 days to prevent bacterial acne.",
    category: "Bi-Weekly",
    duration: 14,
    reward: "Hygiene Hero",
    xp: 1200,
    icon: <BedDouble className="text-indigo-500" size={22} />,
    color: "bg-indigo-50",
    apiName: "Pillowcase Patrol"
  },
  {
    id: 5,
    title: "Barrier Repair Fortnight",
    description: "Stop all exfoliation (acids/scrubs). Only Hydrate + Heal.",
    category: "Bi-Weekly",
    duration: 14,
    reward: "Barrier Guardian",
    xp: 1500,
    icon: <ShieldAlert className="text-emerald-500" size={22} />,
    color: "bg-emerald-50",
    apiName: "Barrier Repair 14"
  },

  // === MONTHLY MASTERY (30 Days) ===
  {
    id: 6,
    title: "Sunscreen Streak (30 Days)",
    description: "Apply SPF 50 every morning, even indoors. No excuses.",
    category: "Monthly",
    duration: 30,
    reward: "Sun Warrior Title",
    xp: 3000,
    icon: <Sun className="text-orange-500" size={22} />,
    color: "bg-orange-50",
    apiName: "Sunscreen Streak"
  },
  {
    id: 7,
    title: "Retinol Ramp-Up",
    description: "Consistency challenge: Use your Retinol exactly as prescribed (e.g., 2x week).",
    category: "Monthly",
    duration: 30,
    reward: "Anti-Aging Pro",
    xp: 3500,
    icon: <Moon className="text-violet-500" size={22} />,
    color: "bg-violet-50",
    apiName: "Retinol Ramp Up"
  },
  {
    id: 8,
    title: "Glow Getter (Vitamin C)",
    description: "Apply Vitamin C serum every single morning for brightness.",
    category: "Monthly",
    duration: 30,
    reward: "Radiance Badge",
    xp: 3200,
    icon: <Zap className="text-yellow-500" size={22} />,
    color: "bg-yellow-50",
    apiName: "Vitamin C Month"
  },

  // === YEARLY LEGEND (52 Weeks) ===
  {
    id: 9,
    title: "The Seasonal Shift",
    description: "Log your skin condition once a week for a full year to track seasonal changes.",
    category: "Yearly",
    duration: 52, 
    reward: "SkinCache Legend",
    xp: 50000,
    icon: <Trophy className="text-[#DCA637]" size={22} />,
    color: "bg-amber-50",
    apiName: "Seasonal Shift Year"
  }
];

// Re-importing ShieldAlert locally since it wasn't in the top import list in previous snippets
import { ShieldAlert } from 'lucide-react';

export default function ChallengesPage() {
  // --- STATE ---
  const [email, setEmail] = useState('');
  const [isEmailSet, setIsEmailSet] = useState(false);
  
  const [activeTab, setActiveTab] = useState("All");
  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);
  
  // Dynamic Data from Neon
  const [currentDay, setCurrentDay] = useState(0); 
  const [isDoneToday, setIsDoneToday] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- FILTER LOGIC ---
  const filteredChallenges = activeTab === "All" 
    ? CHALLENGES.filter(c => c.id !== activeChallenge.id)
    : CHALLENGES.filter(c => c.category === activeTab && c.id !== activeChallenge.id);

  // --- 1. FETCH STATUS FROM NEON ---
  const fetchProgress = async (challengeName) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await fetch('https://skincache-2-0.onrender.com/challenge/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, challenge_name: challengeName })
      });
      const data = await res.json();
      
      setCurrentDay(data.day);
      
      // Check if done today
      const today = new Date().toISOString().split('T')[0];
      if (data.last_checkin === today) {
        setIsDoneToday(true);
      } else {
        setIsDoneToday(false);
      }
    } catch (err) {
      console.error("Neon Connection Failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. HANDLE LOGIN ---
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setIsEmailSet(true);
      fetchProgress(activeChallenge.apiName); // Load data immediately
    }
  };

  // --- 3. HANDLE CHECK-IN (SAVE TO NEON) ---
  const handleCheckIn = async () => {
    if (isDoneToday) {
      alert("You already completed today's task! Come back tomorrow.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('https://skincache-2-0.onrender.com/challenge/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, challenge_name: activeChallenge.apiName })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setCurrentDay(data.day);
        setIsDoneToday(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      } else if (data.status === 'already_done') {
        setIsDoneToday(true);
        alert("Already done today!");
      }
    } catch (err) {
      alert("Failed to save progress. Server might be sleeping.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. SWITCH CHALLENGE ---
  const switchChallenge = (challenge) => {
    setActiveChallenge(challenge);
    // Fetch new data for this specific challenge
    if (isEmailSet) {
        fetchProgress(challenge.apiName);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- RENDER HELPERS ---
  const renderProgressDots = () => {
    const count = Math.min(activeChallenge.duration, 12);
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: count }).map((_, idx) => {
          const filled = idx < currentDay;
          return (
            <div
              key={idx}
              className={`w-4 h-4 md:w-5 md:h-5 rounded-full border transition-all ${
                filled ? "bg-[#DCA637] border-[#DCA637]" : "bg-white border-gray-300"
              }`}
            ></div>
          );
        })}
        {activeChallenge.duration > 12 && (
             <span className="text-xs text-gray-400 self-center">+{activeChallenge.duration - 12} more</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
      <Navbar />

      {/* HEADER */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#DCA637] blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide relative z-10">Habit Builder</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base relative z-10">Consistency is the only magic ingredient.</p>
      </div>

      <div className="max-w-4xl mx-auto -mt-24 px-4">
        
        {/* --- 0. EMAIL LOGIN (REQUIRED FOR NEON) --- */}
        {!isEmailSet ? (
             <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 text-center animate-in zoom-in">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3D1132]">
                    <User size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Track Your Progress</h2>
                <p className="text-gray-500 mb-6">Enter your email to load your challenge history from the cloud.</p>
                <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-md mx-auto">
                    <input 
                        required
                        type="email" 
                        placeholder="your@email.com" 
                        className="flex-1 p-3 border rounded-xl bg-gray-50 focus:border-[#DCA637] outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="bg-[#3D1132] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2a0b22]">
                        Start
                    </button>
                </form>
             </div>
        ) : (
            <>
                {/* --- 1. ACTIVE HERO CARD --- */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 relative">
                  {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                      <div className="text-6xl animate-bounce">🎉</div>
                    </div>
                  )}

                  <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                    <span className="text-xs font-bold text-[#DCA637] uppercase tracking-widest">Current Mission</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isLoading ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      <Zap size={10} fill="currentColor" /> {isLoading ? "SYNCING..." : "ONLINE"}
                    </span>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`p-4 rounded-xl ${activeChallenge.color} hidden md:block`}>{activeChallenge.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeChallenge.title}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">{activeChallenge.description}</p>
                      </div>
                    </div>

                    {/* Progress Visualization */}
                    <div className="mb-8">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-3">
                        <span>Day 1</span>
                        <span className="text-[#3D1132]">
                          Day {Math.min(currentDay, activeChallenge.duration)} / {activeChallenge.duration}
                        </span>
                        <span>Day {activeChallenge.duration}</span>
                      </div>
                      {renderProgressDots()}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      {isDoneToday ? (
                          <button
                            disabled
                            className="w-full md:flex-1 bg-green-100 text-green-700 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                          >
                            <CheckCircle size={18} /> COMPLETE! SEE YOU TOMORROW
                          </button>
                      ) : (
                          <button
                            onClick={handleCheckIn}
                            disabled={isLoading}
                            className="w-full md:flex-1 bg-[#DCA637] hover:bg-[#c4922f] text-[#3D1132] py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            {isLoading ? "SAVING..." : "LOG DAILY SKIN CHECK-IN"}
                          </button>
                      )}

                      <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 w-full md:w-auto">
                        <div className="bg-purple-100 p-2 rounded-full text-[#3D1132]">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Reward</p>
                          <p className="text-xs font-bold text-gray-900">{activeChallenge.reward}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 2. CHALLENGE ARCADE --- */}
                <div>
                   <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                      <h3 className="font-bold text-gray-900 text-lg">Explore Challenges</h3>
                      
                      {/* FILTER TABS */}
                      <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                        {["All", "Weekly", "Bi-Weekly", "Monthly", "Yearly"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                              activeTab === tab ? "bg-[#3D1132] text-white" : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                   </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredChallenges.length === 0 && (
                        <p className="text-gray-400 text-sm col-span-2 text-center py-8">No challenges found in this category.</p>
                    )}
                    
                    {filteredChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        onClick={() => switchChallenge(challenge)}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                      >
                        <div className="flex gap-4 items-start mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${challenge.color}`}>
                            {challenge.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#3D1132] transition-colors">
                              {challenge.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {challenge.duration} Days • {challenge.xp} XP
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{challenge.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}