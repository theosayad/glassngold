import React, { useState, useRef } from 'react';
import { appraiseProperty } from './geminiService';
import { AppraisalResult, HistoryItem } from './types';

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
    imageUrl: './sample.jpg', // User should place their image here named sample.jpg
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
  <header className="py-12 px-6 text-center">
    <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tighter">
      GLA$$ <span className="text-yellow-500">&</span> GOLD
    </h1>
    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
      The Deconstructed Living Experience | Mar Mikhael • Gemmayze • Berlin
    </p>
  </header>
);

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => (
  <div className="glass-card rounded-2xl overflow-hidden mb-6 flex flex-col md:flex-row border-yellow-500/20 border">
    <div className="w-full md:w-1/3 h-[400px] md:h-auto relative">
      <img 
        src={item.imageUrl} 
        alt="Appraised Property" 
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        onError={(e) => {
          // Fallback if sample.jpg isn't uploaded yet
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597047392601-38148677f59d?q=80&w=2000&auto=format&fit=crop';
        }}
      />
      <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 font-mono text-xs font-bold uppercase">
        {item.result.rentPrice}
      </div>
    </div>
    <div className="p-8 flex-1">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-display font-bold text-yellow-500">{item.result.title}</h3>
        <span className="font-mono text-[10px] text-zinc-600 uppercase">
          {new Date(item.timestamp).toLocaleDateString()}
        </span>
      </div>
      <p className="text-zinc-300 mb-6 italic leading-relaxed">"{item.result.listingDescription}"</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {item.result.amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm text-zinc-400">
            <span className="w-1 h-1 bg-yellow-500 rounded-full" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <div className="bg-white/5 p-4 rounded-lg border-l-4 border-yellow-500 italic text-sm text-yellow-100/80">
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] pb-20 selection:bg-yellow-500/30">
      {loading && <LoadingOverlay />}
      
      <Header />

      <main className="max-w-4xl mx-auto px-6">
        {/* Upload Section */}
        <div className="mb-20 text-center">
          <div 
            onClick={triggerUpload}
            className="group relative cursor-pointer border-2 border-dashed border-zinc-800 rounded-3xl p-12 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-all duration-300" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 group-hover:border-yellow-500/30 transition-all duration-300">
                <svg className="w-8 h-8 text-zinc-500 group-hover:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Upload Your Distressed Space</h2>
              <p className="text-zinc-500 text-sm font-mono uppercase tracking-tight">
                Turn your "Bro, what happened here?" into "Habibi, what a concept!"
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Privacy Disclaimer */}
          <div className="mt-6 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2 text-[10px] font-mono uppercase text-zinc-500 tracking-tighter">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Protocol: Off-the-books Confidentiality</span>
            </div>
            <p className="mt-2 text-[9px] font-mono text-zinc-600 max-w-sm leading-relaxed">
              BRO, IT'S SOUS-LA-TABLE: Your 'concept' is processed strictly in your browser's local memory. 
              No servers, no logs, no paper trail for the authorities. Your assets stay between you and your machine. 
              Very Swiss. Very discreet. Very tax-free.
            </p>
          </div>

          {error && <p className="mt-4 text-red-500 font-mono text-xs">{error}</p>}
        </div>

        {/* Listings Section */}
        <div className="space-y-12">
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
        <div className="max-w-md mx-auto glass-card border border-yellow-500/30 rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-zinc-400">Agent Online: Elie "Fresh" Mansour</span>
          </div>
          <button 
            onClick={triggerUpload}
            className="bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-bold uppercase px-4 py-1.5 rounded-full transition-colors"
          >
            New Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;