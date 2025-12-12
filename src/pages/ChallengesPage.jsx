"use client";

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Trophy, Calendar, CheckCircle, Lock, Zap, Droplets, Sun, Moon, Shield, Award, Flame, Sparkles, Layers } from 'lucide-react';

// --- MOCK DATA: CHALLENGES ---
const CHALLENGES = [
  {
    id: 1,
    title: "7-Day Hydration Hero",
    description: "Drink 3L water & use moisturizer twice daily. Rebuild your barrier.",
    category: "Weekly",
    duration: 7,
    currentDay: 5,
    reward: "Hydration Badge",
    xp: 500,
    icon: <Droplets className="text-blue-500" size={22} />,
    color: "bg-blue-50",
    status: "Active",
  },
  {
    id: 2,
    title: "Sunscreen Streak (30 Days)",
    description: "Apply SPF 50 every morning, even indoors. No excuses.",
    category: "Monthly",
    duration: 30,
    currentDay: 12,
    reward: "Sun Warrior Title",
    xp: 2000,
    icon: <Sun className="text-orange-500" size={22} />,
    color: "bg-orange-50",
    status: "Paused",
  },
  {
    id: 3,
    title: "No-Sugar November",
    description: "Cut added sugars to reduce insulin spikes and acne inflammation.",
    category: "Monthly",
    duration: 30,
    currentDay: 0,
    reward: "Detox Master",
    xp: 2500,
    icon: <Shield className="text-red-500" size={22} />,
    color: "bg-red-50",
    status: "Locked",
  },
  {
    id: 4,
    title: "The Double Cleanse Week",
    description: "Oil cleanser + Water cleanser every night for deep pore clearing.",
    category: "Weekly",
    duration: 7,
    currentDay: 2,
    reward: "Pore Perfection",
    xp: 600,
    icon: <Sparkles className="text-purple-500" size={22} />,
    color: "bg-purple-50",
    status: "Unlocked",
  },
  {
    id: 5,
    title: "Retinol Ramp-Up",
    description: "Introduce Retinol 2x/week for a month without irritation.",
    category: "Monthly",
    duration: 30,
    currentDay: 3,
    reward: "Anti-Aging Pro",
    xp: 1500,
    icon: <Moon className="text-indigo-500" size={22} />,
    color: "bg-indigo-50",
    status: "Locked",
  },
  {
    id: 6,
    title: "Year of Glow",
    description: "Log your skin condition weekly for a full year to track seasonality.",
    category: "Yearly",
    duration: 52,
    currentDay: 8,
    reward: "SkinCache Legend",
    xp: 10000,
    icon: <Trophy className="text-yellow-600" size={22} />,
    color: "bg-yellow-50",
    status: "Paused",
  },
  {
    id: 7,
    title: "Barrier Rehab Sprint",
    description: "No exfoliants for 7 days. Only hydrate + SPF.",
    category: "Weekly",
    duration: 7,
    currentDay: 4,
    reward: "Barrier Guardian",
    xp: 550,
    icon: <Shield className="text-emerald-500" size={22} />,
    color: "bg-emerald-50",
    status: "Unlocked",
  },
  {
    id: 8,
    title: "Pigmentation Patrol",
    description: "Apply Vitamin C + SPF daily for a month, track photo results.",
    category: "Monthly",
    duration: 30,
    currentDay: 9,
    reward: "Even Tone Medal",
    xp: 2200,
    icon: <Sun className="text-amber-500" size={22} />,
    color: "bg-amber-50",
    status: "Unlocked",
  },
  {
    id: 9,
    title: "Texture Turnaround",
    description: "Use gentle AHA 1x/week and moisturize nightly for 8 weeks.",
    category: "Monthly",
    duration: 56,
    currentDay: 14,
    reward: "Smooth Skin Laurel",
    xp: 3200,
    icon: <Layers className="text-slate-500" size={22} />,
    color: "bg-slate-50",
    status: "Unlocked",
  },
  {
    id: 10,
    title: "Sleep & Skin Reset",
    description: "Sleep 7.5+ hrs nightly and log sleep/skin daily for 21 days.",
    category: "Monthly",
    duration: 21,
    currentDay: 6,
    reward: "Rested Radiance",
    xp: 1400,
    icon: <Moon className="text-blue-400" size={22} />,
    color: "bg-blue-50",
    status: "Unlocked",
  },
];

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);
  const [progress, setProgress] = useState(CHALLENGES[0].currentDay);
  const [streak, setStreak] = useState(14);
  const [showConfetti, setShowConfetti] = useState(false);

  const filteredChallenges =
    activeTab === "All"
      ? CHALLENGES.filter((c) => c.id !== activeChallenge.id)
      : CHALLENGES.filter(
          (c) => c.category.toLowerCase().includes(activeTab.toLowerCase()) && c.id !== activeChallenge.id
        );

  const handleCheckIn = () => {
    if (progress < activeChallenge.duration) {
      setProgress((prev) => prev + 1);
      setShowConfetti(true);
      setStreak((prev) => prev + 1);
      alert("Streak Increased! Progress logged.");
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      alert("Challenge already completed for today!");
    }
  };

  const switchChallenge = (challenge) => {
    if (challenge.status === "Locked") {
      alert("This challenge is locked. Unlock it by leveling up!");
      return;
    }
    setActiveChallenge(challenge);
    setProgress(challenge.currentDay);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderProgressDots = () => {
    const count = Math.min(activeChallenge.duration, 12);
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: count }).map((_, idx) => {
          const filled = idx < progress;
          return (
            <button
              key={idx}
              onClick={() => setProgress(idx + 1)}
              className={`w-4 h-4 md:w-5 md:h-5 rounded-full border transition-all ${
                filled ? "bg-[#DCA637] border-[#DCA637]" : "bg-white border-gray-300"
              }`}
              aria-label={`Set progress to day ${idx + 1}`}
            ></button>
          );
        })}
        {activeChallenge.duration > count && (
          <span className="text-[10px] text-gray-400 ml-1">+{activeChallenge.duration - count} more</span>
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

        {/* GLOBAL STATS */}
        <div className="flex justify-center gap-8 mt-6 relative z-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#DCA637] font-bold text-xl">
              <Flame fill="#DCA637" size={20} /> {streak}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-purple-300">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-white font-bold text-xl">
              <Trophy size={20} /> 2,450
            </div>
            <span className="text-[10px] uppercase tracking-wider text-purple-300">Total XP</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-24 px-4">
        {/* --- 1. ACTIVE HERO CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 relative">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}

          <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-[#DCA637] uppercase tracking-widest">Current Mission</span>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Zap size={10} fill="currentColor" /> ACTIVE
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
                  Day {Math.min(progress, activeChallenge.duration)} / {activeChallenge.duration}
                </span>
                <span>Day {activeChallenge.duration}</span>
              </div>
              {renderProgressDots()}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button
                onClick={handleCheckIn}
                className="w-full md:flex-1 bg-[#DCA637] hover:bg-[#c4922f] text-[#3D1132] py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> LOG DAILY SKIN CHECK-IN
              </button>

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
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Explore Challenges</h3>
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              {["All", "Weekly", "Monthly", "Yearly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    activeTab === tab ? "bg-[#3D1132] text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => switchChallenge(challenge)}
                className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
                  challenge.status === "Locked" ? "opacity-70 grayscale-[0.5]" : ""
                }`}
              >
                {challenge.status === "Locked" && (
                  <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 p-1.5 rounded-full">
                    <Lock size={14} />
                  </div>
                )}

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

                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{challenge.description}</p>

                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3D1132] h-full rounded-full"
                    style={{ width: `${Math.min((challenge.currentDay / challenge.duration) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="mt-3 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-gray-400">
                    {challenge.currentDay}/{challenge.duration} completed
                  </span>
                  {challenge.status === "Paused" && <span className="text-[#DCA637]">Resume</span>}
                  {challenge.status === "Unlocked" && <span className="text-[#3D1132]">Start Now</span>}
                  {challenge.status === "Completed" && <span className="text-green-600">Completed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

