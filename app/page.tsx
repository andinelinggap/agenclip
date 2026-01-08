"use client";

import { useState, useEffect } from "react";
import { 
  Upload, FileVideo, Loader2, CheckCircle2, Circle, 
  Zap, Download, Settings, Film, AlertCircle, Terminal, Trash2
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
    // 1. LOAD API URL
    const savedUrl = localStorage.getItem("AGENCLIP_API_URL");
    if (savedUrl) setApiUrl(savedUrl);
    else setIsSettingsOpen(true);

    // 2. LOAD LAST RESULT (Agar tidak upload ulang saat refresh)
    const lastResult = localStorage.getItem("AGENCLIP_LAST_RESULT");
    if (lastResult) {
        try {
            const parsed = JSON.parse(lastResult);
            setVideoUrl(parsed.url);
            setClipTitle(parsed.title);
            setStatus("completed"); // Langsung lompat ke hasil
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

  // FUNGSI RESET (NEW TASK)
  const resetApp = () => {
      localStorage.removeItem("AGENCLIP_LAST_RESULT"); // Hapus memori
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
      // 1. UPLOAD
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
        body: formData,
      });

      if (!res.ok) throw new Error("Connection failed. Check AgenClip Backend.");
      
      const { job_id } = await res.json();
      setProgress(20);

      // 2. POLLING
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
            
            // SIMPAN HASIL KE MEMORI
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#111] border border-zinc-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold mb-2 text-emerald-400 flex items-center gap-2">
                    <Terminal className="w-5 h-5" /> Connect Agent
                </h3>
                <p className="text-zinc-400 text-sm mb-4">Paste URL Ngrok dari Colab untuk mengaktifkan AgenClip Engine.</p>
                <input 
                    type="text" 
                    placeholder="https://xxxx.ngrok-free.app"
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none mb-4 font-mono text-sm"
                    defaultValue={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
                <button onClick={() => saveApiUrl(apiUrl)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition uppercase tracking-wide text-xs">Activate Engine</button>
                {/* Tombol Cancel jika sudah ada URL */}
                {localStorage.getItem("AGENCLIP_API_URL") && (
                   <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-3 text-zinc-500 hover:text-white text-xs">Cancel</button>
                )}
            </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                <span className="font-bold text-xl tracking-tighter">AGEN<span className="text-emerald-500">CLIP</span></span>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition">
                <div className={`w-2 h-2 rounded-full ${apiUrl ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs font-mono text-zinc-400">{apiUrl ? 'SYSTEM ONLINE' : 'OFFLINE'}</span>
                <Settings className="w-3 h-3 text-zinc-500 ml-1" />
            </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-12 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* === IDLE STATE === */}
        {status === "idle" && (
          <div className="w-full max-w-xl text-center animate-in slide-in-from-bottom-5 fade-in duration-700">
             <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
                   DEPLOY YOUR <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI AGENT</span>
                </h1>
                <p className="text-zinc-500 text-lg">AgenClip memotong video panjang jadi viral shorts. Otomatis.</p>
             </div>

             <form onSubmit={handleSubmit} className="relative group">
                <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                
                <div className={`border border-dashed rounded-xl p-12 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden
                    ${file ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60'}`}>
                    
                    {file ? (
                        <div className="text-emerald-400 flex flex-col items-center animate-in zoom-in relative z-10">
                            <FileVideo className="w-12 h-12 mb-3" />
                            <p className="font-bold text-lg text-white">{file.name}</p>
                            <p className="text-xs text-emerald-500/70 font-mono mt-1">Ready to deploy</p>
                        </div>
                    ) : (
                        <div className="text-zinc-500 flex flex-col items-center relative z-10">
                            <Upload className="w-10 h-10 mb-3 group-hover:-translate-y-1 transition duration-300" />
                            <p className="font-medium text-zinc-300">Drop Video File</p>
                            <p className="text-xs mt-1">MP4 / MOV</p>
                        </div>
                    )}
                </div>

                <button disabled={!file} className="mt-6 w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide">
                    Run Agent
                </button>
             </form>
          </div>
        )}

        {/* === PROCESSING STATE === */}
        {status === "processing" && (
            <div className="w-full max-w-md bg-[#111] border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">AGENT WORKING...</h3>
                            <p className="text-xs text-zinc-500 font-mono">Progress: {progress}%</p>
                        </div>
                    </div>
                </div>

                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_#10b981]" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-4">
                    <StepItem label="Upload to Cloud" done={progress > 10} />
                    <StepItem label="Transcribing Audio" done={progress > 30} />
                    <StepItem label="Viral Context Analysis" done={progress > 50} />
                    <StepItem label="Final Rendering" done={progress > 80} />
                </div>
            </div>
        )}

        {/* === RESULT STATE === */}
        {status === "completed" && videoUrl && (
            <div className="w-full max-w-4xl animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Film className="w-5 h-5 text-emerald-500" /> MISSION COMPLETE</h2>
                    {/* TOMBOL RESET BARU: Menghapus data memori */}
                    <button onClick={resetApp} className="text-xs text-red-500 hover:text-red-400 transition uppercase font-bold tracking-wider flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clear & New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* RESULT CARD */}
                    <div className="bg-[#111] border border-emerald-500/30 rounded-xl overflow-hidden hover:border-emerald-500 transition duration-300 group shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <div className="relative aspect-[9/16] bg-black">
                            <video src={videoUrl} controls className="w-full h-full object-contain" />
                            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded shadow uppercase tracking-wider">Viral Pick</div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-md mb-2 leading-tight text-white">{clipTitle}</h3>
                            <p className="text-zinc-500 text-[10px] mb-4 uppercase tracking-widest">AI Generated • 720p</p>
                            <a href={videoUrl} download className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-3 rounded hover:bg-zinc-200 transition text-sm uppercase">
                                <Download className="w-4 h-4" /> Download
                            </a>
                        </div>
                    </div>

                    {/* DUMMY CARDS */}
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden opacity-40 grayscale">
                            <div className="aspect-[9/16] bg-zinc-800/50 flex items-center justify-center">
                                <Terminal className="w-8 h-8 text-zinc-700" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-md mb-2 text-zinc-600">Pending Task #{i}</h3>
                                <div className="h-8 bg-zinc-800/50 rounded mb-2 w-full"></div>
                                <div className="h-8 bg-zinc-800/50 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* FAILED STATE */}
        {status === "failed" && (
            <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl flex items-center gap-4 max-w-md backdrop-blur-md">
                <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                <div>
                    <h3 className="font-bold text-red-400 text-sm uppercase tracking-wide">System Error</h3>
                    <p className="text-xs text-red-400/70">Agent disconnected. Check Colab/Ngrok.</p>
                    <button onClick={resetApp} className="mt-2 text-xs text-white underline">Reboot</button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

function StepItem({ label, done }: { label: string, done: boolean }) {
    return (
        <div className={`flex items-center gap-3 transition-colors ${done ? 'text-emerald-400' : 'text-zinc-600'}`}>
            {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </div>
    )
}