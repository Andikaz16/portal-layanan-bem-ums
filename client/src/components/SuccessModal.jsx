import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Ticket,
  AlertTriangle,
} from 'lucide-react';

const SuccessModal = ({ ticketCode = 'BEM-X9A2', onClose, onTrack }) => {
  const [copied, setCopied] = useState(false);
  const [animateCheckmark, setAnimateCheckmark] = useState(false);

  useEffect(() => {
    // Trigger scale animation on mount
    const timer = setTimeout(() => {
      setAnimateCheckmark(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    if (!ticketCode) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(ticketCode);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = ticketCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy ticket code:', err);
    }
  };

  const handleTrackReport = () => {
    console.log('Lacak Laporan clicked for ticket:', ticketCode);
    if (typeof onTrack === 'function') {
      onTrack(ticketCode);
    }
  };

  // Decorative floating confetti dots
  const confettiDots = [
    { top: '12%', left: '15%', size: 'w-3 h-3', color: 'bg-emerald-400', delay: '0s' },
    { top: '18%', right: '12%', size: 'w-2.5 h-2.5', color: 'bg-indigo-400', delay: '0.2s' },
    { top: '42%', left: '8%', size: 'w-2 h-2', color: 'bg-amber-400', delay: '0.5s' },
    { top: '38%', right: '10%', size: 'w-3 h-3', color: 'bg-sky-400', delay: '0.1s' },
    { bottom: '25%', left: '12%', size: 'w-2.5 h-2.5', color: 'bg-rose-400', delay: '0.4s' },
    { bottom: '22%', right: '14%', size: 'w-2 h-2', color: 'bg-emerald-400', delay: '0.3s' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Background dynamic floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiDots.map((dot, index) => (
          <div
            key={index}
            className={`absolute rounded-full opacity-60 animate-float ${dot.size} ${dot.color}`}
            style={{
              top: dot.top,
              left: dot.left,
              right: dot.right,
              bottom: dot.bottom,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* Centered Glass Card */}
      <div className="relative w-full max-w-md bg-white border border-sky-100 shadow-2xl rounded-3xl p-6 sm:p-8 text-center overflow-hidden animate-slide-up">
        {/* Top ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Large Animated Checkmark Circle */}
        <div className="relative mb-6 flex justify-center">
          <div
            className={`w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md ring-4 ring-emerald-100 transition-all duration-700 transform ${
              animateCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <CheckCircle2 className="w-12 h-12 stroke-[2.25]" />
          </div>
        </div>

        {/* 2. Title */}
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Laporan Berhasil Dikirim!
        </h2>

        {/* 3. Subtitle */}
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Terima kasih telah melapor. Laporan Anda akan segera ditinjau oleh tim BEM.
        </p>

        {/* 4. Ticket Code Box */}
        <div className="mb-5 text-left">
          <div className="flex items-center gap-1.5 mb-2">
            <Ticket className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kode Tiket Anda
            </span>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-[#0066FF] transition-colors">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-slate-900 select-all">
              {ticketCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm focus:outline-none ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
              title="Salin Kode Tiket"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white animate-fade-in" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 group-hover:text-slate-800 transition-colors" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5. Warning Note */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm p-3.5 rounded-2xl mb-6 flex items-start gap-2.5 text-left font-medium">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="leading-snug">
            <strong className="font-bold text-amber-900">Simpan kode tiket ini!</strong> Anda memerlukan kode ini untuk melacak status laporan Anda.
          </p>
        </div>

        {/* 6. Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleTrackReport}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lacak Laporan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
