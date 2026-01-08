"use client";

import { useState, useEffect } from "react";
import { 
  Upload, FileVideo, Loader2, CheckCircle2, Circle, 
  Zap, Download, Settings, Film, AlertCircle, Terminal, Trash2, Cpu, Play, 
  Moon, Sun 
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]); 
  const [apiUrl, setApiUrl] = useState(""); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // THEME STATE
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Load Settings
    const savedUrl = localStorage.getItem("AGENCLIP_API_URL");
    if (savedUrl) setApiUrl(savedUrl);
    else setIsSettingsOpen(true);

    const lastResults = localStorage.getItem("AGENCLIP_RESULTS");
    if (lastResults) {
        try {
            setResults(JSON.parse(lastResults));
            setStatus("completed");
        } catch (e) { localStorage.removeItem("AGENCLIP_RESULTS"); }
    }

    // Load Theme
    const savedTheme = localStorage.getItem("AGENCLIP_THEME") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("AGENCLIP_THEME", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const saveApiUrl = (url: string) => {
    const cleanUrl = url.replace(/\/$/, ""); 
    setApiUrl(cleanUrl);
    localStorage.setItem("AGENCLIP_API_URL", cleanUrl);
    setIsSettingsOpen(false);
  };

  const resetApp = () => {
      localStorage.removeItem("AGENCLIP_RESULTS");
      setFile(null);
      setResults([]);
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

      if (!res.ok) throw new Error("Connection failed.");
      
      const { job_id } = await res.json();
      setProgress(20);

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/status/${job_id}`, {
             headers: { "ngrok-skip-browser-warning": "true" }
          });
          const data = await statusRes.json();

          if (data.status === "transcribing") setProgress(35);
          else if (data.status === "analyzing") setProgress(60);
          else if (data.status === "rendering") setProgress(85);
          else if (data.status === "completed") {
            clearInterval(interval);
            setProgress(100);
            
            const finalResults = data.results.map((r: any) => ({
                ...r,
                url: `${apiUrl}${r.url}`
            }));

            localStorage.setItem("AGENCLIP_RESULTS", JSON.stringify(finalResults));
            setResults(finalResults);
            
            setTimeout(() => setStatus("completed"), 500);

          } else if (data.status === "failed") {
            clearInterval(interval);
            setStatus("failed");
          }
        } catch (err) { console.error(err); }
      }, 3000); 

    } catch (err) {
      setStatus("failed");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-emerald-500/30 
        ${theme === 'dark' ? 'bg-[#050505] text-zinc-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
               backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-gray-200'} border p-8 rounded-2xl w-full max-w-md shadow-2xl`}>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-500" /> SYSTEM CONFIG
                </h3>
                <input 
                    type="text" 
                    placeholder="https://xxxx.ngrok-free.app"
                    className={`w-full border rounded-lg p-3 mb-4 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500
                        ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-gray-100 border-gray-300 text-black'}`}
                    defaultValue={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
                <button onClick={() => saveApiUrl(apiUrl)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wide">
                    Connect Engine
                </button>
            </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className={`fixed top-0 w-full z-40 border-b backdrop-blur-md transition-colors duration-300
          ${theme === 'dark' ? 'bg-[#050505]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
                <div className="w-9 h-9 bg-emerald-600/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500">
                    <Cpu className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">AGEN<span className="text-emerald-500">CLIP</span> PRO</span>
            </div>
            
            <div className="flex items-center gap-3">
                {/* THEME TOGGLE BUTTON */}
                <button onClick={toggleTheme} className={`p-2 rounded-full border transition
                    ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}>
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-3 px-4 py-2 border rounded-full transition
                    ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600' : 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${apiUrl ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {apiUrl ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </div>
                    <Settings className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-400'}`} />
                </button>
            </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-12 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* === IDLE === */}
        {status === "idle" && (
          <div className="w-full max-w-xl text-center animate-in slide-in-from-bottom-5 fade-in duration-700">
             <div className="mb-12">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono mb-4">
                    V3.0 • FACE TRACKING • MULTI-CLIP
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                   VIRAL SHORT <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">GENERATOR</span>
                </h1>
                <p className={`text-lg ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`}>
                    Upload 1 jam podcast. Dapatkan 5 klip "Alex Hormozi Style" dalam menit.
                </p>
             </div>

             <form onSubmit={handleSubmit} className="w-full">
                <div className="relative group w-full mb-6">
                    <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                    <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center relative transition-all
                        ${theme === 'dark' 
                            ? (file ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-600')
                            : (file ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400')
                        }`}>
                        {file ? (
                            <div className="text-emerald-500 flex flex-col items-center">
                                <FileVideo className="w-8 h-8 mb-2" />
                                <p className={`font-bold truncate max-w-[200px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                            </div>
                        ) : (
                            <div className={`${theme === 'dark' ? 'text-zinc-500' : 'text-gray-400'} flex flex-col items-center`}>
                                <Upload className="w-8 h-8 mb-2" />
                                <p className={`font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'}`}>Drop Video</p>
                            </div>
                        )}
                    </div>
                </div>
                <button disabled={!file} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition disabled:opacity-50
                    ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                    Process Video
                </button>
             </form>
          </div>
        )}

        {/* === PROCESSING === */}
        {status === "processing" && (
            <div className={`w-full max-w-md border rounded-2xl p-8 shadow-2xl relative overflow-hidden
                ${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-gray-200'}`}>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-pulse"></div>
                <div className="flex items-center gap-4 mb-6">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <div>
                        <h3 className="font-bold">GENERATING CLIPS...</h3>
                        <p className={`text-xs font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Phase: {progress < 40 ? 'Transcribing (Large-V3)' : progress < 70 ? 'AI Analyzing' : 'Face Tracking & Rendering'}
                        </p>
                    </div>
                </div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-200'}`}>
                    <div className="h-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        )}

        {/* === COMPLETED (GRID RESULT) === */}
        {status === "completed" && (
            <div className="w-full max-w-6xl animate-in slide-in-from-bottom-10 duration-500">
                <div className={`flex items-center justify-between mb-8 border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> GENERATION COMPLETE</h2>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>{results.length} Viral Clips Created</p>
                    </div>
                    <button onClick={resetApp} className={`px-4 py-2 border rounded-lg text-xs hover:bg-opacity-80 transition uppercase font-bold flex items-center gap-2
                        ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-red-400' : 'bg-white border-gray-300 text-red-600'}`}>
                        <Trash2 className="w-3 h-3" /> Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((clip, idx) => (
                        <div key={idx} className={`border rounded-2xl overflow-hidden hover:border-emerald-500/50 transition group flex flex-col
                            ${theme === 'dark' ? 'bg-[#0f0f0f] border-zinc-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="relative aspect-[9/16] bg-black">
                                <video src={clip.url} controls className="w-full h-full object-contain" />
                                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded shadow uppercase tracking-wider">
                                    Score: {clip.score}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2">{clip.title}</h3>
                                <p className={`text-xs mb-4 line-clamp-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                                    {clip.reason || "High engagement potential detected."}
                                </p>
                                <a href={clip.url} download className={`mt-auto flex items-center justify-center gap-2 w-full font-bold py-3 rounded-xl transition text-sm uppercase
                                    ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                                    <Download className="w-4 h-4" /> Download
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* === FAILED === */}
        {status === "failed" && (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4 max-w-md">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                    <h3 className="font-bold text-red-500 text-sm uppercase">Error Occurred</h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-red-400/70' : 'text-red-600/70'}`}>Please check Colab logs.</p>
                    <button onClick={resetApp} className={`mt-2 text-xs underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Try Again</button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

function StepItem({ label, done }: { label: string, done: boolean }) {
    // Component ini sedikit tricky karena butuh akses theme context (ideally pakai Context API), 
    // tapi untuk simpelnya kita pakai default style yang netral atau cek parent class
    return (
        <div className={`flex items-center gap-4 transition-all duration-500 ${done ? 'opacity-100 translate-x-0' : 'opacity-40 -translate-x-2'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-current'}`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </div>
            <span className="text-xs font-bold uppercase tracking-wide opacity-80">{label}</span>
        </div>
    )
}