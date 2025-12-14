"use client";

import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { GripVertical, Upload, Loader2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

// --- SCENARIO DESCRIPTIONS ---
const SCENARIO_DESCRIPTIONS = {
  withCare: {
    title: "With Skincache Routine",
    description: "Based on your current skin analysis, following a personalized Skincache routine with targeted actives, proper hydration, and consistent protection can help maintain your skin's elasticity and reduce visible signs of aging. Our AI predicts minimal fine lines, preserved collagen density, and maintained skin barrier function over the next 5 years.",
    futureImageSrc: "https://placehold.co/400x500/e2e8f0/3D1132?text=5+Years+Later+(With+Care)"
  },
  withoutCare: {
    title: "Without Intervention",
    description: "Without a structured skincare routine, your skin may experience accelerated aging due to environmental stressors, UV exposure, and natural collagen depletion. Our prediction model shows potential for increased fine lines, reduced skin elasticity, and compromised barrier function. Early intervention can significantly alter this trajectory.",
    futureImageSrc: "https://placehold.co/400x500/3D1132/DCA637?text=5+Years+Later+(Without+Care)"
  }
};

export default function FutureMePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('withoutCare'); // 'withCare' or 'withoutCare'
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Dropzone Logic
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setUploadedImage(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      setIsScanning(true);
      setScanComplete(false);
      
      // Simulate scanning process
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
      }, 2500);
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
      
      {/* --- HEADER --- */}
      <div className="bg-[#1A0B2E] text-white pt-28 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#DCA637] blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide relative z-10">Your Skin's Future Trajectory</h1>
        <p className="text-purple-200 mt-2 text-sm md:text-base relative z-10">See how your skin could look in 5 years with or without proper care</p>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="max-w-4xl mx-auto -mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* --- IMAGE COMPARISON SECTION --- */}
          <div className="relative flex flex-col md:flex-row h-96">
            {/* Today's Image (Left) - Upload Area */}
            <div className="flex-1 relative overflow-hidden bg-gray-100">
              {uploadedImage ? (
                <>
                  <img 
                    src={uploadedImage.preview} 
                    alt="Your current scan" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div 
                  {...getRootProps()} 
                  className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'bg-[#DCA637]/20 border-4 border-dashed border-[#DCA637]' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload size={48} className="text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm font-medium px-4 text-center">
                    {isDragActive ? 'Drop your photo here' : 'Click or drag to upload your current photo'}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 px-4 text-center">
                    Upload a clear front-facing photo for analysis
                  </p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                TODAY <span className="font-normal opacity-80">(Current Scan)</span>
              </div>
            </div>

            {/* Visual Divider */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-[#DCA637] z-10 hidden md:flex items-center justify-center">
              <div className="bg-[#DCA637] p-1 rounded-full text-[#3D1132] shadow-sm">
                <GripVertical size={16} />
              </div>
            </div>
            
            {/* Future Image (Right) - Prediction Result */}
            <div className="flex-1 relative overflow-hidden bg-gray-100">
              {isScanning ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1A0B2E] to-[#3D1132] flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-[#DCA637] animate-spin mb-4" />
                  <p className="text-white font-bold tracking-wider text-sm">ANALYZING YOUR SKIN...</p>
                  <p className="text-purple-200 text-xs mt-2">Generating 5-year prediction</p>
                </div>
              ) : scanComplete && uploadedImage ? (
                <img 
                  src={currentScenario.futureImageSrc} 
                  alt="Future Prediction" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <p className="text-gray-400 text-sm text-center px-4">
                    Upload a photo to see your predicted future
                  </p>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                5 YEARS LATER <span className="font-normal opacity-80">(Predicted)</span>
              </div>
            </div>
          </div>

          {/* --- CONTENT SECTION --- */}
          <div className="p-8 text-center">
            
            {/* Scenario Toggles */}
            <div className="inline-flex bg-gray-100 rounded-full p-1 mb-8">
              <button 
                onClick={() => setSelectedScenario('withCare')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedScenario === 'withCare'
                    ? 'bg-[#DCA637] text-[#3D1132] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Scenario A: With Skincache Routine
              </button>
              <button 
                onClick={() => setSelectedScenario('withoutCare')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedScenario === 'withoutCare'
                    ? 'bg-[#DCA637] text-[#3D1132] shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Scenario B: Without Intervention
              </button>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-bold text-[#3D1132] mb-3">
                {currentScenario.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentScenario.description}
              </p>
            </div>

            {/* CTA Button */}
            <button className="bg-[#DCA637] hover:bg-[#c4922f] text-[#3D1132] py-3 px-10 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
              UPDATE MY PREVENTATIVE ROUTINE
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

