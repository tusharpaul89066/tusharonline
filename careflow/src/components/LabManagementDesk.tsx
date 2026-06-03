import React, { useState, useEffect } from "react";
import { 
  FlaskConical, 
  Printer, 
  Trash2, 
  Search, 
  Download, 
  PlusCircle, 
  Pencil, 
  X, 
  Plus, 
  CheckCircle, 
  GitCommit, 
  Activity, 
  Pill, 
  PackageMinus, 
  ClipboardCheck, 
  Signature 
} from "lucide-react";
import { Patient, Doctor, LabTest, LabTestMaster, LabPackage, Bill } from "../types";
import { downloadTokenPDF, downloadReceiptPDF } from "./PrintOverlays";

interface LabManagementDeskProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  beds: any[];
  setBeds: React.Dispatch<React.SetStateAction<any[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  staff: any[];
  setStaff: React.Dispatch<React.SetStateAction<any[]>>;
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser: any;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  setViewingToken: (token: any) => void;
  setViewingReceipt: (receipt: any) => void;
  labCategories: string[];
  setLabCategories: React.Dispatch<React.SetStateAction<string[]>>;
  labTestsMaster: LabTestMaster[];
  setLabTestsMaster: React.Dispatch<React.SetStateAction<LabTestMaster[]>>;
  labPackages: LabPackage[];
  setLabPackages: React.Dispatch<React.SetStateAction<LabPackage[]>>;
  labReportsTemplates: Record<string, string>;
  setLabReportsTemplates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  labTests: LabTest[];
  setLabTests: React.Dispatch<React.SetStateAction<LabTest[]>>;
}

export default function LabManagementDesk({
  patients,
  setPatients,
  doctors,
  beds,
  setBeds,
  bills,
  setBills,
  medicines,
  setMedicines,
  staff,
  setStaff,
  users,
  setUsers,
  currentUser,
  pushTimelineEvent,
  setViewingToken,
  setViewingReceipt,
  labCategories,
  setLabCategories,
  labTestsMaster,
  setLabTestsMaster,
  labPackages,
  setLabPackages,
  labReportsTemplates,
  setLabReportsTemplates,
  labTests,
  setLabTests,
}: LabManagementDeskProps) {
  const [labActiveSubTab, setLabActiveSubTab] = useState("collection");

  const [newCatName, setNewCatName] = useState("");
  const [newTestId, setNewTestId] = useState("");
  const [newTestName, setNewTestName] = useState("");
  const [newTestCategory, setNewTestCategory] = useState("Hematology (হেমাটোলজি)");
  const [newTestPrice, setNewTestPrice] = useState("");
  const [newTestSample, setNewTestSample] = useState("Blood (রক্ত)");
  
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgSelectedTests, setNewPkgSelectedTests] = useState<string[]>([]);
  const [newPkgPrice, setNewPkgPrice] = useState("");

  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);

  // Sample collection selection
  const [collPatientId, setCollPatientId] = useState("");
  const [collSelectedTests, setCollSelectedTests] = useState<string[]>([]);
  const [collPackageId, setCollPackageId] = useState("");
  const [collSampleType, setCollSampleType] = useState("Blood (রক্ত)");
  const [collToken, setCollToken] = useState("");

  // Report processing
  const [procLabTestId, setProcLabTestId] = useState<string | null>(null);
  const [procResultsText, setProcResultsText] = useState("");
  const [procNotes, setProcNotes] = useState("");

  // Billing active selections
  const [billLabTestId, setBillLabTestId] = useState<string | null>(null);
  const [billExtraCharges, setBillExtraCharges] = useState<any>(0);
  const [billExtraRemarks, setBillExtraRemarks] = useState("");

  return (
    <div id="lab-management-desk-module" className="space-y-6 animate-fade-in font-semibold text-slate-900">
      
      {/* Visual Header */}
      <div className="bg-white text-slate-900 p-6 rounded-2xl border-none shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 pointer-events-none transform translate-x-12 -translate-y-6 select-none">
          <FlaskConical className="w-48 h-48 text-slate-900" />
        </div>
        <div className="max-w-3xl space-y-2">
          <span className="bg-teal-500/20 text-teal-450 text-teal-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-teal-500/30">
            Pathology & Diagnostics Lab Suite
          </span>
          <h2 className="text-xl font-black tracking-tight uppercase text-teal-700">
            🔬 এন্টারপ্রাইজ ল্যাবরেটরি ম্যানেজমেন্ট এবং অটোমেশন (Enterprise Lab Management)
          </h2>
          <p className="text-xs text-slate-350 leading-relaxed text-slate-700">
            নমুনা সংগ্রহ থেকে শুরু করে ট্যালেন্ট স্লিপ কালেকশন, টোকেন জেনারেশন, টেস্ট প্রসেস, রিপোর্ট অনুমোদন এবং অটোমেটেড পেমেন্ট চালান চূড়ান্তকরণ।
          </p>
        </div>

        {/* Steps display triggers */}
        <div className="mt-6 border-t border-emerald-100 pt-5 grid grid-cols-4 gap-4 text-center text-[10px] uppercase font-black tracking-wider text-slate-9000">
          <div 
            onClick={() => setLabActiveSubTab("management")}
            className={`p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-all ${labActiveSubTab === "management" ? "bg-emerald-100/40 border-teal-500 text-teal-800" : "bg-white border-emerald-100 hover:bg-white hover:text-teal-700"}`}
          >
            <span className="block text-base mb-1">📋</span>
            ১. ক্যাটালগ ও প্রাইজ
          </div>
          <div 
            onClick={() => setLabActiveSubTab("collection")}
            className={`p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-all ${labActiveSubTab === "collection" ? "bg-emerald-100/40 border-teal-500 text-teal-800" : "bg-white border-emerald-100 hover:bg-white hover:text-teal-700"}`}
          >
            <span className="block text-base mb-1">🧪</span>
            ২. নমুনা সংগ্রহ ও টোকেন
          </div>
          <div 
            onClick={() => setLabActiveSubTab("processing")}
            className={`p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-all ${labActiveSubTab === "processing" ? "bg-emerald-100/40 border-teal-500 text-teal-800" : "bg-white border-emerald-100 hover:bg-white hover:text-teal-700"}`}
          >
            <span className="block text-base mb-1">📝</span>
            ৩. রিপোর্ট প্রসেসিং
            <span className="ml-1 bg-emerald-50/50mber-500 text-slate-950 px-1 py-0.5 rounded text-[8px]">
              {labTests.filter(t => t.status === "TEST PROCESSING").length}
            </span>
          </div>
          <div 
            onClick={() => setLabActiveSubTab("billing")}
            className={`p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-all ${labActiveSubTab === "billing" ? "bg-emerald-100/40 border-teal-500 text-teal-800" : "bg-white border-emerald-100 hover:bg-white hover:text-teal-700"}`}
          >
            <span className="block text-base mb-1">💰</span>
            ৪. বিল ও চালান
            <span className="ml-1 bg-indigo-500 text-slate-900 px-1 py-0.5 rounded text-[8px]">
              {labTests.filter(t => t.status === "REPORT READY").length}
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex flex-wrap gap-2.5 bg-slate-100 p-1.5 rounded-2xl border border-emerald-100 shadow-sm rounded-2xl">
        <button
          onClick={() => setLabActiveSubTab("collection")}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition border-none cursor-pointer flex items-center justify-center gap-2 ${labActiveSubTab === "collection" ? "bg-white text-slate-950 shadow-md" : "text-slate-700 hover:bg-emerald-50/80"}`}
        >
          🧪 স্যাম্পল কালেকশন (Sample Specimen)
        </button>
        <button
          onClick={() => setLabActiveSubTab("processing")}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition border-none cursor-pointer flex items-center justify-center gap-2 ${labActiveSubTab === "processing" ? "bg-white text-slate-950 shadow-md" : "text-slate-700 hover:bg-emerald-50/80"}`}
        >
          📝 রিপোর্ট প্রসেসিং (Report Processing)
          {labTests.filter(t => t.status === "TEST PROCESSING").length > 0 && (
            <span className="bg-emerald-50/50mber-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none">
              {labTests.filter(t => t.status === "TEST PROCESSING").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setLabActiveSubTab("billing")}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition border-none cursor-pointer flex items-center justify-center gap-2 ${labActiveSubTab === "billing" ? "bg-white text-slate-950 shadow-md" : "text-slate-700 hover:bg-emerald-50/80"}`}
        >
          💰 বিলিং চালান (Billing & Invoices)
          {labTests.filter(t => t.status === "REPORT READY").length > 0 && (
            <span className="bg-indigo-600 text-slate-900 px-1.5 py-0.5 rounded-full text-[9px] font-black animate-pulse leading-none">
              {labTests.filter(t => t.status === "REPORT READY").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setLabActiveSubTab("management")}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition border-none cursor-pointer flex items-center justify-center gap-2 ${labActiveSubTab === "management" ? "bg-white text-slate-950 shadow-md" : "text-slate-700 hover:bg-emerald-50/80"}`}
        >
          📋 ল্যাব সেটআপ (Catalog Setup)
        </button>
      </div>

      {/* --- SUB TAB 1: SAMPLE specimen COLLECTION --- */}
      {labActiveSubTab === "collection" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-normal text-slate-800">
          
          {/* Sample collection form */}
          <div className="lg:col-span-1 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center gap-1.5 font-sans">
              <span className="text-teal-800">🧪</span> নমুনা অর্ডার ও সংগ্রহ
            </h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-755 text-slate-800">
              <div>
                <label className="block  mb-1 font-bold text-slate-900 text-sm">রুগীর কেস ফাইল নির্বাচন (Select Patient)*</label>
                <select
                  value={collPatientId}
                  onChange={(e) => setCollPatientId(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                >
                  <option value="">-- Patient Selection --</option>
                  {patients
                    .filter(p => p.condition !== "Discharged")
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.name} ({p.bed === "None" ? "OPD" : "Inpatient"})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block  mb-1 font-bold text-slate-900 text-sm">ল্যাব টেস্ট প্যাকেজ (Select Package - Optional)</label>
                <select
                  value={collPackageId}
                  onChange={(e) => {
                    const pkgId = e.target.value;
                    setCollPackageId(pkgId);
                    if (pkgId) {
                      const pkg = labPackages.find(p => p.id === pkgId);
                      if (pkg) {
                        setCollSelectedTests(pkg.tests);
                      }
                    } else {
                      setCollSelectedTests([]);
                    }
                  }}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                >
                  <option value="">-- No Package (Individual Tests Only) --</option>
                  {labPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.price} INR)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block  mb-1 font-bold text-slate-900 text-sm">প্রয়োজনীয় টেস্টসমূহ (Select Diagnostic Tests)*</label>
                <div className="border border-emerald-100 shadow-sm rounded-2xl rounded-xl p-3 bg-white max-h-48 overflow-y-auto space-y-1.5">
                  {labTestsMaster.map(test => {
                    const isChecked = collSelectedTests.includes(test.id);
                    return (
                      <label key={test.id} className="flex items-center gap-2.5 p-1 hover:bg-slate-100 rounded cursor-pointer select-none font-bold text-slate-900 text-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setCollSelectedTests(prev => prev.filter(tid => tid !== test.id));
                            } else {
                              setCollSelectedTests(prev => [...prev, test.id]);
                            }
                          }}
                          className="rounded text-teal-800 focus:ring-teal-500"
                        />
                        <span className="flex-1 font-bold text-slate-900 leading-tight">
                          {test.name}
                          <span className="block text-[10px] text-slate-9000 font-normal mt-0.5">
                            {test.category} • Price: {test.price} INR
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div>
                  <label className="block  mb-1 font-bold text-slate-900 text-sm">নমুনার ধরণ (Sample Type)</label>
                  <select
                    value={collSampleType}
                    onChange={(e) => setCollSampleType(e.target.value)}
                    className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                  >
                    <option value="Blood (রক্ত)">Blood (রক্ত)</option>
                    <option value="Urine (মূত্র)">Urine (মূত্র)</option>
                    <option value="Swab (লালা/সোয়াব)">Swab (সোয়াব)</option>
                    <option value="Sputum (কফ)">Sputum (কফ)</option>
                    <option value="Stool (মল)">Stool (মল)</option>
                    <option value="None (নন-ইনভেসিভ)">None (নন-ইনভেসিভ)</option>
                  </select>
                </div>
                <div>
                  <label className="block  mb-1 font-bold text-slate-900 text-sm">ল্যাব টোকেন (Lab Token)*</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={collToken}
                      readOnly
                      placeholder="Auto-Token"
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl  font-mono text-center font-black outline-none   placeholder:font-semibold bg-white text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setCollToken(`L-TK-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="bg-white hover:bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md border-none hover:shadow-sm transition-all duration-300 font-bold p-2 px-3 rounded-xl cursor-pointer text-xs"
                    >
                      ⚡
                    </button>
                  </div>
                </div>
              </div>

              {collSelectedTests.length > 0 && (
                <div className="bg-emerald-100/40/50 border border-teal-700 rounded-xl p-3 text-slate-900">
                  <div className="flex justify-between font-normal text-[10px] text-slate-9000">
                    <span>Base Regular Sum:</span>
                    <span>
                      {collSelectedTests.reduce((sum, tid) => sum + (labTestsMaster.find(t => t.id === tid)?.price || 0), 0)} INR
                    </span>
                  </div>
                  {collPackageId && (
                    <div className="flex justify-between font-normal text-[10px] text-teal-800">
                      <span>Package Discount Applied:</span>
                      <span>
                        {labPackages.find(p => p.id === collPackageId)?.price || 0} INR
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-xs border-t pt-1.5 mt-1.5 text-slate-900 uppercase">
                    <span>Grand Estimated:</span>
                    <span>
                      INR {collPackageId 
                        ? (labPackages.find(p => p.id === collPackageId)?.price || 0)
                        : collSelectedTests.reduce((sum, tid) => sum + (labTestsMaster.find(t => t.id === tid)?.price || 0), 0)
                      }
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!collPatientId) {
                    alert("দয়া করে রুগী নির্বাচন করুন!");
                    return;
                  }
                  if (collSelectedTests.length === 0) {
                    alert("দয়া করে টেস্ট নির্বাচন করুন!");
                    return;
                  }
                  if (!collToken) {
                    alert("দয়া করে ল্যাব রিং টোকেন জেনারেট করুন!");
                    return;
                  }

                  const patientObj = patients.find(p => p.id === collPatientId);
                  const name = patientObj ? patientObj.name : "Patient";
                  
                  const regularSum = collSelectedTests.reduce((sum, tid) => sum + (labTestsMaster.find(t => t.id === tid)?.price || 0), 0);
                  const pkgObj = labPackages.find(p => p.id === collPackageId);
                  const finalPrice = pkgObj ? pkgObj.price : regularSum;
                  const discount = pkgObj ? (regularSum - pkgObj.price) : 0;

                  const newRequest: LabTest = {
                    id: `LAB-${Date.now().toString().slice(-4)}`,
                    patientId: collPatientId,
                    patientName: name,
                    tests: [...collSelectedTests],
                    packageId: collPackageId || null,
                    sampleType: collSampleType,
                    sampleCollected: true,
                    token: collToken,
                    status: "TEST PROCESSING",
                    results: "",
                    verified: false,
                    extraCharges: 0,
                    packageDiscount: discount,
                    billTotal: finalPrice,
                    date: new Date().toISOString().split("T")[0]
                  };

                  setLabTests(prev => [newRequest, ...prev]);
                  setViewingToken(newRequest);
                  downloadTokenPDF(newRequest, labTestsMaster);

                  pushTimelineEvent(
                    collPatientId,
                    "Lab Ordered",
                    `${currentUser?.name || "System"} (Lab Core Desk)`,
                    `স্যাম্পল সংগ্রহ এবং টোকেন (${collToken}) রেডি। টেস্টসমূহ: ${collSelectedTests.map(tid => labTestsMaster.find(t => t.id === tid)?.name).join(", ")}`
                  );

                  setCollPatientId("");
                  setCollSelectedTests([]);
                  setCollPackageId("");
                  setCollToken("");
                  alert("নমুনা সংগ্রহ করা হয়েছে! স্থিতি: TEST PROCESSING");
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none transition cursor-pointer text-xs shadow-md"
              >
                ✅ স্যাম্পল কালেকশন সাবমিট করুন
              </button>
            </div>
          </div>

          {/* Specimens timeline log */}
          <div className="lg:col-span-2 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
              <span>🧪 নমুনা ট্র্যাকিং ও স্লিপ রেজিস্টার</span>
              <span className="text-[10px] bg-slate-100 text-slate-650 px-2.5 py-0.5 rounded-full font-bold">
                Total: {labTests.length} Records
              </span>
            </h3>

            <div className="overflow-x-auto text-[11px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white border-b border-emerald-100 text-slate-9000 uppercase tracking-wider text-left text-[10px] font-black">
                    <th className="p-3 pl-4">Lab ID</th>
                    <th className="p-3">Patient Case</th>
                    <th className="p-3">Specimen Spec</th>
                    <th className="p-3">Tests Queue</th>
                    <th className="p-3">Workflow State</th>
                    <th className="p-3 text-right pr-4">Base Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labTests.map(r => (
                    <tr key={r.id} className="hover:bg-emerald-50/80 transition font-semibold text-slate-800">
                      <td className="p-3 pl-4">
                        <div className="font-bold text-slate-950">{r.id}</div>
                        <div className="text-[9.5px] text-slate-9000 font-normal font-mono">{r.date}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-black text-slate-900 leading-tight">{r.patientName}</div>
                        <div className="text-[10px] font-mono text-teal-800 font-bold">{r.patientId}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono bg-slate-100 text-slate-805 border border-emerald-100 shadow-sm rounded-2xl px-1.5 py-0.5 rounded text-[10px] font-black">
                            {r.token}
                          </span>
                          <button type="button"
                            onClick={() => {
                              setViewingToken(r);
                              downloadTokenPDF(r, labTestsMaster);
                            }}
                            className="p-1 px-1.5 border border-teal-300 hover:border-teal-400 bg-emerald-100/40 hover:bg-emerald-100/40 text-teal-200 rounded transition duration-150 cursor-pointer flex items-center gap-1 font-bold text-[9px]"
                          >
                            <Printer className="w-2.5 h-2.5" />
                            <span>প্রিন্ট</span>
                          </button>
                        </div>
                        <div className="text-[9px] text-slate-9000 font-normal mt-0.5 font-sans">
                          🧪 {r.sampleType}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs animate-none">
                          {r.tests.map(tid => (
                            <span key={tid} className="inline-block bg-white text-slate-700 border border-emerald-100 shadow-sm rounded-2xl px-1.5 py-0.5 rounded text-[9.5px]">
                              {labTestsMaster.find(t => t.id === tid)?.name || tid}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                          r.status === "TEST PROCESSING" ? "bg-emerald-50/50mber-100 text-amber-700 border border-amber-200 animate-pulse" :
                          r.status === "REPORT READY" ? "bg-indigo-100 text-indigo-700 border border-indigo-200" :
                          "bg-emerald-100 text-emerald-700 border border-emerald-250"
                        }`}>
                          {r.status === "TEST PROCESSING" ? "⚙️ Processing" : r.status === "REPORT READY" ? "📝 Report Ready" : "💰 Billed"}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4 font-mono font-black text-slate-900">
                        {r.billTotal} INR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB 2: PATHOLOGY REPORT PROCESSING --- */}
      {labActiveSubTab === "processing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-normal text-slate-800">
          
          {/* Pending List */}
          <div className="lg:col-span-1 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
              <span>⚙️ প্রসেসিং পেন্ডিং থাকা টেস্টসমূহ</span>
              <span className="bg-emerald-50/50mber-100 text-amber-800 text-[10.5px] px-2.5 py-0.5 rounded-full font-black animate-pulse leading-none">
                {labTests.filter(t => t.status === "TEST PROCESSING").length} Pending
              </span>
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar">
              {labTests.filter(t => t.status === "TEST PROCESSING").length === 0 ? (
                <div className="text-center p-8 text-slate-9000 font-medium italic">
                  কোনো টেস্ট currently পেন্ডিং নেই।
                </div>
              ) : (
                labTests.filter(t => t.status === "TEST PROCESSING").map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setProcLabTestId(item.id);
                      const defaultResults = item.tests.map(tid => {
                        const testObj = labTestsMaster.find(t => t.id === tid);
                        const template = labReportsTemplates[tid] || "No standard template.";
                        return `--- ${testObj ? testObj.name : tid} Results ---\nMeasured Value: \nReference Range:\n${template}`;
                      }).join("\n\n");
                      setProcResultsText(defaultResults);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-xs font-semibold ${procLabTestId === item.id ? "bg-emerald-50/50mber-50/55 border-amber-400 shadow-sm" : "border-slate-250 border-emerald-100 hover:bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono bg-emerald-50/50mber-100 text-amber-850 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {item.token}
                      </span>
                      <span className="text-[10px] text-slate-9000 font-normal font-mono">{item.date}</span>
                    </div>
                    <div className="font-black text-slate-900">{item.patientName}</div>
                    <div className="text-[10px] text-slate-405 font-normal mb-2 leading-none mt-0.5">Reference ID: {item.patientId}</div>
                    <div className="flex flex-wrap gap-1 leading-none font-bold">
                      {item.tests.map(tid => (
                        <span key={tid} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] inline-block font-sans">
                          {labTestsMaster.find(t => t.id === tid)?.name || tid}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pathology writer */}
          <div className="lg:col-span-2 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center gap-1.5 font-sans">
              <span className="text-teal-605">📝</span> প্যাথলজি রিপোর্ট প্রসেস এবং জেনারেশন
            </h3>

            {procLabTestId ? (() => {
              const activeItem = labTests.find(t => t.id === procLabTestId);
              if (!activeItem) return <div className="text-slate-9000 font-medium p-4">কোনো বিবরণী পাওয়া যায়নি।</div>;

              return (
                <div className="space-y-4 text-xs font-semibold text-slate-705">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm rounded-2xl text-xs">
                    <div>
                      <span className="block text-slate-450 text-[10px] font-bold text-slate-9000 uppercase">পেশেন্ট নাম</span>
                      <span className="font-black text-slate-950 block">{activeItem.patientName}</span>
                    </div>
                    <div>
                      <span className="block text-slate-450 text-[10px] font-bold text-slate-9000 uppercase">স্যাম্পল টোকেন</span>
                      <strong className="font-mono font-black text-teal-800 bg-emerald-100/40 px-1.5 py-0.5 rounded block w-fit mt-0.5">{activeItem.token}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-450 text-[10px] font-bold text-slate-9000 uppercase">নমুনার ধরণ</span>
                      <span className="font-bold text-slate-900 block">{activeItem.sampleType}</span>
                    </div>
                    <div>
                      <span className="block text-slate-450 text-[10px] font-bold text-slate-9000 uppercase">পরীক্ষার তারিখ</span>
                      <span className="text-slate-650 block font-mono font-medium">{activeItem.date}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block  font-bold text-slate-900 text-sm">টেস্ট ফলাফল এবং পরিমাপকৃত ভ্যালুসমূহ (Enter Parameters)*</label>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("রেফারেন্স টেমপ্লেট রিসেট করবেন?")) {
                            const defaultResults = activeItem.tests.map(tid => {
                              const testObj = labTestsMaster.find(t => t.id === tid);
                              const template = labReportsTemplates[tid] || "No standard template.";
                              return `--- ${testObj ? testObj.name : tid} Results ---\nMeasured Value: \nReference Range:\n${template}`;
                            }).join("\n\n");
                            setProcResultsText(defaultResults);
                          }
                        }}
                        className="text-[10px] font-bold text-teal-650 bg-emerald-100/40 hover:bg-emerald-100/40 border-none px-2.5 py-1 rounded transition cursor-pointer"
                      >
                        🔄 Reload Default Format
                      </button>
                    </div>
                    <textarea
                      value={procResultsText}
                      onChange={(e) => setProcResultsText(e.target.value)}
                      rows={11}
                      placeholder="এখানে থেরাপিস্ট ফলাফল টাইপ করুন..."
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-3.5 rounded-xl outline-none font-mono text-[11px] leading-relaxed bg-white focus:border-teal-500 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block  mb-1 font-bold text-slate-900 text-sm">প্যাথলজিস্টের মতামত (Pathologist Remarks)</label>
                      <input
                        type="text"
                        value={procNotes}
                        onChange={(e) => setProcNotes(e.target.value)}
                        placeholder="E.g., Microcytic hypochromic pictures checked."
                        className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block  mb-1 font-bold text-slate-900 text-sm">প্যাথলজিস্টের ডিজিটাল স্বাক্ষর (Pathologist Signature)*</label>
                      <input
                        type="text"
                        id="pathologistSignature"
                        placeholder="Dr. K. Zaman, MD (Pathology)"
                        className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none font-serif tracking-wider font-extrabold focus:border-teal-500  text-black  placeholder:font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const sigInput = document.getElementById("pathologistSignature") as HTMLInputElement;
                      const sig = sigInput ? sigInput.value : "";
                      if (!procResultsText.trim()) {
                        alert("দয়া করে টেস্ট ফলাফল টাইপ করুন!");
                        return;
                      }
                      if (!sig) {
                        alert("ভেরিফাই করার জন্য প্যাথলজিস্টের সিগনেচার এন্টার করুন!");
                        return;
                      }

                      setLabTests(prev => prev.map(t => t.id === procLabTestId ? {
                        ...t,
                        status: "REPORT READY",
                        results: procResultsText,
                        verified: true,
                        signature: sig,
                        remarks: procNotes
                      } : t));

                      pushTimelineEvent(
                        activeItem.patientId,
                        "Procedure Done",
                        `${sig} (Pathologist Core)`,
                        `প্যাথলজি রিপোর্ট জেনারেট সম্পন্ন। টোকেন আইডি: ${activeItem.token}. টেস্টসমূহ: ${activeItem.tests.map(tid => labTestsMaster.find(m => m.id === tid)?.name || tid).join(", ")}`
                      );

                      alert("প্যাথলজি রিপোর্টটি সফলভাবে ভেরিফাই এবং EHR ডেটাবেজে পোস্ট করা হয়েছে!");
                      setProcLabTestId(null);
                      setProcResultsText("");
                      setProcNotes("");
                    }}
                    className="w-full btn-action-blue py-3 rounded-xl uppercase tracking-wider transition cursor-pointer text-xs"
                  >
                    📋 জেনারেট ও রিপোর্ট অনুমোদন করুন (Verify & Approve Report)
                  </button>
                </div>
              );
            })() : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-9000 italic font-semibold">
                <span className="text-4xl mb-2 select-none">👈</span>
                বামদিকের তালিকা থেকে পেন্ডিং থাকা ল্যাব টোকেনটি নির্বাচন করে রিপোর্ট ভ্যালু এডিট করুন।
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUB TAB 3: BILLING & ACCOUNT INTEGRATION --- */}
      {labActiveSubTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-normal text-slate-800">
          
          {/* Ready report index */}
          <div className="lg:col-span-1 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
              <span>💰 বিলিং পেন্ডিং তালিকা (Unbilled Reports)</span>
              <span className="bg-indigo-105 bg-indigo-100 text-indigo-700 text-[10.5px] px-2.5 py-0.5 rounded-full font-black animate-pulse leading-none">
                {labTests.filter(t => t.status === "REPORT READY").length} Ready
              </span>
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar font-semibold">
              {labTests.filter(t => t.status === "REPORT READY" || t.status === "BILL GENERATED").length === 0 ? (
                <div className="text-center p-8 text-slate-450 font-medium italic">
                  কোনো টেস্ট currently পেন্ডিং নেই।
                </div>
              ) : (
                labTests.filter(t => t.status === "REPORT READY" || t.status === "BILL GENERATED").map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setBillLabTestId(item.id);
                      setBillExtraCharges(item.extraCharges || 0);
                      setBillExtraRemarks(item.extraRemarks || "");
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-xs ${billLabTestId === item.id ? "bg-indigo-50/55 border-indigo-400 shadow-sm" : "border-emerald-100 hover:bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-1 leading-none font-bold">
                      <span className="font-mono bg-indigo-100 text-indigo-805 px-1.5 py-0.5 rounded text-[10px] font-black border border-indigo-200">
                        {item.token}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.status === "BILL GENERATED" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-900"}`}>
                        {item.status === "BILL GENERATED" ? "💰 Billed" : "⏳ Ready for Bill"}
                      </span>
                    </div>
                    <div className="font-black text-slate-950 text-xs mt-1.5 leading-tight">{item.patientName}</div>
                    <div className="text-[10px] text-slate-9000 font-normal leading-none mt-0.5 select-all">EHR ID: {item.patientId}</div>
                    <div className="text-[10px] text-emerald-700 font-black mt-2">Cost Due: {item.billTotal + (item.extraCharges || 0)} INR</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cost Sheet Generator */}
          <div className="lg:col-span-2 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4 font-semibold">
            <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
              <span>💳 চালান ফাইনাল এবং পোস্ট করুন</span>
            </h3>

            {billLabTestId ? (() => {
              const activeItem = labTests.find(t => t.id === billLabTestId);
              if (!activeItem) return <div className="text-slate-9000 font-medium p-4">কোনো ডাটা পাওয়া যায়নি।</div>;

              const baseTotal = activeItem.tests.reduce((sum, tid) => sum + (labTestsMaster.find(t => t.id === tid)?.price || 0), 0);
              const subTotalWithDiscount = activeItem.packageId ? activeItem.billTotal : baseTotal;
              const discountAmount = activeItem.packageDiscount || 0;
              const finalBillCalc = subTotalWithDiscount + parseInt(billExtraCharges || 0);

              return (
                <div className="space-y-4 text-xs font-semibold text-slate-705">
                  <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-xl p-4 space-y-3 font-semibold text-slate-755 text-slate-800 text-xs">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <span className="block text-slate-405 text-[10px]">পেশেন্ট আইডি</span>
                        <span className="font-black text-slate-900">{activeItem.patientName} ({activeItem.patientId})</span>
                      </div>
                      <div>
                        <span className="block text-slate-405 text-[10px]">স্যাম্পল টোকেন</span>
                        <span className="font-mono font-black text-slate-900">{activeItem.token}</span>
                      </div>
                      <div>
                        <span className="block text-slate-405 text-[10px]">Pathology approval</span>
                        <span className="text-emerald-600 font-bold block mt-0.5">✔️ APPROVED BY PATHOLOGIST</span>
                      </div>
                    </div>

                    <div className="border border-emerald-100 shadow-sm rounded-2xl rounded-xl overflow-hidden bg-white mt-3 font-normal text-slate-800 text-[11px]">
                      <div className="grid grid-cols-3 bg-slate-100 p-2 text-[10px] font-black uppercase text-slate-550 tracking-wider">
                        <span className="col-span-2">পরীক্ষাসমূহের বিবরণী</span>
                        <span className="text-right">ফি (Cost Price)</span>
                      </div>
                      <div className="divide-y divide-slate-100 font-semibold text-slate-900">
                        {activeItem.tests.map(tid => {
                          const testObj = labTestsMaster.find(t => t.id === tid);
                          return (
                            <div key={tid} className="grid grid-cols-3 p-2">
                              <span className="col-span-2">{testObj ? testObj.name : tid}</span>
                              <span className="text-right font-mono">{testObj ? testObj.price : 0} INR</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-100/40 text-teal-950 rounded-xl flex items-center justify-between border border-teal-150">
                    <div>
                      <span className="block text-[10px] text-teal-200 font-normal">ল্যাব টেস্ট প্যাকেজ সুবিধা</span>
                      <span className="font-black">
                        {activeItem.packageId 
                          ? `🎁 প্যাকেজ অফার: ${labPackages.find(p => p.id === activeItem.packageId)?.name}`
                          : "কোনো প্যাকেজ ব্যবহার করা হয়নি (No Package Applied)"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-teal-200 font-normal">ডিসকাউন্ট</span>
                      <span className="font-black text-teal-200">{discountAmount} INR</span>
                    </div>
                  </div>

                  {activeItem.status !== "BILL GENERATED" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-emerald-100 shadow-sm rounded-2xl p-4 rounded-xl text-xs font-semibold">
                      <div>
                        <label className="block  mb-1 font-bold text-slate-900 text-sm">ম্যানুয়াল অতিরিক্ত চার্জ যুক্ত করুন (Add Extra Cost)</label>
                        <div className="flex items-center gap-1.5 font-bold font-mono">
                          <span className="text-slate-9000">INR </span>
                          <input
                            type="number"
                            value={billExtraCharges}
                            onChange={(e) => setBillExtraCharges(parseInt(e.target.value) || 0)}
                            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block  mb-1 font-bold text-slate-900 text-sm">অতিরিক্ত ফি আদায়ের কারণ (Remarks)</label>
                        <input
                          type="text"
                          value={billExtraRemarks}
                          onChange={(e) => setBillExtraRemarks(e.target.value)}
                          placeholder="E.g., Fast checkup or reagent cost."
                          className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-white rounded-xl space-y-1.5 border text-xs">
                      <div className="flex justify-between">
                        <span>অতিরিক্ত চার্জ (Extra Manual Charges):</span>
                        <span>{activeItem.extraCharges || 0} INR</span>
                      </div>
                      <div className="flex justify-between">
                        <span>চার্জের কারণ (Extra Remarks):</span>
                        <span>{activeItem.extraRemarks || "None"}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white text-slate-900 p-4 rounded-xl text-xs font-semibold">
                    <div className="flex justify-between text-[11px] text-slate-9000 mb-1 font-mono font-medium">
                      <span>ল্যাব বেইজ ফি (Base Fee):</span>
                      <span>{baseTotal} INR</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[11px] text-teal-700 mb-1 font-mono font-medium">
                        <span>প্যাকেজ ডিসকাউন্ট (Package Savings):</span>
                        <span>- {discountAmount} INR</span>
                      </div>
                    )}
                    {parseInt(billExtraCharges) > 0 && (
                      <div className="flex justify-between text-[11px] text-amber-400 mb-1 font-mono font-medium font-bold">
                        <span>অতিরিক্ত চার্জ (Extra Services):</span>
                        <span>+ {billExtraCharges} INR</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black border-t border-emerald-100 pt-2 mt-2 text-teal-450 text-teal-700 uppercase tracking-wide">
                      <span>Grand Total (সর্বমোট টাকা):</span>
                      <span>{finalBillCalc} INR</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {activeItem.status !== "BILL GENERATED" && (
                      <button type="button"
                        onClick={() => {
                          setLabTests(prev => prev.map(t => t.id === activeItem.id ? {
                            ...t,
                            status: "BILL GENERATED",
                            extraCharges: parseInt(billExtraCharges) || 0,
                            extraRemarks: billExtraRemarks,
                            billTotal: finalBillCalc
                          } : t));

                          setBills(prevBills => {
                            const existingBill = prevBills.find(b => b.patientId === activeItem.patientId && b.paymentMode !== "CASH" && !b.isDischarged);
                            if (existingBill) {
                              return prevBills.map(b => {
                                if (b.invoice === existingBill.invoice) {
                                  const updatedBreakdown = {
                                    ...b.breakdown,
                                    test: (b.breakdown?.test || 0) + finalBillCalc
                                  };
                                  const updatedSub = (b.breakdown?.bed || 0) + (b.breakdown?.doc || 0) + (b.breakdown?.ot || 0) + (b.breakdown?.med || 0) + updatedBreakdown.test + 500;
                                  const discountPrice = updatedSub * (10 / 100);
                                  const taxPrice = (updatedSub - discountPrice) * (5 / 100);
                                  return {
                                    ...b,
                                    breakdown: updatedBreakdown,
                                    total: Math.round(updatedSub - discountPrice + taxPrice)
                                  };
                                }
                                return b;
                              });
                            } else {
                              const newBillId = `INV-${Date.now().toString().slice(-4)}`;
                              const testBill: Bill = {
                                invoice: newBillId,
                                patientId: activeItem.patientId,
                                patientName: activeItem.patientName,
                                patientMobile: "01700000000",
                                date: new Date().toISOString().split("T")[0],
                                total: finalBillCalc,
                                breakdown: {
                                  bed: 0,
                                  doc: 0,
                                  test: finalBillCalc,
                                  med: 0,
                                  other: 0,
                                  discount: 0,
                                  tax: 5
                                },
                                paymentMode: "CASH",
                                subtotal: finalBillCalc
                              };
                              return [...prevBills, testBill];
                            }
                          });

                          pushTimelineEvent(
                            activeItem.patientId,
                            "Payment Tracked",
                            `${currentUser?.name || "Service"} (Lab Accountant)`,
                            `ল্যাব টেস্ট চালানের বিল EHR লেজারে চূড়ান্ত করা হয়েছে। টোকেন: ${activeItem.token}. টেস্ট বিল ফি: ${finalBillCalc} INR`
                          );

                          alert("বিল ফাইনাল করা হয়েছে এবং EHR ডাটাবেজে পোস্ট করা হয়েছে!");
                        }}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none transition cursor-pointer text-xs"
                      >
                        💳 ফাইনাল বিল জেনারেট করুন (Reconcile Bill)
                      </button>
                    )}

                    <button type="button"
                      onClick={() => {
                        const receiptObj = {
                          ...activeItem,
                          extraCharges: parseInt(billExtraCharges) || 0,
                          extraRemarks: billExtraRemarks,
                          billTotal: finalBillCalc
                        };
                        setViewingReceipt(receiptObj);
                        downloadReceiptPDF(receiptObj, labTestsMaster);
                      }}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md hover:shadow-sm transition-all font-black py-3 rounded-xl uppercase tracking-wider border-none transition cursor-pointer text-xs"
                    >
                      🖨️ রিসিট প্রিন্ট করুন (Print Recipe Bill)
                    </button>
                  </div>
                </div>
              );
            })() : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-9000 italic font-semibold">
                <span className="text-4xl mb-2 select-none">👈</span>
                বামদিকের তালিকা থেকে পেন্ডিং থাকা ল্যাব টেস্ট রেকর্ডটি সিলেক্ট করে পেমেন্ট এবং বিল জেনারেট করুন।
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUB TAB 4: LAB SETUP AND MASTER CONFIGURATION --- */}
      {labActiveSubTab === "management" && (
        <div className="space-y-6 animate-fade-in text-xs font-semibold text-slate-705">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Test Categories builder */}
            <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
                <span>📁 প্যাথলজি টেস্ট ক্যাটাগরি (Categorization Setup)</span>
                {editingCatIdx !== null && (
                  <span className="text-[10px] bg-emerald-50/50mber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded animate-pulse select-none">EDIT MODE</span>
                )}
              </h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="E.g., Immunology (ইমিউনোলজি)"
                  className="flex-1 border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 bg-white"
                />
                
                {editingCatIdx !== null ? (
                  <div className="flex gap-1">
                    <button type="button"
                      onClick={() => {
                        if (!newCatName.trim()) return;
                        setLabCategories(prev => prev.map((cat, idx) => idx === editingCatIdx ? newCatName.trim() : cat));
                        setNewCatName("");
                        setEditingCatIdx(null);
                        alert("ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে!");
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-900 shadow-md text-slate-900 font-bold px-3 py-2 rounded-xl border-none cursor-pointer text-xs"
                    >
                      Save
                    </button>
                    <button type="button"
                      onClick={() => {
                        setNewCatName("");
                        setEditingCatIdx(null);
                      }}
                      className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold px-3 py-2 rounded-xl border-none cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      setLabCategories(prev => [...prev, newCatName.trim()]);
                      setNewCatName("");
                      alert("নতুন ল্যাব টেস্ট ক্যাটাগরি যুক্ত করা হয়েছে!");
                    }}
                    className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-bold px-4 py-2 rounded-xl border-none cursor-pointer text-xs"
                  >
                    + Add Category
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {labCategories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-emerald-100 p-2 hover:bg-white rounded-lg">
                    <span>{cat}</span>
                    <div className="flex gap-1.5 items-center select-none font-bold">
                      <button type="button"
                        onClick={() => {
                          setEditingCatIdx(idx);
                          setNewCatName(cat);
                        }}
                        className="text-teal-800 hover:text-teal-850 bg-transparent border-none cursor-pointer text-xs font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button type="button"
                        onClick={() => {
                          if (confirm(`আপনি কি সত্যিই "${cat}" ক্যাটাগরিটি ডিলিট করতে চান?`)) {
                            setLabCategories(prev => prev.filter((_, i) => i !== idx));
                            if (editingCatIdx === idx) {
                              setEditingCatIdx(null);
                              setNewCatName("");
                            }
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer text-xs font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Master Entry builder */}
            <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
                <span>🔬 {editingTestId !== null ? "টেস্ট এডিটর (Edit Test Master)" : "টেস্ট ক্যাটালগ সেটআপ (Diagnostic Tests Setup)"}</span>
                {editingTestId !== null && (
                  <span className="text-[10px] bg-emerald-50/50mber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded animate-pulse select-none">EDIT MODE</span>
                )}
              </h3>

              <div className="space-y-3.5 text-xs text-slate-705">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px]  font-bold uppercase text-slate-900">টেস্ট কোড (Diagnostic Code)*</label>
                    <input
                      type="text"
                      value={newTestId}
                      onChange={(e) => setNewTestId(e.target.value)}
                      disabled={editingTestId !== null}
                      placeholder="E.g., TEST-107"
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none font-mono focus:border-teal-500 text-slate-900 disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px]  font-bold uppercase text-slate-900">টেস্ট এর নাম (Test Name)*</label>
                    <input
                      type="text"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      placeholder="E.g., Liver Function Test"
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 text-slate-805 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px]  font-bold uppercase text-slate-900">ফি (Price INR)*</label>
                    <input
                      type="number"
                      value={newTestPrice}
                      onChange={(e) => setNewTestPrice(e.target.value)}
                      placeholder="INR  Cost"
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none font-mono focus:border-teal-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px]  font-bold uppercase text-slate-900">ক্যাটাগরি</label>
                    <select
                      value={newTestCategory}
                      onChange={(e) => setNewTestCategory(e.target.value)}
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl bg-white outline-none focus:border-teal-500 text-xs"
                    >
                      {labCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px]  font-bold uppercase text-slate-900">বিশেষ নমুনা</label>
                    <select
                      value={newTestSample}
                      onChange={(e) => setNewTestSample(e.target.value)}
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl bg-white outline-none focus:border-teal-500 text-xs"
                    >
                      <option value="Blood (রক্ত)">Blood (রক্ত)</option>
                      <option value="Urine (মূত্র)">Urine (মূত্র)</option>
                      <option value="Swab (লালা/সোয়াব)">Swab (সোয়াব)</option>
                      <option value="Sputum (কফ)">Sputum (কফ)</option>
                      <option value="Stool (মল)">Stool (মল)</option>
                      <option value="None (নন-ইনভেসিভ)">None</option>
                    </select>
                  </div>
                </div>

                {editingTestId !== null ? (
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => {
                        if (!newTestId || !newTestName || !newTestPrice) {
                          alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
                          return;
                        }
                        setLabTestsMaster(prev => prev.map(m => m.id === editingTestId ? {
                          ...m,
                          name: newTestName.trim(),
                          category: newTestCategory,
                          price: parseInt(newTestPrice),
                          sampleType: newTestSample
                        } : m));
                        alert("ক্যাটালগ রেকর্ড সফলভাবে আপডেট করা হয়েছে!");
                        setEditingTestId(null);
                        setNewTestId("");
                        setNewTestName("");
                        setNewTestPrice("");
                      }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-900 shadow-md text-slate-900 font-bold py-2.5 rounded-xl border-none cursor-pointer text-xs"
                    >
                      💾 পরিবর্তন সংরক্ষণ করুন (Save Changes)
                    </button>
                    <button type="button"
                      onClick={() => {
                        setEditingTestId(null);
                        setNewTestId("");
                        setNewTestName("");
                        setNewTestPrice("");
                      }}
                      className="bg-slate-250 bg-slate-200 hover:bg-slate-350 text-slate-705 font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTestId || !newTestName || !newTestPrice) {
                        alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
                        return;
                      }
                      if (labTestsMaster.some(item => item.id.toLowerCase() === newTestId.trim().toLowerCase())) {
                        alert("টেস্ট কোডটি ইতোমধ্যে বিদ্যমান রয়েছে!");
                        return;
                      }
                      const newTest = {
                        id: newTestId.trim(),
                        name: newTestName.trim(),
                        category: newTestCategory,
                        price: parseInt(newTestPrice),
                        sampleType: newTestSample
                      };
                      setLabTestsMaster(prev => [...prev, newTest]);
                      setNewTestId("");
                      setNewTestName("");
                      setNewTestPrice("");
                      alert("নতুন টেস্ট সফলভাবে ক্যাটালগে যুক্ত করা হয়েছে!");
                    }}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md hover:shadow-sm transition-all font-bold py-2.5 rounded-xl border-none cursor-pointer uppercase tracking-wider text-xs"
                  >
                    + যুক্ত করুন (Add Test Master)
                  </button>
                )}
              </div>

              {/* Existing test list items scroll block */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar border-t pt-3 mt-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-9000">বিদ্যমান টেস্ট তালিকা (Existing Test Records)</h4>
                {labTestsMaster.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-2 hover:bg-white border border-emerald-100 rounded-xl bg-white font-semibold">
                    <div className="truncate pr-1">
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-9000 py-0.5 px-1 rounded font-bold mr-1">{item.id}</span>
                      <span>{item.name} ({item.price} INR)</span>
                    </div>
                    <div className="flex gap-1.5 items-center select-none text-[11px] font-bold">
                      <button type="button"
                        onClick={() => {
                          setEditingTestId(item.id);
                          setNewTestId(item.id);
                          setNewTestName(item.name);
                          setNewTestPrice(item.price.toString());
                          setNewTestCategory(item.category);
                          setNewTestSample(item.sampleType);
                        }}
                        className="text-teal-800 hover:text-teal-850 bg-transparent border-none cursor-pointer font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button type="button"
                        onClick={() => {
                          if (confirm(`আপনি কি সত্যিই "${item.name}" টেস্টটি ডিলিট করতে চান?`)) {
                            setLabTestsMaster(prev => prev.filter(m => m.id !== item.id));
                            if (editingTestId === item.id) {
                              setEditingTestId(null);
                              setNewTestId("");
                              setNewTestName("");
                              setNewTestPrice("");
                            }
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer font-bold"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Package details config */}
            <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-5 shadow-sm space-y-4 md:col-span-2">
              <h3 className="text-xs font-black uppercase text-slate-900 border-b pb-2 flex items-center justify-between font-sans">
                <span>🎁 ল্যাব টেস্ট প্যাকেজ নির্মাতা (Lab Test Packages setup)</span>
                {editingPkgId !== null && (
                  <span className="text-[10px] bg-emerald-50/50mber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded animate-pulse select-none">EDIT MODE</span>
                )}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3.5 text-xs text-slate-755 font-semibold">
                  <div>
                    <label className="block  mb-1 font-bold text-slate-900 text-sm">প্যাকেজের নাম (Package Name)</label>
                    <input
                      type="text"
                      value={newPkgName}
                      onChange={(e) => setNewPkgName(e.target.value)}
                      placeholder="E.g., Cardiac Protection Checkup"
                      className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block  mb-1 font-bold text-slate-900 text-sm">প্যাকেজে অন্তর্ভুক্ত টেস্টসমূহ (Choose Package Tests)</label>
                    <div className="border border-emerald-100 shadow-sm rounded-2xl rounded-xl p-3 max-h-36 overflow-y-auto space-y-1 bg-white font-semibold text-slate-900">
                      {labTestsMaster.map(item => {
                        const isSel = newPkgSelectedTests.includes(item.id);
                        return (
                          <label key={item.id} className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded cursor-pointer select-none leading-none font-bold text-slate-900 text-sm">
                            <input
                              type="checkbox"
                              checked={isSel}
                              onChange={() => {
                                if (isSel) {
                                  setNewPkgSelectedTests(prev => prev.filter(id => id !== item.id));
                                } else {
                                  setNewPkgSelectedTests(prev => [...prev, item.id]);
                                }
                              }}
                              className="rounded text-teal-800 focus:ring-teal-500"
                            />
                            <span>{item.name} ({item.price} INR)</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] text-slate-9000 uppercase">Regular Sum Cost</span>
                      <strong className="block p-2 bg-slate-100 rounded-xl border font-mono font-black text-slate-900 text-sm">
                        {newPkgSelectedTests.reduce((sum, id) => sum + (labTestsMaster.find(t => t.id === id)?.price || 0), 0)} INR
                      </strong>
                    </div>
                    <div>
                      <label className="block text-[10px]  uppercase font-bold text-slate-900">প্যাকেজ অফার মূল্য (Offer Price)</label>
                      <input
                        type="number"
                        value={newPkgPrice}
                        onChange={(e) => setNewPkgPrice(e.target.value)}
                        placeholder="INR  Price"
                        className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-black text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  {editingPkgId !== null ? (
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => {
                          if (!newPkgName || newPkgSelectedTests.length === 0 || !newPkgPrice) {
                            alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
                            return;
                          }
                          setLabPackages(prev => prev.map(pkg => pkg.id === editingPkgId ? {
                            ...pkg,
                            name: newPkgName,
                            tests: [...newPkgSelectedTests],
                            price: parseInt(newPkgPrice)
                          } : pkg));
                          setEditingPkgId(null);
                          setNewPkgName("");
                          setNewPkgSelectedTests([]);
                          setNewPkgPrice("");
                          alert("প্যাকেজ সফলভাবে আপডেট সম্পন্ন করা হয়েছে!");
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-900 shadow-md text-slate-900 font-bold py-2.5 rounded-xl border-none cursor-pointer text-xs"
                      >
                        💾 সংরক্ষণ করুন (Save Package)
                      </button>
                      <button type="button"
                        onClick={() => {
                          setEditingPkgId(null);
                          setNewPkgName("");
                          setNewPkgSelectedTests([]);
                          setNewPkgPrice("");
                        }}
                        className="bg-slate-205 bg-slate-200 text-slate-705 font-bold py-2 px-4 rounded-xl border-none cursor-pointer text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPkgName || newPkgSelectedTests.length === 0 || !newPkgPrice) {
                          alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন!");
                          return;
                        }
                        const newPkg = {
                          id: `PKG-${Date.now().toString().slice(-3)}`,
                          name: newPkgName,
                          tests: [...newPkgSelectedTests],
                          price: parseInt(newPkgPrice)
                        };
                        setLabPackages(prev => [...prev, newPkg]);
                        setNewPkgName("");
                        setNewPkgSelectedTests([]);
                        setNewPkgPrice("");
                        alert("নতুন ল্যাব প্যাকেজ সফলভাবে তৈরি হয়েছে!");
                      }}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md hover:shadow-sm transition-all font-black py-2.5 rounded-xl border-none cursor-pointer uppercase text-xs"
                    >
                      + Create Package
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                  <h4 className="text-[10px] uppercase font-bold text-slate-9000">বিদ্যমান প্যাকেজসমূহ (Active Packages)</h4>
                  {labPackages.map(pkg => (
                    <div key={pkg.id} className="flex justify-between items-center text-xs p-3 hover:bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl bg-white font-semibold">
                      <div className="pr-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono bg-emerald-100/40 text-teal-200 font-bold text-[9px] px-1 rounded">{pkg.id}</span>
                          <span className="font-sans font-black text-slate-900 truncate block">{pkg.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-9000 mt-1">
                          প্যাকেজ অফার ফি: <strong className="text-teal-650 text-teal-605">{pkg.price} INR</strong> ({pkg.tests.length} টেস্ট)
                        </div>
                      </div>
                      <div className="flex gap-1.5 select-none font-bold text-[11px]">
                        <button type="button"
                          onClick={() => {
                            setEditingPkgId(pkg.id);
                            setNewPkgName(pkg.name);
                            setNewPkgSelectedTests([...pkg.tests]);
                            setNewPkgPrice(pkg.price.toString());
                          }}
                          className="text-teal-605 hover:text-teal-850 bg-transparent border-none cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button type="button"
                          onClick={() => {
                            if (confirm(`আপনি কি সত্যিই "${pkg.name}" প্যাকেজটি ডিলিট করতে চান?`)) {
                              setLabPackages(prev => prev.filter(p => p.id !== pkg.id));
                              if (editingPkgId === pkg.id) {
                                setEditingPkgId(null);
                                setNewPkgName("");
                                setNewPkgSelectedTests([]);
                                setNewPkgPrice("");
                              }
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
