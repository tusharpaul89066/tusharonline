import React, { useState } from "react";
import { CalendarCheck, Search, Download, Printer, CheckCircle } from "lucide-react";
import { Patient, Doctor, Bill } from "../types";

interface OpdAppointmentsTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  setEditModal: (modal: any) => void;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

export default function OpdAppointmentsTab({
  patients,
  setPatients,
  doctors,
  setEditModal,
  pushTimelineEvent,
  handleExportCSV,
  setBills,
}: OpdAppointmentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");
  const today = new Date().toISOString().split("T")[0];
  const firstDay = today.substring(0, 8) + '01';
  const [dateRange, setDateRange] = useState({ start: firstDay, end: today });
  const [opdSuccessMessage, setOpdSuccessMessage] = useState<{ patientName: string; doctorName: string; date: string } | null>(null);

  const handleQueueAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const pId = elements.pId.value;
    const docId = elements.docId.value;
    const appDate = elements.appDate.value;
    const opdOthersAmountStr = elements.opdOthersAmount.value;
    const opdOthersAmountVal = opdOthersAmountStr ? parseFloat(opdOthersAmountStr) : 0;
    const selectedDoc = doctors.find((d) => d.id === docId);
    const selectedPatient = patients.find((p) => p.id === pId);
    const opdDocFees = selectedDoc ? selectedDoc.fees : 1000;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          return {
            ...p,
            docId: docId,
            date: appDate,
            appointmentTime: selectedDoc ? selectedDoc.time : "",
            opdOthersAmount: opdOthersAmountVal,
            opdDoctorFees: opdDocFees,
          };
        }
        return p;
      })
    );

    const generatedBill: Bill = {
      invoice: `OPD-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: pId,
      patientName: selectedPatient ? selectedPatient.name : "Patient",
      patientMobile: selectedPatient ? selectedPatient.mobile : "N/A",
      date: appDate,
      total: opdDocFees + opdOthersAmountVal,
      paymentMode: "CASH",
      breakdown: {
         doc: opdDocFees + opdOthersAmountVal,
      }
    };
    
    if (setBills) {
      setBills((prev) => [generatedBill, ...prev]);
    }

    pushTimelineEvent(
      pId,
      "OPD Slot Queued",
      "Receptionist Node Desk",
      `Booked consultation slot under Dr. ${selectedDoc ? selectedDoc.name : ""} (${selectedDoc ? selectedDoc.spec : ""}) on date: ${appDate}.`
    );

    setOpdSuccessMessage({
      patientName: selectedPatient ? selectedPatient.name : "Patient",
      doctorName: selectedDoc ? selectedDoc.name : "Consult Doctor",
      date: appDate,
    });

    form.reset();

    setTimeout(() => {
      setOpdSuccessMessage(null);
    }, 7000);
  };

  const matchedPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchedDoc = doctors.find((d) => d.id === p.docId) || doctors[0];
    if (!matchedDoc && filterSpec !== "All") return false;

    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term);
    const matchesFilter =
      filterSpec === "All" || (matchedDoc && matchedDoc.spec === filterSpec);
    const dateVal = p.date;
    const matchesDate =
      (!dateRange.start || dateVal >= dateRange.start) &&
      (!dateRange.end || dateVal <= dateRange.end);

    return matchesSearch && matchesFilter && matchesDate && !p.appointmentCancelled;
  });

  return (
    <div id="opd-appointments-tab" className="space-y-6 animate-fade-in bg-white/40  border border-emerald-200 rounded-3xl p-6 shadow-sm font-semibold text-slate-800 text-xs text-xs">
      
      {/* Tab Header with clinical graphics decoration */}
      <div className="border-b border-emerald-100/80 pb-3.5">
        <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2 font-sans tracking-wide">
          <CalendarCheck className="text-teal-700 w-5 h-5" /> OPD Chambers Appointment Ticketing (বহিঃবিভাগ টিকেট)
        </h2>
        <p className="text-[11px] text-zinc-800 font-bold leading-relaxed mt-1 font-sans">
          Queue consultation tickets, specify consulting physicians, and print chamber pass receipts instantly.
        </p>
      </div>

      {opdSuccessMessage && (
        <div className="p-4 bg-emerald-50/80 border border-teal-500/30 rounded-2xl flex items-start gap-3 text-teal-800 animate-slide-in shadow-sm">
          <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-sans font-black uppercase text-[11px] tracking-wide text-teal-700">
              OPD TICKET ISSUED SUCCESSFULLY
            </p>
            <p className="text-[11px] text-teal-200 font-bold">
              Patient <strong className="text-slate-900">{opdSuccessMessage.patientName}</strong> successfully queued under <strong className="text-teal-700">Dr. {opdSuccessMessage.doctorName}</strong> on slot <span className="font-mono text-xs">{opdSuccessMessage.date}</span>.
            </p>
          </div>
          <button 
            onClick={() => setOpdSuccessMessage(null)}
            className="ml-auto font-mono text-[10px] text-teal-500 hover:text-teal-800 cursor-pointer border-none bg-transparent"
          >
            DISMISS
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        
        {/* Form panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-900 border-b border-emerald-100/80 pb-2 flex items-center gap-2 tracking-wide">
            Queue New Slot (চেম্বার বুকিং)
          </h3>
          <form onSubmit={handleQueueAppointment} className="space-y-4 font-semibold text-slate-800">
            <div>
              <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Select Registered Patient Card</label>
              <select
                name="pId"
                className="w-full border border-emerald-100  shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-50">
                    {p.id} — {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Clinic Attending Specialist</label>
              <select
                name="docId"
                className="w-full border border-emerald-100  shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-50">
                    Dr. {d.name} ({d.spec})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Add Others Amount</label>
              <input
                name="opdOthersAmount"
                type="number"
                min="0"
                placeholder="Optional extra charges"
                className="w-full border border-emerald-100 shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-bold text-xs bg-white"
              />
            </div>
            <div>
              <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold font-sans text-slate-900">Appointment Date</label>
              <input
                name="appDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full border border-emerald-100  shadow-inner text-black rounded-xl p-2.5 outline-none focus:border-teal-500/40 font-mono font-bold text-xs  placeholder:font-semibold bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-black py-3 rounded-xl border-none uppercase tracking-wider transition cursor-pointer shadow-md text-xs font-sans btn-action-blue"
            >
              Issue OPD Chamber Slip
            </button>
          </form>
        </div>

        {/* Directory queue panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-emerald-100/80 pb-2">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                Active Slot Consulting Queues
              </h3>
              <p className="text-[10.5px] text-zinc-800 font-bold mt-0.5">
                Total active consultations: <strong className="text-teal-700 font-mono font-black">{matchedPatients.length} slots</strong>
              </p>
            </div>
            <button
              onClick={() => {
                const cols = [
                  { label: "Patient Name", value: (p: Patient) => p.name },
                  { label: "Patient Case ID", value: (p: Patient) => p.id },
                  { label: "Doctor Spec", value: (p: Patient) => doctors.find((d) => d.id === p.docId)?.name || "Default Consult" },
                  { label: "Booking Slot Time", value: (p: Patient) => p.appointmentTime || "06:00 PM" },
                  { label: "Appointment Date", value: (p: Patient) => p.date },
                ];
                handleExportCSV("OPD_Consultation_Queues", cols, matchedPatients);
              }}
              className="bg-slate-50 text-slate-900 border border-emerald-100 hover:bg-white font-black px-3.5 py-1.5 rounded-xl text-[9.5px] uppercase cursor-pointer flex items-center gap-1.5 transition shadow-inner select-none"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" /> <span>Export CSV</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search patient name, mobile or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-emerald-100 shadow-inner rounded-xl p-2.5 pl-9 text-xs font-bold bg-slate-50 text-slate-900 outline-none placeholder-zinc-555"
              />
              <Search className="w-4 h-4 text-zinc-700 absolute left-3 top-3.5" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50/80 border border-emerald-100 rounded-xl px-3 py-2 text-[10.5px] font-bold shadow-inner text-slate-800">
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
              value={filterSpec}
              onChange={(e) => setFilterSpec(e.target.value)}
              className="border border-emerald-100 shadow-inner px-3.5 py-2 text-xs rounded-xl bg-slate-50 text-slate-900 font-bold cursor-pointer"
            >
              <option value="All" className="bg-slate-50">All Specialties</option>
              {Array.from(new Set(doctors.map((d) => d.spec))).map((spec) => (
                <option key={spec} value={spec} className="bg-slate-50">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-slate-50 border border-emerald-100 shadow-sm">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-white border-b border-emerald-100 text-[9.5px] uppercase font-black text-zinc-700 font-mono tracking-wider">
                  <th className="p-3.5 pl-4">Patient Details</th>
                  <th className="p-3.5">EHR Case ID</th>
                  <th className="p-3.5">Attending Specialist</th>
                  <th className="p-3.5 text-right pr-4">Options Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-semibold text-slate-800">
                {matchedPatients.map((p) => {
                  const docObj = doctors.find((d) => d.id === p.docId) || doctors[0];
                  return (
                    <tr key={p.id} className="hover:bg-white/40 transition">
                      <td className="p-3.5 pl-4 font-bold">
                        <span className="text-slate-900 block leading-tight">{p.name}</span>
                        <span className="text-[10px] text-zinc-700 block font-black mt-0.5 font-mono uppercase tracking-wider">
                          Slot: {p.appointmentTime || docObj?.time || "Waiting Slot"}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[10.5px] text-teal-700">
                        {p.id}
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-900 block leading-tight">Dr. {docObj?.name || "Clinician MD"}</span>
                        <span className="text-[8.5px] px-2 py-0.5 bg-emerald-50 text-teal-700 border border-teal-550 border-teal-500/20 rounded-md font-black uppercase mt-1 inline-block">
                          {docObj?.spec}
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-4 flex justify-end gap-2 font-bold select-none self-center h-full">
                        <button type="button"
                          onClick={() => setEditModal({ type: "opdTicket", data: { patient: p, doctor: docObj } })}
                          className="bg-white border border-emerald-100 text-teal-700 hover:border-teal-500/30 px-3.5 py-1.5 rounded-lg text-[9.5px] font-black uppercase cursor-pointer flex items-center gap-1.5"
                        >
                          <Printer className="w-3 h-3" /> <span>Consult Pass</span>
                        </button>
                        <button type="button"
                          onClick={() => setEditModal({ type: "appointment", data: { patient: p, doctor: docObj } })}
                          className="bg-white border border-emerald-100 text-indigo-400 hover:border-indigo-500/30 px-3.5 py-1.5 rounded-lg text-[9.5px] font-black uppercase cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Cancel consultation slot for ${p.name}?`)) {
                              setPatients((prev) =>
                                prev.map((item) =>
                                  item.id === p.id ? { ...item, appointmentCancelled: true } : item
                                )
                              );
                              pushTimelineEvent(p.id, "OPD Cancelled", "Service Operator Desk", `Cancelled OPD Booking.`);
                            }
                          }}
                          className="bg-white border border-emerald-100 text-rose-500 hover:border-rose-500/30 px-3.5 py-1.5 rounded-lg text-[9.5px] font-black uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {matchedPatients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-700 italic font-black text-[10.5px]">
                      Zero matching OPD slot bookings active in directory filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
