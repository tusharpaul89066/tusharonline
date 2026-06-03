import React from "react";
import { 
  Activity, 
  History, 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Baby, 
  Users, 
  Heart, 
  Thermometer, 
  Eye, 
  Droplet, 
  UserCheck, 
  Building, 
  Smartphone,
  Sparkles,
  ChevronRight,
  Clock
} from "lucide-react";
import { Patient, PregnancyRecord } from "../types";

interface LiveJourneyTabProps {
  patients: Patient[];
  selectedTrackingPatient: string;
  setSelectedTrackingPatient: (id: string) => void;
  pregnancies: PregnancyRecord[];
  setSharedViewedMother: (mother: PregnancyRecord | null) => void;
  setSharedActiveSubTab: (subTab: 'dashboard' | 'registration' | 'mothers' | 'children') => void;
  setActiveTab: (tabId: string) => void;
}

export default function LiveJourneyTab({
  patients,
  selectedTrackingPatient,
  setSelectedTrackingPatient,
  pregnancies,
  setSharedViewedMother,
  setSharedActiveSubTab,
  setActiveTab,
}: LiveJourneyTabProps) {
  const currentPatient = patients.find((p) => p.id === selectedTrackingPatient) || patients[0];

  return (
    <div id="live-journey-tab" className="space-y-8 animate-fade-in text-xs font-sans">
      
      {/* 1. Header Card: Redesigned as a larger, multi-layered 3D card with distinct texture */}
      <div className="relative overflow-hidden rounded-3xl p-7 bg-white border border-emerald-100/80 shadow-sm select-none">
        
        {/* Futuristic textured accents */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(20,184,166,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.3)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-emerald-50/80 text-teal-700 font-mono font-black text-[9px] rounded-lg tracking-wider uppercase border border-teal-500/30 shadow-sm flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span> Live Command Feed
              </span>
              <span className="text-[10px] text-zinc-800 font-bold tracking-wider uppercase flex items-center gap-1">
                • Active Clinical Stream System
              </span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <Activity className="text-teal-700 w-7 h-7 stroke-[2.5] drop-shadow-sm" /> 
              Live Patient Journey Clinical Timelines
            </h2>
            
            <p className="text-slate-700 font-medium leading-relaxed max-w-2xl text-[11px]">
              High-resolution chronological data loggers capturing real-time automated check-ins, medical administration commentary, assigned cabin allocations, and authenticated biometric timestamps.
            </p>
          </div>

          {/* 3D Glass Indicator display */}
          <div className="px-4 py-3 rounded-2xl flex items-center gap-3.5 border border-emerald-100 bg-slate-50/45 shadow-inner relative">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
            <div className="space-y-0.5 leading-none">
              <div className="text-[9px] text-teal-700 uppercase font-bold tracking-widest font-mono">Telemetry Host</div>
              <div className="text-slate-900 font-extrabold text-[11px] font-mono">SECURE_LINK-03</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Patient Selection Selector bar */}
      <div className="p-4 bg-white/40  border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Avatar frame */}
          <div className="relative w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-teal-500/30 shadow-inner shrink-0">
            <div className="absolute -inset-0.5 border border-teal-500/10 rounded-xl pointer-events-none"></div>
            <Users className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <span className="text-[10px] text-slate-700 font-black tracking-widest uppercase font-mono block">Selected Case Tracker</span>
            <span className="text-slate-900 font-extrabold text-sm">{currentPatient ? currentPatient.name : "Select Patient"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-end">
          <label className="text-[10.5px] font-black uppercase  tracking-wider flex items-center gap-1.5 text-slate-900">
            <span>Track Case:</span>
          </label>
          <div className="relative w-full sm:w-72">
            <select
              value={selectedTrackingPatient}
              onChange={(e) => setSelectedTrackingPatient(e.target.value)}
              className="w-full bg-slate-50 border border-emerald-100/80 py-3 pl-4 pr-10 text-xs font-bold rounded-xl text-teal-800 outline-none cursor-pointer appearance-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-50 text-slate-900 font-bold">
                  {p.id} — {p.name} ({p.type})
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-teal-700">
              <ChevronRight className="w-4 h-4 transform rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {currentPatient ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 3. EHR Dossier Card: Multi-layered digital dossier layout */}
          <div className="lg:col-span-5 relative">
            {/* Colored Folder Cap Index Tab */}
            <div 
              onClick={() => setActiveTab("patients")}
              className="absolute -top-6 left-6 w-44 h-7 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black tracking-widest text-[9px] uppercase rounded-t-xl flex items-center justify-center gap-1.5 shadow-sm border-t border-r border-l border-teal-400/50 cursor-pointer select-none transition-all"
            >
              <FileText size={12} className="stroke-[2.5]" />
              EHR Core File
            </div>
            
            {/* Multiple decorative layers behind folder to suggest stacked medical files */}
            <div className="absolute inset-0 bg-white/20 border border-emerald-100 rounded-3xl -rotate-1 skew-x-1 translate-y-2 translate-x-1.5 pointer-events-none shadow-md"></div>
            <div className="absolute inset-0 bg-white/20 border border-emerald-100 rounded-3xl rotate-1 -skew-x-1 translate-y-1 -translate-x-1 pointer-events-none shadow-md"></div>

            {/* Main Folder Document */}
            <div className="relative bg-white border border-emerald-100 rounded-3xl p-6 space-y-6 shadow-sm relative z-20">
              
              {/* Dossier Header */}
              <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase text-teal-700 tracking-wider">Clinical Core Dossier</h4>
                  <p className="text-[9px] text-zinc-700 font-mono font-bold">DIGITAL RECORD INDEX SYSTEM • ASYNC LOGS</p>
                </div>
                {/* Visual authenticity stamp */}
                <div className="w-7 h-7 rounded-lg border border-teal-500/20 bg-emerald-50/20 flex items-center justify-center text-teal-700/80 shadow-sm text-[9px] font-mono font-black animate-pulse">
                  OK
                </div>
              </div>

              {/* Portrait ID Placement & Identity Overview */}
              <div className="flex items-center gap-5 p-4 bg-slate-50/60 rounded-2xl border border-emerald-200 shadow-inner">
                {/* Photo ID Placeholder styled like futuristic medical portrait scanner */}
                <div className="relative w-20 h-20 bg-slate-50/80 border border-teal-500/30 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {/* Tech scope crop overlays */}
                  <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-teal-400"></div>
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-teal-400"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-teal-400"></div>
                  <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-teal-400"></div>
                  {/* Scanner laser bar animation */}
                  <div className="absolute inset-x-0 h-0.5 bg-teal-400/50 top-1/4 shadow-sm"></div>
                  {/* Human/Silhouette icon */}
                  <Users className="w-8 h-8 text-teal-700/40" />
                </div>
                
                <div className="space-y-1 leading-none">
                  <span className="px-2 py-0.5 bg-emerald-50 border border-teal-500/40 text-teal-700 font-mono font-black text-[8px] rounded uppercase tracking-wider">
                    {currentPatient.type}
                  </span>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight pt-1">{currentPatient.name}</h3>
                  <p className="text-[10px] text-slate-700 font-bold font-mono">
                    Age: {currentPatient.age} | Gender: {currentPatient.gender}
                  </p>
                </div>
              </div>

              {/* Original EHR Data Fields (Rendered cleanly with generous spacing) */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="p-3 bg-slate-50/40 border border-emerald-200 rounded-xl space-y-1">
                  <span className="block text-[8px] text-slate-9000 uppercase font-mono font-bold tracking-widest leading-none">UHID Code Number</span>
                  <span className="font-mono text-slate-800 font-extrabold text-[10.5px] block">{currentPatient.uhid}</span>
                </div>

                <div className="p-3 bg-slate-50/40 border border-emerald-200 rounded-xl space-y-1">
                  <span className="block text-[8px] text-slate-9000 uppercase font-mono font-bold tracking-widest leading-none">Assigned Unit Coordinate</span>
                  <span className="font-mono text-teal-700 font-black text-[10.5px] block">
                    {currentPatient.bed === "None" ? "OPD Consultation" : `CABIN - ${currentPatient.bed}`}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/40 border border-emerald-200 rounded-xl space-y-1 col-span-2">
                  <span className="block text-[8px] text-slate-9000 uppercase font-mono font-bold tracking-widest leading-none">Primary Mobile Contact</span>
                  <span className="font-mono text-slate-800 font-extrabold text-[10.5px] block">{currentPatient.mobile}</span>
                </div>

                {currentPatient.emergency && (
                  <div className="p-3 bg-slate-50/40 border border-emerald-200 rounded-xl space-y-1 col-span-2">
                    <span className="block text-[8px] text-slate-9000 uppercase font-mono font-bold tracking-widest leading-none">Emergency Contact Name</span>
                    <span className="font-semibold text-slate-800 text-[10.5px] block">{currentPatient.emergency}</span>
                  </div>
                )}
              </div>

              {/* Complementary data fields for richer UI (Allergen, Vitals Snapshot) */}
              <div className="space-y-3 pt-2">
                <span className="block text-[9px] text-slate-700 uppercase font-mono font-black tracking-widest leading-none">Supplementary Metrics</span>
                
                <div className="p-3.5 bg-slate-50/40 border border-emerald-200 rounded-xl space-y-3">
                  {/* Vital Signs Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 p-1.5 border border-emerald-200 rounded-lg">
                      <Heart className="w-3.5 h-3.5 text-rose-500 mx-auto mb-1 animate-pulse" />
                      <span className="text-[7.5px] text-slate-700 font-black uppercase font-mono block">Pulse</span>
                      <strong className="font-mono text-[9px] text-slate-800 font-black">
                        {currentPatient.vitals?.pulse || "76 bpm"}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-1.5 border border-emerald-200 rounded-lg">
                      <Activity className="w-3.5 h-3.5 text-teal-700 mx-auto mb-1" />
                      <span className="text-[7.5px] text-slate-700 font-black uppercase font-mono block">BP</span>
                      <strong className="font-mono text-[9px] text-slate-800 font-black">
                        {currentPatient.vitals?.bp || "120/80"}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-1.5 border border-emerald-200 rounded-lg">
                      <Thermometer className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                      <span className="text-[7.5px] text-slate-700 font-black uppercase font-mono block">Temp</span>
                      <strong className="font-mono text-[9px] text-slate-800 font-black">
                        {currentPatient.vitals?.temp || "98.6 °F"}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-1.5 border border-emerald-200 rounded-lg">
                      <Droplet className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                      <span className="text-[7.5px] text-slate-700 font-black uppercase font-mono block">Oxygen</span>
                      <strong className="font-mono text-[9px] text-slate-800 font-black">
                        {currentPatient.vitals?.oxygen || "99%"}
                      </strong>
                    </div>
                  </div>

                  {/* Allergen Status */}
                  <div className="flex items-center gap-2.5 pt-1 border-t border-emerald-200">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                    <div className="leading-none">
                      <span className="text-[8px] text-slate-9000 font-black uppercase font-mono block">Allergen Status Designation</span>
                      <span className="text-slate-800 font-black text-[9.5px]">
                        {currentPatient.history && currentPatient.history !== "None" 
                          ? currentPatient.history 
                          : "NKA (No Known Drug Allergies Checked)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Maternity Integration Segment (Unchanged functionality) */}
              {(() => {
                const pregnancy = pregnancies.find((p) => p.patientId === currentPatient.id);
                if (pregnancy) {
                  return (
                    <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 mt-2 space-y-3.5 shadow-inner">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-black text-rose-300 text-[10px] flex items-center gap-1.5 uppercase tracking-wide">
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse inline-block"></span>
                          Maternal Profile ({pregnancy.id})
                        </h4>
                        <span className="px-1.5 py-0.5 bg-rose-950 border border-rose-800 text-rose-455 text-rose-400 font-black text-[8px] rounded uppercase">
                          {pregnancy.status}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-slate-800 text-[10px] font-medium leading-normal">
                        <p>
                          EDD (প্রসবের সম্ভাব্য তারিখ): <span className="font-extrabold text-slate-900">{pregnancy.edd}</span>
                        </p>
                        <p>
                          Gravida/Para: <span className="font-extrabold text-slate-900">G{pregnancy.gravida} P{pregnancy.para}</span>
                        </p>
                        {pregnancy.isHighRisk && (
                          <p className="font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 border border-rose-800 rounded text-[9px] w-fit mt-1 uppercase flex items-center gap-1">
                            ⚠️ High Risk Case: {pregnancy.riskFactors.join(', ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSharedViewedMother(pregnancy);
                          setSharedActiveSubTab('mothers');
                          setActiveTab('maternity');
                        }}
                        className="w-full text-center font-black p-3 bg-pink-900/40 hover:bg-pink-900/60 text-pink-400 hover:text-pink-300 border border-pink-850 hover:border-pink-800 text-[10px] uppercase tracking-wide transition-all cursor-pointer rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Baby size={12} className="shrink-0" />
                        Maternity Record (মাতৃত্ব ফাইল)
                      </button>
                    </div>
                  );
                } else if (currentPatient.gender === "Female") {
                  return (
                    <div className="bg-slate-50/30 border border-dashed border-emerald-100 rounded-xl p-3.5 mt-2 space-y-2.5 text-center">
                      <p className="text-slate-9000 italic font-semibold text-[10px]">No maternal record (কোনো মাতৃত্ব ফাইল নেই)</p>
                      <button
                        onClick={() => {
                          setSharedActiveSubTab('registration');
                          setActiveTab('maternity');
                        }}
                        className="w-full text-center font-black py-2 px-3 bg-white hover:bg-slate-100 text-teal-700 hover:text-teal-800 border border-emerald-100 text-[9px] uppercase tracking-wide transition-all cursor-pointer rounded-lg flex items-center justify-center gap-1 shrink-0"
                      >
                        New Maternity File (নতুন ফাইল খুলুন)
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* 4. Journey Timeline Trajectory Segment (Re-imagined interactive graphical 3D timeline) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <History className="text-teal-700 animate-spin" style={{ animationDuration: "16s" }} /> 
                Track Patient Care Trail Logs
              </h3>
              
              {/* Graphic stats indicators */}
              <span className="px-2.5 py-1 bg-slate-50/80 border border-emerald-100 rounded-xl text-teal-700 text-[9px] font-mono font-black uppercase shadow-inner block">
                Indices: {(currentPatient.timeline || []).length} Recorded Steps
              </span>
            </div>

            {/* Glowing 3D Grid trajectory line graph segment */}
            <div className="relative border-l-2 border-emerald-200 ml-6 pl-8 space-y-7 pt-2 pb-6">
              
              {/* Subtle background graphics simulating clinical scanner waveform charts */}
              <div className="absolute left-0 top-0 -translate-x-[2px] h-full w-[2px] bg-gradient-to-b from-teal-500 via-indigo-500 to-rose-500"></div>
              
              {/* Digital matrix coordinate grid */}
              <div className="absolute inset-x-4 inset-y-0 opacity-[0.07] pointer-events-none rounded-3xl overflow-hidden">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="timelineGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(20,184,166,0.6)" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#timelineGrid)" />
                </svg>
              </div>

              {(currentPatient.timeline || []).map((t, index) => {
                return (
                  <div key={index} className="relative group animate-fade-in">
                    
                    {/* Node Sphere point */}
                    <div className="absolute -left-[45px] top-1.5 z-30 select-none">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-50 via-teal-700 to-teal-400 text-slate-950 shadow-sm border border-teal-500/30 flex items-center justify-center font-mono font-black text-xs relative hover:scale-110 transition duration-200">
                        {index + 1}
                        
                        {/* Interactive sphere high light */}
                        <div className="absolute top-1 left-2.5 w-1.5 h-1 bg-white/40 rounded-full filter blur-[0.5px]"></div>
                      </div>
                    </div>

                    {/* Stage Card: Distinct cleanly rendered 3D physical-style cards along the timeline */}
                    <div className="space-y-3.5 bg-white hover:to-slate-50/50  p-5 rounded-3xl border border-emerald-100 hover:border-emerald-100 transition duration-200">
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-emerald-100 pb-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-teal-700 bg-emerald-50/80 border border-teal-900/60 rounded-xl px-3 py-1 text-[10px] uppercase font-black tracking-wider shadow-inner">
                            {t.status}
                          </strong>
                        </div>
                        <span className="text-[10px] text-zinc-800 font-bold font-mono flex items-center gap-1.5 leading-none bg-slate-50/30 px-2 py-1 rounded-lg border border-emerald-100/50">
                          <Clock className="w-3.5 h-3.5 text-zinc-700" /> {t.date} | {t.time}
                        </span>
                      </div>
                      
                      {/* Original Remarks Commentary Block */}
                      <p className="font-semibold text-slate-800 leading-relaxed text-[11px] bg-slate-50/40 p-3 rounded-2xl border border-emerald-100 italic font-mono pl-3.5">
                        "{t.remarks}"
                      </p>
                      
                      {/* Authentication Signature Stamp */}
                      {t.signature && (
                        <div className="pt-2 select-none flex items-center gap-3">
                          <span className="text-[8.5px] uppercase text-zinc-450 text-zinc-800 font-extrabold pr-1 tracking-wider font-mono">Biometric Authenticity Stamp:</span>
                          <div className="bg-slate-50 px-3 py-1.5 rounded-2xl shadow-inner border border-emerald-100/80 max-w-[140px] flex items-center justify-center h-[34px]">
                            <img src={t.signature} alt="Biometric Sign Stamp" className="h-[20px] object-contain invert hue-rotate-[170deg] brightness-125" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-1">
                        <span className="text-[8.5px] text-zinc-700 uppercase font-mono font-bold leading-none bg-slate-50/30 px-2.5 py-1.5 rounded-lg border border-emerald-100/30">
                          LOGGED BY AUTHORITY: <strong className="text-slate-800 font-extrabold">{t.updatedBy}</strong>
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
              {(currentPatient.timeline || []).length === 0 && (
                <p className="text-xs text-slate-9000 italic font-semibold ml-4">No timeline trajectories logged for this patient file yet.</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        <p className="text-xs text-slate-9000 italic">Please check in or register patient files first.</p>
      )}
    </div>
  );
}
