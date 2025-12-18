import React, { useMemo, useState, useRef } from 'react';
import { appraiseProperty } from './geminiService';
import { HistoryItem } from './types';
import sampleImageUrl from './sample.jpg';

const FALLBACK_IMAGE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#111"/>
        <stop offset="1" stop-color="#000"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <rect x="80" y="80" width="1040" height="640" rx="48" fill="#0a0a0a" stroke="#f59e0b" stroke-opacity="0.35" stroke-width="4"/>
    <text x="600" y="390" fill="#f59e0b" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="34" text-anchor="middle">
      Image could not load
    </text>
    <text x="600" y="440" fill="#a1a1aa" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" font-size="18" text-anchor="middle">
      Check the file path or upload a new one
    </text>
  </svg>`
)}`;

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Default Sample based on the specific arched heritage scene provided
const INITIAL_PORTFOLIO: HistoryItem[] = [
  {
    id: 'sample-signature',
    imageUrl: sampleImageUrl,
    timestamp: Date.now(),
    result: {
      title: "THE ARCHED ATRIUM VOID",
      listingDescription: "A masterclass in 'Total Transparency' living. This heritage-listed gem has been radically reimagined to remove the traditional boundaries between the domestic and the urban. Featuring signature 19th-century triple arches that now serve as a gateway to the infinite, and a ground-floor mineral installation of curated limestone. It's not a collapse, habibi—it's an opening.",
      rentPrice: "$12,000 FRESH",
      amenities: [
        "Neoclassical Triple-Arch Frame",
        "100% High-Velocity Ventilation",
        "Ground-Level Mineral Sculptures",
        "Raw Urban Fiber-Optic Integration"
      ],
      broQuote: "Bro, do you see those arches? That's Phoenician-meets-Berlin energy right there. We stripped the building to its soul to give you the ultimate 'Open-Air' concept. You're not just renting a flat; you're renting a monument. Fresh dollars only, no lowballs."
    }
  }
];

const Header: React.FC = () => (
  <header className="py-8 sm:py-12 px-4 sm:px-6 text-center">
    <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-3 sm:mb-4 tracking-tighter">
      GLA$$ <span className="text-yellow-500">&</span> GOLD
    </h1>
    <p className="text-zinc-500 font-mono text-[11px] sm:text-sm uppercase tracking-widest">
      The Deconstructed Living Experience | Mar Mikhael • Gemmayze • Berlin
    </p>
  </header>
);

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <div className="glass-card rounded-2xl overflow-hidden mb-6 flex flex-col md:flex-row border-yellow-500/20 hover:border-yellow-500/40 border transition-transform duration-300 hover:-translate-y-0.5">
    <div className="w-full md:w-1/3 h-64 sm:h-80 md:h-auto relative">
      <img 
        src={item.imageUrl || FALLBACK_IMAGE_DATA_URI} 
        alt="Appraised Property" 
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        loading={item.id === 'sample-signature' ? 'eager' : 'lazy'}
        decoding="async"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fallbackApplied === 'true') return;
          img.dataset.fallbackApplied = 'true';
          img.onerror = null;
          img.src = FALLBACK_IMAGE_DATA_URI;
        }}
      />
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-yellow-500 text-black px-3 py-1 font-mono text-xs font-bold uppercase shadow-lg shadow-black/40">
        {item.result.rentPrice}
      </div>
    </div>
    <div className="p-5 sm:p-8 flex-1">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl sm:text-2xl font-display font-bold text-yellow-500 leading-tight">{item.result.title}</h3>
        <span className="font-mono text-[10px] text-zinc-600 uppercase shrink-0 pt-1">
          {new Date(item.timestamp).toLocaleDateString()}
        </span>
      </div>
      <p className="text-zinc-300 mb-5 sm:mb-6 italic leading-relaxed text-sm sm:text-base">"{item.result.listingDescription}"</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {item.result.amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-[13px] sm:text-sm text-zinc-400">
            <span className="w-1 h-1 bg-yellow-500 rounded-full" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <div className="bg-white/5 p-4 rounded-lg border-l-4 border-yellow-500 italic text-[13px] sm:text-sm text-yellow-100/80">
        “{item.result.broQuote}”
      </div>
    </div>
  </div>
);

const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 mb-8 border-t-2 border-yellow-500 rounded-full animate-spin"></div>
    <h2 className="text-2xl font-display font-bold text-yellow-500 mb-2">Analyzing the "Concept", Habibi...</h2>
    <p className="text-zinc-400 font-mono text-xs max-w-xs">
      Just adding the "Fresh" premium. Very Berlin. Very industrial. Almost done, bro.
    </p>
  </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_PORTFOLIO);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundStyle = useMemo<React.CSSProperties>(() => {
    return {
      backgroundImage:
        'radial-gradient(900px circle at 15% 10%, rgba(245, 158, 11, 0.12), transparent 55%), radial-gradient(700px circle at 85% 90%, rgba(255, 255, 255, 0.05), transparent 60%), radial-gradient(1200px circle at 50% 120%, rgba(245, 158, 11, 0.06), transparent 55%)',
    };
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG/PNG/WebP).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const result = await appraiseProperty(base64);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: base64,
        result,
        timestamp: Date.now(),
      };

      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Bro, something went wrong. Maybe the Wi-Fi in the bunker is down? Try again, habibi.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    event.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] pb-[calc(120px+env(safe-area-inset-bottom))] sm:pb-20 selection:bg-yellow-500/30">
      <div aria-hidden className="fixed inset-0 -z-10" style={backgroundStyle} />
      {loading && <LoadingOverlay />}

      <a
        href="https://theosayad.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Back to theosayad.com"
        className="fixed top-3 left-3 z-50 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400/90 hover:text-yellow-500/90 opacity-90 hover:opacity-100 transition-colors select-none px-3 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md"
      >
        theosayad.com
      </a>
      
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Upload Section */}
        <div className="mb-20 text-center">
          <button
            type="button"
            onClick={triggerUpload}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) await handleFile(file);
            }}
            className={[
              "group relative w-full text-center cursor-pointer border-2 border-dashed rounded-3xl p-6 sm:p-12 transition-all duration-300 overflow-hidden active:scale-[0.99]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              isDragging ? "border-yellow-500/70 bg-yellow-500/5" : "border-zinc-800 hover:border-yellow-500/50",
            ].join(" ")}
          >
            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto mb-5 sm:mb-6 flex items-center justify-center group-hover:scale-110 group-hover:border-yellow-500/30 transition-all duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-500 group-hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Upload Your Distressed Space</h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-mono uppercase tracking-tight leading-relaxed">
                Turn your "Bro, what happened here?" into "Habibi, what a concept!"
              </p>
              <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                {isDragging ? "Drop the image here" : "or drag & drop"}
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </button>

          {/* Privacy Disclaimer */}
          <div className="mt-6 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2 text-[11px] sm:text-[10px] font-mono uppercase text-zinc-500 tracking-tighter">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Protocol: Off-the-books Confidentiality</span>
            </div>
            <p className="mt-2 text-[11px] sm:text-[9px] font-mono text-zinc-600 max-w-sm leading-relaxed">
              BRO, IT'S SOUS-LA-TABLE: Your 'concept' is processed strictly in your browser's local memory. 
              No servers, no logs, no paper trail for the authorities. Your assets stay between you and your machine. 
              Very Swiss. Very discreet. Very tax-free.
            </p>
          </div>

          {error && (
            <div className="mt-4 glass-card border border-red-500/20 text-red-300 font-mono text-xs px-4 py-3 rounded-xl text-left" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Listings Section */}
        <div className="space-y-12">
          <h2 className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-zinc-600 mb-6 sm:mb-8 flex items-center">
            <span className="flex-grow h-[1px] bg-zinc-800 mr-4" />
            Active Portfolio
            <span className="flex-grow h-[1px] bg-zinc-800 ml-4" />
          </h2>
          {history.map(item => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 pb-[calc(12px+env(safe-area-inset-bottom))] z-40">
        <div className="max-w-md mx-auto glass-card border border-yellow-500/30 rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between shadow-2xl shadow-black/40">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-mono uppercase text-zinc-400 leading-tight truncate">Agent Online: Elie "Fresh" Mansour</span>
          </div>
          <button 
            onClick={triggerUpload}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-black text-xs font-bold uppercase px-4 py-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            New Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
