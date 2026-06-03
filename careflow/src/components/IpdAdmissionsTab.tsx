import React, { useState } from "react";
import { BedDouble, Search, Download } from "lucide-react";
import { Patient, Doctor, Bed, Staff } from "../types";

interface IpdAdmissionsTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  beds: Bed[];
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
  staff: Staff[];
  setEditModal: (modal: any) => void;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
  currentUser: any;
}

export default function IpdAdmissionsTab({
  patients,
  setPatients,
  doctors,
  beds,
  setBeds,
  staff,
  setEditModal,
  pushTimelineEvent,
  handleExportCSV,
  currentUser,
}: IpdAdmissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("All");

  const handleAuthorizeAdmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const pId = elements.pId.value;
    const bedId = elements.bedId.value;
    const docName = elements.docName.value;
    const nurseIncharge = elements.nurseIncharge.value;
    const pCond = elements.pCond.value;
    const diag = elements.diag.value;
    const packageAmount = elements.packageAmount.value ? Math.round(parseFloat(elements.packageAmount.value)) : undefined;
    const referBy = elements.referBy.value;
    const commissionType = elements.commissionType.value;
    const commissionValue = elements.commissionValue.value ? Math.round(parseFloat(elements.commissionValue.value)) : undefined;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          return {
            ...p,
            type: "IPD (Indoor Patient)",
            bed: bedId,
            condition: pCond,
            packageAmount: packageAmount,
            referBy: referBy,
            commissionType: commissionType,
            commissionValue: commissionValue,
            history: `${p.history || ""}. Admitted under Doctor: ${docName}, Nurse: ${nurseIncharge}. Diagnosis Cause: ${diag}.`,
            timeline: [
              ...(p.timeline || []),
              {
                status: "Admitted",
                date: new Date().toISOString().split("T")[0],
                time: "10:30 AM",
                updatedBy: `${currentUser?.name || "Service Incharge"}`,
                remarks: `IPD Ward Admission triggered. Cause: ${diag}`,
              },
              {
                status: "Bed Allocated",
                date: new Date().toISOString().split("T")[0],
                time: "11:00 AM",
                updatedBy: "Nurse Administration Incharge",
                remarks: `Allocated cabin staying unit location: ${bedId}`,
              },
            ],
          };
        }
        return p;
      })
    );

    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status: "Occupied" } : b))
    );

    alert("IPD Admissions Authorized in Clinical Ledger.");
    form.reset();
  };

  const admittedPatients = patients.filter(
    (p) => p.bed !== "None" && p.condition !== "Discharged"
  );

  const filteredAdmitted = admittedPatients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.bed.toLowerCase().includes(term);
    const matchesFilter =
      filterCondition === "All" || p.condition === filterCondition;
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="ipd-admissions-tab" className="space-y-6 animate-fade-in bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-6 shadow-sm font-semibold text-slate-900 text-xs">
      <div className="border-b pb-3.5">
        <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
          <BedDouble className="text-teal-800" /> IPD Indoor Ward Admissions Center (ভর্তি ও বেড বন্টন)
        </h2>
        <p className="text-xs text-slate-9000 font-normal leading-relaxed mt-0.5">
          Request, book, lock and authorize patient Delux Cabins or general ICU ward stays with direct live database checks.
        </p>
      </div>

      <form onSubmit={handleAuthorizeAdmission} className="grid grid-cols-1 md:grid-cols-4 gap-5 text-slate-800">
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Select Registered Outpatient (রুগী নির্বাচন)</label>
          <select
            name="pId"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl  outline-none font-bold   placeholder:font-semibold bg-white text-black"
          >
            {patients
              .filter((p) => p.bed === "None" && p.condition !== "Discharged")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Available Cabin units (বেড নং)</label>
          <select
            name="bedId"
            className="w-full border border-slate-205 p-2.5 rounded-xl  outline-none font-bold   placeholder:font-semibold bg-white text-black"
          >
            {beds
              .filter((b) => b.status === "Available")
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.type})
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Consulting Physician</label>
          <select
            name="docName"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl  outline-none font-bold   placeholder:font-semibold bg-white text-black"
          >
            {doctors.map((d) => (
              <option key={d.id} value={`Dr. ${d.name}`}>
                Dr. {d.name} ({d.spec})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Assigned Nurse in-charge</label>
          <select
            name="nurseIncharge"
            defaultValue="OTHERS"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl  outline-none font-bold   placeholder:font-semibold bg-white text-black"
          >
            <option value="OTHERS">OTHERS</option>
            {staff
              .filter((s) => s.role === "Nurse")
              .map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.shift})
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Stay Severity Status</label>
          <select
            name="pCond"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl  outline-none font-bold  text-black  placeholder:font-semibold bg-white"
          >
            <option value="Stable">Stable Support (স্থিতিশীল)</option>
            <option value="Observation">Continuous Observation (পর্যবেক্ষণে)</option>
            <option value="Serious">Serious Patient Monitor (গুরুতর)</option>
            <option value="Critical">Critical high-risk Life support (ঝুঁকিপূর্ণ)</option>
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Principal Diagnosed Causes</label>
          <input
            name="diag"
            required
            type="text"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 font-bold    placeholder:font-semibold bg-white text-black"
            placeholder="e.g. Ketoacidosis, Severe Dyspnea..."
          />
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Total Package Contact Amount</label>
          <input
            name="packageAmount"
            type="number"
            min="0"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 font-bold    placeholder:font-semibold bg-white text-black"
            placeholder="e.g. 50000"
          />
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Refer By</label>
          <input
            name="referBy"
            type="text"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 font-bold    placeholder:font-semibold bg-white text-black"
            placeholder="e.g. Dr. Rahim"
          />
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Commission Type</label>
          <select
            name="commissionType"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl  outline-none font-bold   placeholder:font-semibold bg-white text-black"
          >
            <option value="amount">Amount / Fixed</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
        <div>
          <label className="block  mb-1 font-bold text-slate-900 text-sm">Commission Value</label>
          <input
            name="commissionValue"
            type="number"
            min="0"
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 font-bold    placeholder:font-semibold bg-white text-black"
            placeholder="e.g. 500 or 10"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-4 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none cursor-pointer text-xs btn-action-blue"
        >
          Authorize Ward Indoor Case Admission
        </button>
      </form>

      {/* Database stay logs */}
      <div className="mt-8 border-t pt-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">
              Active IPD Cabin Ward Admissions
            </h3>
            <p className="text-[11px] text-slate-9000 font-normal">
              Total staying in ward: <strong className="text-slate-800">{filteredAdmitted.length} folders</strong>
            </p>
          </div>
          <button
            onClick={() => {
              const cols = [
                { label: "Ref ID", value: (p: Patient) => p.id },
                { label: "Patient", value: (p: Patient) => p.name },
                { label: "Staying Cabin", value: (p: Patient) => p.bed },
                { label: "Clinical Condition", value: (p: Patient) => p.condition },
                { label: "Contact No", value: (p: Patient) => p.mobile },
                { label: "Admit Date", value: (p: Patient) => p.date },
              ];
              handleExportCSV("IPD_Indoor_Admissions", cols, filteredAdmitted);
            }}
            className="bg-white text-slate-800 hover:bg-emerald-50/80 border border-slate-200/80 font-bold p-2 px-3.5 rounded-xl text-[10px] uppercase border-none cursor-pointer flex items-center gap-1.5 transition select-none"
          >
            <Download className="w-3.5 h-3.5" /> <span>Spreadsheet CSV</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search active patient name, staying Cabin id, ward section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 pl-9 rounded-xl text-xs font-semibold bg-white outline-none"
            />
            <Search className="w-4 h-4 text-slate-9000 absolute left-3 top-3.5" />
          </div>
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="border border-emerald-100 shadow-sm rounded-2xl p-2 text-xs rounded-xl bg-white font-bold outline-none cursor-pointer"
          >
            <option value="All">All Conditions</option>
            <option value="Stable">Stable</option>
            <option value="Observation">Observation</option>
            <option value="Serious">Serious (ICU)</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white rounded-2xl shadow border border-emerald-100/80 text-slate-900">
          <table className="w-full text-left font-medium text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b text-[10px] uppercase font-bold text-slate-9000">
                <th className="p-3 pl-4">Patient ref</th>
                <th className="p-3">Cabin Bed stays Allocation</th>
                <th className="p-3">Clinical Severity</th>
                <th className="p-3 text-right pr-4">Actions options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 animate-none">
              {filteredAdmitted.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/80">
                  <td className="p-3 pl-4">
                    <span className="font-black text-slate-900 block leading-tight">{p.name}</span>
                    <span className="font-mono text-[10px] text-indigo-750 text-indigo-700 block mt-0.5">{p.id} • {p.uhid}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-black text-slate-900 text-sm bg-slate-100 px-2 py-1 rounded inline-block">
                      {p.bed}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] uppercase font-black border ${p.condition === "Critical" ? "bg-red-50 text-red-700 border-red-200 animate-pulse" : "bg-orange-50 text-orange-700 border-orange-200"}`}
                    >
                      {p.condition}
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 flex justify-end gap-1.5 font-bold">
                    <button onClick={() => setEditModal({ type: "admission", data: p })}
                      className="bg-emerald-100/40 text-teal-200 hover:bg-emerald-100/40 border-none px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Manage Stay
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel indoor stay for ${p.name}? This frees ${p.bed}.`)) {
                          const oldBed = p.bed;
                          setPatients((prev) =>
                            prev.map((item) =>
                              item.id === p.id ? { ...item, bed: "None", type: "OPD (Outpatient)" } : item
                            )
                          );
                          setBeds((prev) =>
                            prev.map((b) => (b.id === oldBed ? { ...b, status: "Available" } : b))
                          );
                          pushTimelineEvent(
                            p.id,
                            " stay cancelled",
                            "Ward Admissions node",
                            `Admission stay aborted for bed Stay unit: ${oldBed}`
                          );
                          alert("Stay assignment cancelled successfully.");
                        }
                      }}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 border-none px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAdmitted.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-9000 italic font-semibold">
                    Zero active Indoor patient stay files in selected registries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
