import React, { useState } from 'react';
import {
  KeyRound,
  CreditCard,
  FileCheck,
  ScanFace,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LogOut,
  PhoneCall,
  Play,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface FaqSectionProps {
  onReturnToMainMenu?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onReturnToMainMenu }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'resolved' | 'unresolved' | 'ended'>('idle');
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  const categories = contentData.faqData.categories;
  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-blue-600" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-emerald-600" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-amber-600" />;
      case 'ScanFace':
        return <ScanFace className="w-6 h-6 text-purple-600" />;
      default:
        return <FileCheck className="w-6 h-6 text-blue-600" />;
    }
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleResetToCategoryList = () => {
    setSelectedCategoryId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
    if (onReturnToMainMenu) {
      onReturnToMainMenu();
    }
  };

  const handleEndConversation = () => {
    setFeedbackStatus('ended');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#005596] to-sky-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trung tâm trợ giúp tương tác</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {contentData.faqData.promptQuestion}
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Chọn câu hỏi bên dưới để xem hướng dẫn từng bước có hình ảnh minh họa chi tiết và video hướng dẫn trực quan.
          </p>
        </div>
      </div>

      {/* Main View: Category Cards or Step Guide */}
      {!currentCategory ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-blue-500/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {getIcon(cat.icon)}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      Mục {idx + 1}/4
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.shortDesc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#005596]">
                  <span>Xem hướng dẫn ({cat.steps.length} bước)</span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#005596] group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Assistance Banner */}
          <div className="mt-8 bg-blue-50/60 rounded-xl p-4 sm:p-5 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#005596] text-white flex items-center justify-center font-bold text-sm shrink-0">
                VB
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Cần hỗ trợ trực tiếp tại quầy?
                </p>
                <p className="text-xs text-slate-500">
                  Chuyên viên tư vấn: <strong className="text-slate-700">{contentData.brand.advisor.name}</strong> – Hotline: {contentData.brand.advisor.phoneDisplay}
                </p>
              </div>
            </div>
            <a
              href={`tel:${contentData.brand.advisor.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e31b23] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Liên hệ tư vấn viên</span>
            </a>
          </div>
        </div>
      ) : (
        /* Detailed Step-by-Step View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Step Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại danh sách</span>
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {currentCategory.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentCategory.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#e31b23] rounded-lg text-xs font-bold transition-colors border border-red-200/60"
              >
                <Play className="w-3.5 h-3.5 fill-[#e31b23]" />
                <span>Xem Video Youtube</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-4 sm:px-6 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-[#005596]">
                Bước {currentStepIndex + 1} / {currentCategory.steps.length}
              </span>
              <span>{Math.round(((currentStepIndex + 1) / currentCategory.steps.length) * 100)}% hoàn thành</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#005596] h-full transition-all duration-300"
                style={{
                  width: `${((currentStepIndex + 1) / currentCategory.steps.length) * 100}%`
                }}
              />
            </div>

            {/* Step navigation tabs */}
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
              {currentCategory.steps.map((st, i) => (
                <button
                  key={st.stepNumber}
                  onClick={() => setCurrentStepIndex(i)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    currentStepIndex === i
                      ? 'bg-[#005596] text-white font-semibold'
                      : i < currentStepIndex
                      ? 'bg-blue-50 text-[#005596]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Bước {st.stepNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Step Description */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-xs font-semibold text-[#005596]">
                <span>Chi tiết hướng dẫn bước {currentCategory.steps[currentStepIndex].stepNumber}</span>
              </div>

              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80">
                <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed">
                  {currentCategory.steps[currentStepIndex].text}
                </p>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Bước trước
                </button>
                <button
                  disabled={currentStepIndex === currentCategory.steps.length - 1}
                  onClick={() =>
                    setCurrentStepIndex((prev) =>
                      Math.min(currentCategory.steps.length - 1, prev + 1)
                    )
                  }
                  className="px-5 py-2 bg-[#005596] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Bước tiếp theo
                </button>
              </div>

              {/* Quick tip box */}
              <div className="text-xs text-slate-500 bg-amber-50/80 p-3.5 rounded-lg border border-amber-200/80">
                <span className="font-semibold text-amber-900">Mẹo thao tác:</span> Nhấp vào hình ảnh bên cạnh để phóng to xem rõ nét các nút và thông tin trên màn hình VietinBank iPay.
              </div>
            </div>

            {/* Step Image Illustration */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                onClick={() =>
                  setActiveImageZoom(currentCategory.steps[currentStepIndex].imageUrl)
                }
                className="relative group bg-slate-900/5 p-2 rounded-2xl border border-slate-200 shadow-inner max-w-sm w-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={currentCategory.steps[currentStepIndex].imageUrl}
                  alt={`Minh họa bước ${currentCategory.steps[currentStepIndex].stepNumber}`}
                  className="w-full h-auto max-h-[380px] object-contain rounded-xl mx-auto group-hover:scale-[1.02] transition-transform duration-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback visually appealing placeholder if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="p-8 text-center bg-blue-50/50 rounded-xl text-slate-600">
                          <p class="font-semibold text-sm text-[#005596]">Hình ảnh minh họa bước ${currentCategory.steps[currentStepIndex].stepNumber}</p>
                          <p class="text-xs mt-1 text-slate-500">${currentCategory.steps[currentStepIndex].text}</p>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <span className="bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                    Phóng to hình ảnh
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-600 mt-2">
                Hình ảnh: Bước {currentCategory.steps[currentStepIndex].stepNumber} - {currentCategory.title}
              </span>
            </div>
          </div>

          {/* End of content: Video Youtube Link Bar */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Xem toàn bộ video hướng dẫn trực tiếp
                </h4>
                <p className="text-[11px] text-slate-500">
                  Video hướng dẫn chi tiết từng thao tác quay màn hình từ VietinBank
                </p>
              </div>
            </div>
            <a
              href={currentCategory.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Mở Video trên Youtube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mandatory Feedback Section */}
          <div className="p-5 sm:p-7 border-t border-slate-200 bg-white">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-sm sm:text-base font-semibold text-slate-900">
                Anh/chị thực hiện đã ổn hay chưa?
              </p>

              {feedbackStatus === 'idle' && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      setFeedbackStatus('resolved');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Đã ổn (Quay lại menu chính)</span>
                  </button>

                  <button
                    onClick={() => setFeedbackStatus('unresolved')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Chưa ổn (Cần hỗ trợ)</span>
                  </button>

                  <button
                    onClick={handleEndConversation}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Kết thúc cuộc trò chuyện</span>
                  </button>
                </div>
              )}

              {/* Resolved State */}
              {feedbackStatus === 'resolved' && (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-emerald-900">
                    Tuyệt vời! VietinBank chúc Quý khách thực hiện giao dịch thuận lợi.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleResetToCategoryList}
                      className="px-4 py-2 bg-[#005596] text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
                    >
                      Quay lại menu chính
                    </button>
                    <button
                      onClick={handleEndConversation}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              )}

              {/* Unresolved State */}
              {feedbackStatus === 'unresolved' && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-left sm:text-center space-y-4">
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    “{contentData.faqData.unresolvedResponse}”
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <a
                      href={`tel:${contentData.brand.advisor.phone}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e31b23] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Gọi ngay Chuyên viên Trung ({contentData.brand.advisor.phoneDisplay})</span>
                    </a>
                    <button
                      onClick={handleResetToCategoryList}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Quay lại menu chính</span>
                    </button>
                    <button
                      onClick={handleEndConversation}
                      className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-200 transition-colors"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              )}

              {/* Ended Conversation State */}
              {feedbackStatus === 'ended' && (
                <div className="bg-blue-50/80 border border-blue-200 p-6 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#005596] text-white flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    “{contentData.faqData.endConversationMessage}”
                  </p>
                  <p className="text-xs text-slate-500">
                    VietinBank hân hạnh đồng hành cùng Quý khách!
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleResetToCategoryList}
                      className="px-4 py-2 bg-[#005596] hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Bắt đầu cuộc trò chuyện mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {activeImageZoom && (
        <div
          onClick={() => setActiveImageZoom(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={activeImageZoom}
              alt="Zoomed Step"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            <p className="text-center text-xs text-slate-500 py-2">
              Chạm hoặc nhấp chuột vào bất kỳ đâu để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
