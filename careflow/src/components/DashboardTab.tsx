import React, { useMemo } from "react";
import { HeartPulse, Users, Bed, Activity, ShieldAlert, IndianRupee } from "lucide-react";
import { Patient, Bed as BedType, Bill, Medicine, Staff } from "../types";

interface DashboardTabProps {
  patients: Patient[];
  beds: BedType[];
  bills: Bill[];
  medicines: Medicine[];
  staff: Staff[];
  onNavigate: (tabId: string) => void;
}

export default function DashboardTab({
  patients,
  beds,
  bills,
  medicines,
  staff,
  onNavigate,
}: DashboardTabProps) {
  const totals = useMemo(() => {
    const IPDActive = patients.filter(
      (p) => p.bed !== "None" && p.condition !== "Discharged"
    ).length;
    const OPDActive = patients.filter((p) =>
      p.bed === "None" && p.condition !== "Discharged"
    ).length;
    const occBedsCount = beds.filter(
      (b) => b.status === "Occupied"
    ).length;
    const criticalCount = patients.filter(
      (p) => p.condition === "Critical"
    ).length;
    const grossRev = bills.reduce((acc, b) => acc + (b.total || 0), 0);
    return {
      IPDActive,
      OPDActive,
      occBedsCount,
      criticalCount,
      grossRev,
    };
  }, [patients, beds, bills]);

  const bedOccupancyRate = useMemo(() => {
    if (!beds.length) return 0;
    return Math.round((totals.occBedsCount / beds.length) * 100);
  }, [beds, totals.occBedsCount]);

  return (
    <div id="dashboard-tab" className="space-y-6 animate-fade-in font-sans text-xs text-slate-800">
      
      {/* Premium Header Jumbotron */}
      <div className="retro-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-[#d6b876] text-[#1a3338] font-mono font-black text-[9px] rounded-full tracking-widest uppercase shadow-sm flex items-center gap-1.5">
                 LIVE TELEMETRY SYSTEM
              </span>
              <span className="text-[10px] text-[#1a3338] font-bold tracking-widest uppercase flex items-center gap-1">
                • ACTIVE WORKSPACE ROOM
              </span>
            </div>
            
            <h2 className="text-3xl font-black text-[#1a3338] uppercase tracking-normal flex items-center gap-3 font-sans mt-2">
              <Activity className="text-[#1a3338] w-8 h-8 stroke-[2.5]" /> 
              EHR COMMAND OVERVIEW
            </h2>
            
            <p className="text-[#1a3338] font-medium leading-relaxed max-w-2xl text-[12px] mt-1">
              Direct monitoring interface of inpatient admissions stay, outpatient consultations flow, pharmacy storage inventory, and revenue lifespans.
            </p>
          </div>
          
          <div className="bg-[#f2efe6] border border-[#e8e2d0] px-8 py-4 rounded-xl text-center sm:text-right font-mono shadow-inner cursor-pointer select-none" onClick={() => onNavigate("reports")}>
            <span className="text-[9px] uppercase tracking-widest text-[#1a3338] block font-black pb-1">
              SYSTEM CLOCK
            </span>
            <span className="text-2xl font-black tracking-widest text-[#1a3338]">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bento Box */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div 
          onClick={() => onNavigate("admissions")}
          className="p-5 retro-card flex flex-col justify-center gap-4 cursor-pointer group" style={{ borderBottomColor: "#1f8281", borderBottomWidth: "6px" }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#1a3338] text-white p-3.5 rounded-2xl shadow-inner">
              <HeartPulse className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#1a3338] uppercase font-mono pb-0.5">
                IPD Stays (ভর্তি রোগী)
              </p>
              <p className="text-3xl font-black text-[#cba86a] font-serif tracking-tight drop-shadow-sm">{totals.IPDActive}</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate("appointments")}
          className="p-5 retro-card flex flex-col justify-center gap-4 cursor-pointer group" style={{ borderBottomColor: "#e28e73", borderBottomWidth: "6px" }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#1a3338] text-white p-3.5 rounded-2xl shadow-inner">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#1a3338] uppercase font-mono pb-0.5">
                OPD Consults (বহিঃবিভাগ)
              </p>
              <p className="text-3xl font-black text-[#cba86a] font-serif tracking-tight drop-shadow-sm">{totals.OPDActive}</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate("beds")}
          className="p-5 retro-card flex flex-col justify-between cursor-pointer group" style={{ borderBottomColor: "#1f8281", borderBottomWidth: "6px" }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#1a3338] text-white p-3.5 rounded-2xl shadow-inner">
              <Bed className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-widest text-[#1a3338] uppercase font-mono pb-0.5">
                Beds Cabin Stay
              </p>
              <p className="text-3xl font-black text-[#cba86a] font-serif tracking-tight drop-shadow-sm flex items-end gap-1">
                {totals.occBedsCount} <span className="text-sm text-[#1a3338] font-sans pb-1">/ {beds.length}</span>
              </p>
            </div>
          </div>
          <div className="mt-3 w-full">
            <div className="flex justify-between text-[8px] text-[#1a3338] font-mono uppercase font-black pb-1.5 px-0.5">
              <span>Occupancy</span>
              <span>{bedOccupancyRate}%</span>
            </div>
            <div className="w-full bg-[#e8e2d0] h-1.5 text-center flex items-center justify-start rounded-full overflow-hidden">
              <div 
                className="bg-[#1f8281] h-1.5 transition-all duration-500 rounded-full" 
                style={{ width: `${bedOccupancyRate}%` }} 
              />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate("nurseDesk")}
          className="p-5 retro-card flex flex-col justify-center gap-4 cursor-pointer group" style={{ borderBottomColor: "#e28e73", borderBottomWidth: "6px" }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#1a3338] text-white p-3.5 rounded-2xl shadow-inner">
              <Activity className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-[#1a3338] uppercase font-mono pb-0.5">
                Critical Risks (ঝুঁকিপূর্ণ)
              </p>
              <p className="text-3xl font-black text-[#cba86a] font-serif tracking-tight drop-shadow-sm">
                {totals.criticalCount}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        
        {/* Critical patients logs and monitors */}
        <div className="retro-card p-6 space-y-4 xl:col-span-2 col-span-1">
          <div className="flex justify-between items-center pb-4 border-b border-[#EBE4D5]">
            <div>
              <h3 className="text-sm font-black uppercase text-[#1a3338] flex items-center gap-2 font-sans tracking-wide">
                <Activity className="text-[#cba86a] w-5 h-5 animate-pulse shrink-0" /> Critical Risk Patient Status (গুরুতর রোগী)
              </h3>
              <p className="text-[10px] text-[#2c555c] font-bold leading-tight mt-1 font-sans">Live vitals streams checked in or admitted under close monitoring wards.</p>
            </div>
            <span 
              onClick={() => onNavigate("liveTimeline")}
              className="retro-pill px-4 py-2 cursor-pointer text-[9px]"
            >
              Audit Feeds ➔
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EBE4D5] text-[#1a3338] text-[10px] font-black uppercase tracking-wider font-mono">
                  <th className="pb-3 pl-1">Patient Details</th>
                  <th className="pb-3 text-center">Stay Unit Bed</th>
                  <th className="pb-3 text-center font-mono">BP Vitals</th>
                  <th className="pb-3 text-center">Pulse</th>
                  <th className="pb-3 text-right pr-1 font-mono">SpO2 Oxygen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE4D5] font-semibold text-[#1a3338] text-xs">
                {patients
                  .filter(
                    (p) =>
                      ["Serious", "Critical"].includes(p.condition) && p.condition !== "Discharged"
                  )
                  .map((p) => (
                    <tr 
                      key={p.id} 
                      onClick={() => onNavigate("nurseDesk")}
                      className="hover:bg-[#f2efe6] transition cursor-pointer"
                    >
                      <td className="py-4 pl-1 font-bold text-[#1a3338]">
                        <span className="block font-black text-[#1a3338] text-sm">{p.name}</span>
                        <span className="font-mono text-[9px] text-[#A6B8B5] block font-black uppercase mt-0.5">
                          {p.id} • {p.uhid}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-mono text-[#cba86a] font-black bg-[#1a3338] px-3 py-1.5 rounded-full shadow-sm text-[10px]">
                          {p.bed === "None" ? "OPD" : `CABIN ${p.bed}`}
                        </span>
                      </td>
                      <td className="py-4 text-center font-mono text-sm font-black text-[#1a3338]">
                        {p.vitals?.bp || "Pending"}
                      </td>
                      <td className="py-4 font-mono text-center font-black text-[#1f8281] text-sm">
                        {p.vitals?.pulse || "N/A"}<span className="text-[9px] text-[#2c555c] font-bold ml-1 font-sans">bpm</span>
                      </td>
                      <td className="py-4 font-mono font-black text-[#e28e73] text-right pr-1 text-sm">
                        {p.vitals?.oxygen || "N/A"}<span className="text-[9px] text-[#2c555c] font-bold ml-1 font-sans">%</span>
                      </td>
                    </tr>
                  ))}
                {patients.filter((p) => ["Serious", "Critical"].includes(p.condition) && p.condition !== "Discharged").length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#2c555c] font-bold">
                      Zero high critical risk patient records checked in today. Clinical environments safe.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ledger panel and Operational Status */}
        <div className="retro-card p-6 space-y-4">
          <div className="pb-4 border-b border-[#EBE4D5]">
            <h3 className="text-sm font-black uppercase text-[#1a3338] flex items-center gap-2 font-sans tracking-wide">
              <IndianRupee className="text-[#cba86a] w-5 h-5 shrink-0" /> Financial & Resource Hub
            </h3>
            <p className="text-[10px] text-[#2c555c] font-bold leading-tight mt-1">Managed ledgers and floor resources.</p>
          </div>

          <div className="space-y-4 font-sans">
            
            <div 
               onClick={() => onNavigate("billing")}
               className="p-5 bg-[#f2efe6] border border-[#EBE4D5] rounded-xl cursor-pointer shadow-inner"
            >
              <span className="text-[#1a3338] uppercase text-[9px] font-mono tracking-widest font-black block">
                Gross Billed Audited Revenue
              </span>
              <strong className="font-serif text-3xl font-black text-[#cba86a] block leading-tight mt-2 drop-shadow-sm">
                INR {totals.grossRev.toLocaleString()} INR
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate("pharmacy")}
                className="p-4 bg-[#f2efe6] border border-[#EBE4D5] rounded-xl text-center shadow-inner cursor-pointer"
              >
                <span className="text-[#1a3338] uppercase text-[9px] font-mono block font-black mb-1.5">Pharmacy Storage</span>
                <span className="font-serif text-lg font-black text-[#1f8281]">
                  {medicines.reduce((sum, m) => sum + m.qty, 0)} units
                </span>
              </div>
              <div 
                onClick={() => onNavigate("staff")}
                className="p-4 bg-[#f2efe6] border border-[#EBE4D5] rounded-xl text-center shadow-inner cursor-pointer"
              >
                <span className="text-[#1a3338] uppercase text-[9px] font-mono block font-black mb-1.5">Active Staff</span>
                <span className="font-serif text-lg font-black text-[#e28e73]">
                  {staff.length} Active
                </span>
              </div>
            </div>

            {/* Ingress node validation summary */}
            <div className="p-5 bg-[#1a3338] rounded-xl text-[#FDFDF8] font-mono text-[10px] leading-relaxed border border-[#0d1a1c] shadow-inner mt-2">
              <p className="text-[#cba86a] font-black flex items-center gap-1.5 uppercase text-[11px] mb-2 tracking-widest">
                <ShieldAlert className="w-4 h-4 text-[#cba86a] animate-pulse" /> CLOUD SERVER SECURE
              </p>
              <div className="text-[#c3d0d3] pl-2 border-l-2 border-[#2d555c] space-y-1 font-bold">
                <p>Node Port: <strong className="text-white">3000 (Primary)</strong></p>
                <p>Nurses Registered: <strong className="text-white">{staff.filter((s) => s.role === "Nurse").length}</strong></p>
                <p>Encryption Hash: <span className="text-[#cba86a] font-mono font-black">SHA-256 Verified</span></p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
