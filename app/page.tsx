"use client";

import { useState, useEffect } from "react";
import { 
  UploadCloud, FileVideo, Loader2, CheckCircle2, Circle, 
  Sparkles, Download, Settings, Link as LinkIcon
} from "lucide-react";

type ProcessingStep = "upload" | "analysis" | "crop" | "subtitle" | "done";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [currentStep, setCurrentStep] = useState<ProcessingStep>("upload");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // === 1. STATE BARU: UNTUK URL NGROK ===
  const [apiUrl, setApiUrl] = useState(""); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Data dummy (sama seperti kodemu)
  const [clipData, setClipData] = useState({
    title: "Rahasia Sukses 2025 🚀",
    desc: "Ternyata ini alasan kenapa kita sering burnout. Relate banget ga sih? 😳",
    score: 92,
    tags: ["#motivasi", "#genz", "#selfimprovement"]
  });

  // Load URL saat pertama buka
  useEffect(() => {
    const savedUrl = localStorage.getItem("ARVISTAR_API_URL");
    if (savedUrl) setApiUrl(savedUrl);
    else setIsSettingsOpen(true); // Paksa buka settings jika belum ada URL
  }, []);

  const saveApiUrl = (url: string) => {
    const cleanUrl = url.replace(/\/$/, ""); // Hapus slash di akhir
    setApiUrl(cleanUrl);
    localStorage.setItem("ARVISTAR_API_URL", cleanUrl);
    setIsSettingsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    // Cek apakah URL Ngrok sudah diisi
    if (!apiUrl) { 
        alert("Masukkan URL Backend Ngrok dulu di menu Settings!"); 
        setIsSettingsOpen(true); 
        return; 
    }

    setStatus("processing");
    setProgress(10);
    setCurrentStep("upload");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // === 2. GANTI URL LOCALHOST DENGAN API URL ===
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal connect. Cek URL Ngrok!");
      
      const data = await res.json();
      const jobId = data.job_id;
      
      setCurrentStep("analysis");
      setProgress(30);

      const interval = setInterval(async () => {
        try {
          // === 3. GANTI URL POLLING JUGA ===
          const statusRes = await fetch(`${apiUrl}/status/${jobId}`);
          const statusData = await statusRes.json();

          if (statusData.status === "transcribing") {
             setCurrentStep("analysis");
             setProgress((prev) => (prev < 60 ? prev + 1 : prev));
          } else if (statusData.status === "analyzing") {
             setCurrentStep("crop"); 
             setProgress((prev) => (prev < 80 ? prev + 5 : prev));
          } else if (statusData.status === "rendering") {
             setCurrentStep("subtitle");
             setProgress((prev) => (prev < 95 ? prev + 2 : prev));
          }

          if (statusData.status === "completed") {
            clearInterval(interval);
            setProgress(100);
            setCurrentStep("done");
            
            setTimeout(() => {
                setStatus("completed");
                setVideoUrl(statusData.result_url);
                if(statusData.clip_title) {
                    setClipData(prev => ({...prev, title: statusData.clip_title}));
                }
            }, 800);
            
          } else if (statusData.status === "failed") {
            clearInterval(interval);
            setStatus("failed");
            setErrorMsg(statusData.error || "Error sistem");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 2000);

    } catch (err: any) {
      setStatus("failed");
      setErrorMsg(err.message + ". Pastikan Colab jalan & URL benar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500 selection:text-black relative">
      
      {/* === 4. MODAL SETTINGS BARU (Untuk Input URL Ngrok) === */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl animate-in zoom-in-95">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-cyan-400" /> Connect Backend
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    Paste URL Ngrok dari Google Colab di sini (contoh: https://xxxx.ngrok-free.app).
                </p>
                <input 
                    type="text" 
                    placeholder="https://xxxx-xxxx.ngrok-free.app"
                    className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none mb-4"
                    defaultValue={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
                <button 
                    onClick={() => saveApiUrl(apiUrl)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition"
                >
                    Simpan & Connect
                </button>
                {/* Tombol Close jika sudah ada URL */}
                {localStorage.getItem("ARVISTAR_API_URL") && (
                   <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-2 text-slate-500 hover:text-white text-sm">Cancel</button>
                )}
            </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
             <Sparkles className="w-5 h-5 text-white" />
           </div>
           <span className="text-lg font-bold tracking-tight">AI Clip Studio <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-normal ml-1">BETA</span></span>
        </div>
        
        {/* Tombol Settings Status */}
        <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-sm font-medium transition"
        >
            <div className={`w-2 h-2 rounded-full ${apiUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {apiUrl ? 'Connected' : 'No Server'}
            <Settings className="w-4 h-4 ml-1" />
        </button>
      </header>

      {/* ... SISANYA SAMA PERSIS DENGAN KODE UI KAMU (Main, Processing, Result) ... */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* STATE 1: IDLE */}
        {status === "idle" && (
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="text-center mb-10 space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Satu Klik. Langsung Viral.
                </h1>
                <p className="text-slate-400 text-lg">Upload video panjang. AI potong jadi Shorts + Subtitles.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group cursor-pointer">
                  <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${file ? "border-cyan-500/50 bg-cyan-950/10" : "border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900"}`}>
                    {file ? (
                      <>
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 text-cyan-400"><FileVideo className="w-8 h-8" /></div>
                        <p className="text-lg font-medium text-cyan-100">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:scale-110 transition"><UploadCloud className="w-8 h-8" /></div>
                        <p className="text-lg font-medium text-slate-200">Click to upload or drag & drop</p>
                      </>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={!file} className="w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                  Generate Viral Clips ✨
                </button>
             </form>
          </div>
        )}

        {/* STATE 2: PROCESSING */}
        {status === "processing" && (
          <div className="w-full max-w-lg bg-[#111] border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-900/20 rounded-lg flex items-center justify-center text-cyan-400 shrink-0"><FileVideo className="w-6 h-6" /></div>
                <div className="overflow-hidden"><h3 className="font-semibold text-slate-200 truncate">{file?.name || "Video.mp4"}</h3></div>
             </div>
             <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 font-medium"><span className="text-cyan-400 animate-pulse">AI Analysis...</span><span className="text-slate-400">{progress}%</span></div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div></div>
             </div>
             <div className="space-y-4">
                <StepItem label="Upload to Secure Storage" status={currentStep === "upload" ? "current" : "completed"} />
                <StepItem label="Gemini Analysis (Indonesian Context)" status={currentStep === "upload" ? "waiting" : (currentStep === "analysis" ? "current" : "completed")} />
                <StepItem label="Smart Crop & Subtitles" status={["upload", "analysis"].includes(currentStep) ? "waiting" : (currentStep === "crop" || currentStep === "subtitle" ? "current" : "completed")} />
             </div>
          </div>
        )}

        {/* STATE 3: RESULT */}
        {status === "completed" && videoUrl && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Result Clips</h2>
                <button onClick={() => window.location.reload()} className="text-sm text-slate-400 hover:text-white transition">Upload New</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultCard videoUrl={videoUrl} score={clipData.score} title={clipData.title} desc={clipData.desc} tags={clipData.tags} duration="30s" />
                <ResultCard videoUrl={videoUrl} score={88} title="Jangan Nyerah Dulu! 💪" desc="Buat lo yang lagi capek berjuang." tags={["#semangat"]} duration="40s" isDemo={true} />
                <ResultCard videoUrl={videoUrl} score={95} title="Mindset Orang Kaya 🤑" desc="Cara atur duit biar ga boncos." tags={["#keuangan"]} duration="35s" isDemo={true} />
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

// SUB COMPONENTS (SAMA SEPERTI SEBELUMNYA)
function StepItem({ label, status }: { label: string, status: "waiting" | "current" | "completed" }) {
    return (
        <div className="flex items-center gap-3">
            {status === "completed" ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : status === "current" ? <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" /> : <Circle className="w-5 h-5 text-slate-700 shrink-0" />}
            <span className={`text-sm ${status === "waiting" ? "text-slate-600" : "text-slate-300"}`}>{label}</span>
        </div>
    )
}

function ResultCard({ videoUrl, score, title, desc, tags, duration, isDemo = false }: any) {
    return (
        <div className={`bg-[#161616] rounded-xl overflow-hidden border border-slate-800 flex flex-col group ${isDemo ? 'opacity-50 hover:opacity-100 transition-opacity' : ''}`}>
           <div className="relative aspect-[9/16] bg-black">
              <video src={videoUrl} controls className="w-full h-full object-contain" poster="/placeholder.png" />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
                  <div className="bg-[#2a1a1a]/90 backdrop-blur border border-red-900/30 px-2 py-1 rounded text-[10px] font-bold text-red-400 uppercase tracking-wide">Viral Score: {score}</div>
                  <div className="bg-black/60 px-2 py-1 rounded text-xs text-white">{duration}</div>
              </div>
           </div>
           <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-slate-100 text-lg mb-2 leading-tight">{title}</h3>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">{desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">{tags.map((tag: string, i: number) => (<span key={i} className="px-2 py-1 bg-slate-800 text-cyan-400 text-[10px] rounded font-medium">{tag}</span>))}</div>
              <div className="mt-auto">
                 <a href={videoUrl} download className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-200 text-black font-bold py-3 rounded-lg text-sm transition-colors"><Download className="w-4 h-4" /> Download HD</a>
              </div>
           </div>
        </div>
    )
}