import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  Apple,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gift,
  ArrowRight,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const AppDownloadSection: React.FC = () => {
  const [iosQr, setIosQr] = useState<string>('');
  const [androidQr, setAndroidQr] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { ios, android, highlights } = contentData.appDownload;

  useEffect(() => {
    // Generate QR for iOS
    QRCode.toDataURL(ios.url, {
      width: 220,
      margin: 1,
      color: {
        dark: '#005596',
        light: '#ffffff'
      }
    }).then(setIosQr).catch(console.error);

    // Generate QR for Android
    QRCode.toDataURL(android.url, {
      width: 220,
      margin: 1,
      color: {
        dark: '#005596',
        light: '#ffffff'
      }
    }).then(setAndroidQr).catch(console.error);
  }, [ios.url, android.url]);

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#005596] via-[#004277] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-4 text-blue-100">
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>Ngân hàng số thông minh 24/7</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {contentData.appDownload.title}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
            {contentData.appDownload.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Miễn phí 100% mở tài khoản eKYC
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> An toàn xác thực sinh trắc học
            </span>
          </div>
        </div>

        {/* Decorative graphic background element */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2 Download Cards: iOS and Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{ios.platform}</h3>
                  <p className="text-xs text-slate-500">{ios.store}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-[#005596] rounded-md text-[11px] font-semibold">
                iOS 13.0+
              </span>
            </div>

            {/* QR Code and Instructions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner shrink-0 text-center">
                {iosQr ? (
                  <img
                    src={iosQr}
                    alt="VietinBank iPay QR iOS"
                    className="w-36 h-36 rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-lg" />
                )}
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Quét bằng Camera iPhone
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Cách cài đặt trên iPhone:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
                  <li>Mở ứng dụng Camera trên iPhone.</li>
                  <li>Hướng ống kính vào mã QR bên trái.</li>
                  <li>Chạm vào liên kết thông báo để tải từ App Store.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <a
              href={ios.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Apple className="w-4 h-4" />
              <span>{ios.badgeText}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(ios.url, 'ios')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
            >
              {copiedLink === 'ios' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã sao chép link App Store</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép link tải</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{android.platform}</h3>
                  <p className="text-xs text-slate-500">{android.store}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-semibold">
                Android 7.0+
              </span>
            </div>

            {/* QR Code and Instructions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner shrink-0 text-center">
                {androidQr ? (
                  <img
                    src={androidQr}
                    alt="VietinBank iPay QR Android"
                    className="w-36 h-36 rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-lg" />
                )}
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Quét bằng Camera / Zalo
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Cách cài đặt trên Android:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed">
                  <li>Mở Camera điện thoại hoặc tính năng Quét mã trên Zalo.</li>
                  <li>Hướng máy vào mã QR bên trái.</li>
                  <li>Nhấn Cài đặt trực tiếp từ Google Play Store.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <a
              href={android.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#005596] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{android.badgeText}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => handleCopy(android.url, 'android')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
            >
              {copiedLink === 'android' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã sao chép link CH Play</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép link tải</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
          Những tính năng vượt trội chỉ có trên VietinBank iPay Mobile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((h, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#005596] flex items-center justify-center mb-3">
                {i === 0 ? <Zap className="w-5 h-5" /> : i === 1 ? <Gift className="w-5 h-5" /> : i === 2 ? <ArrowRight className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{h.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
