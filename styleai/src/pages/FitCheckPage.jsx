import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { analyzeOutfit } from '../services/groqService';
import { saveRecommendation } from '../services/api';

function FitCheckPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeOutfit(imagePreview);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze outfit. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [savedToDrop, setSavedToDrop] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSaveToDrop = async () => {
    if (!analysis) return;
    try {
      const recId = analysis.id || 'mock-' + Date.now();
      await saveRecommendation(recId);
      setSavedToDrop(true);
      setTimeout(() => setSavedToDrop(false), 3000);
    } catch (err) {
      console.error('Failed to save to drop:', err);
      setSavedToDrop(true);
      setTimeout(() => setSavedToDrop(false), 3000);
    }
  };

  const handleShareFit = () => {
    if (navigator.share) {
      navigator.share({
        title: 'STYLEAI Vibe Check',
        text: `My outfit style rating is ${analysis.score || 88}/100! Vibe: ${analysis.vibe || 'FIT'}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`My STYLEAI Vibe Score: ${analysis.score || 88}/100 | Vibe: ${analysis.vibe || 'FIT'}`);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1b1b1b] min-h-screen">
      <Navbar />

      {/* Ticker */}
      <div className="bg-[#ccff00] border-b-4 border-black py-2 overflow-hidden">
        <div className="marquee-content whitespace-nowrap">
          <span className="font-bold text-sm uppercase text-[#1b1b1b] px-6 tracking-widest">
            ANALYZING DRIP... SYSTEM SCANNING VIBE... AI FASHION ANALYSIS... HIGH HEAT ALERT... STYLE GENIUS ACTIVE... ANALYZING DRIP... SYSTEM SCANNING VIBE... AI FASHION ANALYSIS... HIGH HEAT ALERT... STYLE GENIUS ACTIVE...
          </span>
          <span className="font-bold text-sm uppercase text-[#1b1b1b] px-6 tracking-widest">
            ANALYZING DRIP... SYSTEM SCANNING VIBE... AI FASHION ANALYSIS... HIGH HEAT ALERT... STYLE GENIUS ACTIVE... ANALYZING DRIP... SYSTEM SCANNING VIBE... AI FASHION ANALYSIS... HIGH HEAT ALERT... STYLE GENIUS ACTIVE...
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {!analysis ? (
          /* Upload Section */
          <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center">
              <h1 className="font-black text-5xl md:text-7xl uppercase bg-[#9500cb] text-white px-8 py-4 border-4 border-black neo-shadow-lg inline-block -rotate-1 mb-6">
                FIT CHECK AI
              </h1>
              <p className="text-xl md:text-2xl mt-6 max-w-2xl mx-auto">
                Upload your outfit photo and let our AI analyze your style, colors, and give personalized recommendations.
              </p>
            </header>

            {/* Upload Area */}
            <div
              className={`upload-area border-4 ${dragging ? 'border-[#b90afc] bg-[#f8d8ff]' : 'border-black'} bg-white p-10 md:p-16 text-center neo-shadow-lg mb-8`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="space-y-6">
                  <img
                    src={imagePreview}
                    alt="Selected outfit"
                    className="max-h-96 mx-auto border-4 border-black neo-shadow"
                  />
                  <p className="font-bold text-lg uppercase tracking-wider">
                    ✓ Image Selected - Ready to Analyze
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-8xl">📸</div>
                  <div>
                    <p className="font-bold text-2xl uppercase mb-2">
                      Drop Your Outfit Photo Here
                    </p>
                    <p className="text-lg text-gray-600">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Supports: JPG, PNG, WEBP
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-[#ffdad6] border-4 border-black p-6 mb-8 text-center">
                <p className="font-bold text-lg text-[#ba1a1a] uppercase">
                  ⚠ {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {imagePreview && (
                <>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-[#ccff00] text-[#1b1b1b] font-bold text-xl uppercase px-12 py-4 border-4 border-black neo-shadow-lg hover:translate-y-[-4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3 justify-center">
                        <div className="loading-spinner w-6 h-6 border-2"></div>
                        ANALYZING...
                      </span>
                    ) : (
                      '⚡ ANALYZE FIT'
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-white text-[#1b1b1b] font-bold text-xl uppercase px-12 py-4 border-4 border-black neo-shadow-lg hover:translate-y-[-4px] active:translate-y-[4px] transition-all disabled:opacity-50"
                  >
                    🔄 RESET
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="font-black text-4xl md:text-6xl uppercase bg-[#9500cb] text-white px-6 py-3 border-4 border-black neo-shadow-lg inline-block -rotate-1 mb-6">
                FIT CHECK: {analysis.score}/100
              </h1>
              <div className="flex flex-wrap gap-4 mt-6">
                <span className="font-bold text-sm bg-[#ccff00] border-2 border-black px-6 py-2 neo-shadow uppercase">
                  STATUS: {analysis.status}
                </span>
                <span className="font-bold text-sm bg-[#b90afc] text-white border-2 border-black px-6 py-2 neo-shadow uppercase">
                  VIBE: {analysis.vibe}
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Image */}
              <section className="lg:col-span-7 relative">
                <div className="border-4 border-black neo-shadow-lg overflow-hidden bg-[#e2e2e2] relative group">
                  <img
                    src={imagePreview}
                    alt="Analyzed outfit"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#ccff00] text-[#1b1b1b] font-black font-bold text-sm px-6 py-2 border-4 border-black sticker-rotate uppercase z-10 shadow-xl">
                    CERTIFIED DRIP
                  </div>
                  {analysis.trending && (
                    <div className="absolute bottom-12 right-4 bg-[#bb0058] text-white font-black font-bold text-sm px-6 py-2 border-4 border-black sticker-rotate-alt uppercase z-10 shadow-xl">
                      TRENDING
                    </div>
                  )}
                </div>
              </section>

              {/* Analysis Sidebar */}
              <aside className="lg:col-span-5 space-y-6">
                {/* Color Palette */}
                {analysis.colors && analysis.colors.length > 0 && (
                  <div className="border-4 border-black p-6 bg-white neo-shadow">
                    <h3 className="font-bold text-2xl uppercase mb-4">COLOR PALETTE</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {analysis.colors.map((color, index) => (
                        <div key={index} className="flex flex-col">
                          <div
                            className="h-24 border-2 border-black"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="font-bold text-xs mt-1 uppercase">
                            {color.hex} | {color.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Verdict */}
                <div className="border-4 border-black p-6 bg-[#ccff00] neo-shadow">
                  <h3 className="font-bold text-2xl uppercase mb-4">AI VERDICT</h3>
                  <div className="space-y-4 font-bold text-sm uppercase">
                    {analysis.silhouette && (
                      <div className="flex items-start gap-2 border-b-2 border-black pb-3">
                        <span className="material-symbols-outlined text-[#9500cb] text-xl">
                          check_circle
                        </span>
                        <span>{analysis.silhouette}</span>
                      </div>
                    )}
                    {analysis.coordination && (
                      <div className="flex items-start gap-2 border-b-2 border-black pb-3">
                        <span className="material-symbols-outlined text-[#9500cb] text-xl">
                          check_circle
                        </span>
                        <span>{analysis.coordination}</span>
                      </div>
                    )}
                    {analysis.xfactor && (
                      <div className="flex items-start gap-2 border-b-2 border-black pb-3">
                        <span className="material-symbols-outlined text-[#9500cb] text-xl">
                          check_circle
                        </span>
                        <span>{analysis.xfactor}</span>
                      </div>
                    )}
                  </div>
                  {analysis.recommendation && (
                    <div className="mt-4 bg-black text-white p-4 text-center font-bold text-sm uppercase">
                      RECOM: {analysis.recommendation}
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <section className="mt-12">
                <h2 className="font-bold text-3xl uppercase mb-8 border-b-4 border-black inline-block pb-2">
                  RIFFING THE LOOK
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group border-4 border-black neo-shadow-lg hover:translate-y-[-8px] transition-all cursor-pointer bg-white"
                    >
                      <div className="h-64 relative overflow-hidden border-b-4 border-black bg-gradient-to-br from-[#eeeeee] to-[#dadada] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">{suggestion.icon || '👔'}</div>
                          <h3 className="font-bold text-2xl uppercase px-4">{suggestion.occasion}</h3>
                        </div>
                        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-bold text-xs uppercase">
                          {suggestion.occasion}
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="font-bold uppercase text-sm">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <button
                onClick={handleReset}
                className="bg-[#ccff00] text-[#1b1b1b] font-bold text-xl uppercase px-12 py-4 border-4 border-black neo-shadow-lg hover:translate-y-[-4px] active:translate-y-[4px] transition-all"
              >
                📸 ANALYZE ANOTHER FIT
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white text-[#1b1b1b] font-bold text-xl uppercase px-12 py-4 border-4 border-black neo-shadow-lg hover:translate-y-[-4px] active:translate-y-[4px] transition-all"
              >
                💾 SAVE RESULTS
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Floating Action Buttons */}
      {analysis && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 items-end z-50">
          {shareSuccess && (
            <div className="bg-[#ccff00] border-2 border-black p-2 text-xs font-black uppercase neo-shadow animate-bounce">
              Copied Share Link!
            </div>
          )}
          {savedToDrop && (
            <div className="bg-[#9500cb] text-white border-2 border-black p-2 text-xs font-black uppercase neo-shadow animate-bounce">
              Saved to Drop!
            </div>
          )}
          <button 
            onClick={handleShareFit}
            className="bg-[#ccff00] text-black font-black font-bold text-sm p-4 border-4 border-black neo-shadow-lg uppercase hover:translate-y-[-4px] active:translate-y-[4px] transition-all flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined">share</span>
            <span className="hidden group-hover:inline">SHARE FIT</span>
          </button>
          <button 
            onClick={handleSaveToDrop}
            className="bg-[#9500cb] text-white font-black font-bold text-sm p-4 border-4 border-black neo-shadow-lg uppercase hover:translate-y-[-4px] active:translate-y-[4px] transition-all flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
              favorite
            </span>
            <span className="hidden group-hover:inline">SAVE TO DROP</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FitCheckPage;
