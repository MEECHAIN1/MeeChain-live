
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppState';
import { GoogleGenAI } from "@google/genai";
import { triggerMintRitual, triggerSuccessRitual, triggerWarpRitual } from '../lib/rituals';
import { generateMeeBotName } from '../lib/meeBotNames';

const MintPage: React.FC = () => {
  const { state, notify, addEvent, setGlobalLoading, addBot } = useApp();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyWatermark = (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return resolve(base64Image);
        
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(base64Image);

        ctx.drawImage(img, 0, 0, 1024, 1024);

        const gradient = ctx.createLinearGradient(0, 850, 0, 1024);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 850, 1024, 174);

        ctx.font = "900 60px 'Inter', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.textAlign = "center";
        ctx.fillText("MEECHAIN SPIRIT", 512, 950);

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = base64Image;
    });
  };

  const generateMeeBot = async () => {
    if (!prompt.trim()) return notify('error', 'โปรดระบุลักษณะของจิตวิญญาณ MeeBot');
    
    setIsGenerating(true);
    setGlobalLoading('general', true);
    triggerWarpRitual();
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Optimized prompt to match the aesthetic of "MeeChain Spirit" from user image 1
      const enhancedPrompt = `A cute 3D chibi-style mechanical MeeBot robot, large circular glowing cyan blue eyes, white metallic body, ${prompt}, holding a vibrant glowing pink lotus flower in its mechanical palm, wearing a red traditional sash with a gold medallion, standing in a dreamy space nebula with floating planets and abstract shapes, toy photography style, smooth clay-like textures, cinematic lighting, vibrant 8k render.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: enhancedPrompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      let rawImage = "";
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            rawImage = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (rawImage) {
        const finishedAsset = await applyWatermark(rawImage);
        setGeneratedImage(finishedAsset);
        notify('success', 'MeeBot Spirit Manifested!');
      } else {
        throw new Error("Empty manifestation result");
      }
    } catch (err: any) {
      console.error("Manifestation Error:", err);
      notify('error', `Neural link failed: ${err.message || 'Quantum turbulence detected'}. Try again.`);
    } finally {
      setIsGenerating(false);
      setGlobalLoading('general', false);
    }
  };

  const handleMint = async () => {
    if (!state.account || !generatedImage) return notify('error', 'Neural Link not established or image missing.');
    
    setIsMinting(true);
    setGlobalLoading('general', true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      const tokenId = Math.floor(Math.random() * 9000) + 1000;
      
      const newBot = {
        id: tokenId.toString(),
        name: generateMeeBotName(tokenId.toString()),
        rarity: Math.random() > 0.9 ? "Legendary" : Math.random() > 0.7 ? "Epic" : "Common" as any,
        energyLevel: 0,
        stakingStart: null,
        isStaking: false,
        image: generatedImage,
        baseStats: {
          power: 40 + Math.random() * 20,
          speed: 40 + Math.random() * 20,
          intel: 40 + Math.random() * 20
        },
        components: ["Modular Plating", "Core Processor", "Sensory Array", "Energy Conduit"] // Default components for new bots
      };

      addBot(newBot);

      addEvent({
        type: 'Minted',
        contract: 'NFT',
        from: '0x0000000000000000000000000000000000000000',
        to: state.account,
        tokenId: tokenId.toString(),
        hash: `0x${Math.random().toString(16).slice(2, 66)}`
      });

      triggerSuccessRitual();
      triggerMintRitual();
      notify('success', `Spirit #${tokenId} anchored to your wallet and gallery!`);
      setGeneratedImage(null);
      setPrompt('');
    } catch (err) {
      notify('error', 'Anchoring ritual failed.');
    } finally {
      setIsMinting(false);
      setGlobalLoading('general', false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
          Spirit <span className="text-rose-500">Manifestor</span>
        </h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Neural Interface v4.0</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8 relative overflow-hidden">
          <div className="space-y-2">
            <h2 className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-3">
              <span className="w-2 h-6 bg-rose-500 rounded-full animate-pulse"></span>
              Input Spirit Code
            </h2>
            <p className="text-slate-400 font-medium text-sm">Describe the machine spirit you wish to summon.</p>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A golden guardian with neon wings..."
            className="w-full h-56 bg-black/40 border-2 border-white/5 rounded-[2rem] p-8 text-white focus:outline-none focus:border-rose-500/30 transition-all placeholder:text-slate-800 italic text-xl"
            disabled={isGenerating || isMinting}
          />
          
          <button 
            onClick={generateMeeBot}
            disabled={isGenerating || !prompt.trim() || isMinting}
            className="w-full bg-rose-500 hover:bg-rose-400 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.5em] shadow-2xl transition-all disabled:opacity-20 text-white flex items-center justify-center gap-4"
          >
            {isGenerating ? 'SUMMONING...' : 'MANIFEST SPIRIT'}
          </button>
        </div>

        <div className="space-y-8">
          <div className="glass aspect-square rounded-[4rem] border-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl bg-black/40">
            {generatedImage ? (
              <img src={generatedImage} alt="Spirit" className="w-full h-full object-cover animate-in zoom-in-95 duration-700" />
            ) : (
              <div className="text-center opacity-20">
                <div className="text-8xl mb-6">🌸</div>
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Manifestation</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <button 
            onClick={handleMint}
            disabled={!generatedImage || isMinting}
            className="w-full h-24 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.6em] transition-all disabled:opacity-10 flex items-center justify-center gap-6 shadow-2xl"
          >
            {isMinting ? 'ANCHORING...' : 'PERMANENT ASCENSION'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
