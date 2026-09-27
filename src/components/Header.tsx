import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenAdvisorModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAdvisorModal
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    HelpCircle: <HelpCircle className="w-4 h-4" />,
    Smartphone: <Smartphone className="w-4 h-4" />,
    Gamepad2: <Gamepad2 className="w-4 h-4" />,
    PiggyBank: <PiggyBank className="w-4 h-4" />,
    Calculator: <Calculator className="w-4 h-4" />,
    Sparkles: <Sparkles className="w-4 h-4" />,
    MapPin: <MapPin className="w-4 h-4" />
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner for Kiosk Counter Info */}
      <div className="bg-[#005596] text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold bg-[#e31b23] px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">
            Kiosk Giao Dịch
          </span>
          <span className="hidden sm:inline text-blue-100">
            {contentData.brand.fullName}
          </span>
          <span className="sm:hidden text-blue-100 truncate">
            {contentData.brand.name}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdvisorModal}
            className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline font-medium">Tư vấn viên: {contentData.brand.advisor.name}</span>
            <span className="md:hidden font-medium">Tư vấn</span>
          </button>
          <a
            href={`tel:${contentData.brand.advisor.phone}`}
            className="flex items-center gap-1 bg-[#e31b23] hover:bg-red-700 text-white px-2 py-0.5 rounded text-[11px] font-bold transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>{contentData.brand.advisor.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => onSelectTab('faq')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <img
            src={contentData.brand.logoUrl}
            alt="VietinBank Logo"
            className="h-9 md:h-11 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback if external image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="border-l border-slate-300 pl-3 hidden sm:block">
            <h1 className="text-base font-bold text-[#005596] leading-tight tracking-tight">
              Quầy Giao Dịch Số
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Chạm tương tác - Phục vụ tức thì
            </p>
          </div>
        </div>

        {/* Desktop / Tablet Nav Menu */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {contentData.navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#005596] hover:bg-blue-50/70'
                }`}
              >
                <span className={isActive ? 'text-amber-300' : 'text-slate-400'}>
                  {iconMap[item.icon]}
                </span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Button for Mobile or Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('game')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer animate-pulse-subtle"
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Chơi Game Nhận Quà</span>
            <span className="sm:hidden">Nhận Quà</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Tab Navigation */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50/90 overflow-x-auto scrollbar-none px-2 py-1.5 flex gap-1">
        {contentData.navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#005596] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{iconMap[item.icon]}</span>
              <span>{item.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
