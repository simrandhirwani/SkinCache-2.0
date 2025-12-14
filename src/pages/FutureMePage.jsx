"use client";

import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { GripVertical, Upload, Loader2, X, AlertTriangle, Sparkles } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// --- TEXT CONTENT ---
const SCENARIO_DESCRIPTIONS = {
  withCare: {
    title: "Projected: Skincache Routine",
    description: "Consistent use of Vitamin C and SPF preserves collagen density. The simulation predicts maintained 'subsurface scattering' (the glow of healthy skin), refined texture, and strong barrier function.",
    icon: <Sparkles className="w-5 h-5 text-green-600" />,
    colorClass: "text-green-700 bg-green-50 border-green-200"
  },
  withoutCare: {
    title: "Projected: No Intervention",
    description: "Simulation of 'Photo-Aging' and collagen breakdown. The result shows increased micro-texture (roughness), loss of color vitality (dullness), and deepened surface shadows due to dehydration.",
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    colorClass: "text-red-700 bg-red-50 border-red-200"
  }
};

export default function FutureMePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('withoutCare'); 
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // --- DROPZONE HANDLER ---
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setUploadedImage(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      setIsScanning(true);
      setScanComplete(false);
      
      // Simulate "Analysis" calculation time
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
      }, 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: false
  });

  const handleRemoveImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setScanComplete(false);
  };

  const currentScenario = SCENARIO_DESCRIPTIONS[selectedScenario];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20 relative">
      <Navbar />

      {/* ==================================================================
          THE REALISM ENGINE (SVG FILTERS) v4
      ================================================================== */}
      <svg className="hidden">
        <defs>
          
          {/* FILTER 1: THE "NEGLECT" LOOK (Tired, Rough, Dull) - Unchanged */}
          <filter id="skin-damage">
             <feConvolveMatrix order="3,3" kernelMatrix="0 -1 0  -1 5 -1  0 -1 0" in="SourceGraphic" result="sharpened" />
             <feColorMatrix type="saturate" values="0.5" in="sharpened" result="greyed" />
             <feComponentTransfer in="greyed" result="tired">
                <feFuncR type="linear" slope="1.1" intercept="-0.05"/>
                <feFuncG type="linear" slope="1.1" intercept="-0.05"/>
                <feFuncB type="linear" slope="1.1" intercept="-0.05"/>
             </feComponentTransfer>
             <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="grain" />
             <feComposite operator="arithmetic" k1="0" k2="1" k3="0.1" k4="0" in="tired" in2="grain" />
          </filter>


          {/* FILTER 2: THE "CARE" LOOK (FIXED: Realistic Hydration Sheen) */}
          <filter id="skin-glow">
            {/* Create a blurred version of the image. 
                stdDeviation="3" gives a tight blur, simulating light hitting the surface over contours.
            */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            
            {/* Blend using "soft-light". 
                Unlike "screen" (which adds brightness), soft-light adds a gentle sheen.
                It makes the highlights pop subtly like hydrated skin, without blowing out the image.
            */}
            <feBlend mode="soft-light" in="blur" in2="SourceGraphic" result="softGlow" />
            
            {/* A very tiny saturation boost (1.05) just to make it look healthy, not fake.
            */}
            <feColorMatrix type="saturate" values="1.05" in="softGlow" />
          </filter>

        </defs>
      </svg>
      
      {/* --- HEADER --- */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#DCA637] blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide relative z-10">Your Skin's Future Trajectory</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base relative z-10">See the impact of "Photo-Aging" vs. "Barrier Protection"</p>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="max-w-5xl mx-auto -mt-16 px-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* --- IMAGE COMPARISON SECTION --- */}
          <div className="relative flex flex-col md:flex-row h-[500px] md:h-[500px]">
            
            {/* LEFT: Today's Image (Original) */}
            <div className="flex-1 relative overflow-hidden bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200">
              {uploadedImage ? (
                <>
                  <img 
                    src={uploadedImage.preview} 
                    alt="Your current scan" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full transition-all z-20"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10">
                    TODAY
                  </div>
                </>
              ) : (
                <div 
                  {...getRootProps()} 
                  className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'bg-[#DCA637]/10 border-4 border-dashed border-[#DCA637]' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Upload size={32} className="text-[#DCA637]" />
                  </div>
                  <p className="text-gray-600 font-bold">Upload Selfie</p>
                  <p className="text-gray-400 text-xs mt-1">Supports JPG, PNG</p>
                </div>
              )}
            </div>

            {/* CENTER: Divider (Desktop Only) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 z-10 hidden md:flex items-center justify-center pointer-events-none">
               <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-400">
                 <GripVertical size={20} />
               </div>
            </div>
            
            {/* RIGHT: Future Image (Filtered via SVG) */}
            <div className="flex-1 relative overflow-hidden bg-gray-100">
              {isScanning ? (
                <div className="w-full h-full bg-[#1A0B2E] flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#DCA637] animate-spin mb-4" />
                  <p className="text-white font-bold tracking-wider text-sm">CALCULATING BARRIER INTEGRITY...</p>
                  <p className="text-purple-300 text-xs mt-2">Projecting +5 Years</p>
                </div>
              ) : scanComplete && uploadedImage ? (
                <>
                    {/* --- THE FILTER LOGIC --- */}
                    <div className="w-full h-full relative">
                        <img 
                            src={uploadedImage.preview} 
                            alt="Future Prediction" 
                            style={{ 
                                // CALL THE ID FROM THE SVG SECTION ABOVE
                                filter: selectedScenario === 'withCare' ? 'url(#skin-glow)' : 'url(#skin-damage)',
                                transition: 'filter 0.8s ease-in-out' // Smooth morphing
                            }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10 text-right">
                        5 YEARS LATER
                        <span className={`block text-[10px] ${selectedScenario === 'withCare' ? 'text-green-300' : 'text-red-300'}`}>
                            {selectedScenario === 'withCare' ? 'Barrier Protected' : 'Structural Fatigue'}
                        </span>
                    </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 border-l border-gray-100">
                  <Sparkles size={48} className="mb-3 opacity-20" />
                  <p className="text-sm font-medium">Prediction Preview</p>
                </div>
              )}
            </div>
          </div>

          {/* --- CONTROLS --- */}
          <div className="p-8 md:p-10">
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Toggles */}
                <div className="flex-shrink-0 w-full md:w-auto">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Trajectory</p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setSelectedScenario('withCare')}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all text-left w-full md:w-64 ${
                                selectedScenario === 'withCare'
                                ? 'bg-green-50 border-green-200 shadow-sm ring-1 ring-green-200'
                                : 'bg-white border-gray-200 hover:border-green-200 hover:bg-green-50/50'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedScenario === 'withCare' ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                                {selectedScenario === 'withCare' && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                            </div>
                            <div>
                                <span className={`block text-sm font-bold ${selectedScenario === 'withCare' ? 'text-green-900' : 'text-gray-600'}`}>With Skincache</span>
                                <span className="text-xs text-green-700/70 block">Protective Routine</span>
                            </div>
                        </button>

                        <button 
                            onClick={() => setSelectedScenario('withoutCare')}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all text-left w-full md:w-64 ${
                                selectedScenario === 'withoutCare'
                                ? 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-200'
                                : 'bg-white border-gray-200 hover:border-red-200 hover:bg-red-50/50'
                            }`}
                        >
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedScenario === 'withoutCare' ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                                {selectedScenario === 'withoutCare' && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                            </div>
                            <div>
                                <span className={`block text-sm font-bold ${selectedScenario === 'withoutCare' ? 'text-red-900' : 'text-gray-600'}`}>Without Care</span>
                                <span className="text-xs text-red-700/70 block">No Intervention</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Description Text */}
                <div className={`flex-1 rounded-2xl p-6 border transition-colors duration-500 ${
                    selectedScenario === 'withCare' 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-red-50 border-red-100'
                }`}>
                    <div className="flex items-center gap-2 mb-3">
                        {currentScenario.icon}
                        <h3 className="text-lg font-bold text-gray-800">
                            {currentScenario.title}
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {currentScenario.description}
                    </p>
                    
                    <button className="bg-[#1A0B2E] hover:bg-[#2d1250] text-white py-3 px-6 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg">
                        <Sparkles size={16} className="text-[#DCA637]"/>
                        GET THIS ROUTINE
                    </button>
                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}