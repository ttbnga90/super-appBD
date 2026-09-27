import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Gift,
  PhoneCall,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  Maximize2,
  X
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const FeaturedProductsSection: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'vertical'>('carousel');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [interestedProduct, setInterestedProduct] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filterChips = contentData.featuredProducts.filterChips;
  const allItems = contentData.featuredProducts.items;

  // Filter items
  const filteredItems = selectedGroup === 'all'
    ? allItems
    : allItems.filter((item) => item.groupId === selectedGroup);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleInterestClick = (productTitle: string) => {
    setInterestedProduct(productTitle);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005596] via-sky-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3 tracking-wide border border-white/20">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Sản phẩm & Dịch vụ Nổi bật</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {contentData.featuredProducts.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {contentData.featuredProducts.description}
          </p>
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        {/* Filter chips as functional interactive buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {filterChips.map((chip) => {
            const isActive = selectedGroup === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => {
                  setSelectedGroup(chip.id);
                  setCurrentSlideIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-500 font-medium">Chế độ xem:</span>
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Carousel</span>
            </button>
            <button
              onClick={() => setViewMode('vertical')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'vertical'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Vuốt dọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Mode 1: Carousel Mode */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative bg-gradient-to-b from-blue-50/40 to-white rounded-3xl border-2 border-red-500/20 p-6 sm:p-10 shadow-sm">
          {/* Badge Nổi bật top corner */}
          <div className="absolute top-5 left-6 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full text-xs font-bold shadow-xs">
            <Gift className="w-3.5 h-3.5" />
            <span>{filteredItems[currentSlideIndex].badge || 'Nổi bật'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* Poster Image */}
            <div className="lg:col-span-6 flex justify-center">
              <div
                onClick={() => setPreviewImage(filteredItems[currentSlideIndex].imageUrl)}
                className="relative group bg-slate-900/5 rounded-2xl p-2 border border-slate-200 shadow-md max-w-sm w-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={filteredItems[currentSlideIndex].imageUrl}
                  alt={filteredItems[currentSlideIndex].title}
                  className="w-full h-auto max-h-[420px] object-contain rounded-xl mx-auto group-hover:scale-102 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="p-12 text-center bg-blue-50 rounded-xl">
                          <p class="font-bold text-[#005596]">${filteredItems[currentSlideIndex].title}</p>
                          <p class="text-xs text-slate-500 mt-2">Áp dụng trên toàn hệ thống VietinBank</p>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Poster Details & CTA */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#005596] uppercase tracking-wider">
                  {filteredItems[currentSlideIndex].groupLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-3">
                  {filteredItems[currentSlideIndex].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {filteredItems[currentSlideIndex].subtitle}
                </p>
              </div>

              {/* Action Button: "Tôi quan tâm" */}
              <div className="pt-2">
                <button
                  onClick={() => handleInterestClick(filteredItems[currentSlideIndex].title)}
                  className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tôi quan tâm sản phẩm này</span>
                </button>
              </div>

              {/* Slide indicators & navigation controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  {filteredItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'w-7 bg-[#005596]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentation Mode 2: Vertical Swipe Mode (vuốt dọc như yêu cầu PDF) */}
      {viewMode === 'vertical' && (
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border-2 border-slate-200/80 hover:border-red-500/40 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-4 flex justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onClick={() => setPreviewImage(item.imageUrl)}
                  className="w-full max-h-56 object-contain rounded-xl cursor-zoom-in hover:scale-102 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#005596] rounded text-[11px] font-bold">
                    {item.groupLabel}
                  </span>
                  <span className="px-2 py-0.5 bg-red-50 text-[#e31b23] rounded text-[11px] font-bold">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.subtitle}</p>

                <div className="pt-2">
                  <button
                    onClick={() => handleInterestClick(item.title)}
                    className="px-5 py-2.5 bg-[#005596] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tôi quan tâm</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Notification when Customer clicks "Tôi quan tâm" */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold text-slate-900">
                Quan tâm sản phẩm: “{interestedProduct}”
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {contentData.featuredProducts.contactNotification.thankYou}
              </p>
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-[#005596] font-semibold">
                {contentData.featuredProducts.contactNotification.advisorContact}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`tel:${contentData.brand.advisor.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e31b23] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi Chuyên viên Trung ({contentData.brand.advisor.phoneDisplay})</span>
              </a>
              <button
                onClick={() => setInterestedProduct(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={previewImage}
              alt="Zoomed Poster"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            <p className="text-center text-xs text-slate-500 py-2">
              Chạm hoặc click chuột để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
