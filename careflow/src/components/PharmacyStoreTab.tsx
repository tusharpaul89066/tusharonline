import React, { useState } from "react";
import { Pill, Search, Download, AlertTriangle, Edit2, Plus, X, CheckCircle } from "lucide-react";
import { Patient, Medicine, Bill } from "../types";

interface PharmacyStoreTabProps {
  patients: Patient[];
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  currentUser: any;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
}

export default function PharmacyStoreTab({
  patients,
  medicines,
  setMedicines,
  bills,
  setBills,
  pushTimelineEvent,
  currentUser,
  handleExportCSV,
}: PharmacyStoreTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const firstDay = today.substring(0, 8) + '01';
  const [dateRange, setDateRange] = useState({ start: firstDay, end: today });
  const [panelTab, setPanelTab] = useState<'dispense' | 'add'>('dispense');
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  
  // Custom toast notification states to replace native browser alerts
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 7000);
  };

  const handleDispensePharmacy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const elements = form.elements as any;
    
    const pId = elements.pId.value;
    const mName = elements.mName.value;
    const qtyVal = parseInt(elements.qty.value) || 0;

    const activeM = medicines.find((m) => m.name === mName);
    if (!activeM) {
      showNotification('error', "Please select a valid medication brand.");
      return;
    }
    if (activeM.qty < qtyVal) {
      showNotification('error', `Insufficient Stock! Available inventory: ${activeM.qty} units.`);
      return;
    }

    const priceTotal = activeM.price * qtyVal;

    pushTimelineEvent(
      pId,
      "Medicine Issued",
      `${currentUser?.name || "Pharmacist"} (Pharmacy)`,
      `Issued brand: ${mName} (Qty: ${qtyVal} units). Charge Price total: ${priceTotal} INR`
    );

    // Create a pharmacy standalone invoice if not added to IPD existing bill
    const existingBill = bills.find(b => b.patientId === pId && !b.isDischarged);
    if (existingBill) {
      // Update existing IPD bill
      setBills(prev => prev.map(b => {
        if (b.invoice === existingBill.invoice) {
          const updatedBreakdown = { ...b.breakdown, med: (b.breakdown?.med || 0) + priceTotal };
          const updatedSub = (b.breakdown?.bed || 0) + (b.breakdown?.doc || 0) + (b.breakdown?.ot || 0) + (b.breakdown?.test || 0) + updatedBreakdown.med + 500;
          return {
            ...b,
            breakdown: updatedBreakdown,
            dispensedMedicines: [
              ...(b.dispensedMedicines || []),
              { id: Date.now(), type: "med", name: mName, qty: qtyVal, unitPrice: activeM.price, selectType: "Medicine Fee (ওষুধ ফি)" }
            ],
            total: Math.round(updatedSub - (updatedSub * 0.1) + ((updatedSub - (updatedSub * 0.1)) * 0.05)),
          };
        }
        return b;
      }));
    } else {
      // Create new PHRM- invoice
      const targetPatient = patients.find(p => p.id === pId);
      const newBill: Bill = {
        invoice: `PHRM-${Date.now().toString().slice(-4)}`,
        patientId: pId,
        patientName: targetPatient?.name || "Unknown Patient",
        patientMobile: targetPatient?.mobile || "N/A",
        date: new Date().toISOString().split("T")[0],
        total: priceTotal,
        paymentMode: "CASH",
        breakdown: { bed: 0, doc: 0, test: 0, med: priceTotal, other: 0, tax: 0, discount: 0 },
        subtotal: priceTotal,
        dispensedMedicines: [
          { id: Date.now(), type: "med", name: mName, qty: qtyVal, unitPrice: activeM.price, selectType: "Pharmacy Point of Sale" }
        ],
        isDischarged: true
      };
      setBills(prev => [...prev, newBill]);
    }

    setMedicines((prev) =>
      prev.map((m) =>
        m.name === mName ? { ...m, qty: Math.max(0, m.qty - qtyVal) } : m
      )
    );

    showNotification('success', `Successfully dispensed ${qtyVal} units of ${mName} to ${pId}. Billed ${priceTotal} INR.`);
    form.reset();
  };

  const filteredMedicines = medicines.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      m.batch.toLowerCase().includes(term);
    const dateVal = m.date;
    const matchesDate =
      (!dateRange.start || dateVal >= dateRange.start) &&
      (!dateRange.end || dateVal <= dateRange.end);
    return matchesSearch && matchesDate;
  });

  return (
    <div id="pharmacy-store-tab" className="space-y-6 animate-fade-in bg-white border border-emerald-200 rounded-3xl p-6 shadow-sm text-xs font-sans text-slate-800">
      
      {/* Header section */}
      <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[9px] rounded-md tracking-wider uppercase border border-emerald-200">
              Vault System
            </span>
            <span className="text-[10px] text-slate-9000 font-bold">• Secure Pharm Desk</span>
          </div>
          <h2 className="text-base font-black text-emerald-950 uppercase tracking-wide mt-1">
            Apothecary Dispensary stock core (ওষুধাগার ব্যবস্থাপনা)
          </h2>
          <p className="text-[11px] text-slate-600 mt-1 font-bold leading-relaxed">
            Dispense prescriptions directly to checked-in patients, update pharmacy inventories, and audit medicine storage thresholds.
          </p>
        </div>
      </div>

      {/* Styled Notifications block to replace default alert popup */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-slide-in shadow-inner ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-850' 
            : 'bg-rose-50 border-rose-200 text-rose-850'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-black uppercase text-[10.5px] tracking-wide">
              {notification.type === 'success' ? 'DISPENSARY ACTION AUTHORIZED' : 'VAULT ACTION FAILED'}
            </p>
            <p className="text-[11px] font-bold text-slate-800">{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto font-mono text-[9.5px] font-black cursor-pointer border-none bg-transparent"
          >
            DISMISS
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dispension and Stock Addition forms side */}
        <div className="bg-emerald-50/30 border border-emerald-200 rounded-2xl p-5 space-y-4 h-fit shadow-sm">
          <div className="flex border-b border-emerald-100 pb-3 mb-2 gap-2 justify-between">
            <button
              onClick={() => setPanelTab('dispense')}
              className={`flex-1 text-center font-black py-2.5 rounded-xl text-[9.5px] uppercase tracking-wider transition-all cursor-pointer border ${
                panelTab === 'dispense'
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              Issue Rx (ওষুধ বিতরণ)
            </button>
            <button
              onClick={() => setPanelTab('add')}
              className={`flex-1 text-center font-black py-2.5 rounded-xl text-[9.5px] uppercase tracking-wider transition-all cursor-pointer border ${
                panelTab === 'add'
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              + Add Medicine (স্টক যোগ)
            </button>
          </div>

          {panelTab === 'dispense' ? (
            <>
              <h3 className="text-[10.5px] font-black uppercase text-emerald-950 pb-1 flex items-center gap-1.5 tracking-wider">
                <Pill className="text-emerald-600 h-4 w-4 shrink-0" /> Issue Pharmacy Prescription (ওষুধ সরবরাহ)
              </h3>
              <form onSubmit={handleDispensePharmacy} className="space-y-4 text-slate-700 font-semibold font-sans">
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Attending Target Patient</label>
                  <select
                    name="pId"
                    className="w-full border border-emerald-200  shadow-inner  rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white text-black"
                  >
                    {patients
                      .filter((p) => p.condition !== "Discharged")
                      .map((p) => (
                        <option key={p.id} value={p.id} className="bg-white text-slate-900">
                          {p.id} — {p.name}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Medication brand formula</label>
                  <select
                    name="mName"
                    className="w-full border border-emerald-200  shadow-inner  rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold text-xs cursor-pointer  placeholder:font-semibold bg-white text-black"
                  >
                    {medicines.map((m) => (
                      <option key={m.name} value={m.name} className="bg-white text-slate-900">
                        {m.name} (Price: {m.salePrice ?? m.price} INR)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Issue units count quantity</label>
                  <input
                    required
                    name="qty"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue="10"
                    className="w-full border border-emerald-200  shadow-inner  rounded-xl p-2.5 outline-none focus:border-emerald-500 font-mono font-black text-xs  placeholder:font-semibold bg-white text-black"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl uppercase tracking-wider border-none text-[10.5px] cursor-pointer shadow-sm transition-all font-sans btn-action-blue"
                >
                  Dispense & Bill medication
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-[10.5px] font-black uppercase text-emerald-950 pb-1 flex items-center gap-1.5 tracking-wider">
                <Plus className="text-emerald-600 h-4 w-4 shrink-0" /> Add New Medicine Stock (নতুন ওষুধ)
              </h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const fd = new FormData(form);
                  const name = fd.get("newName") as string;
                  const batch = fd.get("newBatch") as string;
                  const qty = parseInt(fd.get("newQty") as string) || 0;
                  const buyPrice = parseFloat(fd.get("newBuyPrice") as string) || 0;
                  const salePrice = parseFloat(fd.get("newSalePrice") as string) || 0;
                  const date = fd.get("newDate") as string;

                  if (medicines.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
                    showNotification('error', "Medication brand already exists in inventory database catalog.");
                    return;
                  }

                  const newMed: Medicine = {
                    name,
                    batch,
                    qty,
                    price: salePrice,
                    buyPrice,
                    salePrice,
                    date,
                  };

                  setMedicines((prev) => [...prev, newMed]);
                  showNotification('success', `Brand ${name} logged into pharmacy database ledger.`);
                  form.reset();
                  setPanelTab('dispense');
                }}
                className="space-y-4 text-slate-700 font-semibold font-sans"
              >
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Medicine Brand Name (নাম)</label>
                  <input
                    required
                    name="newName"
                    type="text"
                    placeholder="e.g. Napa Extend 665mg"
                    className="w-full border border-emerald-200   placeholder-slate-400 rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold text-xs  placeholder:font-semibold bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Batch Code (ব্যাচ নম্বর)</label>
                  <input
                    required
                    name="newBatch"
                    type="text"
                    placeholder="e.g. B-NP998"
                    className="w-full border border-emerald-200   placeholder-slate-400 rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold text-xs font-mono  placeholder:font-semibold bg-white text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block  mb-1.5 uppercase tracking-wider text-[10px]/none font-bold text-slate-900">Stock Qty (সংখ্যা)</label>
                    <input
                      required
                      name="newQty"
                      type="number"
                      min="1"
                      placeholder="100"
                      className="w-full border border-emerald-200   placeholder-slate-400 rounded-xl p-2.5 outline-none focus:border-emerald-500 font-mono font-bold text-xs  placeholder:font-semibold bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block  mb-1.5 uppercase tracking-wider text-[10px]/none font-bold text-slate-900">Entry Date (তারিখ)</label>
                    <input
                      required
                      name="newDate"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full border border-emerald-200   rounded-xl p-2.5 outline-none focus:border-emerald-500 font-bold text-xs font-mono  placeholder:font-semibold bg-white text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block  mb-1.5 uppercase tracking-wider text-[10px]/none font-bold text-slate-900">Buy Price (INR ক্রয়মূল্য)</label>
                    <input
                      required
                      name="newBuyPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 4.0"
                      className="w-full border border-emerald-200   outline-none focus:border-emerald-500 font-mono font-bold text-xs text-black  placeholder:font-semibold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block  mb-1.5 uppercase tracking-wider text-[10px]/none font-bold text-slate-900">Sale Price (INR বিক্রয়মূল্য)</label>
                    <input
                      required
                      name="newSalePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5.0"
                      className="w-full border border-emerald-200   outline-none focus:border-emerald-500 font-mono font-bold text-xs text-black  placeholder:font-semibold bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl uppercase tracking-wider border-none text-[10.5px] cursor-pointer shadow-sm transition-all pt-2.5 font-sans btn-action-blue"
                >
                  Register Stock Item
                </button>
              </form>
            </>
          )}
        </div>

        {/* Inventory lists side */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-emerald-100 pb-3">
            <h3 className="text-xs font-black uppercase text-emerald-950 tracking-wide font-sans">
              Dispensary Vault stocks indicators (মজুদ বিবরণী)
            </h3>
            <button
              onClick={() => {
                const cols = [
                  { label: "Med Brand", value: (m: Medicine) => m.name },
                  { label: "Batch Code", value: (m: Medicine) => m.batch },
                  { label: "In Stock qty", value: (m: Medicine) => m.qty },
                  { label: "Price (INR)", value: (m: Medicine) => m.price },
                  { label: "Checked Date", value: (m: Medicine) => m.date },
                ];
                handleExportCSV("Pharmacy_Stocks", cols, filteredMedicines);
              }}
              className="bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 font-extrabold px-3.5 py-2 rounded-xl text-[9.5px] uppercase cursor-pointer flex items-center gap-1.5 transition shadow-sm select-none font-sans"
            >
              <Download className="w-3.5 h-3.5 text-emerald-650 font-black" /> <span>Export CSV stock</span>
            </button>
          </div>

          {/* Search boxes */}
          <div className="flex flex-col sm:flex-row gap-2.5 font-sans">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search medicine brand, batch tag code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-emerald-200 shadow-inner rounded-xl p-2.5 pl-9 text-xs font-bold bg-white text-slate-800 outline-none placeholder-slate-400 focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 text-[10px] font-bold shadow-inner text-slate-700">
                <span className="text-emerald-800 uppercase text-[8.5px] tracking-wider font-extrabold leading-none">From:</span>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-none outline-none font-mono cursor-pointer text-slate-800 font-bold"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3 py-2 text-[10px] font-bold shadow-inner text-slate-700">
                <span className="text-emerald-800 uppercase text-[8.5px] tracking-wider font-extrabold leading-none">To:</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-none outline-none font-mono cursor-pointer text-slate-800 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {filteredMedicines.map((m) => {
              const bPrice = m.buyPrice ?? Math.round(m.price * 0.8);
              const sPrice = m.salePrice ?? m.price;
              
              return (
                <div
                  key={m.name}
                  className="p-4 bg-white border border-emerald-200 rounded-2xl flex flex-col justify-between shadow-sm hover:border-emerald-400 hover:scale-[1.01] transition-all duration-200 space-y-3 text-slate-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <strong className="text-emerald-950 block font-black uppercase text-[11.5px] font-sans leading-none">{m.name}</strong>
                      <span className="font-mono text-[9px] text-slate-9000 block leading-none font-semibold">
                        Batch: {m.batch} • Entry: {m.date}
                      </span>
                    </div>

                    <div className="text-right">
                      <strong className="font-mono block text-xs font-black text-slate-900">{m.qty} Units</strong>
                      {m.qty < 10 ? (
                        <span className="inline-block bg-rose-50 text-rose-700 border border-rose-250 font-black px-1.5 py-0.5 rounded-md text-[7.5px] uppercase tracking-wider animate-pulse leading-none mt-1">
                          Low Stock!
                        </span>
                      ) : (
                        <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-250 font-black px-1.5 py-0.5 rounded-md text-[7.5px] uppercase tracking-wider leading-none mt-1">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-emerald-50/40 p-2 rounded-xl border border-emerald-100">
                    <div className="grid grid-cols-2 gap-x-4 shrink-0">
                      <div>
                        <span className="block text-[7.5px] text-slate-9000 uppercase tracking-widest font-black leading-none mb-0.5">Purchased</span>
                        <strong className="font-mono text-slate-800 font-black text-[10.5px]">{bPrice} INR</strong>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-slate-9000 uppercase tracking-widest font-black leading-none mb-0.5">Dispensation</span>
                        <strong className="font-mono text-emerald-800 font-black text-[10.5px]">{sPrice} INR</strong>
                      </div>
                    </div>

                    <button type="button"
                      onClick={() => {
                        setEditingMedicine({
                          ...m,
                          buyPrice: bPrice,
                          salePrice: sPrice,
                        });
                      }}
                      className="p-2 bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
                      title="Edit Medication Record (ওষুধ ও স্টক সংশোধন করুন)"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredMedicines.length === 0 && (
              <p className="text-xs text-zinc-550 text-slate-9000 italic font-black py-4">Zero match found in pharmacy catalog vaults.</p>
            )}
          </div>
        </div>

      </div>

      {/* Edit Medication Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1100] transition-all">
          <div className="bg-white border border-emerald-250 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-sm relative text-slate-800 leading-normal font-sans">
            <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-t-3xl"></span>
            
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h3 className="font-black text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={15} className="text-emerald-600" /> Edit Medicine Vault Node
              </h3>
              <button onClick={() => setEditingMedicine(null)} 
                className="text-slate-700 hover:text-slate-650 transition-colors cursor-pointer text-lg bg-transparent border-none outline-none font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const editedName = fd.get('editName') as string;
                const editedBatch = fd.get('editBatch') as string;
                const editedQty = parseInt(fd.get('editQty') as string) || 0;
                const editedBuyPrice = parseFloat(fd.get('editBuyPrice') as string) || 0;
                const editedSalePrice = parseFloat(fd.get('editSalePrice') as string) || 0;
                const editedDate = fd.get('editDate') as string;

                setMedicines(prev => prev.map(m => {
                  if (m.name === editingMedicine.name) {
                    return {
                      name: editedName,
                      batch: editedBatch,
                      qty: editedQty,
                      price: editedSalePrice,
                      buyPrice: editedBuyPrice,
                      salePrice: editedSalePrice,
                      date: editedDate
                    };
                  }
                  return m;
                }));

                showNotification('success', `Updated info for brand ${editedName} inside database folder.`);
                setEditingMedicine(null);
              }}
              className="space-y-4 text-xs font-semibold text-slate-700"
            >
              <div>
                <label className="block  mb-1.5 uppercase font-bold tracking-wider text-[10px] text-slate-900">Medicine Brand Name (নাম)</label>
                <input 
                  required
                  name="editName"
                  type="text"
                  defaultValue={editingMedicine.name}
                  className="w-full border border-emerald-200  p-2.5 rounded-xl  font-bold outline-none focus:border-emerald-500 text-xs  placeholder:font-semibold bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block  mb-1.5 uppercase font-bold tracking-wider text-[10px] text-slate-900">Batch Code (ব্যাচ কোড)</label>
                  <input 
                    required
                    name="editBatch"
                    type="text"
                    defaultValue={editingMedicine.batch}
                    className="w-full border border-emerald-200  p-2.5 rounded-xl  font-bold outline-none focus:border-emerald-500 text-xs font-mono  placeholder:font-semibold bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block  mb-1.5 uppercase font-bold tracking-wider text-[10px] text-slate-900">Stock Quantity (পরিমাণ)</label>
                  <input 
                    required
                    name="editQty"
                    type="number"
                    min="0"
                    defaultValue={editingMedicine.qty}
                    className="w-full border border-emerald-200  p-2.5 rounded-xl  font-bold outline-none focus:border-emerald-500 text-[11px] font-mono font-black  placeholder:font-semibold bg-white text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold text-slate-900">Buy Price (INR ক্রয়মূল্য)</label>
                  <input
                    required
                    name="editBuyPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingMedicine.buyPrice}
                    className="w-full border border-emerald-200  p-2.5 rounded-xl  outline-none font-mono focus:border-emerald-500 font-bold text-xs text-black  placeholder:font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block  mb-1.5 uppercase tracking-wider text-[10px] font-bold font-sans text-slate-900">Sale Price (INR বিক্রয়মূল্য)</label>
                  <input
                    required
                    name="editSalePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingMedicine.salePrice}
                    className="w-full border border-emerald-200  p-2.5 rounded-xl  outline-none font-mono focus:border-emerald-500 font-bold text-xs text-black  placeholder:font-semibold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block  mb-1.5 uppercase font-bold tracking-wider text-[10px] text-slate-900">Checked/Entry Date (তারিখ)</label>
                <input 
                  required
                  name="editDate"
                  type="date"
                  defaultValue={editingMedicine.date}
                  className="w-full border border-emerald-200  p-2.5 rounded-xl  font-bold outline-none focus:border-emerald-500 text-xs font-mono  placeholder:font-semibold bg-white text-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" 
                  onClick={() => setEditingMedicine(null)}
                  className="px-4 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all cursor-pointer border-none text-xs shadow-sm btn-action-blue"
                >
                  Update Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
