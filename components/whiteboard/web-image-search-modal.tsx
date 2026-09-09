'use client';

import React, { useState } from 'react';
import {
  Search,
  Globe,
  Image as ImageIcon,
  Sparkles,
  X,
  Check,
  ExternalLink,
  Plus
} from 'lucide-react';

interface WebImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

interface CuratedImageItem {
  id: string;
  title: string;
  category: string;
  url: string;
  tags: string[];
}

const CURATED_EDUCATIONAL_IMAGES: CuratedImageItem[] = [
  // Açı & İletki
  {
    id: 'img-prot-1',
    title: 'Şeffaf İletki (Açıölçer) Şablonu 180°',
    category: 'Açı & İletki',
    url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=80',
    tags: ['iletki', 'açıölçer', 'derece', 'geometri', 'ölçüm']
  },
  {
    id: 'img-prot-2',
    title: 'Açı Çeşitleri ve Gösterimi (Dar, Dik, Geniş, Doğru)',
    category: 'Açı & İletki',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tags: ['açı', 'dik açı', 'geniş açı', 'dar açı', 'tümler', 'bütünler']
  },
  // Cetvel & Gönye
  {
    id: 'img-ruler-1',
    title: 'Geometri Seti: Gönye ve Cetvel Takımı',
    category: 'Cetvel & Gönye',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    tags: ['gönye', 'cetvel', 'dikme', 'inşa', 'çizim']
  },
  {
    id: 'img-ruler-2',
    title: 'Pergel ile Daire Çizimi ve Yarıçap',
    category: 'Cetvel & Gönye',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    tags: ['pergel', 'çember', 'daire', 'yarıçap', 'geometrik inşa']
  },
  // Doğrular & Kesişim
  {
    id: 'img-lines-1',
    title: 'Kesişen Doğrular ve Ters Açılar Şeması',
    category: 'Doğrular & Açılar',
    url: 'https://images.unsplash.com/photo-1509869175650-a1c97874381a?w=800&auto=format&fit=crop&q=80',
    tags: ['doğru', 'ışın', 'doğru parçası', 'paralel', 'kesen']
  },
  {
    id: 'img-lines-2',
    title: 'Paralel Tren Rayları ve Eşit Uzaklık Modeli',
    category: 'Doğrular & Açılar',
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
    tags: ['paralel', 'ray', 'tren', 'uzaklık', 'kesişmeyen']
  },
  // Geometrik Şekiller & Koordinat
  {
    id: 'img-shapes-1',
    title: 'Kareli Düzlem ve Koordinat Izgarası',
    category: 'Şekiller & Grafikler',
    url: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?w=800&auto=format&fit=crop&q=80',
    tags: ['kareli', 'ızgara', 'koordinat', 'düzlem', 'nokta']
  },
  {
    id: 'img-shapes-2',
    title: 'Matematik Tahtası & Formüller',
    category: 'Şekiller & Grafikler',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    tags: ['tahta', 'matematik', 'sayılar', 'hesap']
  }
];

const CATEGORIES = ['Tümü', 'Açı & İletki', 'Cetvel & Gönye', 'Doğrular & Açılar', 'Şekiller & Grafikler'];

export function WebImageSearchModal({
  isOpen,
  onClose,
  onSelectImage
}: WebImageSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [customUrlInput, setCustomUrlInput] = useState('');

  if (!isOpen) return null;

  const filteredImages = CURATED_EDUCATIONAL_IMAGES.filter((img) => {
    const matchesCategory = selectedCategory === 'Tümü' || img.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    onSelectImage(customUrlInput.trim());
    setCustomUrlInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">İnternetten & Kütüphaneden Görsel Ekle</h3>
              <p className="text-[11px] text-teal-200">
                Eğitim görsellerini arayın veya web bağlantısı yapıştırarak sayfaya ekleyin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Search & URL Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Görsel veya konu ara (Örn: iletki, açı, cetvel, pergel, paralel doğru)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 shadow-2xs font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Direct Image URL Form */}
          <form onSubmit={handleApplyCustomUrl} className="flex items-center gap-2 pt-1 border-t border-slate-200/80">
            <input
              type="url"
              placeholder="Veya doğrudan bir görsel internet bağlantısı (https://...jpg, png) yapıştırın"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:border-teal-500 font-mono text-[11px]"
            />
            <button
              type="submit"
              disabled={!customUrlInput.trim()}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-40 cursor-pointer shrink-0 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bağlantıdan Ekle</span>
            </button>
          </form>

        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredImages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-xs text-slate-600">Aradığınız kriterlere uygun görsel bulunamadı.</p>
              <p className="text-[11px] text-slate-400">Yukarıdaki bağlantı alanına doğrudan resim linki yapıştırabilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    onSelectImage(img.url);
                    onClose();
                  }}
                  className="group relative rounded-2xl border-2 border-slate-200 hover:border-teal-500 overflow-hidden bg-slate-100 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="aspect-4/3 w-full overflow-hidden bg-slate-200">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      crossOrigin="anonymous"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-2.5 bg-white space-y-1">
                    <div className="font-extrabold text-[11px] text-slate-900 line-clamp-1 group-hover:text-teal-700">
                      {img.title}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {img.category}
                    </div>
                  </div>

                  {/* Overlay Check Pill on Hover */}
                  <div className="absolute inset-0 bg-teal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sayfaya Ekle</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>💡 Seçtiğiniz görsel A4 sayfanıza eklenecek, köşelerinden tutup boyutlandırabilirsiniz.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
