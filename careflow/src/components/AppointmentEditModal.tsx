import React, { useState } from "react";
import { X, CalendarDays, Save } from "lucide-react";
import { Patient, Doctor } from "../types";

interface AppointmentEditModalProps {
  appointmentData: { patient: Patient; doctor?: Doctor };
  doctors: Doctor[];
  onClose: () => void;
  onSave: (updatedPatient: Patient) => void;
}

export default function AppointmentEditModal({
  appointmentData,
  doctors,
  onClose,
  onSave,
}: AppointmentEditModalProps) {
  const { patient, doctor } = appointmentData;
  const [selectedDocId, setSelectedDocId] = useState(patient.docId || doctor?.id || "");
  const [appointmentTime, setAppointmentTime] = useState(patient.appointmentTime || doctor?.time || "10:30 AM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPatient: Patient = {
      ...patient,
      docId: selectedDocId,
      appointmentTime,
    };
    onSave(updatedPatient);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 leading-normal">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-sm relative border border-emerald-100">
        <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500"></span>

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 uppercase flex items-center gap-2">
              <CalendarDays className="text-emerald-600 w-5 h-5" /> Edit OPD Appointment Slot
            </h2>
            <p className="text-slate-9000 text-xs font-normal mt-1 leading-normal">
              Re-schedule consulting specialist queues or slot times for patient:{" "}
              <b className="text-emerald-700 font-mono font-bold">{patient.name}</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 text-slate-700 hover:text-rose-500 hover:bg-rose-50 border-none rounded-xl cursor-pointer transition font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-semibold text-xs">
          <div>
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Consulting Specialist Doctor</label>
            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                const found = doctors.find(d => d.id === e.target.value);
                if (found) {
                  setAppointmentTime(found.time);
                }
              }}
              className="w-full border border-slate-200 shadow-sm rounded-xl p-2.5 bg-slate-50 outline-none font-bold text-slate-800 focus:border-emerald-500"
            >
              <option value="">-- Select Physician --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  DR. {doc.name} ({doc.spec}) — Fees: {doc.fees} INR
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block  mb-1 text-[11px] font-bold text-slate-900">Appointment Slot Time</label>
            <input
              required
              type="text"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full border border-slate-200 shadow-sm rounded-xl p-2.5 bg-slate-50 outline-none focus:border-emerald-500 font-bold text-slate-800"
              placeholder="e.g. 11:30 AM"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 shadow-sm rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold text-xs uppercase cursor-pointer text-center select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md border-none transition-all duration-300 font-extrabold py-3 rounded-xl uppercase tracking-wider cursor-pointer text-xs flex items-center justify-center gap-1.5 btn-action-blue"
            >
              <Save className="w-4 h-4 text-white" /> Update Slot Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
