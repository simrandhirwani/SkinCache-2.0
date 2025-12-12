"use client";

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Star, Shield, Clock, CheckCircle, User, MapPin, CreditCard, X, Stethoscope } from 'lucide-react';

// --- MOCK DATA: DOCTORS ---
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Aarav Patel",
    speciality: "Acne & Scarring Specialist",
    education: "MD Dermatology, AIIMS",
    experience: "8 Years",
    rating: 4.9,
    reviewsCount: 124,
    price: 399,
    location: "Mumbai, Bandra",
    patientReviews: [
      "He cured my cystic acne in 3 months. Very patient listener.",
      "Doesn't prescribe unnecessary expensive products. Highly recommend."
    ]
  },
  {
    id: 2,
    name: "Dr. Sneha Gupta",
    speciality: "Trichologist (Hair & Scalp)",
    education: "MBBS, DDVL",
    experience: "5 Years",
    rating: 4.7,
    reviewsCount: 89,
    price: 499,
    location: "Bangalore, Indiranagar",
    patientReviews: [
      "Helped with my postpartum hair loss. The PRP treatment suggestions worked.",
      "Very knowledgeable about scalp health."
    ]
  },
  {
    id: 3,
    name: "Dr. Meera Rao",
    speciality: "Aesthetic & Anti-Aging",
    education: "Fellowship in Aesthetics (UK)",
    experience: "12 Years",
    rating: 5.0,
    reviewsCount: 210,
    price: 799,
    location: "Delhi, GK-1",
    patientReviews: [
      "Best for fillers and botox. Natural results.",
      "She explains the science behind every procedure."
    ]
  },
  {
    id: 4,
    name: "Dr. Arjun Reddy",
    speciality: "Pediatric Dermatology",
    education: "MD, DNB",
    experience: "15 Years",
    rating: 4.8,
    reviewsCount: 156,
    price: 299,
    location: "Hyderabad, Jubilee Hills",
    patientReviews: [
      "Great with kids. Treated my son's eczema very effectively.",
      "Very affordable consultation for the level of expertise."
    ]
  },
  {
    id: 5,
    name: "Dr. Kavita Shah",
    speciality: "General Skin Health",
    education: "MBBS, DVD",
    experience: "6 Years",
    rating: 4.6,
    reviewsCount: 75,
    price: 250,
    location: "Pune, Koregaon Park",
    patientReviews: [
      "Solved my fungal infection issue quickly.",
      "Good for general consultation and routine checks."
    ]
  }
];

export default function DermatologistPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleBook = (doctorName) => {
    alert(`Redirecting to Payment Gateway for ${doctorName}...\n(Demo Only)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      <Navbar />
      {/* --- HEADER --- */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">Dermatologist Connect</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base">Expert advice from India's top certified dermatologists.</p>
        
        {/* TRUST SIGNALS */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-purple-300">
           <div className="flex items-center gap-1"><Shield size={14}/> Verified Degrees</div>
           <div className="flex items-center gap-1"><CheckCircle size={14}/> 100% Private</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto -mt-16 px-4 pb-12 space-y-8">
        
        {/* --- SECTION 1: QUICK SERVICES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#3D1132] mb-2">Quick Scan Review</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Upload photos of your concern. Get a text-based diagnosis and prescription within 24 hours.
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">₹199 <span className="text-xs font-normal text-gray-400">/ session</span></span>
              <button className="bg-[#DCA637] text-[#3D1132] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c4922f] transition-all">
                Request Review
              </button>
            </div>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#3D1132] mb-2">Acne / Spot Triage</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Detailed analysis of recurring acne patterns with diet & routine changes. Video consult included.
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-lg font-bold text-gray-900">₹299 <span className="text-xs font-normal text-gray-400">/ session</span></span>
              <button className="bg-[#DCA637] text-[#3D1132] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#c4922f] transition-all">
                Start Triage
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: DOCTOR LIST --- */}
        <div>
           <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
             <Stethoscope size={20} className="text-[#3D1132]"/> Our Medical Advisors
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {DOCTORS.map((doc) => (
               <div 
                 key={doc.id} 
                 onClick={() => setSelectedDoctor(doc)}
                 className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
               >
                 <div className="flex items-center gap-4 mb-4">
                   <img src={`https://placehold.co/100x100/3D1132/DCA637?text=${doc.name.split(' ')[1]?.[0] || 'Dr'}`} alt="Doc" className="w-14 h-14 rounded-full object-cover border-2 border-purple-50" />
                   <div>
                     <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#DCA637] transition-colors">{doc.name}</h3>
                     <p className="text-xs text-gray-500 font-medium">{doc.speciality}</p>
                     <div className="flex items-center gap-1 mt-1">
                       <Star size={10} fill="#DCA637" stroke="none"/>
                       <span className="text-xs font-bold text-gray-700">{doc.rating}</span>
                       <span className="text-[10px] text-gray-400">({doc.reviewsCount} reviews)</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1"><MapPin size={12}/> {doc.location}</div>
                    <div className="font-bold text-[#3D1132]">₹{doc.price}</div>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* --- DOCTOR PROFILE MODAL --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-[#3D1132] p-6 text-white relative">
              <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={20}/></button>
              <div className="flex gap-4 items-center">
                <img src={`https://placehold.co/100x100/DCA637/3D1132?text=${selectedDoctor.name.split(' ')[1]?.[0] || 'Dr'}`} className="w-16 h-16 rounded-full border-2 border-white" />
                <div>
                  <h2 className="font-bold text-lg">{selectedDoctor.name}</h2>
                  <p className="text-purple-200 text-xs">{selectedDoctor.education} • {selectedDoctor.experience} Exp</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <p className="text-xs text-gray-400 uppercase font-bold">Consultation Fee</p>
                   <p className="text-xl font-bold text-[#3D1132]">₹{selectedDoctor.price}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-gray-400 uppercase font-bold">Next Available</p>
                   <p className="text-sm font-bold text-green-600 flex items-center gap-1 justify-end"><Clock size={12}/> Today, 4:00 PM</p>
                 </div>
              </div>

              <h4 className="font-bold text-gray-900 text-sm mb-3">Patient Reviews</h4>
              <div className="bg-gray-50 rounded-xl p-3 mb-6 space-y-3 max-h-40 overflow-y-auto">
                {selectedDoctor.patientReviews.map((review, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="mt-1"><User size={12} className="text-gray-400"/></div>
                    <p className="text-xs text-gray-600 italic">"{review}"</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleBook(selectedDoctor.name)}
                className="w-full bg-[#DCA637] hover:bg-[#c4922f] text-[#3D1132] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard size={16}/> Pay ₹{selectedDoctor.price} & Book
              </button>
              
              <p className="text-[10px] text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
                <Shield size={10}/> Secure Payment (demo)
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

