import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Search, FlaskConical, CloudSun, ShieldAlert, Moon, BedDouble, Upload, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const SkinReport = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [location, setLocation] = useState({ lat: "0", lon: "0" });
  
  // Default Metrics
  const [metrics, setMetrics] = useState({
    left: [
      { id: 1, title: "Visual Analysis", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: Search, detail: "Upload photo..." },
      { id: 2, title: "Chemical Load", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: FlaskConical, detail: "..." },
      { id: 3, title: "Environmental Stress", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: CloudSun, detail: "..." }
    ],
    right: [
      { id: 4, title: "Skin Barrier", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: ShieldAlert, detail: "..." },
      { id: 5, title: "Hormonal Cycle", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: Moon, detail: "..." },
      { id: 6, title: "Lifestyle Log", status: "Waiting for scan...", color: "bg-gray-100 text-gray-500", icon: BedDouble, detail: "..." }
    ]
  });

  // 1. Get Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude.toString(), lon: pos.coords.longitude.toString() }),
        () => console.log("No location")
      );
    }
  }, []);

  // 2. Analyze via YOUR Backend (Proxy)
  const analyzeSkin = async (imageFile) => {
    setIsProcessing(true);
    setResultsReady(false);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('lat', location.lat);
      formData.append('lon', location.lon);

      // Call YOUR Render Backend
      // Replace with your actual Render URL
      const res = await fetch('https://skincache-2-0.onrender.com/analyze', {
        method: 'POST',
        body: formData, 
      });

      const data = await res.json();
      
      if (data.face && data.face.faces && data.face.faces.length > 0) {
         const skin = data.face.faces[0].attributes.skinstatus;
         const weather = data.weather;
         
         // --- LOGIC MAP ---
         const acne = skin.acne; 
         const health = skin.health;
         const stain = skin.stain;
         const darkCircle = skin.dark_circle;
         const aqi = weather.aqi;

         setMetrics({
            left: [
                { id: 1, title: "Visual Analysis", status: acne > 20 ? "Active Inflammation" : "Clear & Healthy", color: acne > 20 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700", icon: Search, detail: `Acne Score: ${acne.toFixed(0)} | Health: ${health.toFixed(0)}%` },
                { id: 2, title: "Chemical Load", status: health < 50 ? "Possible Irritation" : "Balanced", color: health < 50 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700", icon: FlaskConical, detail: health < 50 ? "Low health score indicates potential barrier damage." : "Skin tolerance is good." },
                { id: 3, title: "Environmental Stress", status: aqi > 3 ? "High Pollution" : "Optimal Air", color: aqi > 3 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700", icon: CloudSun, detail: `Local Air Quality Index: ${aqi}/5` }
            ],
            right: [
                { id: 4, title: "Skin Barrier", status: stain > 30 ? "Pigmentation Risk" : "Intact", color: stain > 30 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700", icon: ShieldAlert, detail: `Pigmentation levels at ${stain.toFixed(0)}%.` },
                { id: 5, title: "Hormonal Cycle", status: acne > 30 ? "Luteal Phase Risk" : "Stable", color: acne > 30 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700", icon: Moon, detail: "Based on sebum/acne correlation." },
                { id: 6, title: "Lifestyle Log", status: darkCircle > 25 ? "Sleep Debt" : "Well Rested", color: darkCircle > 25 ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700", icon: BedDouble, detail: `Dark circle intensity: ${darkCircle.toFixed(0)}%` }
            ]
         });
         setResultsReady(true);
      } else {
         alert("No face detected! Please try again.");
      }

    } catch (err) {
      console.error(err);
      alert("Server is waking up (wait 30s) or API Key error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      analyzeSkin(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []}, maxFiles: 1 });

  const MetricCard = ({ item }) => (
    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white flex flex-col gap-2 transition-all duration-300">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-[#F3E8FF] rounded-lg text-[#1A0B2E]"><item.icon size={20} /></div>
        <h3 className="font-bold text-[#1A0B2E]">{item.title}</h3>
      </div>
      <div className={`text-xs font-semibold px-3 py-2 rounded-lg border ${item.color} transition-all duration-300`}>{item.status}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <Navbar />
      <div className="bg-[#1A0B2E] pt-28 pb-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Your Biological Skin Profile</h1>
        <p className="text-[#D8B4FE]">AI-Powered Dermatological Analysis</p>
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
          <div className="p-8 md:p-12 grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Metrics */}
            <div className="space-y-6">{metrics.left.map(m => <MetricCard key={m.id} item={m} />)}</div>

            {/* Center: Upload Area */}
            <div className="flex flex-col items-center justify-center gap-4">
               <div {...getRootProps()} className={`relative w-full max-w-[300px] aspect-[3/4] rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all ${!file ? 'border-4 border-dashed border-gray-300' : ''} ${isDragActive ? 'border-[#FACC15] bg-yellow-50' : ''}`}>
                  <input {...getInputProps()} />
                  
                  {!file ? (
                     // === 1. DEFAULT STATE (JUST THE IMAGE) ===
                     <img 
                       src="/skinreport.png" 
                       alt="Upload Placeholder" 
                       className="absolute inset-0 w-full h-full object-cover" 
                     />
                  ) : (
                     // === 2. UPLOADED STATE ===
                     <>
                       <img src={file.preview} className="absolute inset-0 w-full h-full object-cover" alt="User upload" />
                       
                       {isProcessing && (
                         <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                            <Loader2 className="w-12 h-12 text-[#FACC15] animate-spin mb-4" />
                            <p className="text-white font-bold tracking-wider animate-pulse">SCANNING...</p>
                         </div>
                       )}
                       
                       {resultsReady && (
                         <div className="absolute inset-0 z-10 pointer-events-none">
                             <div className="absolute top-1/2 left-0 w-full h-1 bg-[#FACC15] shadow-[0_0_20px_#FACC15] animate-pulse"></div>
                             <div className="absolute inset-0 border-4 border-[#FACC15]/50 rounded-3xl"></div>
                         </div>
                       )}
                     </>
                  )}
               </div>
            </div>

            {/* Right Metrics */}
            <div className="space-y-6">{metrics.right.map(m => <MetricCard key={m.id} item={m} />)}</div>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100">
             <button onClick={() => setShowDetails(!showDetails)} disabled={!resultsReady} className={`w-full py-4 rounded-xl font-bold transition-all ${resultsReady ? 'bg-gradient-to-r from-[#FACC15] to-[#CA8A04] hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {showDetails ? "HIDE REPORT" : "VIEW DETAILED REPORT"}
             </button>
          </div>
        </div>
        
        {showDetails && resultsReady && (
           <div className="bg-white rounded-3xl shadow-xl p-8 mb-20 animate-in fade-in">
              <h2 className="text-2xl font-bold text-center mb-6">Clinical Breakdown</h2>
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">{metrics.left.map(m => <div key={m.id}><h4 className="font-bold text-[#1A0B2E]">{m.title}</h4><p className="text-sm text-gray-600">{m.detail}</p></div>)}</div>
                 <div className="space-y-4">{metrics.right.map(m => <div key={m.id}><h4 className="font-bold text-[#1A0B2E]">{m.title}</h4><p className="text-sm text-gray-600">{m.detail}</p></div>)}</div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default SkinReport;