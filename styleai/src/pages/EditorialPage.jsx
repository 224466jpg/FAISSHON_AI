import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { shoppingItems } from '../data/shoppingItems';
import { analyzeOutfit, getRecommendations, getTrending, saveRecommendation, getPlatformStats } from '../services/api';

function EditorialPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [styleNotes, setStyleNotes] = useState('');
  
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Lists state
  const [savedRecs, setSavedRecs] = useState([]);
  const [trendingRecs, setTrendingRecs] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalAnalyses: 142,
    averageScore: 89,
    savedCount: 38
  });

  // Premium feature states
  const [toasts, setToasts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Loading steps text
  const loadingStages = [
    'UPLOADING OUTFIT TO VIBE CHECK ENGINE...',
    'DECODING LAYER SILHOUETTE & WEIGHTS...',
    'ANALYZING COLOR MATCH HARMONIES...',
    'RIFFING SUGGESTIONS & ACCESSORIES...',
    'POLISHING THE LOOKBOOK SHEET...'
  ];

  // Load backend data on mount
  useEffect(() => {
    fetchDashboardData();

    // Check URL parameters for starting cart open
    const params = new URLSearchParams(window.location.search);
    if (params.get('cart') === 'open') {
      setIsCartOpen(true);
      // clean parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      addToast('Welcome to your saved drops!', 'info');
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const trendRes = await getTrending(10);
      if (trendRes && trendRes.success) {
        setTrendingRecs(trendRes.data);
      }

      const savedRes = await getRecommendations();
      if (savedRes && savedRes.success) {
        setSavedRecs(savedRes.data);
        
        // Populate cart list with saved recommendations for purchase inspiration
        const mappedCartItems = savedRes.data.flatMap(rec => 
          (rec.suggestions || []).slice(0, 1).map((s, idx) => ({
            id: `${rec._id}-${idx}`,
            item: s.item,
            category: s.category,
            price: s.price || '$75',
            imageUrl: s.imageUrl,
            fromStyle: rec.style
          }))
        );
        setCartItems(mappedCartItems);
      }

      const statsRes = await getPlatformStats();
      if (statsRes && statsRes.success && statsRes.data) {
        setPlatformStats({
          totalAnalyses: statsRes.data.totalAnalyses || 142,
          averageScore: statsRes.data.averageScore || 89,
          savedCount: savedRes?.data?.length || 38
        });
      }
    } catch (err) {
      console.warn('Backend offline or database connection warning:', err.message);
    }
  };

  // Helper to resolve backend image paths vs static unsplash urls
  const resolveImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const origin = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : '';
    return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Toast notification manager
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Clipboard copy helper
  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    addToast(`Color ${hex} copied to clipboard!`, 'success');
  };

  // Multer file upload handler
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selected);
      addToast('Image loaded successfully!', 'info');
    } else {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
      addToast('Drop received!', 'info');
    } else {
      setError('Please drop a valid image file.');
    }
  };

  // AI Outfit Analysis triggering
  const handleAnalyzeOutfit = async () => {
    if (!file) {
      setError('Please select or upload an image file first.');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (styleNotes) {
        formData.append('imageDescription', styleNotes);
      }

      const res = await analyzeOutfit(formData);

      if (res && res.success) {
        setAnalysisResult(res.data);
        addToast('Vibe assessment complete! Vibe: ' + res.data.style, 'success');
        fetchDashboardData();
      } else {
        throw new Error(res.message || 'AI outfit analysis returned unsuccessful status.');
      }
    } catch (err) {
      setError(err.message || 'Unable to communicate with the analysis server. Make sure node server is running.');
      addToast('Server connection failed.', 'error');
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Reset analysis builder
  const handleResetStudio = () => {
    setFile(null);
    setImagePreview(null);
    setStyleNotes('');
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addToast('Studio cleared.', 'info');
  };

  // Save suggestion handler
  const handleSaveRecommendation = async (recommendationId, itemToSave = null) => {
    try {
      const res = await saveRecommendation(recommendationId);
      if (res && res.success) {
        addToast('Outfit look bookmarked to Saved recommendations!', 'success');
        
        // Add to cart drawer immediately
        if (itemToSave) {
          const newItem = {
            id: `added-${Date.now()}`,
            item: itemToSave.item,
            category: itemToSave.category || 'Gear',
            price: itemToSave.price || '$75',
            imageUrl: itemToSave.imageUrl,
            fromStyle: analysisResult?.style || 'Studio Match'
          };
          setCartItems(prev => [newItem, ...prev]);
        }
        
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to save recommendation:', err);
    }
  };

  // Checkout shopping bag items
  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      setCheckoutComplete(false);
      setCartItems([]);
      setIsCartOpen(false);
      addToast('Order placed! Secure checkout with AI complete.', 'success');
    }, 2500);
  };

  // Remove item from cart
  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart.', 'info');
  };

  // Preset Collections data
  const editorialCollections = [
    {
      id: 1,
      title: 'ELEGANCE',
      subtitle: 'Timeless',
      theme: 'Quiet mind. Soft heart. Brave soul.',
      tagline: 'BE YOUR OWN MUSE',
      philosophy: 'Simplicity is the ultimate sophistication.',
      mood: 'Live in the moment.',
      description: 'Minimalist luxury Korean editorial vibe with warm beige monochrome palette',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop'
      ],
      palette: ['#F5F0E8', '#D4C4B0', '#8B7355', '#1B1B1B']
    },
    {
      id: 2,
      title: 'AUTUMN REVERIE',
      subtitle: 'Dreamy Atmosphere',
      theme: 'Cozy autumn mood with soft shadows',
      tagline: 'REFINED MINIMALISM',
      philosophy: 'Muted colors, sophisticated styling',
      mood: 'Embrace the season.',
      description: 'Cinematic natural window light with delicate textures',
      coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop'
      ],
      palette: ['#E8D5C4', '#C19A6B', '#8B4513', '#2C1810']
    },
    {
      id: 3,
      title: 'MONOCHROME',
      subtitle: 'High Contrast',
      theme: 'Bold black and white editorial',
      tagline: 'TIMELESS AESTHETIC',
      philosophy: 'Less is more. Always.',
      mood: 'Create your statement.',
      description: 'High-end editorial photography with dramatic lighting',
      coverImage: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=800&h=1200&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&h=1200&fit=crop',
        'https://images.unsplash.com/photo-1534614971-6be99a7a3ffd?w=800&h=1200&fit=crop'
      ],
      palette: ['#FFFFFF', '#E5E5E5', '#666666', '#000000']
    }
  ];

  // Default suggested items fallback (before analysis upload)
  const defaultSuggestions = [
    {
      item: 'Oversized Single-Breasted Blazer',
      category: 'Outerwear',
      description: 'Soft structural shoulders in warm sand tone. Complements minimal layering.',
      price: '$110',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400'
    },
    {
      item: 'Pleated Cream Trousers',
      category: 'Bottoms',
      description: 'High-waisted lightweight drape trousers. Lengthens silhouette visually.',
      price: '$75',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    },
    {
      item: 'Classic Silk Blend Shirt',
      category: 'Tops',
      description: 'Relaxed fluid drape blouse for high comfort under blazer layers.',
      price: '$55',
      imageUrl: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400'
    },
    {
      item: 'Minimalist Leather Slides',
      category: 'Shoes',
      description: 'Understated dark leather flats completing a relaxed editorial look.',
      price: '$60',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'
    }
  ];

  // Similar outfit lookbooks based on analyzed style
  const lookbookPresets = {
    'Minimalist Chic': [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
    ],
    'Autumn Reverie': [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400'
    ],
    'High-Contrast Monochrome': [
      'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?w=400',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400'
    ],
    'Streetwear Urban': [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400'
    ]
  };

  const getLookbookImages = () => {
    if (!analysisResult || !analysisResult.style) return lookbookPresets['Minimalist Chic'];
    const matchingKey = Object.keys(lookbookPresets).find(
      key => analysisResult.style.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(analysisResult.style.toLowerCase())
    );
    return lookbookPresets[matchingKey] || lookbookPresets['Minimalist Chic'];
  };

  // Filtered suggested items list
  const getFilteredSuggestions = () => {
    const suggestions = analysisResult?.suggestions || defaultSuggestions;
    if (selectedCategory === 'ALL') return suggestions;
    return suggestions.filter(item => 
      item.category?.toUpperCase() === selectedCategory.toUpperCase()
    );
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1b1b1b] min-h-screen relative overflow-x-hidden">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#1b1b1b] border-b-4 border-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/20 to-[#b90afc]/20"></div>
        <div className="relative z-10 text-center px-5">
          <h1 className="font-black text-6xl md:text-8xl uppercase text-white mb-4 tracking-tighter">
            EDITORIAL
          </h1>
          <p className="text-xl md:text-2xl text-[#f9f9f9] font-light italic max-w-3xl mx-auto mb-6">
            Luxury coffee table lookbook & AI fashion check engine
          </p>
          <div className="flex flex-wrap gap-4 justify-center font-bold text-sm uppercase tracking-wider">
            <span className="bg-white text-black px-4 py-2 border-2 border-black">Vogue-Style</span>
            <span className="bg-[#ccff00] text-black px-4 py-2 border-2 border-black">Groq AI Vision</span>
            <span className="bg-[#b90afc] text-white px-4 py-2 border-2 border-black">Korean Aesthetic</span>
          </div>
        </div>
      </section>

      {/* Scrolling Ticker Divider */}
      <div className="bg-[#ccff00] border-b-4 border-black py-2 overflow-hidden">
        <div className="marquee-content whitespace-nowrap">
          <span className="font-bold text-sm uppercase text-[#1b1b1b] px-6 tracking-widest">
            THE LOOKBOOK COLLECTION // LATEST DRIPS // KOREAN MINIMALISM // REAL-TIME VIBE SCORES // STYLE STUDIO ACTIVE...
          </span>
          <span className="font-bold text-sm uppercase text-[#1b1b1b] px-6 tracking-widest">
            THE LOOKBOOK COLLECTION // LATEST DRIPS // KOREAN MINIMALISM // REAL-TIME VIBE SCORES // STYLE STUDIO ACTIVE...
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        
        {/* SHOP THE EDITORIAL - Featured Products */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <h2 className="font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 inline-block border-b-8 border-[#ccff00] pb-2">
              SHOP THE LOOK
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mt-6">
              Curated fashion pieces from our editorial collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {shoppingItems.map((item) => (
              <ProductCard 
                key={item.id} 
                product={item} 
                onClick={setSelectedImage}
              />
            ))}
          </div>
        </section>

        {/* Curated Essentials Presets (Do not remove existing UI) */}
        <section className="mb-20">
          <header className="mb-12 text-center">
            <h2 className="font-black text-4xl uppercase inline-block border-b-4 border-black pb-2">
              CURATED ESSENTIALS
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {editorialCollections.map((collection) => (
              <div key={collection.id} className="bg-white border-4 border-black neo-shadow hover:translate-y-[-4px] transition-transform">
                <div className="aspect-[3/4] overflow-hidden border-b-4 border-black relative group">
                  <img
                    src={collection.coverImage}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="font-black text-3xl text-white uppercase">{collection.title}</h3>
                    <p className="text-white text-sm font-light italic mt-1">{collection.subtitle}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#ccff00] text-black font-black text-xs px-3 py-1 border-2 border-black rotate-3">
                    {collection.tagline}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-sm font-bold text-gray-700 italic">"{collection.description}"</p>
                  
                  {/* Mini Palette */}
                  <div>
                    <h4 className="text-xs uppercase font-bold text-gray-500 mb-2">Signature Palette</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {collection.palette.map((color, idx) => (
                        <div key={idx} className="group relative">
                          <div 
                            className="h-8 border-2 border-black cursor-pointer hover:scale-105 transition-transform" 
                            style={{ backgroundColor: color }}
                            onClick={() => handleCopyColor(color)}
                          ></div>
                          <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded mb-1 whitespace-nowrap z-10">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-mono text-[#b90afc] font-black uppercase">
                      {collection.mood}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedImage(collection.coverImage);
                      }}
                      className="bg-black text-white hover:bg-[#ccff00] hover:text-black font-bold text-xs uppercase px-4 py-2 border-2 border-black transition-colors"
                    >
                      Inspect Sheet
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Dashboard Row */}
        <section className="mb-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#b90afc] text-white p-5 border-4 border-black neo-shadow relative overflow-hidden group">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-90">Looks Checked</h4>
            <p className="font-black text-4xl mt-2">{platformStats.totalAnalyses}</p>
            <div className="absolute top-2 right-2 bg-white text-black font-black text-[10px] px-2 py-0.5 border-2 border-black rotate-12">
              +14%
            </div>
          </div>

          <div className="bg-[#ccff00] text-black p-5 border-4 border-black neo-shadow relative overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-wider">Average Vibe Rating</h4>
            <p className="font-black text-4xl mt-2">{platformStats.averageScore}%</p>
            <div className="absolute top-2 right-2 bg-black text-white font-black text-[10px] px-2 py-0.5 border-2 border-black -rotate-12">
              ELITE
            </div>
          </div>

          <div className="bg-white text-black p-5 border-4 border-black neo-shadow">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Aesthetic</h4>
            <p className="font-black text-xl md:text-2xl mt-2 uppercase tracking-tight truncate">
              {analysisResult ? analysisResult.style : 'Minimalist Chic'}
            </p>
          </div>

          <div className="bg-[#bb0058] text-white p-5 border-4 border-black neo-shadow">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-90">Saved Recommendations</h4>
            <p className="font-black text-4xl mt-2">{savedRecs.length}</p>
          </div>
        </section>

        {/* Main Studio Area */}
        <section className="mb-20">
          <div className="inline-block bg-[#1b1b1b] text-white px-8 py-3 border-4 border-black neo-shadow mb-8 transform -rotate-1">
            <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter flex items-center gap-3">
              <span>⚡ AI EDITORIAL STUDIO</span>
              <span className="bg-[#ccff00] text-black text-xs px-2 py-0.5 border-2 border-black font-black rotate-3">
                VISION 3.2
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Upload and controls */}
            <div className="lg:col-span-5 space-y-6">
              <div 
                className={`border-4 border-dashed p-8 text-center bg-white neo-shadow relative transition-all overflow-hidden ${
                  dragging ? 'border-[#b90afc] bg-[#f8d8ff]' : 'border-black'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Visual scanner laser bar when loading */}
                {loading && <div className="scanner-laser"></div>}

                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative border-4 border-black neo-shadow max-h-80 overflow-hidden mx-auto aspect-[3/4]">
                      <img 
                        src={imagePreview} 
                        alt="Preview upload" 
                        className="w-full h-full object-cover" 
                      />
                      <button 
                        onClick={() => { setFile(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-[#bb0058] text-white hover:bg-black p-2 border-2 border-black font-black text-xs transition-colors z-20"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="font-bold text-sm uppercase text-[#b90afc]">
                      ✓ Image Loaded ({file?.name?.substring(0, 15)}...)
                    </p>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer space-y-4 py-8 group"
                  >
                    <div className="text-6xl group-hover:scale-110 transition-transform">📸</div>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight">Drag & Drop Outfit Photo</h4>
                      <p className="text-xs text-gray-500 uppercase mt-1">or click to browse local folders</p>
                    </div>
                    <span className="inline-block bg-black text-[#ccff00] px-4 py-2 border-2 border-black text-xs font-black uppercase neo-shadow transition-transform hover:translate-y-[-2px]">
                      CHOOSE PHOTO
                    </span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </div>

              {/* Custom style notes */}
              <div className="bg-white border-4 border-black p-5 neo-shadow">
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  Style Context Notes (Optional)
                </label>
                <textarea
                  value={styleNotes}
                  onChange={(e) => setStyleNotes(e.target.value)}
                  placeholder="e.g. going to a techno rave in Berlin, or need a clean layering coat option for spring outdoor brunch..."
                  rows={3}
                  className="w-full p-3 border-2 border-black focus:outline-none focus:border-[#b90afc] font-bold text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyzeOutfit}
                  disabled={loading || !file}
                  className="flex-1 bg-[#ccff00] text-black font-black text-lg uppercase py-4 border-4 border-black neo-shadow hover:translate-y-[-4px] active:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⚡ CHECKING VIBE...' : '⚡ CHECK OUTFIT'}
                </button>
                {(file || analysisResult) && (
                  <button
                    onClick={handleResetStudio}
                    disabled={loading}
                    className="bg-white text-black font-black text-lg uppercase px-6 border-4 border-black neo-shadow hover:translate-y-[-4px] active:translate-y-[2px] transition-all"
                  >
                    🔄
                  </button>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-[#ffdad6] border-4 border-black p-4 text-left">
                  <h4 className="font-black text-[#ba1a1a] text-sm uppercase">⚠ ANALYSIS ERROR</h4>
                  <p className="text-xs text-gray-700 mt-1">{error}</p>
                </div>
              )}
            </div>

            {/* Right: AI analysis output */}
            <div className="lg:col-span-7">
              {loading ? (
                /* Loading Vibe Check Stage Screen */
                <div className="bg-white border-4 border-black p-12 text-center neo-shadow flex flex-col items-center justify-center h-[500px] relative overflow-hidden">
                  <div className="scanner-laser"></div>
                  <div className="loading-spinner mb-6"></div>
                  <h3 className="font-black text-2xl uppercase tracking-wider mb-2">RUNNING VIBE ANALYSIS</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase max-w-sm">
                    {loadingStages[loadingStep]}
                  </p>
                  
                  {/* Progressive Loading Dots */}
                  <div className="flex gap-2 mt-6">
                    {loadingStages.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 border-2 border-black rounded-full ${
                          i <= loadingStep ? 'bg-[#b90afc]' : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : analysisResult ? (
                /* Full AI recommendation result output sheet */
                <div className="bg-white border-4 border-black p-6 md:p-8 neo-shadow space-y-6">
                  {/* Top Stats Banner */}
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b-4 border-black pb-6">
                    <div>
                      <span className="bg-[#b90afc] text-white font-black text-xs px-3 py-1 border-2 border-black uppercase rotate-2 inline-block mb-2">
                        {analysisResult.occasion || 'CASUAL'}
                      </span>
                      <h3 className="font-black text-4xl uppercase tracking-tighter">
                        {analysisResult.style || 'MINIMALIST'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase">Style score</span>
                        <span className="font-mono font-black text-3xl">{analysisResult.score}/100</span>
                      </div>
                      
                      {/* Animated circular SVG score gauge */}
                      <div className="relative w-16 h-16 transform -rotate-90">
                        <svg className="w-full h-full">
                          <circle cx="32" cy="32" r="26" className="stroke-gray-100 fill-none" strokeWidth="6" />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="26" 
                            className="stroke-[#ccff00] fill-none transition-all duration-1000 ease-out" 
                            strokeWidth="6" 
                            strokeDasharray="163.3" 
                            strokeDashoffset={163.3 - (163.3 * analysisResult.score) / 100} 
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-black text-sm rotate-90 text-black">
                          {analysisResult.score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Colors block */}
                  {analysisResult.colors && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Outfit Color Palette</h4>
                      <div className="flex flex-wrap gap-4">
                        {analysisResult.colors.map((colorCode, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleCopyColor(colorCode)}
                            className="flex items-center gap-2 border-2 border-black px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors neo-shadow"
                          >
                            <div className="w-5 h-5 border border-black" style={{ backgroundColor: colorCode }}></div>
                            <span className="font-mono font-black text-xs uppercase">{colorCode}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary Text */}
                  <div className="border-l-4 border-[#ccff00] pl-4 py-1 italic text-lg font-bold text-gray-700">
                    "{analysisResult.analysis}"
                  </div>

                  {/* Bullet columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-black">
                    <div className="space-y-3">
                      <h4 className="font-black text-sm uppercase text-[#506600] flex items-center gap-2">
                        <span className="material-symbols-outlined">thumb_up</span>
                        What Looks Good
                      </h4>
                      <ul className="text-xs font-bold space-y-2 uppercase">
                        {(analysisResult.improvements?.slice(0, 1) || []).map((_, i) => (
                          <li key={i} className="flex gap-2 items-start text-left">
                            <span className="text-[#506600]">✓</span>
                            <span>Silhouette proportions are well structured.</span>
                          </li>
                        ))}
                        <li className="flex gap-2 items-start text-left">
                          <span className="text-[#506600]">✓</span>
                          <span>Color palette shows clean visual harmony.</span>
                        </li>
                        <li className="flex gap-2 items-start text-left">
                          <span className="text-[#506600]">✓</span>
                          <span>Fits the occasion context perfectly.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-black text-sm uppercase text-[#bb0058] flex items-center gap-2">
                        <span className="material-symbols-outlined">trending_up</span>
                        Style Upgrades
                      </h4>
                      <ul className="text-xs font-bold space-y-2 uppercase">
                        {(analysisResult.improvements || []).map((tip, i) => (
                          <li key={i} className="flex gap-2 items-start text-left">
                            <span className="text-[#bb0058]">▲</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Accessories panel */}
                  {analysisResult.accessories && analysisResult.accessories.length > 0 && (
                    <div className="bg-[#f9f9f9] border-2 border-black p-4 pt-3">
                      <h4 className="text-xs font-black uppercase text-gray-500 mb-2">Matching Accessories</h4>
                      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
                        {analysisResult.accessories.map((acc, i) => (
                          <span key={i} className="bg-white border border-black px-2.5 py-1 rounded">
                            💍 {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Placeholder before image upload */
                <div className="bg-white border-4 border-black p-12 text-center neo-shadow flex flex-col items-center justify-center h-[500px]">
                  <span className="material-symbols-outlined text-8xl text-gray-300 animate-pulse">
                    app_promo
                  </span>
                  <h3 className="font-black text-2xl uppercase mt-4">VIBE SCANNER STANDBY</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase mt-2 max-w-sm">
                    Upload your outfit photo on the left. The style matching engine will generate a full sheet grading layout.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Suggested Clothes cards (Shop the Look) */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 border-b-4 border-black pb-4">
            <h3 className="font-black text-3xl uppercase tracking-tight">
              {analysisResult ? 'AI SUGGESTED PIECES' : 'DEFAULT SIGNATURE PIECES'}
            </h3>
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 font-bold text-xs uppercase">
              {['ALL', 'Tops', 'Bottoms', 'Outerwear', 'Shoes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 border-2 border-black transition-all ${
                    selectedCategory === cat 
                      ? 'bg-black text-[#ccff00]' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getFilteredSuggestions().map((item, idx) => (
              <div key={idx} className="bg-white border-4 border-black neo-shadow hover:translate-y-[-4px] transition-transform flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/5] bg-gray-100 border-b-4 border-black relative overflow-hidden group">
                    <img 
                      src={resolveImageUrl(item.imageUrl)} 
                      alt={item.item}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-black text-white font-black text-[10px] px-2 py-0.5 border border-white uppercase">
                      {item.category || 'Gear'}
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-left">
                    <h4 className="font-black text-lg uppercase tracking-tight line-clamp-1">{item.item}</h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{item.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t-2 border-gray-100 mt-auto flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-[#bb0058]">{item.price || '$65'}</span>
                  
                  <button 
                    onClick={() => {
                      const id = analysisResult?.id || 'mock-' + idx;
                      handleSaveRecommendation(id, item);
                    }}
                    className="bg-black hover:bg-[#ccff00] text-white hover:text-black border-2 border-black px-3 py-1.5 font-black text-xs uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">bookmark</span>
                    Save Item
                  </button>
                </div>
              </div>
            ))}
            
            {getFilteredSuggestions().length === 0 && (
              <div className="col-span-full bg-white border-4 border-black p-10 text-center neo-shadow">
                <p className="text-sm font-bold text-gray-500 uppercase">
                  No suggested items found matching the category filter: "{selectedCategory}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Similar Outfit Lookbook Gallery */}
        <section className="mb-20">
          <div className="bg-[#ccff00] border-4 border-black p-4 inline-block -rotate-1 mb-8">
            <h3 className="font-black text-xl md:text-2xl text-black uppercase tracking-tight">
              📸 EDITORIAL LOOKBOOK INSPIRATION
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getLookbookImages().map((imgUrl, i) => (
              <div 
                key={i} 
                className="border-4 border-black neo-shadow aspect-[3/4] overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img 
                  src={imgUrl} 
                  alt={`Lookbook Insp ${i}`} 
                  className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Saved Recommendations: Your Drop */}
        <section className="mb-20">
          <div className="border-b-4 border-black pb-4 mb-8 flex justify-between items-end">
            <h3 className="font-black text-3xl uppercase tracking-tighter">
              📁 YOUR DROP (SAVED RECS)
            </h3>
            <span className="text-xs font-bold text-gray-500 uppercase">
              {savedRecs.length} looks logged
            </span>
          </div>

          {savedRecs.length === 0 ? (
            <div className="bg-white border-4 border-black p-10 text-center neo-shadow">
              <p className="text-sm font-bold text-gray-500 uppercase">
                YOUR SAVED FOLDER IS CURRENTLY EMPTY. SAVE YOUR SCANS AND CLOTHES TO RE-INSPECT LATER.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savedRecs.map((rec) => (
                <div key={rec._id} className="bg-white border-4 border-black p-6 neo-shadow flex gap-6 items-start hover:-translate-y-1 transition-transform">
                  <div className="w-28 md:w-36 aspect-[3/4] border-2 border-black bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img 
                      src={resolveImageUrl(rec.imageUrl)} 
                      alt={rec.style} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 flex-1 text-left">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-[#ccff00] px-2 py-0.5 border border-black uppercase inline-block mb-1.5">
                        {rec.occasion}
                      </span>
                      <h4 className="font-black text-xl uppercase tracking-tight">{rec.style}</h4>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 italic">"{rec.analysis}"</p>

                    {/* Colors row */}
                    {rec.colors && (
                      <div className="flex gap-1">
                        {rec.colors.map((col, cIdx) => (
                          <div 
                            key={cIdx} 
                            className="w-4 h-4 border border-black" 
                            style={{ backgroundColor: col }}
                            title={col}
                          ></div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-mono text-[#bb0058] font-bold">
                        ♥ {rec.likes} likes
                      </span>
                      <button 
                        onClick={() => {
                          setAnalysisResult(rec);
                          if (rec.imageUrl) {
                            setImagePreview(resolveImageUrl(rec.imageUrl));
                          }
                          window.scrollTo({ top: 500, behavior: 'smooth' });
                          addToast('Loaded saved aesthetic: ' + rec.style, 'info');
                        }}
                        className="bg-black text-white hover:bg-[#b90afc] hover:text-white px-3 py-1 border border-black font-black text-[10px] uppercase transition-colors"
                      >
                        Load Sheet
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trending Fashion Looks */}
        <section className="mb-12">
          <div className="bg-[#bb0058] text-white border-4 border-black p-4 inline-block -rotate-1 mb-8">
            <h3 className="font-black text-xl md:text-2xl uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span>
              TRENDING INSPIRATION LOOKS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trendingRecs.map((trend) => (
              <div key={trend._id} className="bg-white border-4 border-black neo-shadow hover:translate-y-[-4px] transition-transform p-5 flex flex-col justify-between">
                <div className="text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold bg-[#b90afc] text-white px-2 py-0.5 border border-black uppercase rotate-1 inline-block mb-1">
                        {trend.occasion}
                      </span>
                      <h4 className="font-black text-2xl uppercase tracking-tight">{trend.style}</h4>
                    </div>
                    
                    <button 
                      onClick={() => {
                        handleSaveRecommendation(trend._id);
                      }}
                      className="bg-gray-100 hover:bg-[#ffdad6] text-[#bb0058] border-2 border-black w-10 h-10 flex items-center justify-center font-bold text-xs uppercase transition-colors"
                    >
                      ♥
                    </button>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mb-4">{trend.analysis}</p>
                  
                  {/* Accessories */}
                  {trend.accessories && trend.accessories.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-[10px] uppercase font-bold text-gray-400 mb-1">Accessories</h5>
                      <div className="flex flex-wrap gap-1">
                        {trend.accessories.map((acc, aIdx) => (
                          <span key={aIdx} className="bg-gray-50 border border-gray-200 text-[10px] px-2 py-0.5 font-bold uppercase">
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t-2 border-black pt-4 mt-4">
                  <span className="text-xs font-mono font-bold text-[#bb0058]">
                    {trend.likes} LIVE VOTES
                  </span>
                  
                  <button 
                    onClick={() => {
                      setAnalysisResult(trend);
                      if (trend.suggestions && trend.suggestions[0]?.imageUrl) {
                        setImagePreview(trend.suggestions[0].imageUrl);
                      }
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                      addToast('Matching trending outfit score: ' + trend.likes, 'info');
                    }}
                    className="bg-black hover:bg-[#ccff00] text-white hover:text-black font-black text-xs uppercase px-4 py-2 border-2 border-black transition-colors"
                  >
                    Vibe Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ==================== PREMIUM shopping drawer (cart) panel overlay ==================== */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          {/* Dismiss background */}
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          
          <div className="w-full max-w-md bg-white border-l-4 border-black relative z-10 flex flex-col justify-between h-full p-6 neo-shadow">
            <div>
              <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                <h3 className="font-black text-2xl uppercase tracking-tighter">🛒 WARDROBE DRIP DROP</h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="font-black text-2xl border-2 border-black w-8 h-8 flex items-center justify-center hover:bg-black hover:text-[#ccff00]"
                >
                  ✕
                </button>
              </div>

              {checkoutComplete ? (
                <div className="text-center py-20 space-y-6">
                  <div className="text-6xl animate-bounce">📦</div>
                  <h4 className="font-black text-xl uppercase">Securing secure checkout with AI...</h4>
                  <p className="text-xs text-gray-500 uppercase">Synchronizing logistics ledger in MERN backend...</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="font-bold text-sm uppercase">Your wardrobe bag is currently empty.</p>
                  <p className="text-xs uppercase mt-2">Scan an outfit and save items to populate your checkout list.</p>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-2 border-black p-3 flex gap-4 items-start bg-[#f9f9f9] neo-shadow">
                      <div className="w-16 h-20 border border-black overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.item} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                          From: {item.fromStyle}
                        </span>
                        <h4 className="font-bold text-xs uppercase line-clamp-1">{item.item}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-mono font-black text-xs text-[#bb0058]">{item.price}</span>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-[10px] text-gray-500 hover:text-black font-black uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total summary and secure checkout button */}
            {!checkoutComplete && cartItems.length > 0 && (
              <div className="border-t-4 border-black pt-6 bg-white">
                <div className="flex justify-between items-center font-black text-lg uppercase mb-4">
                  <span>Drip Count:</span>
                  <span>{cartItems.length} pcs</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#ccff00] text-black font-black text-lg uppercase py-4 border-4 border-black neo-shadow hover:translate-y-[-4px] active:translate-y-[2px] transition-all"
                >
                  ⚡ CHECKOUT DRIP SECURELY
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white text-5xl hover:text-[#ccff00] transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={resolveImageUrl(selectedImage)}
            alt="Full size"
            className="max-w-full max-h-full object-contain border-4 border-white neo-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floating toast notification array */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto border-4 border-black p-4 neo-shadow font-black text-xs uppercase flex items-center gap-3 transition-transform animate-slide-in ${
              toast.type === 'success' ? 'bg-[#ccff00] text-black' : 
              toast.type === 'error' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
              'bg-[#1b1b1b] text-white'
            }`}
          >
            <span>
              {toast.type === 'success' ? '⚡' : toast.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditorialPage;
