"use client";

import { useState, useEffect } from "react";
import { 
  Upload, FileVideo, Loader2, CheckCircle2, Cloud, RefreshCw, 
  Settings, Terminal, Trash2, Cpu, Moon, Sun, Download, AlertCircle, 
  Lock, LogOut, ArrowLeft, Sparkles, Construction 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// === PIN RAHASIA ===
const ADMIN_PIN = "112244"; 

interface VideoFile {
  filename: string;
  size: number;
  uploadDate: string;
  path: string;
}

export default function CreatePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState("");
  const [theme, setTheme] = useState("dark");
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem("AGENCLIP_ADMIN");
    if (session === "true") setIsAdmin(true);

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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      sessionStorage.setItem("AGENCLIP_ADMIN", "true");
    } else {
      alert("PIN SALAH! Akses Ditolak.");
      setPin("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("AGENCLIP_ADMIN");
    setIsAdmin(false);
    router.push("/");
  };

  // --- TAMPILAN 1: COMING SOON (PUBLIC VIEW) ---
  if (!isAdmin) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500
        ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle at center, ${theme === 'dark' ? '#10b981' : '#059669'} 1px, transparent 1px)`, 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-50">
           <button onClick={toggleTheme} className={`p-2 rounded-full border transition hover:scale-105 shadow-sm
             ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-yellow-400' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}>
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>

        {/* Back to Home */}
        <div className="absolute top-6 left-6 z-50">
           <Link href="/" className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition
             ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
             <ArrowLeft className="w-4 h-4" /> Home
           </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 text-center max-w-3xl animate-in fade-in zoom-in duration-700">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-8 backdrop-blur-md
            ${theme === 'dark' ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600 shadow-sm'}`}>
            <Construction className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Under Development</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            COMING <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              SOON
            </span>
          </h1>
          
          {/* Deskripsi (TYPOGRAPHY UPGRADED) */}
          <div className={`text-lg md:text-2xl leading-relaxed font-medium max-w-2xl mx-auto
            ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>
            <p>
              Kami sedang menyiapkan <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Content Engine AI</span> tercanggih di Indonesia.
            </p>
            <p className={`mt-4 text-base md:text-lg opacity-80 font-normal ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
              Platform otomatisasi ini akan segera dibuka untuk publik.<br/>
              Sementara itu, silakan gunakan jasa kami di halaman utama.
            </p>
          </div>

          {/* Divider */}
          <div className={`w-24 h-1 mx-auto mt-12 rounded-full
            ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`}></div>

          <p className={`mt-6 text-xs font-mono uppercase tracking-widest opacity-50
            ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
            Estimated Launch: Q3 2026
          </p>
        </div>

        {/* --- TOMBOL RAHASIA ADMIN (HIDDEN LOCK) --- */}
        <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {!showPinInput ? (
                <button 
                    onClick={() => setShowPinInput(true)} 
                    className={`p-3 rounded-xl transition opacity-10 hover:opacity-100
                      ${theme === 'dark' ? 'text-zinc-500 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-200'}`}
                    title="System Access"
                >
                    <Lock className="w-5 h-5" />
                </button>
            ) : (
                <form onSubmit={handleUnlock} className={`flex gap-2 border p-1.5 rounded-lg animate-in slide-in-from-right-4 shadow-xl backdrop-blur-md
                  ${theme === 'dark' ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-slate-200'}`}>
                    <input 
                        type="password" 
                        className={`bg-transparent border-none outline-none text-sm w-24 pl-2 font-mono 
                          ${theme === 'dark' ? 'text-white placeholder:text-zinc-600' : 'text-slate-900 placeholder:text-slate-400'}`}
                        placeholder="PIN..."
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition">
                        GO
                    </button>
                </form>
            )}
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: DASHBOARD (ADMIN ONLY) ---
  return <AdminDashboard theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />;
}

// ==================================================================================
// ADMIN DASHBOARD COMPONENT
// ==================================================================================

function AdminDashboard({ theme, toggleTheme, onLogout }: { theme: string, toggleTheme: () => void, onLogout: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]); 
  const [apiUrl, setApiUrl] = useState(""); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [libraryFiles, setLibraryFiles] = useState<VideoFile[]>([]);
  const [isLoadingLib, setIsLoadingLib] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("AGENCLIP_API_URL");
    if (savedUrl) {
        setApiUrl(savedUrl);
        fetchLibrary(savedUrl);
    } else setIsSettingsOpen(true);

    const lastResults = localStorage.getItem("AGENCLIP_RESULTS");
    if (lastResults) {
        try { setResults(JSON.parse(lastResults)); setStatus("completed"); } catch (e) {}
    }
  }, []);

  const saveApiUrl = (url: string) => {
    const cleanUrl = url.replace(/\/$/, ""); 
    setApiUrl(cleanUrl);
    localStorage.setItem("AGENCLIP_API_URL", cleanUrl);
    setIsSettingsOpen(false);
    fetchLibrary(cleanUrl);
  };

  const fetchLibrary = async (url: string) => {
      if (!url) return;
      setIsLoadingLib(true);
      try {
          const res = await fetch(`${url}/library`, { headers: { "ngrok-skip-browser-warning": "true" } });
          if (res.ok) {
              const data = await res.json();
              setLibraryFiles(data.files || []);
          }
      } catch (e) { console.error(e); } finally { setIsLoadingLib(false); }
  };

  const handleReprocess = async (filename: string) => {
      if (!apiUrl) return;
      setStatus("processing"); setProgress(5);
      try {
          const res = await fetch(`${apiUrl}/reprocess`, {
            method: "POST", headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" }, body: JSON.stringify({ filename }),
          });
          if (!res.ok) throw new Error("Failed");
          const { job_id } = await res.json();
          trackProgress(job_id);
      } catch (err) { setStatus("failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !apiUrl) { setIsSettingsOpen(true); return; }
    setStatus("processing"); setProgress(5);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST", headers: { "ngrok-skip-browser-warning": "true" }, body: formData,
      });
      if (!res.ok) throw new Error("Failed");
      const { job_id } = await res.json();
      trackProgress(job_id);
    } catch (err) { setStatus("failed"); }
  };

  const trackProgress = (job_id: string) => {
      setProgress(20);
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/status/${job_id}`, { headers: { "ngrok-skip-browser-warning": "true" } });
          const data = await statusRes.json();
          if (data.status === "transcribing") setProgress(35);
          else if (data.status === "analyzing") setProgress(60);
          else if (data.status === "rendering") setProgress(85);
          else if (data.status === "completed") {
            clearInterval(interval); setProgress(100);
            const finalResults = data.results.map((r: any) => ({ ...r, url: `${apiUrl}${r.url}` }));
            localStorage.setItem("AGENCLIP_RESULTS", JSON.stringify(finalResults));
            setResults(finalResults);
            setTimeout(() => setStatus("completed"), 500);
            fetchLibrary(apiUrl);
          } else if (data.status === "failed") { clearInterval(interval); setStatus("failed"); }
        } catch (err) { }
      }, 3000); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const resetApp = () => {
      localStorage.removeItem("AGENCLIP_RESULTS");
      setFile(null); setResults([]); setProgress(0); setStatus("idle");
  };

  // --- RENDER DASHBOARD ---
  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-emerald-500/30 
        ${theme === 'dark' ? 'bg-[#050505] text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GRID BG */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`border p-8 rounded-2xl w-full max-w-md shadow-2xl transition-colors
              ${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Terminal className="w-5 h-5 text-emerald-500" /> SERVER CONNECTION</h3>
                <input type="text" placeholder="https://xxxx.ngrok-free.app" className={`w-full border rounded-lg p-3 mb-4 font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-gray-100 border-gray-300 text-black'}`} defaultValue={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
                <button onClick={() => saveApiUrl(apiUrl)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wide">Connect Engine</button>
            </div>
        </div>
      )}

      {/* NAVBAR ADMIN */}
      <header className={`fixed top-0 w-full z-40 border-b backdrop-blur-md transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500"><Cpu className="w-4 h-4" /></div>
                <span className="font-bold text-lg tracking-tight">ADMIN<span className="text-emerald-500">DASHBOARD</span></span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={onLogout} 
                  className="flex items-center gap-2 text-xs font-bold text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition mr-2 border border-red-500/20"
                >
                  <LogOut className="w-3.5 h-3.5" /> LOGOUT
                </button>
                
                <button onClick={toggleTheme} className={`p-2 rounded-full border transition ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-100 text-slate-600'}`}>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                
                <button onClick={() => setIsSettingsOpen(true)} className={`flex items-center gap-3 px-4 py-2 border rounded-full transition ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600' : 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}>
                    <div className="flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${apiUrl ? 'bg-emerald-500' : 'bg-red-500'}`}></span><span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>{apiUrl ? 'ONLINE' : 'OFFLINE'}</span></div>
                    <Settings className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-zinc-600' : 'text-slate-400'}`} />
                </button>
            </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-12 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* TABS */}
        {status === "idle" && (
            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab("upload")} className={`px-6 py-2 rounded-full font-bold text-sm transition ${activeTab === 'upload' ? 'bg-emerald-500 text-white' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-slate-500 border border-slate-200')}`}><div className="flex items-center gap-2"><Upload className="w-4 h-4" /> UPLOAD NEW</div></button>
                <button onClick={() => { setActiveTab("library"); if(apiUrl) fetchLibrary(apiUrl); }} className={`px-6 py-2 rounded-full font-bold text-sm transition ${activeTab === 'library' ? 'bg-emerald-500 text-white' : (theme === 'dark' ? 'bg-zinc-800 text-zinc-400' : 'bg-white text-slate-500 border border-slate-200')}`}><div className="flex items-center gap-2"><Cloud className="w-4 h-4" /> MY LIBRARY</div></button>
            </div>
        )}

        {/* UPLOAD VIEW */}
        {status === "idle" && activeTab === "upload" && (
          <div className="w-full max-w-xl text-center animate-in slide-in-from-bottom-5 fade-in duration-700">
             <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">INTERNAL <span className="text-emerald-500">GENERATOR</span></h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>Upload Client Podcast ({'>'}10 min) for best results.</p>
             </div>
             <form onSubmit={handleSubmit} className="w-full">
                <div className="relative group w-full mb-6">
                    <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                    <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center relative transition-all h-64 ${theme === 'dark' ? (file ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-600') : (file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white hover:border-slate-400')}`}>
                        {file ? (
                            <div className="text-emerald-500 flex flex-col items-center"><FileVideo className="w-10 h-10 mb-3" /><p className={`font-bold truncate max-w-[200px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{file.name}</p></div>
                        ) : (
                            <div className={`${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'} flex flex-col items-center`}><Upload className="w-10 h-10 mb-3" /><p className={`font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>Drop Video Here</p></div>
                        )}
                    </div>
                </div>
                <button disabled={!file} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition disabled:opacity-50 ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Start Processing</button>
             </form>
          </div>
        )}

        {/* LIBRARY VIEW */}
        {status === "idle" && activeTab === "library" && (
            <div className="w-full max-w-4xl">
                {isLoadingLib ? (
                    <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" /><p className="text-sm opacity-50">Syncing with GDrive...</p></div>
                ) : libraryFiles.length === 0 ? (
                    <div className="text-center py-20 opacity-50"><Cloud className="w-12 h-12 mx-auto mb-4" /><p>No videos found in Drive.</p></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {libraryFiles.map((vid, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-colors
                                ${theme === 'dark' ? 'bg-[#0f0f0f] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 shrink-0"><FileVideo className="w-5 h-5" /></div>
                                    <div className="min-w-0"><h4 className="font-bold text-sm truncate">{vid.filename}</h4><p className="text-xs opacity-50">{vid.uploadDate}</p></div>
                                </div>
                                <button onClick={() => handleReprocess(vid.filename)} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition" title="Reprocess AI"><RefreshCw className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* PROCESSING & COMPLETED VIEW */}
        {status === "processing" && (
            <div className={`w-full max-w-md border rounded-2xl p-8 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-slate-200'}`}>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 animate-pulse"></div>
                <div className="flex items-center gap-4 mb-6"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /><div><h3 className="font-bold">GENERATING CLIPS...</h3><p className={`text-xs font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>Phase: {progress < 40 ? 'Transcribing' : progress < 70 ? 'AI Analyzing' : 'Face Tracking & Rendering'}</p></div></div>
                <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-slate-200'}`}><div className="h-full bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
            </div>
        )}

        {status === "completed" && (
            <div className="w-full max-w-6xl animate-in slide-in-from-bottom-10 duration-500">
                <div className={`flex items-center justify-between mb-8 border-b pb-6 ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
                    <div><h2 className="text-2xl font-bold flex items-center gap-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> GENERATION COMPLETE</h2><p className={`text-sm mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>{results.length} Viral Clips Created</p></div>
                    <button onClick={resetApp} className={`px-4 py-2 border rounded-lg text-xs hover:bg-opacity-80 transition uppercase font-bold flex items-center gap-2 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-red-400' : 'bg-white border-slate-300 text-red-600'}`}><Trash2 className="w-3 h-3" /> Reset</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((clip, idx) => (
                        <div key={idx} className={`border rounded-2xl overflow-hidden hover:border-emerald-500/50 transition group flex flex-col ${theme === 'dark' ? 'bg-[#0f0f0f] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="relative aspect-[9/16] bg-black">
                                <video src={clip.url} controls className="w-full h-full object-contain" />
                                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded shadow uppercase tracking-wider">Score: {clip.score}</div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2">{clip.title}</h3>
                                <a href={clip.url} download className={`mt-auto flex items-center justify-center gap-2 w-full font-bold py-3 rounded-xl transition text-sm uppercase ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}><Download className="w-4 h-4" /> Download</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {status === "failed" && (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4 max-w-md">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div><h3 className="font-bold text-red-500 text-sm uppercase">Error Occurred</h3><button onClick={resetApp} className={`mt-2 text-xs underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Try Again</button></div>
            </div>
        )}

      </main>
    </div>
  );
}