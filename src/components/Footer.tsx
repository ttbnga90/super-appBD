import React from 'react';
import { Phone, Clock, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
  onOpenAdvisorModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdvisorModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#005596] flex items-center justify-center font-bold text-white text-sm">
                VB
              </div>
              <span className="text-white font-bold text-lg tracking-tight">VietinBank</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ngân hàng Thương mại Cổ phần Công Thương Việt Nam - Nâng giá trị cuộc sống.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Giao dịch an toàn & bảo mật tuyệt đối</span>
            </div>
          </div>

          {/* Col 2: Kiosk Fast Nav */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Tiện Ích Tại Quầy
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  1. Giải đáp thắc mắc khách hàng
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('app')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  2. Tải App VietinBank iPay
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('game')}
                  className="hover:text-blue-400 transition-colors text-left text-amber-300 font-medium"
                >
                  3. Thử thách Game trúng voucher
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('deposit')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  4. Tính lãi tiền gửi tiết kiệm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('loan')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  5. Lịch trả nợ dư nợ giảm dần
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('products')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  6. Sản phẩm & Ưu đãi nổi bật
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('branches')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  7. Tra cứu điểm giao dịch
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Counter Advisor Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Cán Bộ Tư Vấn Tại Quầy
            </h3>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span className="text-white text-xs font-semibold">
                  {contentData.brand.advisor.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {contentData.brand.advisor.title}
              </p>
              <a
                href={`tel:${contentData.brand.advisor.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e31b23] hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi trực tiếp: {contentData.brand.advisor.phoneDisplay}</span>
              </a>
              <button
                onClick={onOpenAdvisorModal}
                className="block text-[11px] text-blue-400 hover:underline pt-1"
              >
                Xem chi tiết thông tin hỗ trợ
              </button>
            </div>
          </div>

          {/* Col 4: Working Hours & Branch Hotline */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Thời Gian Giao Dịch
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-200 font-medium">Thứ 2 đến Thứ 6:</p>
                  <p>Sáng: 07:30 – 11:30</p>
                  <p>Chiều: 13:00 – 16:30</p>
                </div>
              </div>
              <p className="text-slate-400 pl-6">
                Thứ 7 - Chủ nhật: Nghỉ giao dịch
              </p>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p>155+ Chi nhánh & hàng ngàn PGD trên cả nước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Hotline 24/7: 1900 558 868</span>
            <span>·</span>
            <span>Bảo mật chuẩn ISO/IEC 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
