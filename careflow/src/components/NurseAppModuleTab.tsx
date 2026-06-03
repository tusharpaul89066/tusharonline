import React, { useState } from "react";
import { NotepadText, HeartPulse, Pill, FileText, Search, ShieldCheck, HelpCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { Patient, Medicine, Bill } from "../types";
import DigitalSignaturePad from "./DigitalSignaturePad";
import ClinicalWorkflowDiagram from "./ClinicalWorkflowDiagram";

interface NurseAppModuleTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  currentUser: any;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string, signature?: string | null) => void;
  restoreMedicineDispensation: (patientId: string, timelineEventIndex: number) => void;
}

export default function NurseAppModuleTab({
  patients,
  setPatients,
  medicines,
  setMedicines,
  bills,
  setBills,
  currentUser,
  pushTimelineEvent,
  restoreMedicineDispensation,
}: NurseAppModuleTabProps) {
  const activePatients = patients.filter((p) => p.condition !== "Discharged");
  const [selectedPatientId, setSelectedPatientId] = useState(activePatients[0]?.id || "");
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || activePatients[0];

  const [administerMedicine, setAdministerMedicine] = useState(false);
  const [nurseSelectedMedicine, setNurseSelectedMedicine] = useState("");
  const [nurseMedicineQty, setNurseMedicineQty] = useState(1);
  const [nurseMedicineSearch, setNurseMedicineSearch] = useState("");
  const [vitalsSignature, setVitalsSignature] = useState("");
  const [nurseNotes, setNurseNotes] = useState("");

  const filteredDrugs = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(nurseMedicineSearch.toLowerCase()) ||
      m.batch.toLowerCase().includes(nurseMedicineSearch.toLowerCase())
  );

  const handleAssessmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPatient) return;

    if (!vitalsSignature) {
      alert("ভুল সংশোধন বার্তা: সম্পূর্ণ নার্স চেকআপ সম্পন্ন করার জন্য নার্স ডিজিটাল স্বাক্ষর আবশ্যক!\n(Nurse Signature is mandatory!)");
      return;
    }

    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const bpVal = elements.bp.value || currentPatient.vitals?.bp || "120/80";
    const pulseVal = elements.pulse.value || currentPatient.vitals?.pulse || "72";
    const tempVal = elements.temp.value || currentPatient.vitals?.temp || "98.4";
    const oxygenVal = elements.oxygen.value || currentPatient.vitals?.oxygen || "98";
    const weightVal = elements.weight.value || currentPatient.vitals?.weight || "70";
    const condVal = elements.pCond.value;
    const painVal = elements.pain.value;
    const notesVal = elements.notes.value.trim() || "Regular rest";

    let medDetailsStr = "";

    if (administerMedicine) {
      const activeDrugName = nurseSelectedMedicine || filteredDrugs[0]?.name || "";
      const drugInStock = medicines.find((m) => m.name === activeDrugName);

      if (!drugInStock) {
        alert("Clinical exception: Selected medicine is out-of-file in the catalog.");
        return;
      }
      if (drugInStock.qty <= 0) {
        alert(`Pharmacy Out-of-Stock: ${activeDrugName} is completely empty!`);
        return;
      }
      if (nurseMedicineQty > drugInStock.qty) {
        alert(`Insufficient Stock Alert!\nRequested: ${nurseMedicineQty} Units\nAvailable: ${drugInStock.qty} Units`);
        return;
      }

      // Deduct stock globally
      setMedicines((prev) =>
        prev.map((m) =>
          m.name === activeDrugName ? { ...m, qty: m.qty - nurseMedicineQty } : m
        )
      );

      medDetailsStr = ` • Prescribed/Dispensed: ${activeDrugName} (${nurseMedicineQty} Units, Batch: ${drugInStock.batch})`;

      // Adding cost lines to billing invoice
      const patientBill = bills.find((b) => b.patientId === currentPatient.id && !b.isDischarged);
      if (patientBill) {
        const costAmount = drugInStock.price * nurseMedicineQty;
        setBills((prev) =>
          prev.map((b) => {
            if (b.invoice === patientBill.invoice) {
              const updatedMedicines = [
                ...(b.dispensedMedicines || []),
                {
                  id: Date.now(),
                  type: "med",
                  name: activeDrugName,
                  qty: nurseMedicineQty,
                  unitPrice: drugInStock.price,
                  selectType: "Medicine Fee (ওষুধ ফি)",
                },
              ];
              const updatedMedTotal = (b.breakdown?.med || 0) + costAmount;
              const updatedBreakdown = { ...b.breakdown, med: updatedMedTotal };
              const currentSub = 
                (b.breakdown?.bed || 0) +
                (b.breakdown?.doc || 0) +
                (b.breakdown?.ot || 0) +
                (b.breakdown?.test || 0) +
                updatedMedTotal +
                500;
              const discAmount = currentSub * (10 / 100);
              const gstAmount = (currentSub - discAmount) * (5 / 100);

              return {
                ...b,
                dispensedMedicines: updatedMedicines,
                breakdown: updatedBreakdown,
                total: Math.round(currentSub - discAmount + gstAmount),
              };
            }
            return b;
          })
        );
      }
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === currentPatient.id) {
          const formattedLog = `Nursing checkoff Assessment Vitals => BP: ${bpVal}, Pulse: ${pulseVal} bpm, Temp: ${tempVal}°F, SpO2: ${oxygenVal}%, Weight: ${weightVal} kg. pain level: ${painVal}/10. Status: ${condVal}.${medDetailsStr}. Service notes: ${notesVal}`;
          return {
            ...p,
            condition: condVal,
            vitals: {
              bp: bpVal,
              pulse: pulseVal,
              temp: tempVal,
              oxygen: oxygenVal,
              weight: weightVal,
              pain: painVal,
            },
            timeline: [
              ...(p.timeline || []),
              {
                status: "Nurse Checkup Signed",
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                updatedBy: `${currentUser?.name || "Shift Nursing Officer"}`,
                remarks: formattedLog,
                signature: vitalsSignature,
                dispensation: administerMedicine
                  ? {
                      medicineName: nurseSelectedMedicine || filteredDrugs[0]?.name || "",
                      qty: nurseMedicineQty,
                      price: medicines.find(m => m.name === (nurseSelectedMedicine || filteredDrugs[0]?.name))?.price || 0,
                      billInvoice: bills.find(b => b.patientId === currentPatient.id && !b.isDischarged)?.invoice || null,
                      isRestored: false,
                    }
                  : null,
              },
            ],
          };
        }
        return p;
      })
    );

    alert("সম্পূর্ণ নার্স চেকআপ ও স্বাক্ষর সফলভাবে রেকর্ড করা হয়েছে!\n(Complete Nurse Checkup and Digital Signature saved successfully!)");
    setVitalsSignature("");
    setNurseMedicineQty(1);
    setAdministerMedicine(false);
    setNurseNotes("");
    form.reset();
  };

  return (
    <div id="nurse-app-module-tab" className="space-y-6 animate-fade-in font-semibold text-slate-900 text-xs">
      
      {/* Visual Ingress banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-2xl text-slate-950 shadow-md flex flex-wrap justify-between items-center gap-4 select-none">
        <div>
          <span className="bg-emerald-50/80 border border-slate-200/80 text-teal-700 px-3 py-1 rounded-full text-[9px] font-black uppercase font-mono tracking-widest whitespace-nowrap">
            Attending Nurse Desk console
          </span>
          <h2 className="text-xl font-black text-slate-950 mt-1 uppercase flex items-center gap-1.5 font-sans leading-none pb-0.5">
            <NotepadText className="text-slate-950 w-5 h-5 animate-pulse" />
            Nurse Care & Checker Desk (নার্স কেয়ার ও চেকআপ ডেস্ক)
          </h2>
          <p className="text-xs text-slate-900 font-medium font-sans">
            Assess staying patient vitals, administer medicines from pharmacy balances, and complete digital consent stamps.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-100 p-2.5 rounded-xl">
          <span className="text-xs font-black uppercase text-slate-950">Active Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setAdministerMedicine(false);
              setNurseNotes("");
              setVitalsSignature("");
            }}
            className="border-2 border-teal-600 p-2 text-xs rounded-xl font-black bg-white text-slate-900 outline-none w-60 shadow-sm"
          >
            {activePatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name} ({p.bed === "None" ? "OPD" : p.bed})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPatient ? (
        <div className="space-y-6 animate-fade-in">
          {/* Diagrams step trace */}
          <ClinicalWorkflowDiagram
            vitalsSignature={vitalsSignature}
            administerMedicine={administerMedicine}
            nurseMedicineQty={nurseMedicineQty}
            nurseNotes={nurseNotes}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-normal text-slate-705">
            {/* Timeline column */}
            <div className="lg:col-span-5 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-5 h-full flex flex-col justify-between">
              <div>
                <div className="border-b pb-3.5 flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-9000">Demographics Case file</span>
                    <h3 className="text-base font-black text-slate-950 leading-none mt-1">{currentPatient.name}</h3>
                    <p className="font-mono text-[10px] text-zinc-800 mt-1 leading-none">
                      UHID ID: {currentPatient.uhid} • {currentPatient.age} Yrs ({currentPatient.gender})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full border border-teal-300 bg-emerald-100/40 text-teal-200 text-[9px] font-black uppercase">
                    {currentPatient.condition}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-b text-center text-xs">
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-slate-405 text-slate-9000 block text-[9px] font-bold uppercase leading-none mb-1">Blood Press.</span>
                    <strong className="font-mono font-black text-slate-900">{currentPatient.vitals?.bp || "N/A"}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-slate-9000 block text-[9px] font-bold uppercase leading-none mb-1">Pulse Rate</span>
                    <strong className="font-mono font-black text-teal-800">{currentPatient.vitals?.pulse || "N/A"} bpm</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-slate-9000 block text-[9px] font-bold uppercase leading-none mb-1">SpO2 Oxygen</span>
                    <strong className="font-mono font-black text-indigo-700">{currentPatient.vitals?.oxygen || "N/A"}%</strong>
                  </div>
                </div>

                {/* Sub logs with accidental reversals */}
                <div className="pt-4 space-y-3.5">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5 leading-none">
                    <span className="flex h-2 w-2 rounded-full bg-white0 animate-pulse"></span>
                    Patient Trajectory timeline (হিস্ট্রি লগ)
                  </h4>

                  <div className="relative border-l border-emerald-100 ml-3 pl-4 pt-1 max-h-[350px] overflow-y-auto custom-scrollbar space-y-4">
                    {(currentPatient.timeline || [])
                      .slice()
                      .reverse()
                      .map((t, idx, arr) => {
                        const originalIndex = arr.length - 1 - idx;
                        return (
                          <div key={idx} className="relative space-y-1.5">
                            <span className="absolute -left-[24px] top-0.5 bg-white text-teal-700 border border-teal-400 rounded-full h-3 w-3 flex items-center justify-center font-mono font-black text-[7px]" />
                            
                            <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl p-3 rounded-xl space-y-1 hover:bg-emerald-50/80 transition">
                              <div className="flex justify-between items-center bg-transparent gap-1">
                                <strong className="text-slate-950 uppercase font-mono text-[9px]">{t.status}</strong>
                                <span className="text-[8.5px] text-slate-9000 font-mono leading-none">{t.date} | {t.time}</span>
                              </div>
                              <p className="text-slate-800 text-[10px] leading-relaxed italic pr-1">
                                "{t.remarks}"
                              </p>
                              {t.signature && (
                                <div className="flex items-center gap-1 my-1">
                                  <span className="text-[8px] text-slate-9000 uppercase font-bold">Sign-Stamp:</span>
                                  <div className="bg-white p-0.5 rounded border border-slate-150 shadow-sm max-w-[120px]">
                                    <img src={t.signature} alt="Sign validation" className="h-[20px] object-contain" />
                                  </div>
                                </div>
                              )}
                              
                              {/* Medicine dispensation reversal pad */}
                              {t.dispensation && (
                                <div className="mt-2 text-[10px] p-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between gap-1 animate-none font-sans select-none">
                                  <div className="flex items-center gap-1 font-bold text-rose-950">
                                    <Pill className="w-3 h-3 text-rose-600 animate-pulse shrink-0" />
                                    <span className="truncate max-w-[130px] font-bold text-[9.5px]">
                                      {t.dispensation.medicineName} ({t.dispensation.qty} Units)
                                    </span>
                                  </div>
                                  {t.dispensation.isRestored ? (
                                    <span className="text-red-700 font-black text-[8px] uppercase tracking-wider bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-lg select-none">
                                      Restored (বাতিল রিস্টোর)
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`ভুল সংশোধন সতর্কবার্তা: আপনি কি নিশ্চিত যে ${t.dispensation?.medicineName} ওষধ প্রয়োগটি বাতিল করতে চান?`)) {
                                          restoreMedicineDispensation(currentPatient.id, originalIndex);
                                        }
                                      }}
                                      className="bg-rose-600 hover:bg-rose-700 text-slate-900 font-black uppercase text-[8.5px] tracking-wide px-2 py-1 rounded border-none shadow-sm cursor-pointer flex items-center gap-0.5 transition"
                                    >
                                      <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                                      <span>Cancel Dispensation</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment form column */}
            <div className="lg:col-span-7 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-6 shadow-sm space-y-5">
              <div className="border-b pb-3 flex justify-between items-center bg-transparent">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <HeartPulse className="text-teal-800 w-4 h-4" /> Record Clinical Vitals
                  </h3>
                  <p className="text-[10px] text-slate-9000">Fill up staying patient metrics checkoff card, assign signature, and record database.</p>
                </div>
              </div>

              <form onSubmit={handleAssessmentSubmit} className="space-y-4 font-semibold text-slate-800 text-xs">
                {/* 1. Vitals */}
                <div className="bg-white p-4 rounded-xl border grid grid-cols-2 gap-3.5">
                  <div className="col-span-2 border-b pb-1 font-bold">
                    <h4 className="text-[10.5px] font-black uppercase text-teal-850 flex items-center gap-1 leading-none pl-0.5">
                      1. Registries Vitals (ভাইটাল প্যারামিটার)
                    </h4>
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Blood Pressure BP (mmHg)</label>
                    <input
                      name="bp"
                      type="text"
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white"
                      placeholder="e.g. 120/80"
                      defaultValue={currentPatient.vitals?.bp || ""}
                    />
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Pulse Rate (bpm)</label>
                    <input
                      name="pulse"
                      type="number"
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white"
                      placeholder="e.g. 72"
                      defaultValue={currentPatient.vitals?.pulse || ""}
                    />
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Temperature (°F)</label>
                    <input
                      name="temp"
                      type="text"
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white"
                      placeholder="e.g. 98.4"
                      defaultValue={currentPatient.vitals?.temp || ""}
                    />
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Oxygen SpO2 (%)</label>
                    <input
                      name="oxygen"
                      type="number"
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white"
                      placeholder="e.g. 98"
                      defaultValue={currentPatient.vitals?.oxygen || ""}
                    />
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Scale weight (KG)</label>
                    <input
                      name="weight"
                      type="number"
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white"
                      placeholder="e.g. 70"
                      defaultValue={currentPatient.vitals?.weight || ""}
                    />
                  </div>
                  <div>
                    <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Stay Condition</label>
                    <select
                      name="pCond"
                      defaultValue={currentPatient.condition}
                      className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl  outline-none focus:border-teal-500 font-bold text-black  placeholder:font-semibold bg-white"
                    >
                      <option value="Stable">Stable Support (স্থিতিশীল)</option>
                      <option value="Observation">Under Shift Observation (পর্যবেক্ষণে)</option>
                      <option value="Serious">Serious Condition Log (গুরুতর)</option>
                      <option value="Critical">Critical Clinical Risk (ঝুঁকিপূর্ণ)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block  mb-1 font-bold text-slate-900 text-sm">Pain Rating Scale (1 - Minimal, 10 - Severe)</label>
                    <div className="flex items-center gap-3 bg-white p-2 border border-slate-250 rounded-xl font-mono">
                      <input
                        name="pain"
                        type="range"
                        min="1"
                        max="10"
                        className="w-full accent-teal-500 cursor-pointer h-2  rounded-lg outline-none text-black font-bold  placeholder:font-semibold bg-white border border-slate-300"
                        defaultValue={currentPatient.vitals?.pain || "1"}
                      />
                      <span className="font-mono font-black text-slate-900 bg-emerald-100/40 px-2 py-0.5 rounded text-xs shrink-0 select-none">
                        Scale 1-10
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Pharmacy drug dispenser */}
                <div className="bg-white p-4 rounded-xl border space-y-3.5">
                  <div className="flex justify-between items-center border-b pb-1 mb-2 font-bold">
                    <h4 className="text-[10.5px] font-black uppercase text-teal-850 flex items-center gap-1 leading-none pl-0.5">
                      2. Dispense Medications (ওষুধ প্রয়োগ - অপশনাল)
                    </h4>
                    <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded border shadow-sm select-none font-bold text-slate-900 text-sm">
                      <input
                        type="checkbox"
                        checked={administerMedicine}
                        onChange={(e) => setAdministerMedicine(e.target.checked)}
                        className="accent-teal-500 w-3.5 h-3.5"
                      />
                      <span className="font-black text-[9.5px]">Dispense Drug?</span>
                    </label>
                  </div>

                  {administerMedicine ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={nurseMedicineSearch}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNurseMedicineSearch(val);
                            const matched = medicines.find(m => m.name.toLowerCase().includes(val.toLowerCase()));
                            if (matched) setNurseSelectedMedicine(matched.name);
                          }}
                          placeholder="Search live pharmacy stocks brand names..."
                          className="w-full border border-emerald-100 px-3 py-2 rounded-xl bg-slate-100 shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all pl-8 rounded-xl bg-white focus:border-teal-500 outline-none text-slate-900 font-bold"
                        />
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-9000" />
                      </div>

                      <div>
                        <label className="block  mb-1 font-bold text-slate-900 text-sm">Select Medicine from Live Dispensary Stocks (ওষুধ নির্বাচন)</label>
                        <select
                          value={nurseSelectedMedicine || filteredDrugs[0]?.name || ""}
                          onChange={(e) => setNurseSelectedMedicine(e.target.value)}
                          className="w-full border border-emerald-100 px-3 py-2 rounded-xl bg-slate-100 shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl bg-white outline-none focus:border-teal-500 text-slate-850 font-bold"
                        >
                          {filteredDrugs.length === 0 ? (
                            <option value="">-- No matching medications --</option>
                          ) : (
                            filteredDrugs.map((m) => (
                              <option key={m.name} value={m.name} disabled={m.qty <= 0}>
                                {m.name} [Stock: {m.qty} Units] — {m.price} INR {m.qty <= 0 ? "(OUT OF STOCK)" : ""}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Dose Count (Qty units)*</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={nurseMedicineQty}
                            onChange={(e) => setNurseMedicineQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full border border-emerald-100 px-3 py-2 rounded-xl bg-slate-100 shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl outline-none font-mono focus:border-teal-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block  mb-0.5 font-bold text-slate-900 text-sm">Pharmacy Batch Code</label>
                          <div className="bg-white p-2 border rounded-xl text-center font-mono font-bold text-slate-9000 uppercase select-all">
                            {medicines.find(m => m.name === (nurseSelectedMedicine || filteredDrugs[0]?.name))?.batch || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Stock warnings */}
                      {(() => {
                        const chosen = medicines.find(m => m.name === (nurseSelectedMedicine || filteredDrugs[0]?.name));
                        if (chosen && chosen.qty < 10) {
                          return (
                            <div className="p-3 bg-emerald-50/50mber-50 border border-amber-200 text-amber-805 rounded-xl flex items-center gap-2 select-all leading-relaxed">
                              <AlertTriangle className="text-amber-605 w-4 h-4 animate-bounce text-amber-600 shrink-0" />
                              <div>
                                <strong>Floor stock alert:</strong> Only <strong>{chosen.qty} units</strong> left in floor apothecary database.
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-9000 pl-1.5 italic leading-none font-normal select-none">Prescription skipping. Enable checkbox to dispense formulations.</p>
                  )}
                </div>

                {/* 3. Text field */}
                <div className="bg-white p-4 rounded-xl border">
                  <label className="block  mb-1 font-bold text-slate-900 text-sm">3. Clinical Care Notes (সেবা বিবরণী)</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={nurseNotes}
                    onChange={(e) => setNurseNotes(e.target.value)}
                    placeholder="Describe respiratory patterns, fluid intakes, dietary restraints advice..."
                    className="w-full border border-emerald-100 px-4 py-3 rounded-xl bg-slate-100 shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-xl focus:border-teal-500 outline-none bg-white font-semibold resize-none"
                  />
                </div>

                {/* 4. Signature pad */}
                <div className="bg-white p-4 rounded-xl border space-y-3 animate-none">
                  <h4 className="text-[10px] font-black uppercase text-teal-850 flex items-center gap-1 pl-0.5 leading-none shadow-none pb-0.5 border-none bg-transparent">
                    4. Authorize Assessment (নার্স ডিজিটাল সিগনেচার)
                  </h4>
                  <DigitalSignaturePad
                    value={vitalsSignature}
                    onSave={(sig) => setVitalsSignature(sig)}
                    onClear={() => setVitalsSignature("")}
                    nurseName={currentUser?.name || "Nursing Officer"}
                    disabled={false}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-650 hover:to-emerald-700 text-slate-950 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs border-none cursor-pointer shadow-md shadow-emerald-500/10 btn-action-blue"
                >
                  Confirm Vitals Assessment & Sign-Off Check-Up
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p className="p-8 text-center text-slate-9000 italic font-semibold">Zero stays currently checked in.</p>
      )}
    </div>
  );
}
