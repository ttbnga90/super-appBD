import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Clock,
  ExternalLink,
  Search,
  Building,
  Navigation,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const BranchNetworkSection: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('binh-duong');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedOfficeModal, setSelectedOfficeModal] = useState<any | null>(null);

  const branches = contentData.branchNetwork.branches;
  const currentBranch = branches.find((b) => b.branchId === selectedBranchId) || branches[0];

  // Filter sub-offices by keyword
  const filteredOffices = currentBranch.offices.filter((office) => {
    const q = searchKeyword.toLowerCase();
    return (
      office.name.toLowerCase().includes(q) ||
      office.address.toLowerCase().includes(q) ||
      office.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005596] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3 tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>Mạng lưới 155+ Chi nhánh VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {contentData.branchNetwork.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {contentData.branchNetwork.description}
          </p>
        </div>
      </div>

      {/* Working Hours Announcement Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <h4 className="font-bold text-slate-900">
              Thời gian giao dịch phục vụ tại quầy
            </h4>
            <p className="text-slate-700 font-medium">
              • <strong>Thứ 2 đến Thứ 6:</strong> {contentData.branchNetwork.workingHours.weekdays}
            </p>
            <p className="text-slate-500">
              • <strong>Thứ 7 - Chủ nhật:</strong> {contentData.branchNetwork.workingHours.weekend}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Đang mở cửa đón khách
          </span>
        </div>
      </div>

      {/* Branch Selection Bar & Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Branch Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-700 shrink-0">Chi nhánh:</span>
          {branches.map((b) => {
            const isSelected = selectedBranchId === b.branchId;
            return (
              <button
                key={b.branchId}
                onClick={() => {
                  setSelectedBranchId(b.branchId);
                  setSearchKeyword('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {b.branchName} ({b.offices.length} điểm)
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm tên, đường, số điện thoại..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
          />
        </div>
      </div>

      {/* Offices Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffices.map((office) => (
          <div
            key={office.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Badge */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                <img
                  src={office.imageUrl}
                  alt={office.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {office.type}
                </div>
              </div>

              {/* Title & Info */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#005596] transition-colors mb-2">
                {office.name}
              </h3>

              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{office.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Hotline PGD: <strong className="text-slate-800">{office.phone}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons: Direct Call & Google Maps */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${office.phone.replace(/[^\d]/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#005596] rounded-xl text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi điện</span>
              </a>

              <a
                href={office.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 rounded-xl text-xs font-bold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredOffices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-semibold text-slate-600">
            Không tìm thấy điểm giao dịch phù hợp với từ khóa "{searchKeyword}".
          </p>
          <button
            onClick={() => setSearchKeyword('')}
            className="mt-3 px-4 py-2 bg-[#005596] text-white text-xs font-bold rounded-lg"
          >
            Xem tất cả điểm giao dịch
          </button>
        </div>
      )}
    </div>
  );
};
