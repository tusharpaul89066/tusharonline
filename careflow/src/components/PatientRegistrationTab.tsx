import React, { useState } from "react";
import { UserPlus, Search, Download, Edit3, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Patient, User } from "../types";

interface PatientRegistrationTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  currentUser: User | null;
  setEditModal: (modal: any) => void;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
}

export default function PatientRegistrationTab({
  patients,
  setPatients,
  currentUser,
  setEditModal,
  pushTimelineEvent,
  handleExportCSV,
}: PatientRegistrationTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const today = new Date().toISOString().split("T")[0];
  const firstDay = today.substring(0, 8) + '01';
  const [dateRange, setDateRange] = useState({ start: firstDay, end: today });
  const [registrationMessage, setRegistrationMessage] = useState<{ id: string; name: string } | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const pId = `PID-${2001 + patients.length}`;
    const newP: Patient = {
      id: pId,
      uhid: `UHID-${212450 + patients.length}`,
      name: elements.pname.value,
      age: parseInt(elements.page.value) || 0,
      gender: elements.pgender.value,
      blood: elements.pblood.value,
      mobile: elements.pmobile.value,
      altMobile: elements.paltmobile.value,
      address: elements.paddress.value,
      guardian: elements.pguardian.value,
      guardianMobile: elements.pguardianmobile.value,
      aadhar: elements.paadhar.value,
      insurance: elements.pinsurance.value,
      emergency: elements.pemergency.value,
      history: elements.phistory.value,
      date: new Date().toISOString().split("T")[0],
      type: "OPD (Outpatient)",
      bed: "None",
      condition: "Stable",
      vitals: {
        bp: "120/80",
        pulse: "72",
        temp: "98.4",
        oxygen: "98",
        weight: "70",
        pain: "1",
      },
      timeline: [
        {
          status: "Patient Registered",
          date: new Date().toISOString().split("T")[0],
          time: "09:30 AM",
          updatedBy: `${currentUser?.name || "Service"} (Registrar)`,
          remarks: "Initial case card registration directory.",
        },
      ],
    };

    setPatients((prev) => [newP, ...prev]);
    setRegistrationMessage({ id: pId, name: newP.name });
    form.reset();
    
    // Auto clear success message after 7 seconds
    setTimeout(() => {
      setRegistrationMessage(null);
    }, 7000);
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.mobile.includes(term);
    const matchesGender = filterGender === "All" || p.gender === filterGender;
    const dateVal = p.date;
    const matchesDate =
      (!dateRange.start || dateVal >= dateRange.start) &&
      (!dateRange.end || dateVal <= dateRange.end);
    return matchesSearch && matchesGender && matchesDate;
  });

  return (
    <div id="patient-registration-tab" className="space-y-6 animate-fade-in bg-white/40  border border-emerald-200 rounded-3xl p-6 shadow-sm font-semibold text-slate-800 text-xs">
      
      {/* Header section with clinical diagnostics style */}
      <div className="border-b border-emerald-100/80 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2 font-sans tracking-wide">
            <UserPlus className="text-teal-700 w-5 h-5" /> Patient Case Registries File (রোগী নিবন্ধন)
          </h2>
          <p className="text-[11px] text-zinc-800 font-bold leading-relaxed mt-1 font-sans">
            Initialize patient profiles, check in triage records and assign core clinical dossier metrics dynamically.
          </p>
        </div>
      </div>

      {/* Modern state driven custom diagnostic toast banner */}
      {registrationMessage && (
        <div className="p-4 bg-emerald-50/80 border border-teal-500/30 rounded-2xl flex items-start gap-3.5 text-teal-800 animate-slide-in shadow-sm">
          <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-sans font-black uppercase text-[11px] tracking-wide text-teal-700">
              REGISTRATION AUTHORIZED SUCCESSFULLY
            </p>
            <p className="text-[11px] text-teal-200 font-bold">
              Case file created details: <strong className="text-slate-900">{registrationMessage.name}</strong> has been allocated Case Reference ID <strong className="text-teal-700 font-mono tracking-wider">{registrationMessage.id}</strong>.
            </p>
          </div>
          <button 
            onClick={() => setRegistrationMessage(null)}
            className="ml-auto font-mono text-[10px] text-teal-500 hover:text-teal-800 cursor-pointer border-none bg-transparent"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Grid registration input metrics */}
      <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Patient Full Name (নাম)</label>
          <input
            name="pname"
            required
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="e.g. Lipi Chowdhury"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Age (Years)</label>
          <input
            name="page"
            required
            type="number"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="e.g. 29"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Gender</label>
          <select
            name="pgender"
            className="w-full border border-emerald-100 /60 shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white"
          >
            <option className="bg-slate-50">Female</option>
            <option className="bg-slate-50">Male</option>
            <option className="bg-slate-50">Other</option>
          </select>
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Primary Contact Mobile (মোবাইল)</label>
          <input
            name="pmobile"
            required
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="017xxxxxxxx"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Alternative Contact</label>
          <input
            name="paltmobile"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="018xxxxxxxx"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Blood-Group</label>
          <select
            name="pblood"
            defaultValue="Others"
            className="w-full border border-emerald-100 /60 shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white"
          >
            <option value="Others" className="bg-slate-50">Others</option>
            <option className="bg-slate-50">O+</option>
            <option className="bg-slate-50">O-</option>
            <option className="bg-slate-50">A+</option>
            <option className="bg-slate-50">A-</option>
            <option className="bg-slate-50">B+</option>
            <option className="bg-slate-50">B-</option>
            <option className="bg-slate-50">AB+</option>
            <option className="bg-slate-50">AB-</option>
          </select>
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">National ID / Electoral Identity Code</label>
          <input
            name="paadhar"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="xxxx-xxxx-xxxx"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Insurance Assurer Policy Details</label>
          <input
            name="pinsurance"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="MetLife Secure Assurance"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Residential Location Address</label>
          <input
            name="paddress"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="Dhaka, Bangladesh"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Local Guardian Full Name</label>
          <input
            name="pguardian"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="Spouse or Father Name"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Guardian Primary Phone</label>
          <input
            name="pguardianmobile"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="019xxxxxxxx"
          />
        </div>
        <div>
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Emergency Rescue Contact Person</label>
          <input
            name="pemergency"
            type="text"
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
            placeholder="015xxxxxxxx"
          />
        </div>
        <div className="md:col-span-3">
          <label className="block  mb-1.5 text-[10.5px] uppercase tracking-wider font-bold text-slate-900">Clinical Symptoms / Previous Illness History Description</label>
          <textarea
            name="phistory"
            rows={2}
            className="w-full border border-emerald-100 /60 shadow-inner text-black placeholder-zinc-650 rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs resize-none  placeholder:font-semibold bg-white"
            placeholder="Specify known allergen codes, respiratory asthma, heart stents details..."
          />
        </div>
        <button
          type="submit"
          className="md:col-span-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-750 text-slate-950 shadow-md transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none w-full cursor-pointer text-xs btn-action-blue"
        >
          Authorize Case Registration Directory Card
        </button>
      </form>

      {/* Directory database tab filter & listings */}
      <div className="mt-8 border-t border-emerald-100 pt-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide font-sans">
              Registered Patients Demographics Directory
            </h3>
            <p className="text-[10.5px] text-zinc-800 font-bold mt-0.5 font-sans">
              Current loaded profiles: <strong className="text-teal-700 font-mono font-black">{filteredPatients.length} record nodes</strong>
            </p>
          </div>
          <button
            onClick={() => {
              const cols = [
                { label: "Ref ID", value: (p: Patient) => p.id },
                { label: "UHID", value: (p: Patient) => p.uhid },
                { label: "Name", value: (p: Patient) => p.name },
                { label: "Age", value: (p: Patient) => p.age },
                { label: "Gender", value: (p: Patient) => p.gender },
                { label: "Blood", value: (p: Patient) => p.blood },
                { label: "Mobile", value: (p: Patient) => p.mobile },
                { label: "Condition", value: (p: Patient) => p.condition },
                { label: "Checkin Date", value: (p: Patient) => p.date },
              ];
              handleExportCSV("Patients_Directory", cols, filteredPatients);
            }}
            className="bg-slate-50 text-slate-900 border border-emerald-100 hover:bg-white font-black px-4 py-2.5 rounded-xl text-[10px] uppercase cursor-pointer flex items-center gap-1.5 transition select-none font-sans shadow-inner"
          >
            <Download className="w-3.5 h-3.5 text-teal-405 text-teal-450 text-teal-700" /> <span>Spreadsheet CSV</span>
          </button>
        </div>

        {/* Filters and search queries */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by registered patient name, reference code, or mobile ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-emerald-100 shadow-inner rounded-xl p-2.5 pl-9 text-xs font-bold bg-slate-50 text-slate-900 outline-none placeholder-zinc-555"
            />
            <Search className="w-4 h-4 text-zinc-700 absolute left-3 top-3.5" />
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2 font-sans">
            <div className="flex items-center gap-1.5 bg-slate-50/80 border border-emerald-100 rounded-xl px-3 py-2 text-[10.5px] font-bold shadow-inner text-slate-800">
              <span className="text-zinc-550 text-zinc-700 uppercase text-[8.5px] tracking-wider font-black">From:</span>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-transparent border-none outline-none font-mono cursor-pointer text-slate-900 font-bold"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50/80 border border-emerald-100 rounded-xl px-3 py-2 text-[10.5px] font-bold shadow-inner text-slate-800">
              <span className="text-zinc-700 uppercase text-[8.5px] tracking-wider font-black">To:</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-transparent border-none outline-none font-mono cursor-pointer text-slate-900 font-bold"
              />
            </div>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="border border-emerald-100 shadow-inner px-3.5 py-2 text-xs rounded-xl bg-slate-50 text-slate-900 font-bold cursor-pointer"
            >
              <option value="All" className="bg-slate-50">All Genders</option>
              <option value="Male" className="bg-slate-50">Male</option>
              <option value="Female" className="bg-slate-50">Female</option>
              <option value="Other" className="bg-slate-50">Other</option>
            </select>
          </div>
        </div>

        {/* Database table records */}
        <div className="overflow-x-auto rounded-2xl bg-slate-50 border border-emerald-100 shadow-sm">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="bg-white border-b border-emerald-100 text-[9.5px] uppercase font-black text-zinc-700 font-mono tracking-wider">
                <th className="p-3.5 pl-4">Patient Profile Ref</th>
                <th className="p-3.5">Demographics</th>
                <th className="p-3.5">Condition Severity</th>
                <th className="p-3.5">Stay unit bed</th>
                <th className="p-3.5 text-right pr-4">Action Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-semibold text-slate-800 font-sans">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-white/40 transition">
                  <td className="p-3.5 pl-4">
                    <span className="font-extrabold text-slate-900 block leading-tight">{p.name}</span>
                    <span className="font-mono text-[9.5px] text-teal-700 block mt-0.5 uppercase tracking-wider">{p.id} • {p.uhid}</span>
                  </td>
                  <td className="p-3.5 text-slate-800">
                    <p className="leading-none text-slate-800">
                      {p.age} Yrs • {p.gender} • Blood: <span className="text-teal-700 font-bold font-mono">{p.blood}</span>
                    </p>
                    <p className="font-mono text-[9.5px] text-zinc-700 mt-1 leading-none font-bold">
                      {p.mobile}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[8.5px] uppercase font-black border ${
                        p.condition === "Critical" 
                          ? "bg-rose-950/60 text-rose-455 text-rose-400 border-rose-500/20" 
                          : p.condition === "Serious"
                          ? "bg-amber-950/60 text-amber-400 border-amber-500/10"
                          : "bg-emerald-50/60 text-teal-700 border-teal-500/10"
                      }`}
                    >
                      {p.condition}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-black text-slate-350">
                    {p.bed === "None" ? (
                      <span className="text-zinc-700 text-[10.5px]">OPD CONSULTATION</span>
                    ) : (
                      <span className="text-slate-250 font-semibold text-slate-800">CABIN - {p.bed}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right pr-4 flex justify-end gap-2 font-bold select-none h-full self-center">
                    <button onClick={() => setEditModal({ type: "patient", data: p })}
                      className="bg-slate-905 bg-white border border-emerald-100 text-teal-700 hover:border-teal-500/30 font-black px-3.5 py-1.5 rounded-lg text-[9.5px] font-sans font-black uppercase cursor-pointer"
                    >
                      Edit Info
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel demographic case file for ${p.name}?`)) {
                          setPatients((prev) => prev.filter((item) => item.id !== p.id));
                          pushTimelineEvent(p.id, "Case Discarded", `${currentUser?.name || "System"}`, "Discarded patient files registry.");
                        }
                      }}
                      className="bg-white border border-emerald-100 text-rose-500 hover:border-rose-500/30 px-3.5 py-1.5 rounded-lg text-[9.5px] font-sans font-black uppercase cursor-pointer"
                    >
                      Discard
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-9 text-center text-zinc-700 italic font-black text-[10.5px]">
                    No matching patient case profiles registered in directory filters.
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
