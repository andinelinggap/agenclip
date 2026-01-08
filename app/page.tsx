"use client";

import { useState, useEffect } from "react";
import { 
  Upload, FileVideo, Loader2, CheckCircle2, Circle, 
  Zap, Download, Settings, Film, AlertCircle, Terminal, Trash2, Cpu
} from "lucide-react";

type ProcessingStep = "upload" | "analysis" | "rendering" | "done";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [clipTitle, setClipTitle] = useState("AgenClip Result");
  
  // Settings State
  const [apiUrl, setApiUrl] = useState(""); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("AGENCLIP_API_URL");
    if (savedUrl) setApiUrl(savedUrl);
    else setIsSettingsOpen(true);

    const lastResult = localStorage.getItem("AGENCLIP_LAST_RESULT");
    if (lastResult) {
        try {
            const parsed = JSON.parse(lastResult);
            setVideoUrl(parsed.url);
            setClipTitle(parsed.title);
            setStatus("completed");
        } catch (e) {
            localStorage.removeItem("AGENCLIP_LAST_RESULT");
        }
    }
  }, []);

  const saveApiUrl = (url: string) => {
    const cleanUrl = url.replace(/\/$/, ""); 
    setApiUrl(cleanUrl);
    localStorage.setItem("AGENCLIP_API_URL", cleanUrl);
    setIsSettingsOpen(false);
  };

  const resetApp = () => {
      localStorage.removeItem("AGENCLIP_LAST_RESULT");
      setFile(null);
      setVideoUrl("");
      setProgress(0);
      setStatus("idle");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !apiUrl) { setIsSettingsOpen(true); return; }

    setStatus("processing");
    setProgress(5);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
        body: formData,
      });

      if (!res.ok) throw new Error("Connection failed. Check AgenClip Backend.");
      
      const { job_id } = await res.json();
      setProgress(20);

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/status/${job_id}`, {
             headers: { "ngrok-skip-browser-warning": "true" }
          });
          const data = await statusRes.json();

          if (data.status === "transcribing") setProgress(40);
          else if (data.status === "analyzing") setProgress(60);
          else if (data.status === "rendering") setProgress(85);
          else if (data.status === "completed") {
            clearInterval(interval);
            setProgress(100);
            
            const resultData = { url: data.result_url, title: data.title || "AgenClip Result" };
            localStorage.setItem("AGENCLIP_LAST_RESULT", JSON.stringify(resultData));

            setTimeout(() => {
                setStatus("completed");
                setVideoUrl(data.result_url);
                if(data.title) setClipTitle(data.title);
            }, 500);
          } else if (data.status === "failed") {
            clearInterval(interval);
            setStatus("failed");
          }
        } catch (err) { console.error(err); }
      }, 2000);

    } catch (err) {
      setStatus("failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ 
               backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                
                <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2 tracking-tight">
                    <Terminal className="w-5 h-5 text-emerald-500" /> SYSTEM CONFIGURATION
                </h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Establish secure connection with <strong>Neural Engine (Colab)</strong>. Paste your Ngrok tunnel endpoint below.
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-mono text-zinc-500 uppercase mb-1 block">Endpoint URL</label>
                        <input 
                            type="text" 
                            placeholder="https://xxxx.ngrok-free.app"
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none font-mono text-sm transition-all"
                            defaultValue={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                        />
                    </div>
                    <button onClick={() => saveApiUrl(apiUrl)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-all hover:scale-[1.02] shadow-lg shadow-emerald-900/20 uppercase tracking-wide text-xs flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" /> Establish Connection
                    </button>
                    {localStorage.getItem("AGENCLIP_API_URL") && (
                        <button onClick={() => setIsSettingsOpen(false)} className="w-full text-zinc-500 hover:text-white text-xs transition">Cancel Configuration</button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
                <div className="w-9 h-9 bg-emerald-600/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <Cpu className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight leading-none">AGEN<span className="text-emerald-500">CLIP</span></span>
                    <span className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">Autonomous Editor</span>
                </div>
            </div>
            
            <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full hover:border-zinc-600 transition group">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${apiUrl ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}></span>
                    <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition">
                        {apiUrl ? 'ENGINE ONLINE' : 'DISCONNECTED'}
                    </span>
                </div>
                <Settings className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition" />
            </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-12 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* === IDLE STATE (FIXED BUTTON BUG) === */}
        {status === "idle" && (
          <div className="w-full max-w-xl text-center animate-in slide-in-from-bottom-5 fade-in duration-700">
             <div className="mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                    AI Model v2.5 Ready
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
                   COMMAND <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CENTER</span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                    Transformasi video panjang menjadi aset viral otomatis. 
                    <span className="text-zinc-200"> Tanpa edit manual. Tanpa drama.</span>
                </p>
             </div>

             <form onSubmit={handleSubmit} className="w-full">
                
                {/* 1. AREA UPLOAD (RELATIVE) */}
                <div className="relative group w-full mb-6">
                    <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" 
                    />
                    
                    <div className={`border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-900/20
                        ${file ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40'}`}>
                        
                        {file ? (
                            <div className="text-emerald-400 flex flex-col items-center animate-in zoom-in relative z-10">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3 border border-emerald-500/20">
                                    <FileVideo className="w-7 h-7" />
                                </div>
                                <p className="font-bold text-lg text-white max-w-[250px] truncate">{file.name}</p>
                                <p className="text-xs text-emerald-500/70 font-mono mt-1 uppercase tracking-wider">{(file.size / (1024*1024)).toFixed(1)} MB • Source Loaded</p>
                            </div>
                        ) : (
                            <div className="text-zinc-500 flex flex-col items-center relative z-10 group-hover:scale-105 transition duration-300">
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-zinc-700 transition">
                                    <Upload className="w-6 h-6 text-zinc-400" />
                                </div>
                                <p className="font-bold text-zinc-300">Drop Source Material</p>
                                <p className="text-xs text-zinc-500 mt-1 font-mono">MP4 / MOV FORMAT SUPPORTED</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. TOMBOL EKSEKUSI (DI LUAR AREA UPLOAD AGAR BISA DIKLIK) */}
                <button 
                    type="submit"
                    disabled={!file} 
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    {file ? 'Initialize Protocol' : 'Select File to Begin'}
                </button>

             </form>
          </div>
        )}

        {/* === PROCESSING STATE === */}
        {status === "processing" && (
            <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-pulse"></div>
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative">
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm tracking-wide">PROCESSING SEQUENCE</h3>
                            <p className="text-xs text-zinc-500 font-mono mt-1">Status: <span className="text-emerald-400">Active</span> • {progress}%</p>
                        </div>
                    </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mb-8 border border-zinc-800">
                    <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_15px_#10b981]" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-5">
                    <StepItem label="Secure Cloud Upload" done={progress > 10} />
                    <StepItem label="Whisper Audio Transcription" done={progress > 30} />
                    <StepItem label="Context & Virality Analysis" done={progress > 50} />
                    <StepItem label="Final Compositing & Rendering" done={progress > 80} />
                </div>
            </div>
        )}

        {/* === RESULT STATE === */}
        {status === "completed" && videoUrl && (
            <div className="w-full max-w-4xl animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> MISSION ACCOMPLISHED</h2>
                        <p className="text-zinc-500 text-sm mt-1">Output generated successfully.</p>
                    </div>
                    <button onClick={resetApp} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs text-red-400 hover:text-red-300 transition uppercase font-bold tracking-wider flex items-center gap-2">
                        <Trash2 className="w-3 h-3" /> Clear & Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* RESULT CARD */}
                    <div className="bg-[#0f0f0f] border border-emerald-500/40 rounded-2xl overflow-hidden hover:border-emerald-400 transition duration-300 group shadow-[0_0_40px_rgba(16,185,129,0.1)] flex flex-col">
                        <div className="relative aspect-[9/16] bg-black">
                            <video src={videoUrl} controls className="w-full h-full object-contain" />
                            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wider flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-white" /> Viral Pick
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-2 leading-tight text-white">{clipTitle}</h3>
                            <div className="flex gap-2 mb-6">
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded border border-zinc-700 font-mono">HD 720P</span>
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded border border-zinc-700 font-mono">AI SUBTITLES</span>
                            </div>
                            <div className="mt-auto">
                                <a href={videoUrl} download className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition text-sm uppercase tracking-wide">
                                    <Download className="w-4 h-4" /> Download Asset
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* DUMMY CARDS */}
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden opacity-30 grayscale pointer-events-none">
                            <div className="aspect-[9/16] bg-zinc-800/20 flex items-center justify-center">
                                <Terminal className="w-8 h-8 text-zinc-700" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-2 text-zinc-600">Queue Empty</h3>
                                <div className="h-8 bg-zinc-800/50 rounded mb-2 w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* FAILED STATE */}
        {status === "failed" && (
            <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-2xl flex items-center gap-4 max-w-md backdrop-blur-md animate-in shake">
                <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-red-400 text-sm uppercase tracking-wide mb-1">Critical Failure</h3>
                    <p className="text-xs text-red-400/70 mb-2">Connection to Neural Engine terminated unexpectedly.</p>
                    <button onClick={resetApp} className="text-xs bg-red-900/30 px-3 py-1 rounded text-red-200 hover:bg-red-900/50 transition">REBOOT SYSTEM</button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

function StepItem({ label, done }: { label: string, done: boolean }) {
    return (
        <div className={`flex items-center gap-4 transition-all duration-500 ${done ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${done ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-700 text-zinc-700'}`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wide ${done ? 'text-white' : 'text-zinc-500'}`}>{label}</span>
        </div>
    )
}