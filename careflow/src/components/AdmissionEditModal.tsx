import React, { useState } from "react";
import { X, BedDouble, Save } from "lucide-react";
import { Patient, Doctor, Bed } from "../types";

interface AdmissionEditModalProps {
  patient: Patient;
  doctors: Doctor[];
  beds: Bed[];
  onClose: () => void;
  onSave: (updatedPatient: Patient, targetBedId?: string) => void;
}

export default function AdmissionEditModal({
  patient,
  doctors,
  beds,
  onClose,
  onSave,
}: AdmissionEditModalProps) {
  const [selectedDocId, setSelectedDocId] = useState(patient.docId || "");
  const [bedCharge, setBedCharge] = useState(patient.bed || "None");
  const [condition, setCondition] = useState(patient.condition || "Stable");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPatient: Patient = {
      ...patient,
      docId: selectedDocId,
      bed: bedCharge,
      condition,
    };
    onSave(updatedPatient, bedCharge !== patient.bed ? bedCharge : undefined);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 leading-normal">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-sm relative border border-emerald-200 shadow-sm rounded-2xl">
        <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></span>

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4 border-emerald-100">
          <div>
            <h2 className="text-base font-extrabold text-emerald-900 uppercase flex items-center gap-2">
              <BedDouble className="text-emerald-600 w-5 h-5" /> Edit Patient Admission (IPD)
            </h2>
            <p className="text-slate-9000 text-xs font-normal mt-1 leading-normal">
              Adjust inpatient cabin beds, attending specialist, or severity statuses for:{" "}
              <b className="text-emerald-700 font-mono font-bold">{patient.name}</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-slate-9000 hover:text-rose-500 hover:bg-rose-50 border-none rounded-xl cursor-pointer transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-xs">
          <div>
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Primary Attending Specialist</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 outline-none font-bold focus:border-emerald-500"
            >
              <option value="">-- No Specialist Assigned --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  DR. {doc.name} ({doc.spec})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Inpatient Cabin / Ward Bed</label>
            <select
              value={bedCharge}
              onChange={(e) => setBedCharge(e.target.value)}
              className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 outline-none font-bold focus:border-emerald-500"
            >
              <option value="None">None (OPD Only)</option>
              {/* Force show currently assigned bed even if marked occupied */}
              {patient.bed && patient.bed !== "None" && (
                <option value={patient.bed}>{patient.bed} (Current Assigned Bed)</option>
              )}
              {beds
                .filter((b) => b.status === "Available" && b.id !== patient.bed)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — Type: {b.type} ({b.status})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Clinical Severity Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 outline-none font-bold focus:border-emerald-500"
            >
              <option>Stable</option>
              <option>Observation</option>
              <option>Serious</option>
              <option>Critical</option>
              <option>Discharged</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-emerald-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-emerald-200 shadow-sm rounded-2xl rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs uppercase cursor-pointer text-center select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md border-none transition-all duration-300 font-black py-3 rounded-xl uppercase tracking-wider border-none transition cursor-pointer text-xs flex items-center justify-center gap-1.5 btn-action-blue"
            >
              <Save className="w-4 h-4 text-white" /> Save Ward Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
