import React, { useState, useId } from 'react';
import {
  PiggyBank,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  Percent,
  Play
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumber, parseNumberFromString } from '../utils/formatters';

export const DepositCalculatorSection: React.FC = () => {
  const depositAmountId = useId();
  const depositTermId = useId();
  const depositRateId = useId();
  const cfg = contentData.depositCalculator;

  // Form states
  const [rawAmount, setRawAmount] = useState<string>(formatNumber(cfg.defaultAmount));
  const [termMonths, setTermMonths] = useState<number>(cfg.defaultTerm);
  const [interestRate, setInterestRate] = useState<number>(5.3);
  const [isOnlineDeposit, setIsOnlineDeposit] = useState<boolean>(true); // iPay gets bonus rate

  // Errors
  const [amountError, setAmountError] = useState<string>('');
  const [termError, setTermError] = useState<string>('');
  const [rateError, setRateError] = useState<string>('');

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const num = parseNumberFromString(val);
    setRawAmount(num > 0 ? formatNumber(num) : '');

    if (!num || num <= 0) {
      setAmountError(cfg.validationErrors.amount);
    } else if (num < cfg.minAmount) {
      setAmountError(`Số tiền gửi tối thiểu là ${formatVND(cfg.minAmount)}`);
    } else {
      setAmountError('');
    }
  };

  // Handle quick amount pills
  const handleSelectQuickAmount = (val: number) => {
    setRawAmount(formatNumber(val));
    setAmountError('');
  };

  // Handle term change
  const handleTermChange = (months: number) => {
    setTermMonths(months);
    setTermError('');
    const matched = cfg.termOptions.find((t) => t.months === months);
    if (matched) {
      const baseRate = matched.rate;
      setInterestRate(isOnlineDeposit ? baseRate + 0.3 : baseRate);
    }
  };

  // Toggle online deposit bonus
  const handleToggleOnline = (online: boolean) => {
    setIsOnlineDeposit(online);
    const matched = cfg.termOptions.find((t) => t.months === termMonths);
    if (matched) {
      setInterestRate(online ? matched.rate + 0.3 : matched.rate);
    }
  };

  // Handle interest rate manual edit
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) {
      setRateError(cfg.validationErrors.rate);
      setInterestRate(0);
    } else if (val > cfg.maxInterestRate) {
      setRateError(`Lãi suất không được vượt quá mức trần ${cfg.maxInterestRate}%/năm`);
      setInterestRate(val);
    } else {
      setRateError('');
      setInterestRate(val);
    }
  };

  // Calculation
  const numericAmount = parseNumberFromString(rawAmount);
  const isValid = numericAmount >= cfg.minAmount && termMonths > 0 && interestRate >= 0 && !amountError && !termError && !rateError;

  // Formula: Lãi = (Số tiền * Lãi suất * Số tháng) / 12
  const interestEarned = isValid ? Math.round((numericAmount * (interestRate / 100) * termMonths) / 12) : 0;
  const totalReceived = numericAmount + interestEarned;
  const monthlyAverageInterest = termMonths > 0 ? Math.round(interestEarned / termMonths) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005596] to-sky-700 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3 tracking-wide">
            <PiggyBank className="w-3.5 h-3.5 text-amber-300" />
            <span>Sinh lời an toàn - Uy tín hàng đầu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            {cfg.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {cfg.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Input Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Thông tin tiền gửi dự tính
            </h3>
            {/* Online Deposit switch */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleToggleOnline(false)}
                className={`px-2.5 py-1 rounded-md transition-colors ${!isOnlineDeposit ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Tại quầy
              </button>
              <button
                type="button"
                onClick={() => handleToggleOnline(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${isOnlineDeposit ? 'bg-[#005596] text-white shadow-xs' : 'text-slate-500'}`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>iPay Online (+0.3%)</span>
              </button>
            </div>
          </div>

          {/* Input 1: Số tiền gửi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={depositAmountId} className="text-xs font-bold text-slate-800">
                Tổng tiền gửi (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tối thiểu: {formatVND(cfg.minAmount)}
              </span>
            </div>
            <div className="relative">
              <input
                id={depositAmountId}
                type="text"
                value={rawAmount}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi"
                className={`w-full px-4 py-3 rounded-xl border text-base font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  amountError
                    ? 'border-red-400 bg-red-50/20 focus:ring-red-200'
                    : 'border-slate-300 focus:border-[#005596] focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
            {amountError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{amountError}</span>
              </p>
            )}

            {/* Quick amount presets */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {[20000000, 50000000, 100000000, 200000000, 500000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleSelectQuickAmount(amt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                    numericAmount === amt
                      ? 'bg-blue-50 border-[#005596] text-[#005596] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {formatNumber(amt)} ₫
                </button>
              ))}
            </div>
          </div>

          {/* Input 2: Kỳ hạn gửi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={depositTermId} className="text-xs font-bold text-slate-800">
                Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Đang chọn: <strong className="text-[#005596]">{termMonths} Tháng</strong>
              </span>
            </div>
            <select
              id={depositTermId}
              value={termMonths}
              onChange={(e) => handleTermChange(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
            >
              <option value={0}>Chọn kỳ hạn gửi</option>
              {cfg.termOptions.map((t) => (
                <option key={t.months} value={t.months}>
                  {t.label} (Lãi suất chuẩn: {t.rate}%/năm)
                </option>
              ))}
            </select>
            {termError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{termError}</span>
              </p>
            )}

            {/* Term badges for quick tap */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2.5">
              {cfg.termOptions.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermChange(t.months)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                    termMonths === t.months
                      ? 'bg-[#005596] text-white border-[#005596] shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input 3: Lãi suất */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={depositRateId} className="text-xs font-bold text-slate-800">
                Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tối đa {cfg.maxInterestRate}%/năm
              </span>
            </div>
            <div className="relative">
              <input
                id={depositRateId}
                type="number"
                step="0.05"
                min="0"
                max={cfg.maxInterestRate}
                value={interestRate}
                onChange={handleRateChange}
                className={`w-full px-4 py-3 rounded-xl border text-base font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  rateError
                    ? 'border-red-400 bg-red-50/20 focus:ring-red-200'
                    : 'border-slate-300 focus:border-[#005596] focus:ring-blue-100'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
            {rateError && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{rateError}</span>
              </p>
            )}
            {isOnlineDeposit && (
              <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Đã bao gồm ưu đãi +0.3%/năm gửi tiết kiệm trên VietinBank iPay</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Calculation Result Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Kết Quả Lãi Dự Tính</span>
            </h3>

            {/* Interest Result */}
            <div className="space-y-4 mb-6">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-slate-300 block mb-1">
                  Tiền lãi dự tính
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                  {formatVND(interestEarned)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  ≈ {formatVND(monthlyAverageInterest)} / tháng
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-slate-300 block mb-1">
                  Tổng tiền nhận được khi đáo hạn (Gốc + Lãi)
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {formatVND(totalReceived)}
                </span>
              </div>
            </div>

            {/* Summary bullet details */}
            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/80 pt-4">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Hình thức nhận lãi:</span>
                <span className="font-semibold text-white">Cuối kỳ (Trả lãi sau)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Kỳ hạn gửi:</span>
                <span className="font-semibold text-white">{termMonths} Tháng</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lãi suất áp dụng:</span>
                <span className="font-semibold text-amber-300">{interestRate}% / năm</span>
              </div>
            </div>
          </div>

          {/* Video Guide Card (as requested in PDF page 2) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {cfg.videoGuideTitle}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Xem video clip hướng dẫn thao tác mở sổ tiết kiệm nhận lãi suất cao từ TikTok
                </p>
              </div>
            </div>

            <a
              href={cfg.videoGuideUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Xem video trên TikTok</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
