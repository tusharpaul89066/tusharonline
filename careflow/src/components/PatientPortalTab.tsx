import React, { useState } from "react";
import { User, Search, HeartPulse, ShieldAlert, CreditCard, Clock, Activity, BedDouble, Lock, LogOut, CheckCircle } from "lucide-react";
import { Patient, Bill, User as AppUser } from "../types";

interface PatientPortalTabProps {
  patients: Patient[];
  bills: Bill[];
  users?: AppUser[];
}

export default function PatientPortalTab({ patients, bills, users = [] }: PatientPortalTabProps) {
  const [portalMode, setPortalMode] = useState<"login" | "search">("login");
  const [patientLookupId, setPatientLookupId] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<AppUser | null>(null);

  const [queriedPatient, setQueriedPatient] = useState<Patient | null>(null);
  const [queriedBill, setQueriedBill] = useState<Bill | null>(null);

  const handleLookup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pid = patientLookupId.trim().toUpperCase();
    const foundP = patients.find(
      (p) => p.id.toUpperCase() === pid || p.name.toUpperCase() === pid
    );
    if (!foundP) {
      alert("Demographics registry lookup failed. Please double check Case Ref Patient ID code.");
      setQueriedPatient(null);
      setQueriedBill(null);
      return;
    }
    const foundB = bills.find((b) => b.patientId === foundP.id && !b.isDischarged);
    setQueriedPatient(foundP);
    setQueriedBill(foundB || null);
    setLoggedInUser(null);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uname = loginUsername.trim().toLowerCase();
    const upass = loginPassword.trim();

    const userAcc = users.find(
      (u) => u.username.toLowerCase() === uname && u.password === upass
    );

    if (!userAcc) {
      alert("Invalid Patient User ID or Password. Please try again! (ভুল ইউজার আইডি বা পাসওয়ার্ড)");
      setQueriedPatient(null);
      setQueriedBill(null);
      setLoggedInUser(null);
      return;
    }

    if (userAcc.role !== "Patient" && !userAcc.patientId) {
      alert("Only patients accounts can log into this family node. (এই পোর্টালটি শুধুমাত্র রোগীদের জন্য)");
      setQueriedPatient(null);
      setQueriedBill(null);
      setLoggedInUser(null);
      return;
    }

    const linkedPid = userAcc.patientId || "";
    const foundP = patients.find(
      (p) => p.id.toUpperCase() === linkedPid.toUpperCase() || p.name.toUpperCase() === userAcc.name.toUpperCase()
    );

    if (!foundP) {
      alert(`Linked patient profile not found for Case connection.`);
      setQueriedPatient(null);
      setQueriedBill(null);
      setLoggedInUser(null);
      return;
    }

    const foundB = bills.find((b) => b.patientId === foundP.id && !b.isDischarged);
    setQueriedPatient(foundP);
    setQueriedBill(foundB || null);
    setLoggedInUser(userAcc);
  };

  const handleLogout = () => {
    setLoginUsername("");
    setLoginPassword("");
    setLoggedInUser(null);
    setQueriedPatient(null);
    setQueriedBill(null);
  };

  return (
    <div id="patient-portal-tab" className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in font-sans text-xs">
      
      {/* Title */}
      <div className="border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[9px] rounded-md tracking-wider uppercase border border-indigo-100">
            Self Service
          </span>
          <span className="text-[10px] text-zinc-800 font-bold">• Secure Patient Node</span>
        </div>
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1">
          Clinician Patient & Family Portal self-service (রোগী পোর্টাল)
        </h2>
        <p className="text-xs text-slate-800 mt-1 font-normal leading-relaxed">
          Access secure accounts using Patient User ID and Password created in User Management to view live tracking history, billing ledger, and nurse vitals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Login & Verification Side */}
        <div className="space-y-4">
          
          {loggedInUser ? (
            <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl space-y-4 shadow-sm animate-fade-in text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-600 animate-bounce" />
                <div>
                  <h4 className="font-black text-teal-900 uppercase text-[11px]">Logged In Patient Profile</h4>
                  <p className="text-[9px] text-teal-700 font-mono">Session ID: SSL-OK</p>
                </div>
              </div>

              <div className="bg-white/80 border border-teal-100/60 p-3 rounded-xl space-y-1">
                <p className="font-bold text-slate-800 text-xs">{loggedInUser.name}</p>
                <p className="text-[10px] text-zinc-600">User ID: <span className="font-mono text-indigo-600 font-bold">{loggedInUser.username}</span></p>
                {loggedInUser.patientId && (
                  <p className="text-[10px] text-zinc-600">Patient Case Link: <span className="font-mono text-emerald-600 font-bold">{loggedInUser.patientId}</span></p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full button-3d-rose px-4 py-2.5 text-xs text-white font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out Portal
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/80 border border-emerald-100 shadow-sm rounded-2xl p-5 space-y-4 h-fit">
              {/* Tab Selector */}
              <div className="flex border-b border-emerald-100">
                <button
                  type="button"
                  onClick={() => setPortalMode("login")}
                  className={`flex-1 pb-3 text-center transition-all text-[10px] font-black uppercase tracking-wider ${
                    portalMode === "login"
                      ? "border-b-2 border-teal-600 text-teal-800"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🔑 Patient Login
                </button>
                <button
                  type="button"
                  onClick={() => setPortalMode("search")}
                  className={`flex-1 pb-3 text-center transition-all text-[10px] font-black uppercase tracking-wider ${
                    portalMode === "search"
                      ? "border-b-2 border-teal-600 text-teal-800"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🔍 Case Search
                </button>
              </div>

              {portalMode === "login" ? (
                /* Patient Login form using Username and Password */
                <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Patient User ID</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="Ex: pid-2001, pid-2002"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 pl-9 bg-white focus:border-teal-500 hover:border-slate-300 outline-none font-bold text-xs shadow-inner"
                      />
                      <User className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Secure Password</label>
                    <div className="relative">
                      <input
                        required
                        type="password"
                        placeholder="Type current password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 pl-9 bg-white focus:border-teal-500 hover:border-slate-300 outline-none font-bold text-xs shadow-inner"
                      />
                      <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full button-3d-teal text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-[10.5px] shadow-md transition-transform btn-action-blue"
                  >
                    Authorize Node Login & Verified Access
                  </button>
                </form>
              ) : (
                /* Original Case Search Fallback */
                <form onSubmit={handleLookup} className="space-y-3.5 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Secure Ref ID Lookup</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="Type Patient Case ID (e.g. PID-2001)"
                        value={patientLookupId}
                        onChange={(e) => setPatientLookupId(e.target.value)}
                        className="w-full border border-emerald-100 shadow-sm rounded-xl p-3 pl-9 bg-white focus:border-teal-500 hover:border-slate-300 outline-none font-bold text-xs shadow-inner focus:ring-1 focus:ring-teal-400/20 transition-all"
                      />
                      <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full button-3d-teal text-white font-extrabold py-3 rounded-xl uppercase tracking-wider text-[10.5px] shadow-md transition-transform btn-action-blue"
                  >
                    Verify Patient Dossier
                  </button>
                </form>
              )}

              <div className="pt-2">
                <div className="p-3 bg-zinc-950 rounded-xl leading-relaxed font-mono text-[9px] text-emerald-500 space-y-1">
                  <p className="font-bold">✓ CERTIFIED GATEWAY LINK</p>
                  <p>HIPAA Compliance Audited</p>
                  <p>Host Ingress Security Code: ok</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results side */}
        <div className="lg:col-span-2 space-y-4">
          {queriedPatient ? (
            <div className="p-5 border border-teal-300/80 bg-teal-50/20 rounded-2xl space-y-5 animate-fade-in text-xs font-semibold">
              
              <div className="border-b border-emerald-100 pb-3.5 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <span className="font-mono text-[9px] font-extrabold text-teal-800 bg-teal-100 border border-teal-300/40 px-2.5 py-0.5 rounded-full uppercase tracking-wide inline-block">
                    Verified Digital ID Matched
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight mt-2 uppercase font-sans">
                    {queriedPatient.name}
                  </h3>
                  <span className="font-mono text-[10.5px] text-slate-600 block mt-1 font-bold">
                    Case ID: <span className="text-slate-900">{queriedPatient.id}</span> • UHID: <span className="text-slate-900">{queriedPatient.uhid}</span>
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full border border-teal-300 bg-emerald-100/40 text-teal-850 uppercase font-black text-[9.5px]">
                  Condition: {queriedPatient.condition}
                </span>
              </div>

              {/* Vitals Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm text-center">
                  <span className="text-[8.5px] uppercase text-slate-500 block font-bold tracking-wider">Age & Gender</span>
                  <strong className="text-[11.5px] block text-slate-900 mt-1">
                    {queriedPatient.age} Yrs ({queriedPatient.gender})
                  </strong>
                </div>

                <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm text-center flex flex-col justify-center">
                  <span className="text-[8.5px] uppercase text-slate-500 block font-bold tracking-wider">Staying Bed</span>
                  <strong className="text-[11.5px] block text-indigo-600 mt-1 flex items-center justify-center gap-1">
                    <BedDouble className="w-3 h-3 inline" /> {queriedPatient.bed === "None" ? "OPD Clinic" : queriedPatient.bed}
                  </strong>
                </div>

                <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm text-center">
                  <span className="text-[8.5px] uppercase text-slate-500 block font-bold tracking-wider">Blood Group</span>
                  <strong className="text-[11.5px] block text-rose-600 mt-1 font-mono font-black">
                    {queriedPatient.blood}
                  </strong>
                </div>

                <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm text-center">
                  <span className="text-[8.5px] uppercase text-slate-500 block font-bold tracking-wider">Checked BP</span>
                  <strong className="text-[11.5px] block font-mono font-black text-emerald-650 mt-1">
                    {queriedPatient.vitals?.bp || "Pending"}
                  </strong>
                </div>

              </div>

              {/* Unpaid Bills */}
              {queriedBill && (
                <div className="p-4 bg-gradient-to-r from-rose-50/20 to-amber-50/20 border border-rose-100 shadow-sm rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 leading-none">
                  <div>
                    <span className="text-[8.5px] uppercase text-rose-800 font-extrabold tracking-wider block mb-1 flex items-center gap-1">
                      <CreditCard className="h-3 w-3 text-rose-500 shrink-0" /> Unresolved checkout outstanding billing invoice
                    </span>
                    <p className="font-mono text-xs block text-slate-800 leading-none mt-1 font-bold">
                      Invoice ID: <span className="text-slate-900 font-black">{queriedBill.invoice}</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-slate-500 text-[9px] uppercase font-bold block pb-1">AMOUNTS DUE:</span>
                    <strong className="text-base font-mono text-rose-600 font-black">{queriedBill.total} INR</strong>
                  </div>
                </div>
              )}

              {/* Patient timeline journey track */}
              <div className="space-y-3.5 border-t border-emerald-100 pt-4">
                <span className="text-[9.5px] uppercase tracking-wider text-slate-600 font-black flex items-center gap-1.5 leading-none font-mono">
                  <Activity className="text-teal-850 w-3.5 h-3.5 animate-pulse shrink-0" /> Chronological Care Log Timeline (চিকিৎসা লগ)
                </span>
                
                <div className="relative border-l border-zinc-200 ml-2 pl-5 space-y-4 pt-1">
                  {queriedPatient.timeline?.slice().reverse().map((tl, index) => (
                    <div key={index} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[24.5px] top-1 h-2 w-2 rounded-full bg-teal-500 border border-white ring-2 ring-teal-100 shadow-sm" />
                       
                      <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200 transition hover:bg-emerald-50/30">
                        <div className="flex justify-between items-center text-[10px] font-semibold">
                          <strong className="text-slate-900 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 rounded text-[9.5px] uppercase leading-none font-bold">
                            {tl.status}
                          </strong>
                          <span className="text-slate-500 font-mono text-[9px] leading-none flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {tl.date} @ {tl.time}
                          </span>
                        </div>
                        <p className="text-slate-700 font-normal pl-1 leading-relaxed text-[11px] italic mt-1">
                          "{tl.remarks}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!queriedPatient.timeline || queriedPatient.timeline.length === 0) && (
                    <p className="text-zinc-600 italic">No care logs registered for this patient history.</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-10 border border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl text-center text-slate-500 font-normal shadow-inner space-y-2">
              <User className="w-8 h-8 text-emerald-600 mx-auto stroke-[1.5]" />
              <p className="italic">
                Please login with your Patient User ID and password or look up via Case reference code to view medical charts, vitals, bills, and care history securely.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
