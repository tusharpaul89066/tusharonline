import React, { useState } from 'react';

export function MaternityEditModals({ 
  mother, child, onClose, onUpdateMother, onUpdateChild 
}: { 
  mother?: any, child?: any, onClose: () => void, 
  onUpdateMother?: (data: any) => void, onUpdateChild?: (data: any) => void 
}) {
  const [mData, setMData] = useState(mother || {});
  const [cData, setCData] = useState(child || {});

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-slate-900">
            {mother ? "Edit Maternity Record" : "Edit Newborn Record"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-2 text-xl">&times;</button>
        </div>
        
        <div className="p-6 space-y-4">
          {mother && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-500">Name</label><input className="w-full border p-2 rounded" value={mData.motherName || ''} onChange={e => setMData({...mData, motherName: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Husband Name</label><input className="w-full border p-2 rounded" value={mData.husbandName || ''} onChange={e => setMData({...mData, husbandName: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Age</label><input className="w-full border p-2 rounded" type="number" value={mData.age || ''} onChange={e => setMData({...mData, age: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Phone</label><input className="w-full border p-2 rounded" value={mData.phone || ''} onChange={e => setMData({...mData, phone: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">LMP</label><input className="w-full border p-2 rounded" type="date" value={mData.lmp || ''} onChange={e => setMData({...mData, lmp: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">EDD</label><input className="w-full border p-2 rounded" type="date" value={mData.edd || ''} onChange={e => setMData({...mData, edd: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Gravida</label><input className="w-full border p-2 rounded" type="number" value={mData.gravida || ''} onChange={e => setMData({...mData, gravida: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Para</label><input className="w-full border p-2 rounded" type="number" value={mData.para || ''} onChange={e => setMData({...mData, para: e.target.value})} /></div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => onUpdateMother && onUpdateMother(mData)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg">Update Record</button>
              </div>
            </>
          )}

          {child && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-500">Baby Name</label><input className="w-full border p-2 rounded" value={cData.babyName || ''} onChange={e => setCData({...cData, babyName: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Gender</label>
                  <select className="w-full border p-2 rounded" value={cData.gender || ''} onChange={e => setCData({...cData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div><label className="text-sm font-bold text-slate-500">Birth Weight (kg)</label><input className="w-full border p-2 rounded" type="number" step="0.1" value={cData.birthWeight || ''} onChange={e => setCData({...cData, birthWeight: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Date of Birth</label><input className="w-full border p-2 rounded" type="date" value={cData.birthDate || ''} onChange={e => setCData({...cData, birthDate: e.target.value})} /></div>
                <div><label className="text-sm font-bold text-slate-500">Time of Birth</label><input className="w-full border p-2 rounded" type="time" value={cData.birthTime || ''} onChange={e => setCData({...cData, birthTime: e.target.value})} /></div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => onUpdateChild && onUpdateChild(cData)} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg">Update Newborn</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
