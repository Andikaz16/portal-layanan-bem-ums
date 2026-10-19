import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft, Share2, Check, MessageCircle, Newspaper, AlertCircle } from 'lucide-react';

export default function PressReleaseDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/press-releases/${slug}`);
        if (!res.ok) {
          throw new Error('Press release tidak ditemukan atau belum dipublikasikan');
        }
        const json = await res.json();
        setItem(json.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!item) return;
    const text = encodeURIComponent(`*${item.title}*\n\nBaca rilis resmi BEM UMS selengkapnya:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066FF] mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Memuat isi siaran pers...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-20 px-4">
        <div className="bg-white border border-sky-100 rounded-3xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Rilis Pers Tidak Ditemukan</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            {error || 'Halaman press release yang Anda tuju mungkin telah dipindahkan atau belum dipublikasikan.'}
          </p>
          <Link
            to="/press-release"
            className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold inline-flex items-center gap-2 bg-[#0066FF] text-white"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Rilis</span>
          </Link>
        </div>
      </div>
    );
  }

  // Format paragraphs
  const paragraphs = item.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pt-24 sm:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/press-release"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Semua Press Release</span>
          </Link>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0066FF] hover:border-[#0066FF] transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs"
              title="Salin Tautan"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin Tautan'}</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center gap-1.5 shadow-xs"
              title="Bagikan ke WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
          
          {/* Header Info */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                {item.category || 'Advokasi'}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(item.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Eye size={13} />
                {item.views || 0} kali dibaca
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {item.title}
            </h1>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold">
                <User size={15} />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{item.author || 'BEM UMS'}</span>
                <span className="text-[11px] text-slate-400">Pernyataan Sikap & Rilis Media Resmi</span>
              </div>
            </div>
          </header>

          {/* Featured Image (if exists) */}
          {item.thumbnail && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 aspect-[16/9] w-full bg-slate-50">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Summary Callout (if exists) */}
          {item.summary && (
            <div className="p-5 bg-blue-50/70 border-l-4 border-[#0066FF] rounded-r-2xl mb-8 text-sm text-slate-700 font-medium leading-relaxed">
              {item.summary}
            </div>
          )}

          {/* Article Body */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Official Sign-off Box */}
          <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50/80 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0066FF] mb-1">
              Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta
            </p>
            <p className="text-xs text-slate-500 font-medium italic">
              "Keadilan, Integritas, dan Perjuangan Aspirasi Mahasiswa"
            </p>
          </div>

          {/* Footer Back and Share CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/press-release"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Daftar Press Release</span>
            </Link>

            <button
              onClick={handleCopyLink}
              className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold bg-[#0066FF] hover:bg-[#0052FF] text-white flex items-center gap-2 shadow-sm"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'Tautan Berhasil Disalin!' : 'Bagikan Press Release'}</span>
            </button>
          </div>

        </article>
      </div>
    </div>
  );
}
