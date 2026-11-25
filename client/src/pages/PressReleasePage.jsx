import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Search, Calendar, User, Eye, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PressReleasePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  const categories = ['Semua', 'Advokasi', 'Kebijakan Kampus', 'Pernyataan Sikap', 'UKT & Fasilitas', 'Info Beasiswa', 'Umum'];

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      });

      if (selectedCategory !== 'Semua') {
        params.append('category', selectedCategory);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const res = await fetch(`/api/v1/press-releases?${params.toString()}`);
      if (!res.ok) throw new Error('Gagal memuat rilis pers');
      const json = await res.json();
      setItems(json.data || []);
      setMeta(json.meta || { totalPages: 1, total: 0 });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#0066FF] rounded-full text-xs font-bold mb-4 shadow-sm">
            <Newspaper size={14} className="text-[#0066FF]" />
            <span>Kanal Informasi Resmi BEM UMS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Press Release & Pernyataan Sikap
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Pusat siaran pers resmi, kabar advokasi, hasil audiensi, dan sikap kelembagaan Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-sky-100 rounded-3xl p-4 sm:p-6 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <label htmlFor="search-pr-input" className="sr-only">
                Cari rilis pers atau topik
              </label>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-pr-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari rilis pers atau topik..."
                aria-label="Cari rilis pers atau topik"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:bg-white transition-all"
              />
            </form>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066FF] mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Memuat press release...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-red-100 p-8 max-w-md mx-auto">
            <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
            <button
              onClick={fetchItems}
              className="btn-primary py-2 px-5 text-xs font-bold rounded-full bg-[#0066FF] text-white"
            >
              Coba Lagi
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 px-6 text-center bg-white border border-sky-100 rounded-3xl max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center mx-auto mb-4">
              <Newspaper size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Belum Ada Press Release
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
              {search || selectedCategory !== 'Semua'
                ? 'Tidak ada press release yang cocok dengan kata kunci atau kategori yang Anda pilih.'
                : 'Saat ini belum ada siaran pers resmi yang dipublikasikan. Kementerian Advokasi BEM UMS akan segera memperbarui pernyataan sikap dan rilis informasi publik di sini.'}
            </p>
            {(search || selectedCategory !== 'Semua') && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('Semua');
                  setPage(1);
                }}
                className="btn-secondary py-2 px-5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-sky-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-blue-50 to-sky-100 overflow-hidden border-b border-slate-100">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#0066FF]/40 p-6">
                        <Newspaper size={44} className="mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Siaran Pers Resmi</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0066FF] text-white shadow-sm">
                        {item.category || 'Advokasi'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye size={13} className="text-slate-400" />
                          {item.views || 0} tayangan
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 mb-2 leading-snug">
                        <Link to={`/press-release/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {item.summary || (item.content ? item.content.substring(0, 140) + '...' : '')}
                      </p>
                    </div>

                    {/* Bottom Author & Link */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <User size={13} className="text-slate-400" />
                        <span className="truncate max-w-[140px]">{item.author || 'BEM UMS'}</span>
                      </div>
                      <Link
                        to={`/press-release/${item.slug}`}
                        className="text-xs font-bold text-[#0066FF] hover:text-[#0052FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Baca Rilis</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Sebelumnya</span>
                </button>
                <span className="text-xs font-semibold text-slate-500 px-2">
                  Halaman {page} dari {meta.totalPages}
                </span>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  className="px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
