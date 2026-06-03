import React, { useState } from "react";
import { 
  User, 
  Activity, 
  SquareActivity, 
  Heart, 
  Thermometer, 
  Droplet, 
  Clock, 
  ChevronRight, 
  History, 
  Sparkles,
  FileText,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Patient, Doctor } from "../types";

interface DoctorAppModuleTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  currentUser: any;
}

export default function DoctorAppModuleTab({
  patients,
  setPatients,
  doctors,
  pushTimelineEvent,
  currentUser,
}: DoctorAppModuleTabProps) {
  
  const activePatients = patients.filter((p) => p.condition !== "Discharged");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    return activePatients.length > 0 ? activePatients[0].id : (patients[0]?.id || "");
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handlePrescribeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const pId = elements.pId.value;
    const docIncharge = elements.docIncharge.value;
    const diag = elements.diag.value;
    const presc = elements.presc.value;
    const sig = elements.signature.value;
    const advice = elements.advice.value;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          const original = p.history || "";
          return {
            ...p,
            history: `${original}. Diagnosis: ${diag}. Prescriptions: ${presc}. Advice: ${advice}.`,
            timeline: [
              ...(p.timeline || []),
              {
                status: "Doctor Visit",
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                updatedBy: `${docIncharge}`,
                remarks: `Diagnosis of: ${diag}. Prescribed: ${presc}. Advice: ${advice}. Digitally signed: ${sig}`,
              },
            ],
          };
        }
        return p;
      })
    );

    alert(`Prescription for ${selectedPatient?.name || "Patient"} submitted successfully & synchronized with Live Timeline!`);
    form.reset();
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs text-slate-900 font-semibold">
      
      {/* 1. Module Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm select-none">
        <span className="bg-indigo-50 text-indigo-805 px-3 py-1 rounded-full text-[9px] font-black uppercase font-mono tracking-widest border border-indigo-200">
          Physician Clinical & Consultation Chambers
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-2 uppercase flex items-center gap-2 font-sans leading-none">
          <SquareActivity className="text-indigo-600 w-5 h-5 animate-pulse" /> 
          Physician Prescription desk with Live Patient Journey Link
        </h2>
        <p className="text-[11px] text-slate-600 font-medium mt-1">
          Prescribe medicines, record clinical diagnostics, and seamlessly track real-time patient vitals & logged trajectories in the integrated Live Journey monitor panel.
        </p>
      </div>

      {/* 2. Side-By-Side Integrated Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Prescription Form Panel */}
        <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-emerald-50 pb-3 flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-slate-800 uppercase tracking-widest">
              Consultation Form
            </span>
            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
              Chamber Live
            </span>
          </div>

          <form onSubmit={handlePrescribeSubmit} className="space-y-4 text-slate-800">
            
            {/* Patient Select */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                Select Active Patient Consultation (রোগী নির্বাচন)
              </label>
              <select
                name="pId"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-500 outline-none font-bold text-black bg-slate-50/50"
              >
                {patients.length === 0 ? (
                  <option value="">No registered patients</option>
                ) : (
                  patients
                    .filter((p) => p.condition !== "Discharged")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.name} ({p.type})
                      </option>
                    ))
                )}
              </select>
            </div>

            {/* Attending Doctor Select */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                Attending Specialist Doctor
              </label>
              <select
                name="docIncharge"
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-500 outline-none font-bold text-black bg-slate-50/50"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={`Dr. ${d.name} (${d.spec})`}>
                    Dr. {d.name} ({d.spec})
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosed Codes */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                Diagnosed Disease / Clinical Codes (রোগের নাম/কোড)
              </label>
              <input
                name="diag"
                required
                type="text"
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 font-bold text-black bg-slate-50/50"
                placeholder="e.g. Chronic Hypertension, Acute Gastritis"
              />
            </div>

            {/* Prescriptions */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                Prescribed Medicines & Dose Trajectory (প্রেসক্রিপশন)
              </label>
              <textarea
                name="presc"
                required
                rows={3}
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 font-bold text-black bg-slate-50/50"
                placeholder="e.g. Tab Napa Extend 665mg - 1+0+1 (After food) for 5 days"
              />
            </div>

            {/* Digital Signature */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                Physician Digital Signature Code
              </label>
              <input
                name="signature"
                required
                type="text"
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 outline-none font-mono font-bold tracking-wider focus:ring-2 focus:ring-teal-400 focus:border-teal-500 text-black bg-slate-50/50"
                placeholder="Type physician signature name"
              />
            </div>

            {/* Medical Advice */}
            <div className="space-y-1">
              <label className="block font-black text-slate-900 text-[10px] uppercase tracking-wider">
                General Advice & Follow up instructions
              </label>
              <textarea
                name="advice"
                rows={2}
                className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 font-bold text-black bg-slate-50/50"
                placeholder="Check BP daily, restrict excessive sodium/oil..."
              />
            </div>

            <button
              type="submit"
              disabled={patients.length === 0}
              className="w-full button-3d-teal text-white font-black py-3.5 rounded-xl uppercase tracking-wider text-[11px] btn-action-blue"
            >
              Authorize & Log Visit (প্রেসক্রিপশন সাবমিট করুন)
            </button>
          </form>
        </div>

        {/* Right Side: Linked Live Patient Journey Panel */}
        <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm space-y-5 relative">
          
          {/* Subtle connecting graphics */}
          <div className="absolute -left-3 top-20 text-slate-200 hidden lg:block animate-pulse">
            <ArrowRight className="w-6 h-6 text-teal-400" />
          </div>

          <div className="border-b border-emerald-50 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-emerald-800 uppercase tracking-widest">
                Linked Live Journey Monitor (রোগীর সরাসরি লাইভ রেকর্ড)
              </span>
            </div>
            {selectedPatient && (
              <span className="text-[9px] font-mono bg-zinc-900 text-emerald-400 px-2 py-0.5 rounded font-black">
                FEED: CONNECTED ({selectedPatient.id})
              </span>
            )}
          </div>

          {selectedPatient ? (
            <div className="space-y-5 animate-fade-in">
              {/* Linked Patient Demographics Card */}
              <div className="p-4 bg-teal-50/40 border border-teal-100 rounded-xl space-y-2 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-[0.05] bg-[size:10px_10px]">
                  <FileText className="w-12 h-12 text-teal-700" />
                </div>
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[8.5px] uppercase font-mono tracking-widest bg-emerald-100 text-teal-800 px-2 py-0.5 rounded font-black">
                      {selectedPatient.type}
                    </span>
                    <h3 className="text-base font-black text-slate-900 uppercase mt-1.5 leading-none">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-bold font-mono mt-1">
                      UHID: {selectedPatient.uhid} | Age: {selectedPatient.age} | Gender: {selectedPatient.gender} | Blood: {selectedPatient.blood}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[8.5px] text-slate-500 font-bold block uppercase">Assigned Placement</span>
                    <strong className="text-xs text-indigo-700 block font-mono">
                      {selectedPatient.bed === "None" ? "OPD Consultation room" : `CABIN ${selectedPatient.bed}`}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-teal-50 text-center">
                    <span className="text-[7.5px] font-black text-slate-500 uppercase font-mono block">Pulse</span>
                    <strong className="font-mono text-xs text-rose-600 font-extrabold">
                      {selectedPatient.vitals?.pulse || "76 bpm"}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-teal-50 text-center">
                    <span className="text-[7.5px] font-black text-slate-500 uppercase font-mono block">BP (রক্তচাপ)</span>
                    <strong className="font-mono text-xs text-emerald-700 font-extrabold">
                      {selectedPatient.vitals?.bp || "120/80"}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-teal-50 text-center">
                    <span className="text-[7.5px] font-black text-slate-500 uppercase font-mono block">Temp</span>
                    <strong className="font-mono text-xs text-amber-600 font-extrabold">
                      {selectedPatient.vitals?.temp || "98.6 °F"}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-teal-50 text-center">
                    <span className="text-[7.5px] font-black text-slate-500 uppercase font-mono block">Oxygen (SPO2)</span>
                    <strong className="font-mono text-xs text-indigo-600 font-extrabold">
                      {selectedPatient.vitals?.oxygen || "99%"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Linked Chronological Care logs */}
              <div className="space-y-3">
                <h4 className="text-[9.5px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5 font-mono">
                  <History className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: "12s" }} />
                  Automated Trajectory Log updates (চিকিৎসা ইতিহাস ও লাইভ টাইমলাইন)
                </h4>

                <div className="relative border-l border-emerald-100 ml-2 pl-4 space-y-3 max-h-72 overflow-y-auto custom-scrollbar pt-1.5 pb-2">
                  
                  {(selectedPatient.timeline || []).map((t, index) => (
                    <div key={index} className="relative group animate-fade-in pl-1">
                      {/* Circle dot marker */}
                      <span className="absolute -left-[20.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 ring-2 ring-teal-50 shadow-sm" />
                      
                      <div className="bg-slate-50/50 group-hover:bg-teal-50/10 border border-slate-200 p-3 rounded-xl transition duration-150 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-semibold">
                          <span className="text-teal-850 font-black tracking-wider uppercase bg-teal-100 px-1.5 py-0.5 rounded leading-none">
                            {t.status}
                          </span>
                          <span className="text-slate-500 font-mono text-[8.5px] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {t.date} @ {t.time}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-slate-800 leading-normal font-medium pl-1.5 border-l border-teal-300 italic">
                          "{t.remarks}"
                        </p>

                        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                          <span className="text-[7.5px] text-slate-400 uppercase font-mono">
                            Authority
                          </span>
                          <span className="text-[8.5px] text-slate-700 uppercase font-mono font-bold">
                            {t.updatedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!selectedPatient.timeline || selectedPatient.timeline.length === 0) && (
                    <div className="p-4 border border-dashed border-emerald-100/80 bg-emerald-50/30 rounded-xl text-center text-slate-500 italic">
                      No active logs registered for this patient history file yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-10 border border-dashed border-slate-200 text-center text-slate-500 italic rounded-2xl">
              Select or register a valid patient consult coordinate to render link state telemetry parameters.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
