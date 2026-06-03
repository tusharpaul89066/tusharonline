import React from "react";
import { Activity, Pill, PackageMinus, ClipboardCheck, Signature, CheckCircle2 } from "lucide-react";

interface ClinicalWorkflowDiagramProps {
  vitalsSignature: string;
  administerMedicine: boolean;
  nurseMedicineQty: number;
  nurseNotes: string;
}

export default function ClinicalWorkflowDiagram({
  vitalsSignature,
  administerMedicine,
  nurseMedicineQty,
  nurseNotes,
}: ClinicalWorkflowDiagramProps) {
  return (
    <div id="clinical-workflow-diagram bg-emerald-50/80 border border-slate-200/80 rounded-2xl p-5 text-slate-900 space-y-4 shadow-sm select-none text-xs">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20">
            <Activity className="w-5 h-5 text-teal-700 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-teal-700 tracking-wider">
              Clinical Workflow Diagram (ক্লিনিক্যাল অপারেশনাল ফ্লো ডায়াগ্রাম)
            </h4>
            <p className="text-[10px] text-slate-9000 font-sans">
              Real-time state tracking based on active clinical checkup form entries
            </p>
          </div>
        </div>
        <span className="bg-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full text-slate-700 font-mono border border-emerald-100">
          Status: {vitalsSignature ? "Ready to Submit" : "In Progress"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 relative">
        {/* Step 1: Patient Checkup */}
        <div className="p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 bg-emerald-50/40 border-teal-500/40 shadow-sm shadow-teal-500/10 text-teal-350">
          <div className="flex justify-between items-start">
            <span className="h-6 w-6 rounded-lg bg-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center font-mono">
              1
            </span>
            <Activity className="w-4 h-4 text-teal-700" />
          </div>
          <div className="mt-1">
            <h5 className="text-[10px] uppercase font-black text-teal-800 tracking-wide leading-tight">Patient Checkup</h5>
            <div className="text-[8.5px] text-teal-700 font-mono mt-0.5 font-bold">
              BP, Pulse, SpO2 Loaded
            </div>
          </div>
        </div>

        {/* Step 2: Medicine Administration */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 ${
          administerMedicine 
            ? "bg-indigo-950/40 border-indigo-500/40 shadow-md shadow-indigo-500/5 text-indigo-300" 
            : "bg-slate-100 border-emerald-100 text-slate-405 text-slate-9000"
        }`}>
          <div className="flex justify-between items-start">
            <span className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
              administerMedicine ? "bg-indigo-500 text-slate-900" : "bg-white text-slate-9000"
            }`}>
              2
            </span>
            <Pill className={`w-4 h-4 ${administerMedicine ? "text-indigo-400 animate-bounce" : "text-slate-700"}`} />
          </div>
          <div className="mt-1">
            <h5 className={`text-[10px] uppercase font-black tracking-wide leading-tight ${administerMedicine ? "text-indigo-300" : "text-slate-9000"}`}>Medication</h5>
            <div className="text-[8.5px] font-mono mt-0.5 leading-none font-bold">
              {administerMedicine ? (
                <span className="text-indigo-400 font-extrabold">Active (প্রয়োগ হবে)</span>
              ) : (
                <span className="text-slate-9000">Skipped (অপশনাল)</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Stock Deduction */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 ${
          administerMedicine 
            ? "bg-emerald-50/50mber-900/40 border-amber-500/40 shadow-md shadow-amber-500/5 text-amber-300" 
            : "bg-slate-100 border-emerald-100 text-slate-9000"
        }`}>
          <div className="flex justify-between items-start">
            <span className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
              administerMedicine ? "bg-emerald-50/50mber-500 text-slate-900 font-extrabold" : "bg-white text-slate-9000"
            }`}>
              3
            </span>
            <PackageMinus className={`w-4 h-4 ${administerMedicine ? "text-amber-400 animate-pulse" : "text-slate-700"}`} />
          </div>
          <div className="mt-1">
            <h5 className={`text-[10px] uppercase font-black tracking-wide leading-tight ${administerMedicine ? "text-amber-300" : "text-slate-9000"}`}>Stock Deduction</h5>
            <div className="text-[8.5px] font-mono mt-0.5 leading-none truncate font-bold">
              {administerMedicine ? (
                <span className="text-amber-400">Qty: -{nurseMedicineQty} Units</span>
              ) : (
                <span className="text-slate-9000">Unchanged</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 4: Nurse Review */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 ${
          nurseNotes && nurseNotes.trim().length > 0
            ? "bg-emerald-950/40 border-emerald-500/40 shadow-md shadow-emerald-500/5 text-emerald-800" 
            : "bg-slate-100 border-emerald-100 text-slate-9000"
        }`}>
          <div className="flex justify-between items-start">
            <span className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
              nurseNotes && nurseNotes.trim().length > 0 ? "bg-white0 text-slate-950 font-black" : "bg-white text-slate-9000"
            }`}>
              4
            </span>
            <ClipboardCheck className={`w-4 h-4 ${nurseNotes && nurseNotes.trim().length > 0 ? "text-emerald-700 animate-pulse" : "text-slate-605"}`} />
          </div>
          <div className="mt-1">
            <h5 className={`text-[10px] uppercase font-black tracking-wide leading-tight ${nurseNotes && nurseNotes.trim().length > 0 ? "text-emerald-200" : "text-slate-9000"}`}>Nurse Review</h5>
            <div className="text-[8.5px] font-mono mt-0.5 leading-none truncate font-bold">
              {nurseNotes && nurseNotes.trim().length > 0 ? (
                <span className="text-emerald-700 font-bold font-mono">Review Complete</span>
              ) : (
                <span className="text-slate-9000">Needs Notes</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 5: Digital Signature */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 ${
          vitalsSignature 
            ? "bg-sky-950/40 border-sky-500/40 shadow-md shadow-sky-500/5 text-sky-300" 
            : "bg-slate-100 border-emerald-100 text-slate-9000"
        }`}>
          <div className="flex justify-between items-start">
            <span className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
              vitalsSignature ? "bg-sky-500 text-slate-950 font-extrabold" : "bg-white text-slate-9000"
            }`}>
              5
            </span>
            <Signature className={`w-4 h-4 ${vitalsSignature ? "text-sky-400" : "text-slate-700"}`} />
          </div>
          <div className="mt-1">
            <h5 className={`text-[10px] uppercase font-black tracking-wide leading-tight ${vitalsSignature ? "text-sky-300" : "text-slate-9000"}`}>Digital Sign</h5>
            <div className="text-[8.5px] font-mono mt-0.5 leading-none truncate font-bold">
              {vitalsSignature ? (
                <span className="text-sky-400 font-bold">SIGNED</span>
              ) : (
                <span className="text-slate-9000 font-bold">Awaiting Sign</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 6: Report Submit */}
        <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-28 ${
          vitalsSignature 
            ? "bg-rose-950/35 border-rose-500/50 text-rose-300 animate-pulse" 
            : "bg-slate-100 border-emerald-100 text-slate-9000"
        }`}>
          <div className="flex justify-between items-start">
            <span className={`h-6 w-6 rounded-lg font-mono font-black text-xs flex items-center justify-center ${
              vitalsSignature ? "bg-rose-500 text-slate-900 font-black" : "bg-white text-slate-9000"
            }`}>
              6
            </span>
            <CheckCircle2 className={`w-4 h-4 ${vitalsSignature ? "text-rose-400" : "text-slate-700"}`} />
          </div>
          <div className="mt-1">
            <h5 className={`text-[10px] uppercase font-black tracking-wide leading-tight ${vitalsSignature ? "text-rose-300" : "text-slate-9000"}`}>Report Submit</h5>
            <div className="text-[8.5px] font-mono mt-0.5 leading-none truncate font-bold">
              {vitalsSignature ? (
                <span className="text-rose-400 font-black">READY TO SUBMIT</span>
              ) : (
                <span className="text-slate-9000 font-bold">Pending Steps</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
