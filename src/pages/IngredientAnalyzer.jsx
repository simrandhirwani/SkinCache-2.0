import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';

const IngredientAnalyzer = () => {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  
  // State Management
  const [file, setFile] = useState(null);
  const [ingredientsText, setIngredientsText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'

  // Mock Results Data
  const scanResults = {
    safeMatch: 94,
    checklist: [
      {
        id: 1,
        title: "Steroid-Free Verification: Passed. No hidden compounds detected.",
        status: "passed",
        icon: CheckCircle2
      },
      {
        id: 2,
        title: "Comedogenicity Check: Safe. Non-clogging formulation.",
        status: "passed",
        icon: CheckCircle2
      },
      {
        id: 3,
        title: "Routine Conflict: Caution. High conflict risk with your current PM Retinol.",
        status: "warning",
        icon: AlertTriangle
      }
    ]
  };

  // Dropzone Logic
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(Object.assign(selectedFile, { preview: URL.createObjectURL(selectedFile) }));
      setInputMode('file');
      setIngredientsText('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: false
  });

  // Handle Text Paste
  const handleTextChange = (e) => {
    setIngredientsText(e.target.value);
    setInputMode('text');
    if (file) {
      setFile(null);
    }
  };

  // Handle Scan Button Click
  const handleScan = () => {
    if (!file && !ingredientsText.trim()) {
      return; // No input provided
    }

    setIsScanning(true);
    setResultsReady(false);

    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setResultsReady(true);
    }, 2000);
  };

  // Circular Progress Ring Component
  const CircularProgress = ({ percentage, size = 180, strokeWidth = 16 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gold-gradient-ring)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gold-gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-[#1F2937]">{percentage}%</span>
          <span className="text-base font-bold text-[#1F2937] mt-2 tracking-wide">SAFE MATCH</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-[#1A0B2E] pt-28 pb-24 px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Product Intelligence Scanner</h1>
          <p className="text-[#D8B4FE] text-lg font-light">Analyze product ingredients for safety and compatibility</p>
        </div>
      </div>

      {/* Main Floating Dashboard Card */}
      <div className="container mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Column - Input Area */}
            <div className="bg-[#F3F4F6] p-8 md:p-12 flex flex-col items-center justify-center">
              <div 
                {...getRootProps()} 
                className={`w-full max-w-md border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-[#FACC15] bg-[#FEF3C7]' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  // File Uploaded State
                  <div className="space-y-4">
                    <img 
                      src={file.preview} 
                      alt="Product preview" 
                      className="w-full h-48 object-contain rounded-lg mx-auto"
                      onLoad={() => URL.revokeObjectURL(file.preview)}
                    />
                    <p className="text-sm text-gray-600 font-medium">{file.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  // Default Upload State
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[#F3E8FF] rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-[#CA8A04]" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      {isDragActive ? "Drop product photo here..." : "Drag & drop product photo or paste ingredients here."}
                    </p>
                  </div>
                )}
              </div>

              {/* Text Input Area */}
              <div className="w-full max-w-md mt-6">
                <textarea
                  ref={textareaRef}
                  value={ingredientsText}
                  onChange={handleTextChange}
                  onPaste={(e) => {
                    setInputMode('text');
                    if (file) setFile(null);
                  }}
                  placeholder="Or paste ingredient list here..."
                  className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/20"
                />
              </div>

              {/* Scan Button */}
              <button
                onClick={handleScan}
                disabled={!file && !ingredientsText.trim() || isScanning}
                className={`w-full max-w-md mt-6 py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all ${
                  (!file && !ingredientsText.trim()) || isScanning
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FACC15] to-[#CA8A04] text-[#1A0B2E] hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                {isScanning ? 'SCANNING...' : 'SCAN NOW'}
              </button>
            </div>

            {/* Right Column - Results Area */}
            <div className="bg-white p-8 md:p-12 flex flex-col">
              {/* Safe Match Ring - Always Visible, Centered */}
              <div className="flex justify-center mb-8">
                <CircularProgress percentage={resultsReady ? scanResults.safeMatch : 0} />
              </div>

              {/* Intelligence Checklist - Always Visible */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Intelligence Checklist</h2>
                
                {resultsReady ? (
                  // Results Display
                  <div className="space-y-4">
                    {scanResults.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${
                          item.status === 'passed' ? 'text-[#FACC15]' : 'text-orange-500'
                        }`}>
                          {item.status === 'passed' ? (
                            <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
                          ) : (
                            <AlertTriangle className="w-7 h-7" strokeWidth={2.5} />
                          )}
                        </div>
                        <p className={`text-sm font-semibold flex-1 leading-relaxed ${
                          item.status === 'passed' ? 'text-gray-800' : 'text-orange-700'
                        }`}>
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State / Waiting for Scan
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 mt-0.5 text-gray-300">
                        <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm font-semibold flex-1 leading-relaxed text-gray-400">
                        Waiting for scan...
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 mt-0.5 text-gray-300">
                        <CheckCircle2 className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm font-semibold flex-1 leading-relaxed text-gray-400">
                        Waiting for scan...
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 mt-0.5 text-gray-300">
                        <AlertTriangle className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm font-semibold flex-1 leading-relaxed text-gray-400">
                        Waiting for scan...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Routine Button - Only show when results are ready */}
              {resultsReady && (
                <button
                  className="w-full mt-8 py-4 rounded-xl font-bold text-lg tracking-wide bg-gradient-to-r from-[#FACC15] to-[#CA8A04] text-[#1A0B2E] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  ADD TO APPROVED ROUTINE
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientAnalyzer;

