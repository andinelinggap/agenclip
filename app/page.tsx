"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MessageCircle, ArrowRight, Play, Star, Users, Zap, 
  Moon, Sun, CheckCircle2, TrendingUp, ShieldCheck, Clock
} from "lucide-react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  // GANTI NOMOR WA DI SINI
  const WA_NUMBER = "6281234567890"; 
  const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Halo%20Min,%20saya%20mau%20order%20Paket%20AgenClip%20Promo.`;

  useEffect(() => {
    const savedTheme = localStorage.getItem("THEME_PREF");
    if (savedTheme === "light") setIsDark(false);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("THEME_PREF", newMode ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans selection:bg-emerald-500/30
      ${isDark ? 'bg-[#050505] text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* THEME TOGGLE */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-2xl transition hover:scale-110 border
            ${isDark 
              ? 'bg-zinc-800 text-yellow-400 border-zinc-700 hover:bg-zinc-700' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-500
        ${isDark ? 'bg-[#050505]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">A</div>
            <span className="font-bold text-xl tracking-tight">Agen<span className="text-emerald-500">Clip</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/create" className={`text-xs font-mono font-medium transition hidden md:block opacity-50 hover:opacity-100
              ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Smart Auto Upload 
            </Link>
            <a href={WA_LINK} target="_blank" className={`px-5 py-2.5 rounded-full font-bold text-sm transition flex items-center gap-2 shadow-lg hover:-translate-y-0.5
                ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              <MessageCircle className="w-4 h-4" /> Order Jasa
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-32 pb-20 px-6 relative overflow-hidden text-center">
        {/* Animated Background Blob */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-80' : 'opacity-0'}`}></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-8 transition-colors duration-500
            ${isDark ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Accepting Orders: Slot Tersedia
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 transition-colors duration-500">
            Stop Ngedit Manual. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              Mulai Viral Hari Ini.
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-500 font-medium
            ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Jasa repurpose video AI #1 di Indonesia. Ubah 1 jam podcast menjadi 10+ klip TikTok/Reels siap upload. <br className="hidden md:block"/> Tanpa ribet, tanpa mahal, 24 jam jadi.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={WA_LINK} target="_blank" className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-400 transition shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-105 transform duration-200">
              Pesan Sekarang - Rp 49rb <ArrowRight className="w-5 h-5" />
            </a>
            <button className={`w-full sm:w-auto px-10 py-5 border rounded-2xl font-bold text-lg transition
              ${isDark ? 'border-zinc-700 text-white hover:bg-white/5' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              Lihat Contoh Hasil
            </button>
          </div>

          {/* STATS */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y transition-colors duration-500
            ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
             {[
               { label: "Video Terproses", val: "10,000+" },
               { label: "Waktu Hemat", val: "5000 Jam" },
               { label: "Klien Puas", val: "98%" },
               { label: "Kecepatan AI", val: "10x Cepat" },
             ].map((stat, i) => (
               <div key={i}>
                 <div className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.val}</div>
                 <div className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{stat.label}</div>
               </div>
             ))}
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className={`py-24 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Kenapa Editor Kami "Curang"?</h2>
            <p className={`${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Karena kami menggunakan AgenClip Engine yang tidak dimiliki agency lain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Dopamine Hooks", desc: "AI mendeteksi 3 detik pertama yang menahan scroll user." },
              { icon: Users, title: "Smart Face-Tracking", desc: "Tidak ada lagi video crop yang memotong kepala pembicara." },
              { icon: TrendingUp, title: "Premium Subtitle Style", desc: "Subtitle warna-warni yang terbukti meningkatkan views 200%." }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-all duration-300 group hover:-translate-y-2
                ${isDark ? 'bg-zinc-900/50 border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:border-emerald-200 hover:shadow-xl'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
                  ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white text-emerald-600 shadow-sm'}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={`py-24 border-t transition-colors duration-500 ${isDark ? 'border-white/5 bg-black' : 'border-slate-100 bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Investasi Receh, Hasil Maksimal</h2>
            <p className={`${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Pilih paket yang sesuai kebutuhan kontenmu.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Paket 1 */}
            <div className={`p-8 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <div className="mb-4 text-emerald-500 font-bold uppercase tracking-widest text-xs">Starter Pack</div>
              <h3 className="text-4xl font-black mb-2">Rp 49.000</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Per 1 Video Youtube (Max 30 Menit)</p>
              <ul className="space-y-4 mb-8">
                {['5-7 Klip Viral', 'Subtitle Otomatis', 'Face Tracking', '720p HD Quality'].map((item,i)=>(
                  <li key={i} className="flex items-center gap-3 text-sm font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> {item}</li>
                ))}
              </ul>
              <a href={WA_LINK} target="_blank" className={`block text-center w-full py-4 rounded-xl font-bold border transition ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}>Order Satuan</a>
            </div>

            {/* Paket 2 (Featured) */}
            <div className={`relative p-8 rounded-3xl border-2 transition-all duration-300 transform md:scale-105 shadow-2xl ${isDark ? 'bg-black border-emerald-500 shadow-emerald-900/20' : 'bg-white border-emerald-500 shadow-emerald-100'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Paling Laku 🔥</div>
              <div className="mb-4 text-emerald-500 font-bold uppercase tracking-widest text-xs">Creator Bundle</div>
              <h3 className="text-4xl font-black mb-2">Rp 299.000</h3>
              <p className={`text-sm mb-6 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Per Bulan (4 Video Youtube)</p>
              <ul className="space-y-4 mb-8">
                {['20-30 Klip Viral', 'Subtitle Premium (V9.2)', 'Prioritas Antrian', '1080p Full HD', 'Free Revisi Caption'].map((item,i)=>(
                  <li key={i} className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> {item}</li>
                ))}
              </ul>
              <a href={WA_LINK} target="_blank" className="block text-center w-full py-4 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition">Ambil Slot Bundle</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-24 border-t transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-12 text-center">Sering Ditanyakan</h2>
          <div className="space-y-6">
            {[
              { q: "Berapa lama prosesnya?", a: "Rata-rata 1-3 jam setelah Anda kirim link, tergantung antrian server kami." },
              { q: "Apakah bisa request font?", a: "Saat ini kami menggunakan standar font viral yang sudah terbukti performanya di TikTok." },
              { q: "Video apa yang cocok?", a: "Podcast, Wawancara, Ceramah, atau video edukasi yang menampilkan wajah pembicara." }
            ].map((faq, i) => (
              <div key={i} className={`p-6 rounded-2xl border transition ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <h4 className="font-bold mb-2 text-lg">{faq.q}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-12 text-center text-sm border-t transition-colors duration-500
        ${isDark ? 'border-white/5 text-zinc-600' : 'border-slate-200 text-slate-400 bg-white'}`}>
        <p className="font-bold mb-2">AGENCLIP AI STUDIOS</p>
        <p>&copy; 2026 All rights reserved.</p>
      </footer>

    </div>
  );
}