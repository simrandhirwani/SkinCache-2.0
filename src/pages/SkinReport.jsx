import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Search, FlaskConical, CloudSun, ShieldAlert, Moon, BedDouble, Upload, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const SkinReport = () => {
  const navigate = useNavigate();
  
  // State Management
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [useDefaultImage, setUseDefaultImage] = useState(true);

  // Simulated Backend Data (Pre-analysis vs Post-analysis)
  const initialMetrics = {
    left: [
      { id: 1, title: "Visual Analysis", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: Search },
      { id: 2, title: "Chemical Load", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: FlaskConical },
      { id: 3, title: "Environmental Stress", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: CloudSun }
    ],
    right: [
      { id: 4, title: "Skin Barrier", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: ShieldAlert },
      { id: 5, title: "Hormonal Cycle", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: Moon },
      { id: 6, title: "Lifestyle Log", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500 border-gray-200", icon: BedDouble }
    ]
  };

  const analyzedMetrics = {
    left: [
      { id: 1, title: "Visual Analysis", status: "Active Inflammation Zones Detected", color: "bg-red-100 text-red-700 border-red-200", icon: Search, detail: "Our AI detected 3 distinct zones of sub-clinical inflammation across the cheeks and forehead, suggesting a compromised barrier." },
      { id: 2, title: "Chemical Load", status: "Overload Warning: Retinol + Vit C Conflict", color: "bg-red-100 text-red-700 border-red-200", icon: FlaskConical, detail: "Your routine indicates simultaneous use of high-strength Retinol and Vitamin C. This combination is causing cumulative irritation." },
      { id: 3, title: "Environmental Stress", status: "AQI: Unhealthy (PM 2.5 High)", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: CloudSun, detail: "Your location's current Air Quality Index is poor. Particulate matter (PM 2.5) is likely contributing to clogged pores." }
    ],
    right: [
      { id: 4, title: "Skin Barrier", status: "Caution: Lipid Layer Thinning", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: ShieldAlert, detail: "Trans-epidermal water loss is higher than average, indicating your lipid barrier needs reinforcement with ceramides." },
      { id: 5, title: "Hormonal Cycle", status: "Phase: Luteal. Acne Risk: High.", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Moon, detail: "You are in the luteal phase. Progesterone is peaking, increasing sebum production and the likelihood of hormonal breakouts." },
      { id: 6, title: "Lifestyle Log", status: "Sleep Debt: Recovery Slow", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: BedDouble, detail: "Consecutive nights of less than 7 hours of sleep are impairing your skin's overnight repair processes." }
    ]
  };

  const currentMetrics = resultsReady ? analyzedMetrics : initialMetrics;

  // Dropzone Logic
  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      setUseDefaultImage(false);
      setIsProcessing(true);
      setResultsReady(false);
      // Simulate backend processing
      setTimeout(() => {
        setIsProcessing(false);
        setResultsReady(true);
      }, 3000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []}, 
    maxFiles: 1,
    noClick: false,
    noKeyboard: false
  });

  // Component for Metric Cards
  const MetricCard = ({ item }) => (
    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white flex flex-col gap-2 transition-all duration-300">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-[#F3E8FF] rounded-lg text-[#1A0B2E]">
          <item.icon size={20} />
        </div>
        <h3 className="font-bold text-[#1A0B2E]">{item.title}</h3>
      </div>
      <div className={`text-xs font-semibold px-3 py-2 rounded-lg border ${item.color} transition-all duration-300`}>
        {item.status}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <Navbar />
      
      {/* 1. Header Section */}
      <div className="bg-[#1A0B2E] pt-28 pb-24 px-6">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your Biological Skin Profile</h1>
            <p className="text-[#D8B4FE] text-lg font-light">Deep analysis of your dermatological data</p>
        </div>
      </div>

      {/* 2. Main Floating Dashboard Card */}
      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
          
          <div className="p-8 md:p-12 grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Metrics */}
            <div className="space-y-6">
              {currentMetrics.left.map(m => <MetricCard key={m.id} item={m} />)}
            </div>

            {/* Center: Image Upload & Scan Area */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div {...getRootProps()} className={`relative w-full max-w-[300px] aspect-[3/4] rounded-3xl border-4 ${file || useDefaultImage ? 'border-transparent' : 'border-dashed border-gray-300'} overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors`}>
                <input {...getInputProps()} />
                
                {useDefaultImage && !file ? (
                  // Default Image State (skinreport.png)
                  <>
                    <img src="/skinreport.png" alt="Skin report preview" className="absolute inset-0 w-full h-full object-cover" />
                    {isProcessing && (
                      // Processing State with Scanning Animation
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FACC15]/30 to-transparent animate-scan"></div>
                          <Loader2 className="w-12 h-12 text-[#FACC15] animate-spin mb-4" />
                          <p className="text-white font-bold tracking-wider">PROCESSING...</p>
                      </div>
                    )}
                    {resultsReady && (
                      // Final Result State with Static Overlay
                      <div className="absolute inset-0 z-10 pointer-events-none">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#FACC15] shadow-[0_0_15px_#FACC15]"></div>
                          <div className="absolute inset-0 border-2 border-[#FACC15]/50 rounded-3xl"></div>
                      </div>
                    )}
                  </>
                ) : !file ? (
                  // Initial Upload State
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mb-4 mx-auto bg-[#F3E8FF] rounded-full flex items-center justify-center text-[#CA8A04]">
                        <Upload size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">
                      {isDragActive ? "Drop image here..." : "Drag & drop your face scan, or click to upload."}
                    </p>
                  </div>
                ) : (
                  // Image Selected State
                  <>
                    <img src={file.preview} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(file.preview)} />
                    
                    {isProcessing && (
                        // Processing State with Scanning Animation
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FACC15]/30 to-transparent animate-scan"></div>
                            <Loader2 className="w-12 h-12 text-[#FACC15] animate-spin mb-4" />
                            <p className="text-white font-bold tracking-wider">PROCESSING...</p>
                        </div>
                    )}
                    {resultsReady && (
                        // Final Result State with Static Overlay
                        <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#FACC15] shadow-[0_0_15px_#FACC15]"></div>
                            <div className="absolute inset-0 border-2 border-[#FACC15]/50 rounded-3xl"></div>
                        </div>
                    )}
                  </>
                )}
              </div>
              {/* Analyze Button for Default Image */}
              {useDefaultImage && !file && !isProcessing && !resultsReady && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProcessing(true);
                    setResultsReady(false);
                    setTimeout(() => {
                      setIsProcessing(false);
                      setResultsReady(true);
                    }, 3000);
                  }}
                  className="px-6 py-2 rounded-lg font-semibold text-sm text-[#1A0B2E] bg-gradient-to-r from-[#FACC15] to-[#CA8A04] hover:shadow-lg transition-all"
                >
                  Analyze Current Image
                </button>
              )}
            </div>

            {/* Right Metrics */}
            <div className="space-y-6">
              {currentMetrics.right.map(m => <MetricCard key={m.id} item={m} />)}
            </div>
          </div>

          {/* Footer Toggle Button */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full py-4 rounded-xl font-bold tracking-widest text-sm shadow-lg text-[#1A0B2E] bg-gradient-to-r from-[#FACC15] to-[#CA8A04] hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              {showDetails ? "HIDE DETAILED REPORT" : "VIEW FULL DETAILED REPORT & RECOMMENDATIONS"}
            </button>
          </div>
        </div>

        {/* 3. Detailed Report Section (Conditionally Rendered) */}
        {showDetails && resultsReady && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 animate-in fade-in slide-in-from-top-10">
                <h2 className="text-3xl font-serif text-[#1A0B2E] mb-8 text-center">Detailed Clinical Analysis</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        {analyzedMetrics.left.map(m => (
                            <div key={m.id}>
                                <h3 className="flex items-center gap-2 font-bold text-lg text-[#1A0B2E] mb-2">
                                    <m.icon size={20} className="text-[#CA8A04]" /> {m.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{m.detail}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-8">
                        {analyzedMetrics.right.map(m => (
                            <div key={m.id}>
                                <h3 className="flex items-center gap-2 font-bold text-lg text-[#1A0B2E] mb-2">
                                    <m.icon size={20} className="text-[#CA8A04]" /> {m.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{m.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default SkinReport;

