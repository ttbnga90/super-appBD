/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { FlappyGameSection } from './components/FlappyGameSection';
import { DepositCalculatorSection } from './components/DepositCalculatorSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchNetworkSection } from './components/BranchNetworkSection';
import { AdvisorModal } from './components/AdvisorModal';
import contentData from './data/contentData.json';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState<boolean>(false);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // Animate tab transition using GSAP
  useEffect(() => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
    // Scroll to top of content smoothly on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Global game callbacks setup as requested in technical requirements
  useEffect(() => {
    window.onFlappyVoucherWin = (data) => {
      console.log('[VietinBank Kiosk] Player Won Voucher:', data);
    };

    window.onFlappyVoucherLose = (data) => {
      console.log('[VietinBank Kiosk] Player Lost Game:', data);
    };

    return () => {
      delete window.onFlappyVoucherWin;
      delete window.onFlappyVoucherLose;
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'faq':
        return <FaqSection onReturnToMainMenu={() => setActiveTab('faq')} />;
      case 'app':
        return <AppDownloadSection />;
      case 'game':
        return <FlappyGameSection onReturnToMainMenu={() => setActiveTab('faq')} />;
      case 'deposit':
        return <DepositCalculatorSection />;
      case 'loan':
        return <LoanCalculatorSection />;
      case 'products':
        return <FeaturedProductsSection />;
      case 'branches':
        return <BranchNetworkSection />;
      default:
        return <FaqSection onReturnToMainMenu={() => setActiveTab('faq')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-[#005596] selection:text-white">
      <div>
        {/* Main Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
        />

        {/* Quick Kiosk Service Jump Bar (Desktop / Tablet) */}
        <div className="bg-white border-b border-slate-200/80 shadow-2xs py-2 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">7 Tính Năng Phục Vụ Tại Quầy:</span>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              {contentData.navItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`hover:text-[#005596] transition-colors cursor-pointer ${
                    activeTab === item.id ? 'font-bold text-[#005596] underline underline-offset-4' : ''
                  }`}
                >
                  {idx + 1}. {item.shortTitle}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div ref={contentContainerRef}>
            {renderActiveSection()}
          </div>
        </main>
      </div>

      {/* Counter Advisor Popup Modal */}
      <AdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />

      {/* Main Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
      />
    </div>
  );
}
