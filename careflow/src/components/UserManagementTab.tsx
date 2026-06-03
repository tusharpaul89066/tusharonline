import React, { useState } from "react";
import { User, Patient } from "../types";
import { ShieldCheck, Key, User as UserIcon, Plus, Edit, Trash2, Save, X, Link } from "lucide-react";

interface UserManagementTabProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  patients?: Patient[];
}

export default function UserManagementTab({ users, setUsers, currentUser, patients = [] }: UserManagementTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({});

  const isSuperAdmin = currentUser?.role === "SuperAdmin";

  const handleEdit = (user: User) => {
    setEditingUserId(user.id || null);
    setFormData(user);
    setShowAddForm(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    if (confirm("Are you sure you want to completely remove this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: `USER-${Math.floor(Math.random() * 90000) + 10000}`,
        username: formData.username || "",
        password: formData.password || "",
        name: formData.name || "",
        role: formData.role || "Doctor",
        patientId: formData.role === "Patient" ? formData.patientId : undefined,
      };
      setUsers([...users, newUser]);
    }
    
    setShowAddForm(false);
    setEditingUserId(null);
    setFormData({});
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 border border-rose-100 rounded-3xl animate-fade-in text-center shadow-inner mt-4 mx-4">
        <ShieldCheck className="w-16 h-16 text-rose-400 mb-4 opacity-80" />
        <h2 className="text-xl font-black text-rose-900 uppercase tracking-widest dropdown-shadow">Access Denied</h2>
        <p className="text-rose-700 font-bold mt-2 max-w-lg text-[13px] leading-relaxed">
          Only the Super Admin can access the User & Password Management facility. Please login as SuperAdmin to manage system credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in bg-white/40 border border-indigo-100 rounded-3xl p-6 shadow-sm font-semibold text-slate-800 text-xs">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-indigo-100/80 pb-3.5">
        <div>
          <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2 tracking-wide font-sans">
            <ShieldCheck className="text-indigo-600 w-5 h-5" /> User Management & Access Control
          </h2>
          <p className="text-[11px] text-zinc-600 font-bold leading-relaxed mt-1 font-sans">
            Manage Login IDs and Passwords for Doctors, Nurses, Receptionists, and Admins.
          </p>
        </div>
        <button onClick={() => {
            setEditingUserId(null);
            setFormData({ role: "Doctor" });
            setShowAddForm(!showAddForm);
          }}
          className="btn-action-blue px-4 py-2 text-[10px] text-white font-black uppercase tracking-wider rounded-xl flex items-center gap-2"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAddForm ? "Cancel" : "Add New User"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <h3 className="text-[13px] font-black text-indigo-900 uppercase mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" /> {editingUserId ? "Edit User Credentials" : "Create New User"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className={`flex flex-col gap-1.5 ${formData.role === "Patient" ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <label className="text-[10px] font-black uppercase text-indigo-800">Role Select</label>
              <select 
                value={formData.role || "Doctor"}
                onChange={(e) => {
                  const role = e.target.value;
                  setFormData({
                    ...formData,
                    role,
                    patientId: role === "Patient" ? "" : undefined,
                    name: role === "Patient" ? "" : formData.name,
                    username: role === "Patient" ? "" : formData.username
                  });
                }}
                required 
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none"
              >
                <option value="SuperAdmin">Super Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Receptionist">Receptionist</option>
                <option value="LabTechnician">Lab Technician</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Patient">Patient (রোগী)</option>
              </select>
            </div>

            {formData.role === "Patient" && (
              <div className="flex flex-col gap-1.5 lg:col-span-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
                  <Link className="w-3 h-3 text-emerald-600" /> Link Patient Profile
                </label>
                <select
                  value={formData.patientId || ""}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const foundPat = patients.find(p => p.id === pid);
                    if (foundPat) {
                      setFormData({
                        ...formData,
                        patientId: pid,
                        name: foundPat.name,
                        username: pid.toLowerCase(),
                        password: formData.password || "password123"
                      });
                    } else {
                      setFormData({
                        ...formData,
                        patientId: "",
                        name: "",
                        username: ""
                      });
                    }
                  }}
                  required={formData.role === "Patient"}
                  className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-emerald-900 border-emerald-300 bg-emerald-50/50 outline-none"
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name} ({p.mobile})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className={`flex flex-col gap-1.5 ${formData.role === "Patient" ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <label className="text-[10px] font-black uppercase text-indigo-800">Assign Name</label>
              <input 
                type="text" 
                value={formData.name || ""}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                placeholder="Ex: Dr. Anisur, Subha..." 
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none" 
              />
            </div>

            <div className={`flex flex-col gap-1.5 ${formData.role === "Patient" ? "lg:col-span-2" : "lg:col-span-2"}`}>
              <label className="text-[10px] font-black uppercase text-indigo-800">Login ID</label>
              <input 
                type="text" 
                value={formData.username || ""}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
                placeholder="Ex: doc_anisur, admin..." 
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none" 
              />
            </div>

            <div className={`flex flex-col gap-1.5 ${formData.role === "Patient" ? "lg:col-span-2" : "lg:col-span-2"}`}>
              <label className="text-[10px] font-black uppercase text-indigo-800">Password</label>
              <input 
                type="text" 
                value={formData.password || ""}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                placeholder="Type new password..." 
                className="input-3d-sunken w-full p-2 rounded-lg text-xs font-bold text-slate-800 outline-none" 
              />
            </div>

            <div className={`flex gap-2 ${formData.role === "Patient" ? "lg:col-span-1" : "lg:col-span-2"}`}>
              <button type="submit" className="button-3d-teal px-4 py-2 text-[10px] w-full text-white font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 btn-action-blue">
                <Save className="w-3.5 h-3.5" />
                {editingUserId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">ID / Info</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Role</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Login ID</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500">Password</th>
              <th className="py-3 px-4 font-black uppercase tracking-wider text-[9px] text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
                        {u.name}
                        {u.patientId && (
                          <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase">
                            Patient Connection: {u.patientId}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-[9px] uppercase font-black tracking-wider ${
                    u.role === 'SuperAdmin' ? 'bg-rose-100 text-rose-700' :
                    u.role === 'Doctor' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'Nurse' ? 'bg-pink-100 text-pink-700' :
                    u.role === 'Patient' ? 'bg-teal-100 text-teal-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-[11px] font-black tracking-wide text-slate-700 bg-emerald-50">
                  {u.username}
                </td>
                <td className="py-3 px-4 text-[11px] font-bold tracking-widest text-slate-600">
                  {u.password || "********"}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleEdit(u)}
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {u.role !== 'SuperAdmin' && (
                      <button onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-bold text-xs uppercase">
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
