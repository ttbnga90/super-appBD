import React, { useState, useId } from 'react';
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  X,
  Printer,
  Copy,
  Check,
  Building2,
  DollarSign,
  TrendingDown,
  Info
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { formatVND, formatNumber, parseNumberFromString } from '../utils/formatters';

interface ScheduleRow {
  period: number;
  paymentDate: string;
  beginningBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  endingBalance: number;
}

export const LoanCalculatorSection: React.FC = () => {
  const propertyValId = useId();
  const loanAmtId = useId();
  const loanTermId = useId();
  const loanRateId = useId();
  const disbDateId = useId();
  const payCycleId = useId();
  const payDayId = useId();
  const roundModeId = useId();
  const loanDefaults = contentData.loanCalculator.defaultValues;

  // Form states (direct inputs as requested)
  const [propertyValue, setPropertyValue] = useState<string>(formatNumber(loanDefaults.propertyValue));
  const [loanAmount, setLoanAmount] = useState<string>(formatNumber(loanDefaults.loanAmount));
  const [loanTermMonths, setLoanTermMonths] = useState<number>(loanDefaults.loanTermMonths);
  const [annualRate, setAnnualRate] = useState<number>(loanDefaults.annualRate);
  const [disbursementDate, setDisbursementDate] = useState<string>(loanDefaults.disbursementDate);
  const [paymentCycle, setPaymentCycle] = useState<string>(loanDefaults.paymentCycle);
  const [paymentDay, setPaymentDay] = useState<number>(loanDefaults.paymentDay);
  const [roundingMode, setRoundingMode] = useState<string>(loanDefaults.roundingMode); // '1000' or '1'

  // Modal view for detailed repayment table
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [copiedTable, setCopiedTable] = useState<boolean>(false);

  // Calculations
  const numLoanAmount = parseNumberFromString(loanAmount);
  const numPropertyValue = parseNumberFromString(propertyValue);

  // Cycle config
  const cycleDivisors: Record<string, { divisor: number; monthsPerCycle: number; label: string }> = {
    monthly: { divisor: 12, monthsPerCycle: 1, label: 'Hằng tháng' },
    quarterly: { divisor: 4, monthsPerCycle: 3, label: 'Hằng quý (3 tháng)' },
    semiannual: { divisor: 2, monthsPerCycle: 6, label: '6 tháng' },
    annual: { divisor: 1, monthsPerCycle: 12, label: 'Hằng năm' },
  };

  const currentCycle = cycleDivisors[paymentCycle] || cycleDivisors.monthly;
  const totalPeriods = Math.max(1, Math.round(loanTermMonths / currentCycle.monthsPerCycle));
  const periodRate = (annualRate / 100) / currentCycle.divisor;

  // Generate repayment schedule
  const generateSchedule = (): {
    schedule: ScheduleRow[];
    totalPrincipal: number;
    totalInterest: number;
    firstPayment: number;
    lastPayment: number;
  } => {
    if (numLoanAmount <= 0 || totalPeriods <= 0) {
      return { schedule: [], totalPrincipal: 0, totalInterest: 0, firstPayment: 0, lastPayment: 0 };
    }

    const roundUnit = roundingMode === '1000' ? 1000 : 1;
    const roundFunc = (val: number) => Math.round(val / roundUnit) * roundUnit;

    const basePrincipalPerPeriod = roundFunc(numLoanAmount / totalPeriods);
    let remaining = numLoanAmount;
    let totalInterestAccum = 0;
    let totalPrincipalAccum = 0;

    const disbDateObj = new Date(disbursementDate);
    const schedule: ScheduleRow[] = [];

    // Period 0 (Disbursement)
    schedule.push({
      period: 0,
      paymentDate: disbDateObj.toLocaleDateString('vi-VN'),
      beginningBalance: numLoanAmount,
      principal: 0,
      interest: 0,
      totalPayment: 0,
      endingBalance: numLoanAmount,
    });

    for (let k = 1; k <= totalPeriods; k++) {
      // Calculate date: e.g. disb 10/01/2026 -> k=1 is 25/02/2026 if payDay is 25
      const paymentDateObj = new Date(disbDateObj);
      paymentDateObj.setMonth(disbDateObj.getMonth() + k * currentCycle.monthsPerCycle);
      paymentDateObj.setDate(Math.min(paymentDay, 28)); // Safe date

      const currentBeginning = remaining;
      const periodInterest = roundFunc(currentBeginning * periodRate);

      let periodPrincipal = basePrincipalPerPeriod;
      // Last period handles rounding difference
      if (k === totalPeriods) {
        periodPrincipal = currentBeginning;
      } else {
        periodPrincipal = Math.min(periodPrincipal, currentBeginning);
      }

      const periodTotal = periodPrincipal + periodInterest;
      remaining = Math.max(0, currentBeginning - periodPrincipal);

      totalPrincipalAccum += periodPrincipal;
      totalInterestAccum += periodInterest;

      schedule.push({
        period: k,
        paymentDate: paymentDateObj.toLocaleDateString('vi-VN'),
        beginningBalance: currentBeginning,
        principal: periodPrincipal,
        interest: periodInterest,
        totalPayment: periodTotal,
        endingBalance: remaining,
      });
    }

    const firstPayment = schedule.length > 1 ? schedule[1].totalPayment : 0;
    const lastPayment = schedule.length > 1 ? schedule[schedule.length - 1].totalPayment : 0;

    return {
      schedule,
      totalPrincipal: totalPrincipalAccum,
      totalInterest: totalInterestAccum,
      firstPayment,
      lastPayment,
    };
  };

  const { schedule, totalPrincipal, totalInterest, firstPayment, lastPayment } = generateSchedule();

  const handleCopyTable = () => {
    let tsv = 'Kỳ\tKỳ trả nợ\tDư nợ còn lại\tGốc\tLãi\tTổng gốc + Lãi\n';
    schedule.forEach((r) => {
      tsv += `${r.period}\t${r.paymentDate}\t${r.beginningBalance}\t${r.principal}\t${r.interest}\t${r.totalPayment}\n`;
    });
    tsv += `TỔNG\t\t\t${totalPrincipal}\t${totalInterest}\t${totalPrincipal + totalInterest}`;
    navigator.clipboard.writeText(tsv);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#005596] text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-xs font-semibold mb-3 tracking-wide">
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Kế hoạch tài chính minh bạch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            {contentData.loanCalculator.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {contentData.loanCalculator.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Form Inputs and Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Thông tin khoản vay (Nhập trực tiếp)
            </h3>
            <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
              Dư nợ giảm dần
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input: Giá trị bất động sản */}
            <div>
              <label htmlFor={propertyValId} className="text-xs font-bold text-slate-700 block mb-1">
                Giá trị tài sản / Bất động sản (VND)
              </label>
              <div className="relative">
                <input
                  id={propertyValId}
                  type="text"
                  value={propertyValue}
                  onChange={(e) => {
                    const num = parseNumberFromString(e.target.value);
                    setPropertyValue(num > 0 ? formatNumber(num) : '');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">VND</span>
              </div>
            </div>

            {/* Input: Số tiền vay */}
            <div>
              <label htmlFor={loanAmtId} className="text-xs font-bold text-slate-700 block mb-1">
                Số tiền vay (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanAmtId}
                  type="text"
                  value={loanAmount}
                  onChange={(e) => {
                    const num = parseNumberFromString(e.target.value);
                    setLoanAmount(num > 0 ? formatNumber(num) : '');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-[#005596] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">VND</span>
              </div>
              {numPropertyValue > 0 && numLoanAmount > 0 && (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tỷ lệ vay / tài sản: <strong className="text-slate-700">{Math.round((numLoanAmount / numPropertyValue) * 100)}%</strong>
                </span>
              )}
            </div>

            {/* Input: Thời gian vay */}
            <div>
              <label htmlFor={loanTermId} className="text-xs font-bold text-slate-700 block mb-1">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanTermId}
                  type="number"
                  min="1"
                  max="360"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">Tháng ({Math.floor(loanTermMonths / 12)} năm {loanTermMonths % 12} thg)</span>
              </div>
            </div>

            {/* Input: Lãi suất năm */}
            <div>
              <label htmlFor={loanRateId} className="text-xs font-bold text-slate-700 block mb-1">
                Lãi suất theo năm (%/Năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={loanRateId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">%/Năm</span>
              </div>
            </div>

            {/* Input: Ngày giải ngân */}
            <div>
              <label htmlFor={disbDateId} className="text-xs font-bold text-slate-700 block mb-1">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                id={disbDateId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
              />
            </div>

            {/* Input: Chu kỳ trả nợ */}
            <div>
              <label htmlFor={payCycleId} className="text-xs font-bold text-slate-700 block mb-1">
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                id={payCycleId}
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
              >
                {contentData.loanCalculator.cycleOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input: Ngày trả nợ định kỳ */}
            <div>
              <label htmlFor={payDayId} className="text-xs font-bold text-slate-700 block mb-1">
                Ngày trả nợ định kỳ hằng tháng
              </label>
              <div className="relative">
                <input
                  id={payDayId}
                  type="number"
                  min="1"
                  max="28"
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">Ngày hàng tháng</span>
              </div>
            </div>

            {/* Input: Quy tắc làm tròn */}
            <div>
              <label htmlFor={roundModeId} className="text-xs font-bold text-slate-700 block mb-1">
                Quy tắc làm tròn số
              </label>
              <select
                id={roundModeId}
                value={roundingMode}
                onChange={(e) => setRoundingMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#005596]"
              >
                <option value="1000">Làm tròn đến 1.000 đồng</option>
                <option value="1">Làm tròn đến đơn vị đồng</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Nguyên tắc tính toán nghiệp vụ:</p>
            <p>• Lãi suất kỳ = {annualRate}% / {currentCycle.divisor} = {((annualRate / currentCycle.divisor)).toFixed(3)}%/kỳ.</p>
            <p>• Sai lệch làm tròn được tự động điều chỉnh chính xác vào kỳ trả nợ cuối cùng.</p>
          </div>
        </div>

        {/* Right: Summary Card & "Xem chi tiết" Button (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Ước Tính Số Tiền Phải Trả</span>
            </h3>

            <div className="space-y-4 mb-6">
              {/* Payment Month 1 vs Last Month */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block mb-0.5">Số tiền trả kỳ đầu</span>
                  <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                    {formatVND(firstPayment)}
                  </span>
                </div>
                <div className="bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block mb-0.5">Số tiền trả kỳ cuối</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-300 font-mono">
                    {formatVND(lastPayment)}
                  </span>
                </div>
              </div>

              {/* Total Interest */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-slate-300 block mb-1">Tổng tiền lãi phải trả</span>
                <span className="text-xl sm:text-2xl font-black text-rose-300 font-mono">
                  {formatVND(totalInterest)}
                </span>
              </div>

              {/* Total Principal + Interest */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-slate-300 block mb-1">Tổng gốc + lãi phải trả</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  {formatVND(numLoanAmount + totalInterest)}
                </span>
              </div>
            </div>

            {/* Primary Action Button: "Xem chi tiết" */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-[#005596] hover:from-blue-700 hover:to-blue-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xem chi tiết lịch trả nợ ({totalPeriods} kỳ)</span>
            </button>
          </div>

          {/* Business Rules Card */}
          <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-[#005596] flex items-center gap-1.5 text-xs">
              <Info className="w-4 h-4" />
              <span>Đặc điểm phương thức trả gốc đều, lãi giảm dần:</span>
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Số tiền trả giảm dần theo thời gian.</li>
              <li>Tổng lãi phải trả thường thấp hơn so với phương thức trả góp đều.</li>
              <li>Gốc trả mỗi kỳ = Số tiền vay / Tổng số kỳ trả nợ.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 2: Modal Detail Repayment Schedule Table */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Khoản vay: {formatVND(numLoanAmount)} · Thời hạn: {loanTermMonths} tháng ({totalPeriods} kỳ) · Lãi suất: {annualRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTable}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  {copiedTable ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTable ? 'Đã sao chép' : 'Sao chép bảng'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In bảng</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Table Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#005596] text-white font-bold sticky top-0 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3 text-center">Stt</th>
                      <th className="py-3 px-4">Kỳ trả nợ</th>
                      <th className="py-3 px-4 text-right">Dư nợ còn lại</th>
                      <th className="py-3 px-4 text-right">Gốc</th>
                      <th className="py-3 px-4 text-right">Lãi</th>
                      <th className="py-3 px-4 text-right">Tổng Gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((row) => (
                      <tr
                        key={row.period}
                        className={row.period === 0 ? 'bg-slate-50 font-semibold text-slate-600' : 'hover:bg-blue-50/40 transition-colors'}
                      >
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {row.period}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {row.paymentDate}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-800">
                          {formatNumber(row.beginningBalance)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                          {row.principal > 0 ? formatNumber(row.principal) : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-amber-700 font-medium">
                          {row.interest > 0 ? formatNumber(row.interest) : '-'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-[#005596]">
                          {row.totalPayment > 0 ? formatNumber(row.totalPayment) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-center uppercase tracking-wider text-xs">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-800">
                        {formatNumber(totalPrincipal)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-800">
                        {formatNumber(totalInterest)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#005596] text-sm">
                        {formatNumber(totalPrincipal + totalInterest)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Đơn vị tính: Việt Nam Đồng (VND).</span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-[#005596] text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
