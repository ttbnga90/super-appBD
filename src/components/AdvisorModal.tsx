import React from 'react';
import { Phone, Mail, Clock, UserCheck, X, ShieldCheck, HeartHandshake } from 'lucide-react';
import contentData from '../data/contentData.json';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const advisor = contentData.brand.advisor;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#005596] to-sky-500 text-white flex items-center justify-center mx-auto shadow-md">
            <UserCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{advisor.name}</h3>
            <p className="text-xs text-[#005596] font-semibold">{advisor.title}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">VietinBank - Quầy Giao Dịch Phục Vụ Khách Hàng</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Số điện thoại: <strong>{advisor.phoneDisplay}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Giờ hỗ trợ: <strong>07:30 – 16:30 (Thứ 2 – Thứ 6)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Hỗ trợ: Tư vấn tiền gửi, gói vay, cài đặt iPay, xác thực CCCD & xử lý sự cố.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`tel:${advisor.phone}`}
              className="w-full py-3 bg-[#e31b23] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi điện thoại hỗ trợ trực tiếp</span>
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
