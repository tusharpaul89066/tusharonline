import React, { useState } from "react";
import { Users, Search, Pencil, Trash2, HeartPulse, Briefcase, Smile } from "lucide-react";
import { Staff } from "../types";

interface StaffManagementTabProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

export default function StaffManagementTab({
  staff,
  setStaff,
}: StaffManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All"); // "All" | "Nurse" | "Worker"
  const [staffForm, setStaffForm] = useState({
    id: "",
    name: "",
    role: "Nurse",
    shift: "Day (8 AM - 4 PM)",
    salary: "",
    status: "Present",
  });
  const [formMode, setFormMode] = useState<"ADD" | "EDIT">("ADD");

  const filteredStaff = staff.filter((s) => {
    const matchesCategory =
      filterRole === "All" ||
      (filterRole === "Nurse" && s.role.toLowerCase() === "nurse") ||
      (filterRole === "Worker" && s.role.toLowerCase() !== "nurse");

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(term) ||
      s.id.toLowerCase().includes(term) ||
      s.shift.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!staffForm.name.trim()) return alert("Staff Name is required.");
    if (!staffForm.shift.trim()) return alert("Shift details are required.");
    const salVal = parseInt(staffForm.salary);
    if (isNaN(salVal)) return alert("Salary must be a valid number.");

    if (formMode === "ADD") {
      const nextId = `STF-${Math.max(...staff.map(s => parseInt(s.id.replace("STF-", "")) || 5000), 5000) + 1}`;
      const newS: Staff = {
        id: nextId,
        name: staffForm.name,
        role: staffForm.role,
        shift: staffForm.shift,
        salary: salVal,
        status: staffForm.status,
      };
      setStaff((prev) => [...prev, newS]);
      alert(`Successfully registered ${newS.role} ${newS.name}!`);
    } else {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === staffForm.id
            ? { ...s, name: staffForm.name, role: staffForm.role, shift: staffForm.shift, salary: salVal, status: staffForm.status }
            : s
        )
      );
      setFormMode("ADD");
      alert("Staff record updated successfully.");
    }

    setStaffForm({ id: "", name: "", role: "Nurse", shift: "Day (8 AM - 4 PM)", salary: "", status: "Present" });
  };

  return (
    <div id="staff-management-tab" className="space-y-6 animate-fade-in bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-2xl p-6 shadow-sm font-semibold text-slate-900 text-xs font-sans">
      <div className="border-b pb-3.5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
            <Users className="text-teal-800" /> Nurse & Worker Management (নার্স এবং স্টাফ ব্যবস্থাপনা)
          </h2>
          <p className="text-xs text-slate-455 text-slate-9000 font-normal mt-0.5 leading-relaxed">
            Configure shifts roster duty hours, specify monthly salary registers, and audit daily attendance statuses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterRole("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition ${filterRole === "All" ? "bg-white text-slate-900 shadow-sm" : "text-slate-9000 hover:text-slate-900"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterRole("Nurse")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition ${filterRole === "Nurse" ? "bg-white text-slate-900 shadow-sm" : "text-slate-9000 hover:text-slate-900"}`}
            >
              Nurses
            </button>
            <button
              type="button"
              onClick={() => setFilterRole("Worker")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition ${filterRole === "Worker" ? "bg-white text-slate-900 shadow-sm" : "text-slate-9000 hover:text-slate-900"}`}
            >
              Workers
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search staff shift, name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-emerald-100 shadow-sm rounded-2xl p-2.5 pl-9 rounded-xl outline-none focus:border-teal-500 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-9000 absolute left-3 top-3.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-normal text-slate-800">
        <div className="p-3.5 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-450 text-slate-405 uppercase tracking-widest leading-none">Total Nurses (মোট নার্স)</p>
            <p className="text-xl font-black text-slate-900 mt-2">
              {staff.filter(s => s.role.toLowerCase() === "nurse").length}
            </p>
          </div>
          <div className="p-2 bg-emerald-100/40 text-teal-800 rounded-lg shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>
        <div className="p-3.5 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest leading-none">Total Workers (মোট স্টাফ কর্মী)</p>
            <p className="text-xl font-black text-slate-900 mt-2">
              {staff.filter(s => s.role.toLowerCase() !== "nurse").length}
            </p>
          </div>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <div className="p-3.5 bg-emerald-50/80 border border-slate-200/80 rounded-2xl rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest leading-none">Present Today (উপস্থিত সংখ্যা)</p>
            <p className="text-xl font-black text-emerald-600 mt-2">
              {staff.filter(s => s.status === "Present").length}
            </p>
          </div>
          <div className="p-2 bg-white text-emerald-650 rounded-lg shrink-0">
            <Smile className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in font-semibold text-slate-800">
            {filteredStaff.map((s) => (
              <div
                key={s.id}
                className="p-4 border rounded-xl bg-emerald-50/80 hover:bg-white transition shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3 font-semibold">
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${s.role.toLowerCase() === "nurse" ? "bg-rose-50 text-rose-650" : "bg-emerald-100/40 text-blue-650"}`}>
                        {s.role.toLowerCase() === "nurse" ? <HeartPulse className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 leading-tight">{s.name}</h3>
                        <span className="text-[10px] text-slate-450 uppercase tracking-wider font-bold block mt-0.5">{s.role}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] bg-slate-200 px-2 py-0.5 rounded text-slate-650 font-black">
                      {s.id}
                    </span>
                  </div>

                  <div className="border-t border-emerald-100 pt-2 space-y-1.5 text-xs text-slate-700 font-semibold">
                    <div className="flex justify-between leading-none">
                      <span className="text-slate-9000">Shift (শিফট):</span>
                      <strong className="font-mono text-slate-900">{s.shift}</strong>
                    </div>
                    <div className="flex justify-between leading-none">
                      <span className="text-slate-9000">Salary (বেতন):</span>
                      <strong className="font-mono text-indigo-750 text-indigo-700">{(s.salary || 0).toLocaleString()} INR</strong>
                    </div>
                    <div className="flex justify-between items-center leading-none">
                      <span className="text-slate-9000">Duty Status:</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-black border ${s.status === "Present" ? "bg-white text-emerald-700 border-emerald-200" : s.status === "On Leave" ? "bg-emerald-50/50mber-150 text-amber-700 border-amber-205" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 border-t pt-2 max-w-full font-bold">
                  <button type="button"
                    onClick={() => {
                      setStaffForm({
                        id: s.id,
                        name: s.name,
                        role: s.role,
                        shift: s.shift,
                        salary: s.salary.toString(),
                        status: s.status,
                      });
                      setFormMode("EDIT");
                    }}
                    className="flex-1 bg-emerald-100 hover:bg-emerald-200 border-none text-emerald-800 py-1.5 rounded-lg font-black uppercase text-[10px] cursor-pointer flex items-center justify-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (confirm(`Remove records for ${s.role} ${s.name}?`)) {
                        setStaff(prev => prev.filter(item => item.id !== s.id));
                        alert("Staff deleted.");
                      }
                    }}
                    className="flex-1 bg-rose-100 hover:bg-rose-200 border-none text-rose-800 py-1.5 rounded-lg font-black uppercase text-[10px] cursor-pointer flex items-center justify-center gap-1"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredStaff.length === 0 && (
              <p className="text-xs text-slate-9000 italic">No matching nurse or healthcare worker found.</p>
            )}
          </div>
        </div>

        {/* Adding form */}
        <div className="bg-emerald-50/80 border border-slate-200/80 rounded-2xl p-5 rounded-2xl h-fit space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
              {formMode === "ADD" ? "Add Staff Record" : "Update Staff details"}
            </h3>
            <p className="text-[10px] text-slate-9000 font-normal leading-tight font-sans mt-0.5 normal-case">
              Enter full names, salary scales, daily shifts, and roster configurations.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 font-semibold text-slate-800">
            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Full Name (নাম)</label>
              <input
                type="text"
                required
                placeholder="e.g. Nur Jahan Begum"
                value={staffForm.name}
                onChange={(e) => setStaffForm(p => ({ ...p, name: e.target.value }))}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none focus:border-teal-500 font-bold"
              />
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Designation Role (পদবি/দায়িত্ব)</label>
              <select
                value={staffForm.role}
                onChange={(e) => setStaffForm(p => ({ ...p, role: e.target.value }))}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none font-bold"
              >
                <option value="Nurse">Nurse (নার্স ইনচার্জ)</option>
                <option value="Ward Boy">Ward Boy (স্টাফ সহকারী)</option>
                <option value="Receptionist">Receptionist (ফ্রন্ট ডেস্ক কর্মকর্তা)</option>
                <option value="Lab Technician">Lab Technician (ল্যাব টেকনিশিয়ান)</option>
                <option value="Pharmacist">Pharmacist (ফার্মাসিস্ট)</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Duty Shift Shift (শিফট)</label>
              <select
                value={staffForm.shift}
                onChange={(e) => setStaffForm(p => ({ ...p, shift: e.target.value }))}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none font-bold"
              >
                <option value="Day (8 AM - 4 PM)">Day Shift (8 AM - 4 PM)</option>
                <option value="Evening (4 PM - 12 AM)">Evening Shift (4 PM - 12 AM)</option>
                <option value="Night (12 AM - 8 AM)">Night Shift (12 AM - 8 AM)</option>
              </select>
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm">Salary scales (বেতন- INR )</label>
              <input
                type="number"
                required
                placeholder="e.g. 20000"
                value={staffForm.salary}
                onChange={(e) => setStaffForm(p => ({ ...p, salary: e.target.value }))}
                className="w-full border border-slate-205 p-2.5 rounded-xl bg-white font-mono focus:border-teal-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block  mb-1 font-bold text-slate-900 text-sm"> Roster Attendance Status</label>
              <select
                value={staffForm.status}
                onChange={(e) => setStaffForm(p => ({ ...p, status: e.target.value }))}
                className="w-full border border-emerald-100 shadow-sm rounded-2xl p-2.5 rounded-xl bg-white outline-none font-bold text-slate-900"
              >
                <option value="Present">Present (উপস্থিত)</option>
                <option value="Absent">Absent (অনুপস্থিত)</option>
                <option value="On Leave">On Leave (ছুটিতে)</option>
              </select>
            </div>

            <div className="flex gap-2">
              {formMode === "EDIT" && (
                <button
                  type="button"
                  onClick={() => {
                    setFormMode("ADD");
                    setStaffForm({ id: "", name: "", role: "Nurse", shift: "Day (8 AM - 4 PM)", salary: "", status: "Present" });
                  }}
                  className="flex-1 border bg-white p-2 hover:bg-slate-100 text-slate-800 rounded-xl font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="w-full flex-1 bg-green-800 hover:bg-green-900 text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wide cursor-pointer border-none text-xs shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center gap-2 btn-action-blue"
              >
                {formMode === "ADD" ? "+ ADD NURSE & STAFF" : "UPDATE STAFF"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
