import React, { useState } from "react";
import { Bill, Patient, DistributionRecord } from "../types";
import { 
  Search, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  IndianRupee,
  TrendingUp,
  Clock
} from "lucide-react";

interface ReportsCenterTabProps {
  bills: Bill[];
  patients: Patient[];
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
  distributions?: DistributionRecord[];
}

export default function ReportsCenterTab({ bills, patients, handleExportCSV, distributions = [] }: ReportsCenterTabProps) {
  const [activeReport, setActiveReport] = useState<string>("TOTAL_INCOME");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const todayStr = new Date().toISOString().split("T")[0];

  const calculateIncome = (type: string, isToday: boolean) => {
    let rawBills = bills;
    if (isToday) {
      rawBills = bills.filter(b => b.date === todayStr);
    }
    const rawIncome = rawBills.reduce((acc, bill) => {
      let amount = 0;
      if (type === "TOTAL") amount = bill.total || 0;
      if (type === "OPD") amount = (bill.breakdown?.doc || 0) + (bill.breakdown?.reg || 0);
      if (type === "MEDICINE") amount = bill.breakdown?.med || 0;
      if (type === "LAB") amount = bill.breakdown?.test || 0;
      return acc + amount;
    }, 0);

    if (type === "TOTAL" && distributions) {
      let refDists = distributions.filter(d => d.purpose === "Referral Commission" && d.status !== "Canceled");
      if (isToday) {
        refDists = refDists.filter(d => d.date === todayStr);
      }
      const distributed = refDists.reduce((acc, d) => acc + (d.amount || 0), 0);
      return Math.max(0, rawIncome - distributed);
    }

    return rawIncome;
  };

  const calculateReferCommission = (isToday: boolean) => {
    let rawPatients = patients.filter(p => p.type && p.type.includes("IPD"));
    if (isToday) {
      rawPatients = rawPatients.filter(p => p.date === todayStr || p.timeline?.some(t => t.date === todayStr && t.status === "Admitted"));
    }
    const patientsTotal = rawPatients.reduce((acc, p) => {
      let com = 0;
      if (p.commissionValue && p.commissionValue > 0) {
        if (p.commissionType === "percentage") {
          com = Math.round(((p.packageAmount || 0) * p.commissionValue) / 100);
        } else {
          com = Math.round(p.commissionValue);
        }
      }
      return acc + com;
    }, 0);

    // Sum up distributed referral commissions
    let distributed = 0;
    if (distributions) {
      let refDists = distributions.filter(d => d.purpose === "Referral Commission" && d.status !== "Canceled");
      if (isToday) {
        refDists = refDists.filter(d => d.date === todayStr);
      }
      distributed = refDists.reduce((acc, d) => acc + (d.amount || 0), 0);
    }

    return Math.max(0, patientsTotal - distributed);
  };

  const themes = {
    TOTAL: {
      wrapperClass: "bg-[#d1e7dd] border-[#1a6245]", 
      iconSquareClass: "bg-[#258a62] text-white",
      titleClass: "text-[#1a6245]",
      amountClass: "text-[#0d3b28]",
      bgIconClass: "text-[#1a6245]",
      ringClass: "ring-[#258a62]/30"
    },
    OPD: {
      wrapperClass: "bg-[#cce3f0] border-[#1e587b]", 
      iconSquareClass: "bg-[#297dae] text-white",
      titleClass: "text-[#1e587b]",
      amountClass: "text-[#0f344a]",
      bgIconClass: "text-[#1e587b]",
      ringClass: "ring-[#297dae]/30"
    },
    MEDICINE: {
      wrapperClass: "bg-[#fbe8d5] border-[#9c5127]", 
      iconSquareClass: "bg-[#d97136] text-white",
      titleClass: "text-[#9c5127]",
      amountClass: "text-[#653316]",
      bgIconClass: "text-[#9c5127]",
      ringClass: "ring-[#d97136]/30"
    },
    LAB: {
      wrapperClass: "bg-[#e2d5ed] border-[#5a3a7c]", 
      iconSquareClass: "bg-[#7d51ac] text-white",
      titleClass: "text-[#5a3a7c]",
      amountClass: "text-[#36224d]",
      bgIconClass: "text-[#5a3a7c]",
      ringClass: "ring-[#7d51ac]/30"
    },
    REFER_COMMISSION: {
      wrapperClass: "bg-[#f8d7da] border-[#922b35]", 
      iconSquareClass: "bg-[#cc3c4b] text-white",
      titleClass: "text-[#922b35]",
      amountClass: "text-[#581720]",
      bgIconClass: "text-[#922b35]",
      ringClass: "ring-[#cc3c4b]/30"
    }
  };

  const topCards = [
    { id: "TOTAL_INCOME", title: "TOTAL INCOME", amount: calculateIncome("TOTAL", false), icon: IndianRupee, type: "TOTAL", today: false, theme: themes.TOTAL },
    { id: "TOTAL_OPD", title: "TOTAL OPD INCOME", amount: calculateIncome("OPD", false), icon: Stethoscope, type: "OPD", today: false, theme: themes.OPD },
    { id: "TOTAL_MEDICINE", title: "TOTAL MEDICINE", amount: calculateIncome("MEDICINE", false), icon: Pill, type: "MEDICINE", today: false, theme: themes.MEDICINE },
    { id: "TOTAL_LAB", title: "TOTAL LAB INCOME", amount: calculateIncome("LAB", false), icon: FlaskConical, type: "LAB", today: false, theme: themes.LAB },
    { id: "TOTAL_REFER_COMMISSION", title: "REFER COMMISSION", amount: calculateReferCommission(false), icon: TrendingUp, type: "REFER_COMMISSION", today: false, theme: themes.REFER_COMMISSION },
  ];

  const bottomCards = [
    { id: "TODAY_TOTAL", title: "TODAY TOTAL", amount: calculateIncome("TOTAL", true), icon: TrendingUp, type: "TOTAL", today: true, theme: themes.TOTAL },
    { id: "TODAY_OPD", title: "TODAY OPD INCOME", amount: calculateIncome("OPD", true), icon: Clock, type: "OPD", today: true, theme: themes.OPD },
    { id: "TODAY_MEDICINE", title: "TODAY MEDICINE", amount: calculateIncome("MEDICINE", true), icon: Pill, type: "MEDICINE", today: true, theme: themes.MEDICINE },
    { id: "TODAY_LAB", title: "TODAY LAB INCOME", amount: calculateIncome("LAB", true), icon: FlaskConical, type: "LAB", today: true, theme: themes.LAB },
    { id: "TODAY_REFER_COMMISSION", title: "TODAY REFER COMMISSION", amount: calculateReferCommission(true), icon: TrendingUp, type: "REFER_COMMISSION", today: true, theme: themes.REFER_COMMISSION },
  ];

  const getFilteredData = () => {
    const activeData = [...topCards, ...bottomCards].find(c => c.id === activeReport);
    
    if (activeData?.type === "REFER_COMMISSION") {
      let rawPatients = patients.filter(p => p.type && p.type.includes("IPD") && p.commissionValue && p.commissionValue > 0);
      
      if (activeData.today) {
        rawPatients = rawPatients.filter(p => p.date === todayStr || p.timeline?.some(t => t.date === todayStr && t.status === "Admitted"));
      }

      if (dateFilter === "today") {
        rawPatients = rawPatients.filter(p => p.date === todayStr || p.timeline?.some(t => t.date === todayStr && t.status === "Admitted"));
      } else if (dateFilter === "month") {
        const monthPrefix = todayStr.substring(0, 7);
        rawPatients = rawPatients.filter(p => p.date?.startsWith(monthPrefix) || p.timeline?.some(t => t.date?.startsWith(monthPrefix) && t.status === "Admitted"));
      }

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        rawPatients = rawPatients.filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.referBy && p.referBy.toLowerCase().includes(q))
        );
      }
      return rawPatients.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Default Bill logic
    let result = bills;

    if (activeData) {
      if (activeData.today) {
        result = result.filter(b => b.date === todayStr);
      }
      
      result = result.filter(b => {
        if (activeData.type === "OPD") return ((b.breakdown?.doc || 0) + (b.breakdown?.reg || 0)) > 0;
        if (activeData.type === "MEDICINE") return (b.breakdown?.med || 0) > 0;
        if (activeData.type === "LAB") return (b.breakdown?.test || 0) > 0;
        return true;
      });
    }

    if (dateFilter === "today") {
      result = result.filter(b => b.date === todayStr);
    } else if (dateFilter === "month") {
      const monthPrefix = todayStr.substring(0, 7);
      result = result.filter(b => b.date?.startsWith(monthPrefix));
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(b => 
        (b.patientName && b.patientName.toLowerCase().includes(q)) || 
        (b.invoice && b.invoice.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredData = getFilteredData();
  const activeCardInfo = [...topCards, ...bottomCards].find(c => c.id === activeReport) || topCards[0];
  const pageCount = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportData = () => {
    if (activeCardInfo.type === "REFER_COMMISSION") {
      const columns = [
        { label: "Date", value: (r: any) => r.date },
        { label: "IPD Reg No", value: (r: any) => r.id },
        { label: "Patient Name", value: (r: any) => r.name },
        { label: "Refer By", value: (r: any) => r.referBy || "N/A" },
        { label: "Contact Amount", value: (r: any) => r.packageAmount || 0 },
        { label: "Com Info", value: (r: any) => r.commissionType === "percentage" ? `${r.commissionValue}%` : `${r.commissionValue} (Fixed)` },
        { label: "Commission Amount", value: (r: any) => r.commissionType === "percentage" ? Math.round(((r.packageAmount || 0) * (r.commissionValue || 0)) / 100) : Math.round(r.commissionValue || 0) }
      ];
      handleExportCSV(`${activeReport}_Report`, columns, filteredData);
      return;
    }

    const columns = [
      { label: "Invoice ID", value: (r: any) => r.invoice },
      { label: "Patient Name", value: (r: any) => r.patientName },
      { label: "Date", value: (r: any) => r.date },
      { label: "Department", value: (r: any) => activeCardInfo.type },
      { label: "Amount", value: (r: any) => {
          if (activeCardInfo.type === "OPD") return (r.breakdown?.doc || 0) + (r.breakdown?.reg || 0);
          if (activeCardInfo.type === "MEDICINE") return r.breakdown?.med || 0;
          if (activeCardInfo.type === "LAB") return r.breakdown?.test || 0;
          return r.total;
      }},
      { label: "Payment Mode", value: (r: any) => r.paymentMode || "CASH" },
    ];
    handleExportCSV(`${activeReport}_Report`, columns, filteredData);
  };

  return (
    <div className="flex flex-col-reverse xl:flex-row gap-6 h-full font-sans animate-fade-in pl-1">
      
      {/* LEFT: Dynamic Report Sheet */}
      <div className="flex-1 bg-white border border-emerald-100 rounded-2xl shadow-sm flex flex-col overflow-hidden transition-all duration-500">
        <div className="bg-gradient-to-r from-emerald-50 to-white px-5 py-4 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm rounded-xl flex items-center justify-center border border-emerald-500">
              <activeCardInfo.icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-black text-emerald-950 uppercase tracking-tight">{activeCardInfo.title} SHEET</h2>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5 tracking-wider uppercase">Showing {filteredData.length} records in register</p>
            </div>
          </div>
          
          <button 
            onClick={exportData}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow border border-emerald-700 hover:shadow-md cursor-pointer"
          >
            <Download size={14} /> DOWNLOAD EXCEL
          </button>
        </div>

        <div className="px-5 py-3 border-b border-emerald-50/80 flex flex-wrap items-center justify-between gap-4 bg-emerald-50/20">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/50 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by Patient Name or ID..." 
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm bg-white text-emerald-900 placeholder:text-emerald-900/40"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/50 w-4 h-4" />
              <select 
                className="pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none bg-white shadow-sm text-emerald-900"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Time</option>
                <option value="today">Today Only</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar bg-white">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="sticky top-0 bg-emerald-50 backdrop-blur-md z-10 border-b border-emerald-100 shadow-sm">
              <tr className="text-emerald-800 font-extrabold uppercase tracking-widest text-[9.5px]">
                <th className="px-5 py-3.5">Serial No</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">{activeCardInfo.type === "REFER_COMMISSION" ? "IPD Reg No / Refer By" : "Invoice ID"}</th>
                <th className="px-5 py-3.5">Patient Name</th>
                <th className="px-5 py-3.5">Department / Package</th>
                <th className="px-5 py-3.5">Payment Method / Com Info</th>
                <th className="px-5 py-3.5 text-right flex-1 xl:pr-10">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 font-semibold">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-emerald-600/50">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-bold opacity-60">No records found in this criteria.</p>
                  </td>
                </tr>
              ) : (
                currentData.map((d: any, i) => {
                  let amount = 0;
                  
                  if (activeCardInfo.type === "REFER_COMMISSION") {
                    if (d.commissionType === "percentage") {
                      amount = Math.round(((d.packageAmount || 0) * (d.commissionValue || 0)) / 100);
                    } else {
                      amount = Math.round(d.commissionValue || 0);
                    }
                    
                    return (
                      <tr key={d.id} className="hover:bg-emerald-50/60 transition-colors bg-white even:bg-emerald-50/20 text-[11px] group cursor-default">
                        <td className="px-5 py-3 text-emerald-600/70 font-mono tracking-widest">
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </td>
                        <td className="px-5 py-3 font-mono text-emerald-800 tracking-tight">{d.date}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50 shadow-sm w-max">
                              ID: {d.id.substring(0,6).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-black">
                              Ref: {d.referBy || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-emerald-950 font-bold">{d.name}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="px-2.5 py-0.5 w-max rounded-md text-[9px] uppercase font-black border bg-emerald-50 text-emerald-700 border-emerald-200">
                              IPD ADMISSION
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold">
                              Pkg: {d.packageAmount || 0} INR
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="bg-orange-100/50 text-orange-800 font-extrabold px-2 py-0.5 rounded text-[9px] border border-orange-200/60 tracking-widest uppercase">
                            {d.commissionType === "percentage" ? `${d.commissionValue}%` : `${d.commissionValue} Fixed`}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-black text-emerald-900 font-mono text-sm xl:pr-10">
                          {amount.toLocaleString()} INR
                        </td>
                      </tr>
                    );
                  }

                  // Default bill logic
                  if (activeCardInfo.type === "OPD") amount = (d.breakdown?.doc || 0) + (d.breakdown?.reg || 0);
                  else if (activeCardInfo.type === "MEDICINE") amount = d.breakdown?.med || 0;
                  else if (activeCardInfo.type === "LAB") amount = d.breakdown?.test || 0;
                  else amount = d.total;

                  return (
                    <tr key={d.invoice} className="hover:bg-emerald-50/60 transition-colors bg-white even:bg-emerald-50/20 text-[11px] group cursor-default">
                      <td className="px-5 py-3 text-emerald-600/70 font-mono tracking-widest">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td className="px-5 py-3 font-mono text-emerald-800 tracking-tight">{d.date}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50 shadow-sm">
                          {d.invoice}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-emerald-950 font-bold">{d.patientName}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] uppercase font-black border ${
                          activeCardInfo.type === 'OPD' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          activeCardInfo.type === 'MEDICINE' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          activeCardInfo.type === 'LAB' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                          'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {activeCardInfo.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-emerald-100/50 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[9px] border border-emerald-200/60 tracking-widest uppercase">
                           {d.paymentMode || "CASH"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-black text-emerald-900 font-mono text-sm xl:pr-10">
                        {amount.toLocaleString()} INR
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="bg-emerald-50/30 border-t border-emerald-100 px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-white hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-200 rounded-lg shadow-sm disabled:opacity-40 transition-colors cursor-pointer"
               >
                 Prev
               </button>
               <button 
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className="px-3 py-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-white hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-200 rounded-lg shadow-sm disabled:opacity-40 transition-colors cursor-pointer"
               >
                 Next
               </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Cards Section aligned to the right */}
      <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-6">
        
        {/* Top Row: Total Data */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            All-Time Overview
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            {topCards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => { setActiveReport(card.id); setCurrentPage(1); }}
                className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-200 transform outline-none cursor-pointer overflow-hidden ${idx === 4 ? 'col-span-2' : ''} ${card.theme.wrapperClass} ${
                  activeReport === card.id 
                    ? `shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.03] ring-4 ring-offset-2 ring-offset-[#F8F5EE] ${card.theme.ringClass}`
                    : "shadow-sm hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="relative z-10 flex flex-col items-start w-full h-full justify-between">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm mb-4 ${card.theme.iconSquareClass}`}>
                    <card.icon size={20} className="opacity-90 leading-none" strokeWidth={2.5}/>
                  </div>
                  
                  <div>
                    <h4 className={`text-[10px] font-black tracking-widest uppercase mb-1 leading-tight ${card.theme.titleClass}`}>
                      {card.title}
                    </h4>
                    <div className={`text-xl xl:text-[1.35rem] font-black font-mono tracking-tight leading-none truncate w-full ${card.theme.amountClass}`}>
                      {card.amount.toLocaleString()} INR
                    </div>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className={`absolute -right-2 top-2 p-2 opacity-15 transform rotate-[20deg] transition-transform duration-500 pointer-events-none ${
                  activeReport === card.id ? "group-hover:rotate-0 scale-110" : "group-hover:rotate-[25deg]"
                } ${card.theme.bgIconClass}`}>
                  <card.icon size={88} strokeWidth={2.5} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Today Data */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
            Today's Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            {bottomCards.map((card, idx) => (
               <button
               key={card.id}
               onClick={() => { setActiveReport(card.id); setCurrentPage(1); }}
               className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-200 transform outline-none cursor-pointer overflow-hidden ${idx === 4 ? 'col-span-2' : ''} ${card.theme.wrapperClass} ${
                 activeReport === card.id 
                   ? `shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.03] ring-4 ring-offset-2 ring-offset-[#F8F5EE] ${card.theme.ringClass}`
                   : "shadow-sm hover:shadow-md hover:-translate-y-1"
               }`}
             >
               <div className="relative z-10 flex flex-col items-start w-full h-full justify-between">
                 <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm mb-4 ${card.theme.iconSquareClass}`}>
                   <card.icon size={20} className="opacity-90 leading-none" strokeWidth={2.5}/>
                 </div>
                 
                 <div>
                   <h4 className={`text-[10px] font-black tracking-widest uppercase mb-1 leading-tight ${card.theme.titleClass}`}>
                     {card.title}
                   </h4>
                   <div className={`text-xl xl:text-[1.35rem] font-black font-mono tracking-tight leading-none truncate w-full ${card.theme.amountClass}`}>
                     {card.amount.toLocaleString()} INR
                   </div>
                 </div>
               </div>
               {/* Decorative background element */}
               <div className={`absolute -right-2 top-2 p-2 opacity-15 transform rotate-[20deg] transition-transform duration-500 pointer-events-none ${
                 activeReport === card.id ? "group-hover:rotate-0 scale-110" : "group-hover:rotate-[25deg]"
               } ${card.theme.bgIconClass}`}>
                 <card.icon size={88} strokeWidth={2.5} />
               </div>
             </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
