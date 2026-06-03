import React, { useState } from "react";
import { BedDouble, Plus, Edit2, X, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";
import { Bed } from "../types";

interface BedsCabinStayTabProps {
  beds: Bed[];
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
}

export default function BedsCabinStayTab({ beds, setBeds }: BedsCabinStayTabProps) {
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  
  // New bed form states
  const [newBedId, setNewBedId] = useState("");
  const [newBedType, setNewBedType] = useState("General");
  const [newBedStatus, setNewBedStatus] = useState("Available");
  const [newBedCharge, setNewBedCharge] = useState("");

  const handleAddBed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idTrimmed = newBedId.trim();
    if (!idTrimmed) {
      alert("Please enter a Bed/Cabin ID or Name.");
      return;
    }

    if (beds.some(b => b.id.toLowerCase() === idTrimmed.toLowerCase())) {
      alert(`A Bed/Cabin with the ID "${idTrimmed}" already exists.`);
      return;
    }

    const newBed: Bed = {
      id: idTrimmed,
      type: newBedType,
      status: newBedStatus,
      chargeAmount: parseFloat(newBedCharge) || 0,
    };

    setBeds(prev => [...prev, newBed]);
    alert(`Successfully added new Bed/Cabin: ${newBed.id}`);
    
    // Reset states
    setNewBedId("");
    setNewBedType("General");
    setNewBedStatus("Available");
    setNewBedCharge("");
    setIsAddingBed(false);
  };

  const handleUpdateBed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBed) return;

    const trimmedId = editingBed.id.trim();
    if (!trimmedId) return;

    setBeds(prev => prev.map(b => b.id === editingBed.id ? editingBed : b));
    alert(`Bed/Cabin "${editingBed.id}" updated successfully.`);
    setEditingBed(null);
  };

  return (
    <div id="beds-cabin-stay-tab" className="space-y-6 animate-fade-in bg-white border border-emerald-200 rounded-3xl p-6 shadow-sm font-semibold text-slate-800 text-xs relative overflow-hidden">
      <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></span>
      
      {/* Header section with Add Button */}
      <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
        <div>
          <h2 className="text-base font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
            <BedDouble className="text-emerald-600 h-5 w-5" />
            Bed & Cabin stay room matrix (বেড ও কেবিন ম্যাট্রিক্স)
          </h2>
          <p className="text-xs text-emerald-850 mt-1 font-normal leading-relaxed">
            Configure Deluxe Cabins, general ward bedstays, and Critical ICU units. Register new physical assets or edit their charge rates in real-time.
          </p>
        </div>

        <button 
          onClick={() => setIsAddingBed(!isAddingBed)}
          className={`py-2.5 px-4 font-black text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer border shadow-sm transition-all active:scale-95 shrink-0 select-none ${
            isAddingBed ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100" : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700"
          }`}
        >
          {isAddingBed ? (
            <>
              <X size={14} /> Cancel (বাতিল)
            </>
          ) : (
            <>
              <Plus size={14} /> Add Bed/Cabin (নতুন বেড/কেবিন যোগ)
            </>
          )}
        </button>
      </div>

      {/* Add Bed/Cabin Section */}
      {isAddingBed && (
        <form onSubmit={handleAddBed} className="bg-emerald-50/50 border border-emerald-250 p-5 rounded-2xl animate-fade-in space-y-4 shadow-inner">
          <h3 className="font-black text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Plus size={14} className="animate-spin-slow" /> Bed/Cabin Asset Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Bed / Cabin ID (কোড/নাম)</label>
              <input 
                required 
                type="text" 
                value={newBedId}
                onChange={e => setNewBedId(e.target.value)}
                className="w-full bg-white border border-emerald-200 px-3.5 py-2.5 rounded-xl text-slate-800 font-bold text-sm outline-none focus:border-emerald-500" 
                placeholder="e.g. cabin 107, Cabin-303, ICU-Bed 5"
              />
            </div>

            <div>
              <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Section Type (ধরণ)</label>
              <select 
                value={newBedType}
                onChange={e => setNewBedType(e.target.value)}
                className="w-full bg-white border border-emerald-200 px-3.5 py-2.5 rounded-xl text-slate-850 font-bold text-sm outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="Deluxe">Deluxe Cabin (ডেলুক্স কেবিন)</option>
                <option value="Semi-Deluxe">Semi-Deluxe Cabin (সেমি ডেলুক্স)</option>
                <option value="General">General Cabin / Bed (সাধারণ কেবিন)</option>
                <option value="Critical Care">Critical Care ICU Bed (নিবিড় পরিচর্যা)</option>
                <option value="Emergency Care">Emergency Care (জরুরি বিভাগ)</option>
              </select>
            </div>

            <div>
              <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Charge Amount (INR ভাড়া প্রতি দিন)</label>
              <input 
                required 
                type="number" 
                min="0"
                step="50"
                value={newBedCharge}
                onChange={e => setNewBedCharge(e.target.value)}
                className="w-full bg-white border border-emerald-200 px-3.5 py-2.5 rounded-xl text-emerald-800 font-bold text-sm outline-none font-mono focus:border-emerald-500" 
                placeholder="e.g. 1500"
              />
            </div>

            <div>
              <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Initial Status (অবস্থা)</label>
              <select 
                value={newBedStatus}
                onChange={e => setNewBedStatus(e.target.value)}
                className="w-full bg-white border border-emerald-200 px-3.5 py-2.5 rounded-xl text-slate-800 font-bold text-sm outline-none cursor-pointer focus:border-emerald-500"
              >
                <option value="Available">Available (ফাঁকা আছে)</option>
                <option value="Occupied">Occupied (রোগী বরাদ্দ আছে)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl text-xs cursor-pointer border-none shadow-sm btn-action-blue"
            >
              Register Stay Unit Asset
            </button>
          </div>
        </form>
      )}

      {/* Main Grid View of Beds and Cabins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in text-slate-700">
        {beds.map((b) => {
          const charge = b.chargeAmount ?? 1000;
          const isAvail = b.status === "Available";

          return (
            <div
              key={b.id}
              className={`p-4 rounded-2xl flex flex-col justify-between transition-all relative group border ${
                isAvail 
                  ? "bg-emerald-50/60 border-emerald-200 shadow-sm text-emerald-950" 
                  : "bg-amber-50/50 border-amber-200 text-amber-950"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-block p-2 rounded-xl border ${isAvail ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-amber-100 border-amber-200 text-amber-700"}`}>
                    <BedDouble className="h-4.5 w-4.5" />
                  </span>
                  
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border leading-none ${
                      isAvail 
                        ? "text-emerald-700 bg-emerald-100 border-emerald-200" 
                        : "text-amber-700 bg-amber-100 border-amber-200"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <strong className="font-mono text-base block font-black text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">
                    {b.id}
                  </strong>
                  <span className="text-[9.5px] text-slate-9000 uppercase block font-bold leading-none tracking-wide">
                    {b.type} section
                  </span>
                </div>
              </div>

              {/* Charge details & inline action section */}
              <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="block text-[8px] text-slate-9000 uppercase tracking-widest font-black leading-none mb-1">Stay Charge Rate</span>
                  <strong className="font-mono text-sm block font-black text-emerald-700">
                    {charge} INR <span className="text-[9px] text-slate-9000 font-normal">/ day</span>
                  </strong>
                </div>

                <button type="button"
                  onClick={() => setEditingBed({ ...b, chargeAmount: charge })}
                  className="py-1.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg cursor-pointer flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider transition-colors"
                  title="Configure Room Stay Parameters"
                >
                  <Edit2 size={9} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing Cabin/Bed Parameters Modal */}
      {editingBed && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1100] transition-all">
          <div className="bg-white border border-emerald-250 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-sm relative text-slate-800 leading-normal">
            <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-t-3xl"></span>
            
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h3 className="font-black text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={14} className="text-emerald-600" /> Bedstay Configuration Desk
              </h3>
              <button onClick={() => setEditingBed(null)} 
                className="text-slate-700 hover:text-slate-600 transition-colors cursor-pointer text-lg bg-transparent border-none outline-none font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateBed} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block  mb-1 uppercase font-bold tracking-wider text-[10px] text-slate-900">Bed/Cabin Code ID (কোড/নাম)</label>
                <input 
                  required
                  type="text"
                  value={editingBed.id}
                  disabled
                  className="w-full /50 border border-emerald-150 p-2.5 rounded-xl  font-bold outline-none font-mono cursor-not-allowed text-sm  placeholder:font-semibold bg-white text-black"
                />
                <p className="text-[9px] text-slate-9000 mt-1 font-normal leading-relaxed">Note: The primary identification code stays immutable for linked active inpatient records.</p>
              </div>

              <div>
                <label className="block  mb-1 uppercase font-bold tracking-wider text-[10px] text-slate-900">Section Type Designation</label>
                <select 
                  value={editingBed.type}
                  onChange={e => setEditingBed({ ...editingBed, type: e.target.value })}
                  className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-slate-800 font-bold outline-none cursor-pointer text-sm focus:border-emerald-500"
                >
                  <option value="Deluxe">Deluxe Cabin (ডেলুক্স কেবিন)</option>
                  <option value="Semi-Deluxe">Semi-Deluxe Cabin (সেমি ডেলুক্স)</option>
                  <option value="General">General Cabin / Bed (সাধারণ কেবিন)</option>
                  <option value="Critical Care">Critical Care ICU Bed (নিবিড় পরিচর্যা)</option>
                  <option value="Emergency Care">Emergency Care (জরুরি বিভাগ)</option>
                </select>
              </div>

              <div>
                <label className="block  mb-1 uppercase font-bold tracking-wider text-[10px] font-sans text-slate-900">Staying Charge Rate (INR প্রতিদিনের ভাড়া)</label>
                <input 
                  required
                  type="number"
                  min="0"
                  step="50"
                  value={editingBed.chargeAmount ?? ""}
                  onChange={e => setEditingBed({ ...editingBed, chargeAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-emerald-800 font-black outline-none font-mono text-sm focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block  mb-1 uppercase font-bold tracking-wider text-[10px] text-slate-900">Current Live Occupancy Status</label>
                <select 
                  value={editingBed.status}
                  onChange={e => setEditingBed({ ...editingBed, status: e.target.value })}
                  className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-slate-850 font-bold outline-none cursor-pointer text-sm focus:border-emerald-500"
                >
                  <option value="Available">Available (ফাঁকা আছে)</option>
                  <option value="Occupied">Occupied (ভর্তি আছে)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button type="button" 
                  onClick={() => setEditingBed(null)}
                  className="px-4 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-all cursor-pointer text-xs font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl cursor-pointer text-xs border-none btn-action-blue"
                >
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
