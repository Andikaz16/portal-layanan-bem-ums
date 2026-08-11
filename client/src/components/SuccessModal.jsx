import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Ticket,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Background dynamic floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiDots.map((dot, index) => (
          <div
            key={index}
            className={`absolute rounded-full opacity-75 animate-float ${dot.size} ${dot.color}`}
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
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-3xl p-6 sm:p-8 text-center overflow-hidden animate-slide-up">
        {/* Top ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Large Animated Checkmark Circle */}
        <div className="relative mb-6 flex justify-center">
          <div
            className={`w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/30 transition-all duration-700 transform ${
              animateCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <CheckCircle2 className="w-12 h-12 stroke-[2.25]" />
          </div>
        </div>

        {/* 2. Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Laporan Berhasil Dikirim!
        </h2>

        {/* 3. Subtitle */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Terima kasih telah melapor. Laporan Anda akan segera ditinjau oleh tim BEM.
        </p>

        {/* 4. Ticket Code Box */}
        <div className="mb-5 text-left">
          <div className="flex items-center gap-1.5 mb-2">
            <Ticket className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Kode Tiket Anda
            </span>
          </div>

          <div className="bg-white/10 border-2 border-dashed border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-red-500/50 transition-colors">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white select-all">
              {ticketCode}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm focus:outline-none ${
                copied
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
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
                  <Copy className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5. Warning Note */}
        <div className="bg-red-950/30 border border-red-500/20 text-red-200 text-xs sm:text-sm p-3.5 rounded-xl mb-6 flex items-start gap-2.5 text-left font-medium">
          <span className="text-base leading-none select-none">⚠️</span>
          <p className="leading-snug">
            <strong className="font-bold text-white">Simpan kode tiket ini!</strong> Anda memerlukan kode ini untuk melacak status laporan Anda.
          </p>
        </div>

        {/* 6. Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleTrackReport}
            className="btn-primary w-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lacak Laporan</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-surface-500" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
