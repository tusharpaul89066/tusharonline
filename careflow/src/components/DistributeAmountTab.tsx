import React, { useState } from "react";
import { Bill, Patient, DistributionRecord, Doctor } from "../types";
import { Receipt, Coins, Landmark, CalendarDays, Search, CheckCircle, Ticket, HeartHandshake, Download, RotateCcw, Wallet } from "lucide-react";
import { jsPDF } from "jspdf";

interface DistributeAmountTabProps {
  bills: Bill[];
  patients: Patient[];
  distributions: DistributionRecord[];
  setDistributions: React.Dispatch<React.SetStateAction<DistributionRecord[]>>;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
}

export default function DistributeAmountTab({
  bills,
  patients,
  distributions,
  setDistributions,
  handleExportCSV
}: DistributeAmountTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const todayRaw = new Date();
  const todayStr = todayRaw.toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showDistributeForm, setShowDistributeForm] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState("Doctor");
  const [selectedReferralId, setSelectedReferralId] = useState("");

  const referralPatients = patients.filter(p => p.type?.includes("IPD") && p.commissionValue && p.commissionValue > 0);
  const selectedRefPatient = referralPatients.find(p => p.id === selectedReferralId);
  let expectedCommission = 0;
  if (selectedRefPatient && selectedRefPatient.commissionValue) {
    if (selectedRefPatient.commissionType === "percentage") {
      expectedCommission = Math.round(((selectedRefPatient.packageAmount || 0) * selectedRefPatient.commissionValue) / 100);
    } else {
      expectedCommission = Math.round(selectedRefPatient.commissionValue);
    }
  }

  // Auto Calculations
  
  // Calculate total income purely from bills to match Reports Center perfectly (with Referral Commissions subtracted)
  const rawTotalIncomeAmount = bills
    .filter(b => (!dateRange.start || b.date >= dateRange.start) && (!dateRange.end || b.date <= dateRange.end))
    .reduce((acc, bill) => acc + (bill.total || 0), 0);

  const distributedReferralInDateRange = distributions
    .filter(d => (!dateRange.start || d.date >= dateRange.start) && (!dateRange.end || d.date <= dateRange.end) && d.purpose === "Referral Commission" && d.status !== "Canceled")
    .reduce((acc, d) => acc + d.amount, 0);

  const totalIncomeAmount = Math.max(0, rawTotalIncomeAmount - distributedReferralInDateRange);
  
  // 3. Distributed Amounts (within date range, excluding Referral Commission as it's already deducted from income)
  const totalDistributedAmount = distributions
    .filter(d => (!dateRange.start || d.date >= dateRange.start) && (!dateRange.end || d.date <= dateRange.end) && d.status !== "Canceled" && d.purpose !== "Referral Commission")
    .reduce((acc, d) => acc + d.amount, 0);
  
  const afterDistributeAmount = Math.max(0, totalIncomeAmount - totalDistributedAmount);

  // Today specific calculations for Cards
  const todayDistributions = distributions.filter(d => d.date === todayStr && d.status !== "Canceled");
  
  const todayDoctorDistributeAmount = todayDistributions
    .filter(d => d.purpose === "Doctor")
    .reduce((acc, d) => acc + d.amount, 0);

  const todayReferralCommission = todayDistributions
    .filter(d => d.purpose === "Referral Commission")
    .reduce((acc, d) => acc + d.amount, 0);

  const todayOthersPurpose = todayDistributions
    .filter(d => d.purpose === "Others Purpose")
    .reduce((acc, d) => acc + d.amount, 0);

  // Form handling
  const handleDistributeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const purpose = elements.purpose.value;
    const amountRaw = parseFloat(elements.amount.value);
    const amount = isNaN(amountRaw) ? 0 : amountRaw;
    const details = elements.details.value;

    if (amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const newDist: DistributionRecord = {
      id: `DIST-${Math.floor(Math.random() * 90000) + 10000}`,
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose,
      amount,
      details,
      status: "Active"
    };

    setDistributions([newDist, ...distributions]);
    setShowDistributeForm(false);
  };

  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const handleRestore = (distId: string) => {
    setDistributions(distributions.map(d => 
      d.id === distId ? { ...d, status: "Canceled" } : d
    ));
    setConfirmRestoreId(null);
  };

  const handlePrintToken = (dist: DistributionRecord) => {
    const doc = new jsPDF({ format: "a5" });
    
    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("DISTRIBUTE TOKEN", 20, 20);
    
    // Details
    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Token No: ${dist.id}`, 20, 35);
    doc.text(`Date & Time: ${dist.date} ${dist.time}`, 20, 45);
    
    doc.text(`Purpose: ${dist.purpose}`, 20, 60);
    doc.text(`Details: ${dist.details}`, 20, 70);
    
    doc.setFont("Helvetica", "bold");
    doc.text(`Distributed Amount: Rs. ${dist.amount.toFixed(2)}`, 20, 85);
    
    doc.setFont("Helvetica", "normal");
    doc.text("------------------------------------------", 20, 105);
    doc.text("Authorized Signature", 20, 115);
    
    doc.save(`${dist.id}_Token.pdf`);
  };

  // Searching & Listing filter
  const filteredDistributions = distributions.filter(d => {
    const matchesSearch = d.details.toLowerCase().includes(searchTerm.toLowerCase()) || d.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = (!dateRange.start || d.date >= dateRange.start) && (!dateRange.end || d.date <= dateRange.end);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in bg-white/40 border border-emerald-200 rounded-3xl p-6 shadow-sm font-semibold text-slate-800 text-xs">
      
      {/* Header */}
      <div className="border-b border-emerald-100/80 pb-3.5">
        <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2 font-sans tracking-wide">
          <Landmark className="text-teal-700 w-5 h-5" /> Distribute Amount Center (বণ্টন কেন্দ্র)
        </h2>
        <p className="text-[11px] text-zinc-800 font-bold leading-relaxed mt-1 font-sans">
          Manage, calculate, and print distribution amounts automatically mapped from OPD and Billing.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="card-isometric-3d-emerald p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-emerald-800">Total Income Amount</span>
            <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600 shadow-inner">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-900 tracking-tight">{totalIncomeAmount.toLocaleString()} INR</div>
            <div className="text-[9px] text-emerald-700 font-bold tracking-wider mt-1 uppercase">From OPD, IPD, Medicine, Lab</div>
          </div>
        </div>

        <div className="card-isometric-3d p-4 rounded-2xl flex flex-col justify-between border-blue-200" style={{ borderBottomColor: '#60a5fa' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-blue-800">After Distribute Amount</span>
            <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600 shadow-inner border border-blue-100">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-blue-900 tracking-tight">{afterDistributeAmount.toLocaleString()} INR</div>
            <div className="text-[9px] text-blue-700 font-bold tracking-wider mt-1 uppercase">Remaining Balance</div>
          </div>
        </div>

        <div className="card-isometric-3d p-4 rounded-2xl flex flex-col justify-between border-indigo-200" style={{ borderBottomColor: '#818cf8' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-indigo-800">Today Doctor Distribute</span>
            <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600 shadow-inner border border-indigo-100">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-indigo-900 tracking-tight">{todayDoctorDistributeAmount.toLocaleString()} INR</div>
            <div className="text-[9px] text-indigo-700 font-bold tracking-wider mt-1 uppercase">Today's Doctor Scope</div>
          </div>
        </div>

        <div className="card-isometric-3d p-4 rounded-2xl flex flex-col justify-between border-orange-200" style={{ borderBottomColor: '#fb923c' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-orange-800">Today Referral Commission</span>
            <div className="bg-orange-50 p-1.5 rounded-lg text-orange-600 shadow-inner border border-orange-100">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-orange-900 tracking-tight">{todayReferralCommission.toLocaleString()} INR</div>
            <div className="text-[9px] text-orange-700 font-bold tracking-wider mt-1 uppercase">Today's Broker Scope</div>
          </div>
        </div>

        <div className="card-isometric-3d p-4 rounded-2xl flex flex-col justify-between border-rose-200" style={{ borderBottomColor: '#f43f5e' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-rose-800">Today Others Purpose</span>
            <div className="bg-rose-50 p-1.5 rounded-lg text-rose-600 shadow-inner border border-rose-100">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-rose-900 tracking-tight">{todayOthersPurpose.toLocaleString()} INR</div>
            <div className="text-[9px] text-rose-700 font-bold tracking-wider mt-1 uppercase">Today's Other Exps</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/70 p-3 rounded-2xl border border-emerald-100 shadow-sm gap-4">
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search details or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all font-sans"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-transparent text-[10px] font-bold text-slate-700 outline-none"
            />
            <span className="text-slate-400 font-bold text-[10px]">TO</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-transparent text-[10px] font-bold text-slate-700 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const exportCols = [
                { label: "ID", value: (r: any) => r.id },
                { label: "Date", value: (r: any) => r.date },
                { label: "Time", value: (r: any) => r.time },
                { label: "Purpose", value: (r: any) => r.purpose },
                { label: "Details", value: (r: any) => r.details },
                { label: "Amount", value: (r: any) => r.amount },
                { label: "Status", value: (r: any) => r.status || "Active" }
              ];
              handleExportCSV("distribution_sheet", exportCols, filteredDistributions);
            }}
            className="bg-white border border-slate-200 hover:border-teal-500 font-sans text-[11px] px-4 py-2 uppercase font-black tracking-wider text-slate-700 hover:text-teal-700 rounded-xl shadow-sm w-full md:w-auto flex items-center gap-2 justify-center transition-all"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
          
          <button
            onClick={() => setShowDistributeForm(!showDistributeForm)}
            className="btn-action-blue font-sans text-[11px] px-5 py-2 uppercase font-black tracking-wider text-white rounded-xl shadow-md w-full md:w-auto flex items-center gap-2 justify-center"
          >
            <Coins className="w-4 h-4" />
            Distribute Option
          </button>
        </div>
      </div>

      {/* Distribution Form Modal equivalent (inline) */}
      {showDistributeForm && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-[13px] font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-teal-600" /> Record New Distribution
          </h3>
          <form onSubmit={handleDistributeSubmit} className={`grid grid-cols-1 ${selectedPurpose === 'Referral Commission' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-4 items-end`}>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Distribute Purpose</label>
              <select 
                name="purpose" 
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                required 
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none"
              >
                <option value="Doctor">Doctor</option>
                <option value="Referral Commission">Referral Commission</option>
                <option value="Others Purpose">Others Purpose</option>
              </select>
            </div>

            {selectedPurpose === 'Referral Commission' && (
              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label className="text-[10px] font-black uppercase text-slate-500">Select Referral</label>
                <div className="relative">
                  <select 
                    value={selectedReferralId}
                    onChange={(e) => setSelectedReferralId(e.target.value)}
                    className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none"
                    required={selectedPurpose === 'Referral Commission'}
                  >
                    <option value="">Select Referral...</option>
                    {referralPatients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.referBy || "Unknown"} (IPD: {p.id.substring(0,6).toUpperCase()})
                      </option>
                    ))}
                  </select>
                  {selectedRefPatient && (
                    <div className="absolute -top-7 right-0 bg-orange-100 text-orange-800 text-[9px] px-2 py-0.5 rounded font-black border border-orange-200 shadow-sm z-10 whitespace-nowrap">
                      Expected: {expectedCommission.toLocaleString()} INR
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Amount (INR)</label>
              <input 
                key={`amount-${selectedReferralId}`}
                type="number" 
                name="amount" 
                min="0" 
                step="any"
                required 
                placeholder="Ex: 500" 
                defaultValue={selectedPurpose === 'Referral Commission' && expectedCommission > 0 ? expectedCommission : undefined}
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none" 
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
            <div className={`flex flex-col gap-1.5 ${selectedPurpose === 'Referral Commission' ? 'md:col-span-2' : 'md:col-span-2'}`}>
              <label className="text-[10px] font-black uppercase text-slate-500">Details (Whom / Description)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="details" 
                  key={`details-${selectedReferralId}`}
                  required 
                  defaultValue={selectedPurpose === 'Referral Commission' && selectedRefPatient ? `Paid to: ${selectedRefPatient.referBy || "Unknown"} for IPD ${selectedRefPatient.id.substring(0,6).toUpperCase()}` : ""}
                  placeholder="Dr. Name / Broker Name / Remarks..." 
                  className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none" 
                />
                <button type="submit" className="px-4 py-2 text-[10px] text-white font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 btn-action-blue">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Distribute Sheet (Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Token ID</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Date & Time</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Purpose</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Details</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500 text-right">Amount (INR)</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDistributions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-bold text-xs uppercase">
                  No distribution sheets found in this range.
                </td>
              </tr>
            ) : (
              filteredDistributions.map((dist, idx) => (
                <tr key={dist.id} className={`border-b border-slate-100 transition-colors ${dist.status === 'Canceled' ? 'bg-rose-50/40 opacity-75' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-3 px-4 text-[10px] font-black text-slate-700">{dist.id}</td>
                  <td className="py-3 px-4 text-[10px] font-bold text-slate-600">
                    <div>{dist.date}</div>
                    <div className="text-[9px] text-slate-400">{dist.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded uppercase font-black text-[9px] ${
                      dist.purpose === 'Doctor' ? 'bg-indigo-100 text-indigo-700' : 
                      dist.purpose === 'Referral Commission' ? 'bg-orange-100 text-orange-700' : 
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {dist.purpose}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-bold text-slate-700">{dist.details}</td>
                  <td className="py-3 px-4 text-[12px] font-black text-emerald-700 text-right">
                    <span className={dist.status === 'Canceled' ? 'line-through text-rose-500' : ''}>
                      {dist.amount.toLocaleString()} INR
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {dist.status === 'Canceled' ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                        Restored / Canceled
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handlePrintToken(dist)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-600 hover:text-teal-700 transition-colors rounded-lg text-[9px] font-black uppercase tracking-wider"
                        >
                          <Download className="w-3.5 h-3.5" /> Token Print
                        </button>
                        
                        {confirmRestoreId === dist.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRestore(dist.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 border border-rose-600 text-white transition-colors rounded-lg text-[9px] font-black uppercase tracking-wider"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmRestoreId(null)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-colors rounded-lg text-[9px] font-black uppercase tracking-wider"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmRestoreId(dist.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-colors rounded-lg text-[9px] font-black uppercase tracking-wider"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
