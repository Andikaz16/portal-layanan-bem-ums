import { useState, useEffect } from 'react';
import { Newspaper, Plus, Search, Edit3, Trash2, ExternalLink, Eye, CheckCircle2, Clock, Image, X, AlertCircle } from 'lucide-react';

export default function AdminPressRelease() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Advokasi',
    summary: '',
    content: '',
    author: 'Kementerian Advokasi BEM UMS',
    thumbnail: '',
    is_published: true
  });

  const categories = ['Semua', 'Advokasi', 'Kebijakan Kampus', 'Pernyataan Sikap', 'UKT & Fasilitas', 'Info Beasiswa', 'Umum'];

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`/api/v1/admin/press-releases?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Gagal memuat data press release');
      const result = await res.json();
      setItems(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Advokasi',
      summary: '',
      content: '',
      author: 'Kementerian Advokasi BEM UMS',
      thumbnail: '',
      is_published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category || 'Advokasi',
      summary: item.summary || '',
      content: item.content || '',
      author: item.author || 'Kementerian Advokasi BEM UMS',
      thumbnail: item.thumbnail || '',
      is_published: item.is_published
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, thumbnail: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul press release wajib diisi');
      return;
    }
    if (!formData.content.trim()) {
      alert('Konten press release wajib diisi');
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem('adminToken');
      const url = editingItem 
        ? `/api/v1/admin/press-releases/${editingItem.id}` 
        : '/api/v1/admin/press-releases';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menyimpan press release');

      setIsModalOpen(false);
      await fetchPressReleases();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleting(true);
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`/api/v1/admin/press-releases/${deleteItem.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menghapus press release');

      setDeleteItem(null);
      await fetchPressReleases();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = !search.trim() || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const totalPublished = items.filter(i => i.is_published).length;
  const totalDraft = items.filter(i => !i.is_published).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Newspaper className="w-7 h-7 text-sky-400" />
            Manajemen Press Release
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1">
            Publikasikan siaran pers resmi, pernyataan sikap, dan kabar advokasi BEM UMS
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary py-2.5 px-5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Tulis Press Release Baru</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-800 border border-panel-600 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">Total Rilis Pers</div>
          <div className="text-2xl font-black text-white">{items.length}</div>
        </div>
        <div className="bg-navy-800 border border-panel-600 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Diterbitkan (Publik)
          </div>
          <div className="text-2xl font-black text-white">{totalPublished}</div>
        </div>
        <div className="bg-navy-800 border border-panel-600 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock size={14} />
            Draf (Internal)
          </div>
          <div className="text-2xl font-black text-white">{totalDraft}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navy-800 border border-panel-600 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul press release..."
            className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-panel-700 rounded-xl text-xs text-white placeholder-sky-400/60 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-navy-900 text-sky-200 hover:bg-panel-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-navy-800 border border-panel-600 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sky-300 text-sm">
            Memuat data press release...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-400 text-sm">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <Newspaper size={40} className="mx-auto text-sky-400/40 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Belum ada Press Release</h3>
            <p className="text-xs text-sky-300 max-w-sm mx-auto mb-4">
              {search || selectedCategory !== 'Semua' 
                ? 'Tidak ada rilis pers yang cocok dengan filter pencarian.' 
                : 'Mulai tulis dan publikasikan siaran pers atau pernyataan sikap resmi BEM UMS sekarang.'}
            </p>
            {(!search && selectedCategory === 'Semua') && (
              <button
                onClick={openCreateModal}
                className="btn-primary py-2 px-4 rounded-full text-xs font-bold inline-flex items-center gap-1.5 bg-[#0066FF] text-white"
              >
                <Plus size={14} />
                Tulis Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950/60 border-b border-panel-700 text-sky-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Judul & Kategori</th>
                  <th className="py-3.5 px-4">Penulis</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Tayangan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-700/60 text-sky-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-900/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white text-sm line-clamp-1">{item.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-full bg-panel-800 text-[10px] font-semibold text-sky-300 border border-panel-600">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-sky-400/80 font-mono">
                          /{item.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sky-200">
                      {item.author || 'BEM UMS'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        item.is_published
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950/60 text-amber-300 border-amber-700'
                      }`}>
                        {item.is_published ? 'Diterbitkan' : 'Draf'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sky-300">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-sky-300 font-mono">
                      {item.views || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.is_published && (
                          <a
                            href={`/press-release/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-navy-900 text-sky-300 hover:text-white hover:bg-panel-700 transition-colors"
                            title="Buka Tampilan Publik"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-navy-900 text-sky-300 hover:text-white hover:bg-panel-700 transition-colors"
                          title="Edit Press Release"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="p-1.5 rounded-lg bg-navy-900 text-red-400 hover:text-red-300 hover:bg-red-950/60 transition-colors"
                          title="Hapus Press Release"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-navy-900 border border-panel-600 rounded-3xl w-full max-w-2xl p-6 sm:p-8 my-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-sky-300 hover:text-white p-1 rounded-xl hover:bg-navy-800 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Newspaper size={20} className="text-sky-400" />
              {editingItem ? 'Edit Press Release' : 'Tulis Press Release Baru'}
            </h2>
            <p className="text-xs text-sky-300 mb-6">
              Lengkapi formulir berikut untuk menerbitkan siaran pers resmi BEM UMS.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Judul Press Release *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Pernyataan Sikap BEM UMS Terkait Kebijakan Penyesuaian UKT 2026"
                  className="w-full px-4 py-2.5 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Advokasi">Advokasi</option>
                    <option value="Kebijakan Kampus">Kebijakan Kampus</option>
                    <option value="Pernyataan Sikap">Pernyataan Sikap</option>
                    <option value="UKT & Fasilitas">UKT & Fasilitas</option>
                    <option value="Info Beasiswa">Info Beasiswa</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Penulis / Pengunggah
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Contoh: Kementerian Advokasi BEM UMS"
                    className="w-full px-4 py-2.5 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Ringkasan Singkat (Lead / Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Ringkasan 1-2 kalimat pengantar untuk ditampilkan di kartu beranda..."
                  className="w-full px-4 py-2 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Isi / Konten Lengkap Press Release *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tuliskan isi rilis pers lengkap. Anda dapat memisahkan paragraf dengan baris kosong..."
                  className="w-full px-4 py-2.5 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400 font-sans leading-relaxed"
                />
              </div>

              {/* Thumbnail / Image */}
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Gambar / Banner Sampul (Opsional)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="URL gambar (https://...) atau unggah di sebelah kanan"
                    className="flex-1 px-4 py-2 bg-navy-800 border border-panel-600 rounded-xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400"
                  />
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-panel-800 hover:bg-panel-700 border border-panel-600 text-xs font-bold text-sky-200 flex items-center gap-2 shrink-0">
                    <Image size={14} />
                    <span>Pilih Berkas</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 relative inline-block">
                    <img 
                      src={formData.thumbnail} 
                      alt="Thumbnail Preview" 
                      className="h-24 w-auto rounded-xl object-cover border border-panel-600" 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs"
                      title="Hapus Gambar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Status Publish Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-navy-800 border border-panel-600 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded text-sky-500 focus:ring-0 bg-navy-900 border-panel-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Publikasikan Sekarang (Dapat Dilihat Publik)
                    </span>
                    <span className="text-[11px] text-sky-300 block">
                      Jika dinonaktifkan, rilis ini akan tersimpan sebagai draf internal saja.
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-panel-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-sky-200 hover:text-white bg-navy-800 border border-panel-600 hover:bg-panel-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold bg-[#0066FF] hover:bg-[#0052FF] text-white disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingItem ? 'Perbarui Rilis' : 'Terbitkan Rilis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-navy-900 border border-panel-600 rounded-3xl w-full max-w-md p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Hapus Press Release Ini?</h3>
            <p className="text-xs text-sky-200 mb-6 leading-relaxed">
              Anda yakin ingin menghapus <span className="text-white font-semibold">"{deleteItem.title}"</span>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-sky-200 bg-navy-800 border border-panel-600 hover:bg-panel-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
