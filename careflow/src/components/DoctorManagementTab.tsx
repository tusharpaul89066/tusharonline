import React, { useState } from "react";
import { Stethoscope, Search, Pencil, Trash2 } from "lucide-react";
import { Doctor } from "../types";

interface DoctorManagementTabProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
}

export default function DoctorManagementTab({
  doctors,
  setDoctors,
}: DoctorManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorForm, setDoctorForm] = useState({
    id: "",
    name: "",
    spec: "Cardiology",
    time: "",
    fees: "",
  });
  const [formMode, setFormMode] = useState<"ADD" | "EDIT">("ADD");

  const filteredDoctors = doctors.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.spec.toLowerCase().includes(term) ||
      d.id.toLowerCase().includes(term)
    );
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!doctorForm.name.trim()) return alert("Physician Name is required.");
    if (!doctorForm.time.trim()) return alert("Consulting Hours are required.");
    const feeVal = parseInt(doctorForm.fees);
    if (isNaN(feeVal)) return alert("Visa fee must be valid numbers.");

    if (formMode === "ADD") {
      const nextId = `DOC-${Math.max(...doctors.map(d => parseInt(d.id.replace("DOC-", "")) || 100), 100) + 1}`;
      const newD: Doctor = {
        id: nextId,
        name: doctorForm.name,
        spec: doctorForm.spec,
        time: doctorForm.time,
        fees: feeVal,
      };
      setDoctors((prev) => [...prev, newD]);
      alert(`Registered Dr. ${newD.name} successfully!`);
    } else {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === doctorForm.id
            ? { ...d, name: doctorForm.name, spec: doctorForm.spec, time: doctorForm.time, fees: feeVal }
            : d
        )
      );
      setFormMode("ADD");
      alert("Consultant file updated successfully.");
    }

    setDoctorForm({ id: "", name: "", spec: "Cardiology", time: "", fees: "" });
  };

  return (
    <div id="doctor-management-tab" className="space-y-6 animate-fade-in bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-6 shadow-sm font-semibold text-slate-900 text-xs">
      <div className="border-b pb-3.5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2 font-sans">
            <Stethoscope className="text-teal-605 text-teal-800" /> Physicians Specialists Panel (ডাক্তার ব্যবস্থাপনা)
          </h2>
          <p className="text-xs text-slate-9000 font-normal mt-0.5 leading-relaxed">
            Manage attending consultants, medical rosters, specialty certifications, and consulting session fee structures.
          </p>
        </div>
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search physician spec, name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 pl-9 rounded-xl outline-none focus:border-teal-500 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-9000 absolute left-3 top-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Physician grid listings */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-9000 tracking-wider">
            Physicians Directories ({filteredDoctors.length})
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((d) => (
              <div
                key={d.id}
                className="p-4 border border-emerald-100 shadow-sm rounded-2xl rounded-xl bg-emerald-50/80 hover:bg-white transition shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-3.5 font-semibold text-slate-800">
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-955 leading-tight">Dr. {d.name}</h4>
                        <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">{d.spec}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] bg-slate-205 bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-black">
                      {d.id}
                    </span>
                  </div>

                  <div className="border-t pt-2 space-y-1.5">
                    <div className="flex justify-between leading-none text-xs">
                      <span className="text-slate-9000">Hours:</span>
                      <span className="font-mono font-bold text-slate-900">{d.time}</span>
                    </div>
                    <div className="flex justify-between leading-none text-xs">
                      <span className="text-slate-9000">Consult Fee:</span>
                      <span className="font-mono font-black text-emerald-600">{d.fees} INR</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-2.5">
                  <button type="button"
                    onClick={() => {
                      setDoctorForm({
                        id: d.id,
                        name: d.name,
                        spec: d.spec,
                        time: d.time,
                        fees: d.fees.toString(),
                      });
                      setFormMode("EDIT");
                    }}
                    className="flex-1 bg-emerald-100 hover:bg-emerald-200 border-none text-emerald-800 py-1.5 rounded-lg font-black uppercase text-[10px] cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (confirm(`Remove Dr. ${d.name} from files?`)) {
                        setDoctors(prev => prev.filter(item => item.id !== d.id));
                        alert(`Dr. ${d.name} has been erased.`);
                      }
                    }}
                    className="flex-1 bg-rose-100 hover:bg-rose-200 border-none text-rose-800 py-1.5 rounded-lg font-black uppercase text-[10px] cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <p className="text-xs text-slate-9000 italic">No specialist physicians found matching search criteria.</p>
            )}
          </div>
        </div>

        {/* Adding / Setup Form */}
        <div className="bg-white border border-emerald-200 p-5 rounded-2xl h-fit space-y-4 shadow-sm">
          <div className="border-b border-emerald-100 pb-2">
            <h3 className="text-xs font-black text-emerald-900 uppercase flex items-center gap-1.5">
              {formMode === "ADD" ? "Add Specialty Physician" : "Update Doctor Details"}
            </h3>
            <p className="text-[10px] text-slate-9000 font-normal leading-tight mt-0.5 normal-case font-sans">
              Enter physician's license credentials and consulting session configurations.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 font-semibold text-emerald-950">
            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Physician Name (নাম)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-700 font-mono text-xs select-none pointer-events-none">
                  Dr.
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhana Yasmin"
                  value={doctorForm.name}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.toLowerCase().startsWith("dr. ")) val = val.substring(4);
                    else if (val.toLowerCase().startsWith("dr ")) val = val.substring(3);
                    setDoctorForm(p => ({ ...p, name: val }));
                  }}
                  className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 pl-8 rounded-xl bg-emerald-50 text-emerald-950 focus:border-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Specialty Department (বিশেষজ্ঞ)</label>
              <select
                value={doctorForm.spec}
                onChange={(e) => setDoctorForm(p => ({ ...p, spec: e.target.value }))}
                className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 outline-none font-sans font-bold focus:border-emerald-500"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Family Medicine">Family Medicine</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Gynaecology">Gynaecology</option>
                <option value="Urology">Urology</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Consulting Hours (ভিজিটিং সময়)</label>
              <input
                type="text"
                required
                placeholder="e.g. 05:00 PM - 09:00 PM"
                value={doctorForm.time}
                onChange={(e) => setDoctorForm(p => ({ ...p, time: e.target.value }))}
                className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 font-mono focus:border-emerald-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Session Fee (ফি - INR )</label>
              <input
                type="number"
                required
                placeholder="e.g. 800"
                value={doctorForm.fees}
                onChange={(e) => setDoctorForm(p => ({ ...p, fees: e.target.value }))}
                className="w-full border border-emerald-250 shadow-sm rounded-2xl p-2.5 rounded-xl bg-emerald-50 text-emerald-950 font-mono focus:border-emerald-500 outline-none font-bold"
              />
            </div>

            <div className="flex gap-2">
              {formMode === "EDIT" && (
                <button
                  type="button"
                  onClick={() => {
                    setFormMode("ADD");
                    setDoctorForm({ id: "", name: "", spec: "Cardiology", time: "", fees: "" });
                  }}
                  className="flex-1 bg-emerald-50 rounded-2xl shadow border border-emerald-200 text-emerald-800 p-2 rounded-xl font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-full flex-1 bg-green-800 hover:bg-green-900 text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wide cursor-pointer border-none text-xs shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 btn-action-blue"
              >
                {formMode === "ADD" ? "+ ADD SPECIALTY PHYSICIAN" : "UPDATE PHYSICIAN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
