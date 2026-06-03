import React, { useState, useEffect } from "react";
import { X, Save, ShieldCheck } from "lucide-react";
import { Patient } from "../types";

interface PatientEditFormModalProps {
  patient: Patient;
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

export default function PatientEditFormModal({
  patient,
  onClose,
  onSave,
}: PatientEditFormModalProps) {
  // Local form states
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);
  const [gender, setGender] = useState(patient.gender);
  const [blood, setBlood] = useState(patient.blood || "Others");
  const [mobile, setMobile] = useState(patient.mobile);
  const [altMobile, setAltMobile] = useState(patient.altMobile || "");
  const [address, setAddress] = useState(patient.address || "");
  const [guardian, setGuardian] = useState(patient.guardian || "");
  const [guardianMobile, setGuardianMobile] = useState(patient.guardianMobile || "");
  const [aadhar, setAadhar] = useState(patient.aadhar || "");
  const [insurance, setInsurance] = useState(patient.insurance || "");
  const [emergency, setEmergency] = useState(patient.emergency || "");
  const [history, setHistory] = useState(patient.history || "");
  const [condition, setCondition] = useState(patient.condition || "Stable");
  
  // Vitals states
  const [bp, setBp] = useState(patient.vitals?.bp || "120/80");
  const [pulse, setPulse] = useState(patient.vitals?.pulse || "72");
  const [temp, setTemp] = useState(patient.vitals?.temp || "98.4");
  const [oxygen, setOxygen] = useState(patient.vitals?.oxygen || "98");
  const [weight, setWeight] = useState(patient.vitals?.weight || "70");
  const [pain, setPain] = useState(patient.vitals?.pain || "1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedPatient: Patient = {
      ...patient,
      name,
      age: Number(age),
      gender,
      blood,
      mobile,
      altMobile,
      address,
      guardian,
      guardianMobile,
      aadhar,
      insurance,
      emergency,
      history,
      condition,
      vitals: {
        bp,
        pulse,
        temp,
        oxygen,
        weight,
        pain,
      },
    };

    onSave(updatedPatient);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 overflow-y-auto leading-normal">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 text-slate-900 shadow-sm relative border border-emerald-100 shadow-sm rounded-2xl custom-scrollbar max-h-[90vh] overflow-y-auto">
        <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-indigo-505 via-indigo-500 to-emerald-500"></span>
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <ShieldCheck className="text-teal-800 w-5 h-5" /> Edit Patient Demographics
            </h2>
            <p className="text-slate-9000 text-xs font-normal mt-1 leading-normal">
              Modify demographic file directories and registered triaged case histories for:{" "}
              <b className="text-teal-800 font-mono font-bold">{patient.id} ({patient.uhid})</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-slate-9000 hover:text-rose-500 hover:bg-rose-50 border-none rounded-xl cursor-pointer transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal edit form */}
        <form onSubmit={handleSubmit} className="space-y-5 font-semibold text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Primary Details Block */}
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Patient Full Name (নাম)</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Age (Years)</label>
              <input
                required
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl bg-white outline-none font-bold"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Primary Contact Mobile</label>
              <input
                required
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Alternative Contact</label>
              <input
                type="text"
                value={altMobile}
                onChange={(e) => setAltMobile(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Blood-Group</label>
              <select
                value={blood}
                onChange={(e) => setBlood(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl bg-white outline-none font-bold"
              >
                <option value="Others">Others</option>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">National Aadhar ID</label>
              <input
                type="text"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Insurance Assurer</label>
              <input
                type="text"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Condition Severity</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl bg-white outline-none font-bold"
              >
                <option>Stable</option>
                <option>Observation</option>
                <option>Serious</option>
                <option>Critical</option>
                <option>Discharged</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Guardian Name</label>
              <input
                type="text"
                value={guardian}
                onChange={(e) => setGuardian(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Guardian Phone Contact</label>
              <input
                type="text"
                value={guardianMobile}
                onChange={(e) => setGuardianMobile(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block  mb-1 text-[11px] font-bold text-slate-900">Emergency Contact Mobile</label>
              <input
                type="text"
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2 rounded-xl outline-none focus:border-teal-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 font-semibold"
            />
          </div>

          {/* Clinical Symptoms and History */}
          <div className="col-span-1 sm:col-span-3">
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Clinical Symptoms / Previous Illness History</label>
            <textarea
              rows={2}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl outline-none focus:border-teal-500 bg-white font-medium resize-none"
            />
          </div>

          {/* Vitals Demographics Block */}
          <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl/60 rounded-xl p-4 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-9000 tracking-wider block">
              🔧 Patient Core Vitals Record (জরুরী ভাইটাল পরিমাপক)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">BP (Blood Pressure)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">Pulse Rate (bpm)</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">Temperature (°F)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">Oxygen SpO2 (%)</label>
                <input
                  type="text"
                  value={oxygen}
                  onChange={(e) => setOxygen(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">Weight (Kg)</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block  text-[10px] mb-0.5 font-bold text-slate-900">Pain Scale (1-10)</label>
                <input
                  type="text"
                  value={pain}
                  onChange={(e) => setPain(e.target.value)}
                  className="w-full border border-emerald-100 shadow-sm rounded-2xl p-1.5 text-center rounded-lg bg-white font-mono font-bold focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-emerald-100 shadow-sm rounded-2xl rounded-xl bg-white hover:bg-white text-slate-800 font-bold text-xs uppercase cursor-pointer text-center select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none transition cursor-pointer text-xs flex items-center justify-center gap-1.5 btn-action-blue"
            >
              <Save className="w-4 h-4 text-slate-950" /> Save Patient Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
