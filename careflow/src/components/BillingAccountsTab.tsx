import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { 
  Receipt, 
  Search, 
  Download, 
  Trash2, 
  Plus, 
  Edit2, 
  Check, 
  PlusCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  User as UserIcon, 
  FileText, 
  ChevronRight, 
  Bed, 
  Stethoscope, 
  Calendar, 
  Printer, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Patient, Bill, BillDetailItem, User } from "../types";

interface BillingAccountsTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  beds: any[];
  setBeds: React.Dispatch<React.SetStateAction<any[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  currentUser: User | null;
  pushTimelineEvent: (patientId: string, status: string, updatedBy: string, remarks: string) => void;
  handleExportCSV: (filename: string, columns: any[], dataList: any[]) => void;
  setActiveInvoice: (invoice: Bill | null) => void;
}

export default function BillingAccountsTab({
  patients,
  setPatients,
  beds,
  setBeds,
  bills,
  setBills,
  currentUser,
  pushTimelineEvent,
  handleExportCSV,
  setActiveInvoice,
}: BillingAccountsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState("All");

  // Selection state
  const [selectedPatientId, setSelectedPatientId] = useState("");

  // Input states for manual extra entries
  const [stayDays, setStayDays] = useState<number>(1);
  const [otCharge, setOtCharge] = useState<number>(0);
  const [extraMedCharge, setExtraMedCharge] = useState<number>(0);
  const [nursingCharge, setNursingCharge] = useState<number>(500);
  const [anesthesiaFee, setAnesthesiaFee] = useState<number>(0);
  const [othersCharge, setOthersCharge] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);

  // Discount options
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxPercentage, setTaxPercentage] = useState<number>(5);
  const [paymentMode, setPaymentMode] = useState<string>("CASH");
  const [healthCardType, setHealthCardType] = useState<string>("");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [upiAmount, setUpiAmount] = useState<number>(0);

  // Draft Bill Items
  const [draftItems, setDraftItems] = useState<BillDetailItem[]>([]);

  // Editing state for draft items table
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingQty, setEditingQty] = useState<number>(1);
  const [editingPrice, setEditingPrice] = useState<number>(0);

  // Manual Particular input state
  const [customParticularName, setCustomParticularName] = useState("");
  const [customParticularCategory, setCustomParticularCategory] = useState("other");
  const [customParticularQty, setCustomParticularQty] = useState(1);
  const [customParticularPrice, setCustomParticularPrice] = useState(0);

  const [predefinedSelection, setPredefinedSelection] = useState<string>("reg");

  // Find currently selected patient object
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleAddPredefined = () => {
    let newItem: any = null;
    switch(predefinedSelection) {
      case "reg":
        newItem = { type: "reg", name: "Standard Checkin Registration Fee (ভর্তি ফি)", qty: 1, unitPrice: 500, selectType: "Base Registration (বেস ফি)" };
        break;
      case "doc":
        let docRate = activePatient?.condition === "Critical" ? 1500 : 1005;
        newItem = { type: "doc", name: `Consulting Physician Round Fee (${activePatient?.referBy || "Duty Specialist"})`, qty: 1, unitPrice: docRate, selectType: `Doctor Session (ডাক্তার রাউন্ড ফি)` };
        break;
      case "med":
        let pharmacyCost = 0;
        let dispensedNames: string[] = [];
        activePatient?.timeline?.forEach(event => {
          if (event.dispensation && !event.dispensation.isRestored) {
            pharmacyCost += event.dispensation.qty * event.dispensation.price;
            dispensedNames.push(`${event.dispensation.medicineName} (Qty: ${event.dispensation.qty})`);
          }
        });
        newItem = { type: "med", name: `Pharmacy Dispensed Medicines: ${dispensedNames.slice(0, 3).join(", ")}${dispensedNames.length > 3 ? "..." : ""}`, qty: 1, unitPrice: pharmacyCost, selectType: `Pharmacy Bill (ওষুধ বিল)` };
        break;
      case "ot":
        newItem = { type: "ot", name: "Surgery & OT Theater Usage charges (ওটি চার্জ)", qty: 1, unitPrice: otCharge || 0, selectType: "OT Charge (ওটি চার্জ)" };
        break;
      case "extra_med":
        newItem = { type: "med", name: "Surgical Dressings / Extra Medicines (অতিরিক্ত ওষুধ)", qty: 1, unitPrice: extraMedCharge || 0, selectType: "Extra Medicines" };
        break;
      case "nurse":
        newItem = { type: "other", name: "General Nursing & Auxiliary Services (নার্সিং চার্জ)", qty: 1, unitPrice: nursingCharge || 0, selectType: "Nursing Fee (নার্সিং চার্জ)" };
        break;
      case "anes":
        newItem = { type: "doc", name: "Anesthesia Professional Fees (অ্যানেস্থেশিয়া ফি)", qty: 1, unitPrice: anesthesiaFee || 0, selectType: "Anesthetist Fee" };
        break;
      case "other":
        newItem = { type: "other", name: "Emergency Medical Consumables / Other Duties (অন্যান্য)", qty: 1, unitPrice: othersCharge || 0, selectType: "Other Charges" };
        break;
    }
    
    if (newItem) {
      setDraftItems(prev => [...prev, { ...newItem, id: Date.now() }]);
    }
  };

  // Set the default patient on load
  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  // Load and auto-populate patient charges when patient or stay parameters change
  const autoPopulatePatientCosts = () => {
    if (!activePatient) return;

    const items: BillDetailItem[] = [];

    // 1. Room/Bed cabin stay charges
    if (activePatient.bed && activePatient.bed !== "None") {
      const bedObj = beds.find(b => b.id === activePatient.bed);
      const rate = bedObj?.chargeAmount || 1000;
      items.push({
        id: 10002,
        type: "bed",
        name: `Inpatient Stay Fee (${activePatient.bed})`,
        qty: stayDays,
        unitPrice: rate,
        selectType: `Room/Bed Stay (বেড ও কেবিন ভাড়া)`,
      });
    }

    setDraftItems(items);
  };

  // Run autoPopulate whenever the selected patient, stay duration, or manual inputs change
  useEffect(() => {
    if (activePatient) {
      // Auto estimate stay duration from dates
      if (activePatient.date) {
        try {
          const admDate = new Date(activePatient.date);
          const currDate = new Date();
          const diffTime = Math.abs(currDate.getTime() - admDate.getTime());
          const estDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          // update but do not loop-trigger
          setStayDays(estDays);
        } catch (e) {
          setStayDays(1);
        }
      } else {
        setStayDays(1);
      }
    }
  }, [selectedPatientId]);

  // Re-run population if inputs parameters change explicitly
  useEffect(() => {
    autoPopulatePatientCosts();
  }, [
    selectedPatientId,
    stayDays,
    otCharge,
    extraMedCharge,
    nursingCharge,
    anesthesiaFee,
    othersCharge,
  ]);

  // Calculations
  const draftSubtotal = draftItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  
  const discountTotalVal = discountType === "percentage" 
    ? draftSubtotal * (discountValue / 100)
    : discountValue;

  const validSubtotalWithDiscount = Math.max(0, draftSubtotal - discountTotalVal);
  const taxCostVal = Math.round(validSubtotalWithDiscount * (taxPercentage / 100));
  
  // Grand total represents Net due after subtraction of Advance amount
  const calculatedGrandTotal = Math.max(0, Math.round(validSubtotalWithDiscount + taxCostVal - advancePaid));

  const handleCreateBill = () => {
    if (!activePatient) return alert("Please select a patient card.");

    const generatedBill: Bill = {
      invoice: `INV-${Math.floor(81000 + Math.random() * 9000)}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientMobile: activePatient.mobile,
      date: new Date().toISOString().split("T")[0],
      total: calculatedGrandTotal,
      isDischarged: activePatient.condition === "Discharged",
      dischargeNotes: activePatient.condition === "Discharged" ? "Cleared hospital invoice and case record archived." : "",
      dispensedMedicines: [...draftItems],
      breakdown: {
        reg: draftItems.filter(i => i.type === "reg").reduce((s, i) => s + (i.qty * i.unitPrice), 0),
        bed: draftItems.filter(i => i.type === "bed").reduce((s, i) => s + (i.qty * i.unitPrice), 0),
        doc: draftItems.filter(i => i.type === "doc").reduce((s, i) => s + (i.qty * i.unitPrice), 0),
        test: draftItems.filter(i => i.type === "test").reduce((s, i) => s + (i.qty * i.unitPrice), 0),
        med: draftItems.filter(i => i.type === "med").reduce((s, i) => s + (i.qty * i.unitPrice), 0),
        ot: otCharge,
        extraMed: extraMedCharge,
        nursing: nursingCharge,
        anesthesia: anesthesiaFee,
        other: draftItems.filter(i => i.type === "other" || i.type === "other_fee").reduce((s, i) => s + (i.qty * i.unitPrice), 0) + othersCharge,
        discount: discountTotalVal,
        tax: taxPercentage,
        advance: advancePaid,
      },
      paymentMode,
      healthCardType: paymentMode === "HEALTH_CARD" ? healthCardType : undefined,
      cashAmount: paymentMode === "CASH_UPI" ? cashAmount : undefined,
      upiAmount: paymentMode === "CASH_UPI" ? upiAmount : undefined,
      subtotal: draftSubtotal,
    };

    setBills(prev => [generatedBill, ...prev]);
    pushTimelineEvent(
      activePatient.id,
      "Bill Generated",
      currentUser?.name || "Accounts Executive",
      `Hospital stays invoice created successfully. Total net payment INR: ${calculatedGrandTotal} INR. Mode: ${paymentMode}.`
    );

    alert(`Successfully generated invoice "${generatedBill.invoice}" for ${activePatient.name}.`);
    
    // Clear fields
    setOtCharge(0);
    setExtraMedCharge(0);
    setAnesthesiaFee(0);
    setOthersCharge(0);
    setAdvancePaid(0);
    setDiscountValue(0);
  };

  const matchedBills = bills.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.invoice.toLowerCase().includes(term) ||
      b.patientName.toLowerCase().includes(term) ||
      b.patientId.toLowerCase().includes(term);
    const matchesFilter = filterPayment === "All" || b.paymentMode === filterPayment;
    return matchesSearch && matchesFilter;
  });

  const handleDischargeAndPrint = (e: React.MouseEvent, b: Bill, patientNow: Patient, isBedAllocated: boolean) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const note = "Patient stable, fully recovered and cleared stay accounts.";

      // 1. Update patient status to Discharged
      setPatients(prev => prev.map(p => {
        if (p.id === b.patientId) {
          return {
            ...p,
            condition: "Discharged",
            bed: "None", // remove bed assignment
            timeline: [
              ...(p.timeline || []),
              {
                status: "Discharged",
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                updatedBy: currentUser?.name || "Cashier Accountant",
                remarks: `Indoor discharge authorization approved. Cleared billing invoice stays reference: ${b.invoice}. Details: ${note}`,
              }
            ]
          };
        }
        return p;
      }));

      // 2. Clear room bed occupancy status
      const bedStayItem = (b.dispensedMedicines || []).find(i => i.type === "bed");
      if (bedStayItem || isBedAllocated) {
        setBeds(prev => prev.map(bd => {
          if (bd.id === patientNow.bed) {
            return { ...bd, status: "Available" };
          }
          return bd;
        }));
      }

      // 3. Generate Discharge Certificate
      const doc = new jsPDF({ format: "a4" });
      const dischargeDate = new Date().toISOString().split("T")[0];
      
      // Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("NURSING HOME DISCHARGE LETTER", 105, 30, { align: "center" });
      
      // Details
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.text(`Patient Name: ${patientNow.name}`, 20, 50);
      doc.text(`Age/Sex: ${patientNow.age || "N/A"} / ${patientNow.gender || "N/A"}`, 20, 60);
      doc.text(`Admission Date: ${patientNow.date || "N/A"}`, 20, 70);
      doc.text(`Discharge Date: ${dischargeDate}`, 20, 80);
      
      // Diagnosis
      doc.text(`Diagnosis: ${patientNow.condition || "N/A"}`, 20, 100);
      
      // Treatment Given
      doc.setFont("Helvetica", "bold");
      doc.text("Treatment Given:", 20, 120);
      doc.setFont("Helvetica", "normal");
      const treatmentText = "The patient received appropriate nursing care and treatment during the stay. Condition improved satisfactorily.";
      const splitTreatment = doc.splitTextToSize(treatmentText, 170);
      doc.text(splitTreatment, 20, 130);
      
      // Discharge Condition
      doc.setFont("Helvetica", "bold");
      doc.text("Discharge Condition:", 20, 150);
      doc.setFont("Helvetica", "normal");
      doc.text("Patient discharged in stable condition.", 20, 160);
      
      // Advice
      doc.setFont("Helvetica", "bold");
      doc.text("Advice:", 20, 180);
      doc.setFont("Helvetica", "normal");
      doc.text("• Take prescribed medicines regularly", 25, 190);
      doc.text("• Maintain proper diet and rest", 25, 200);
      doc.text("• Follow up after ______ days", 25, 210);
      doc.text("• Contact doctor if any emergency occurs", 25, 220);
      
      // Footer
      doc.text("Doctor's Signature: ____________________", 20, 260);
      doc.text("Hospital/Nursing Home Seal", 130, 260);
      
      doc.save(`${patientNow.id}_Discharge_Letter.pdf`);

      // Success! State is updated.
    } catch (err: any) {
      console.error(err);
      // alert error removed
    }
  };

  return (
    <div id="billing-accounts-dashboard" className="space-y-6 animate-fade-in text-slate-800 font-sans text-xs">
      
      {/* Title section banner */}
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden shadow-sm">
        <span className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-emerald-500 to-teal-500"></span>
        <div>
          <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider block w-fit mb-2">
            Discharge accounting desk & Payment ledger (হিসাব শাখা)
          </span>
          <h1 className="text-xl font-black uppercase tracking-wide flex items-center gap-2 text-emerald-950">
            <Receipt className="text-emerald-600 h-6 w-6" /> Billing & Accounts Management
          </h1>
          <p className="text-slate-650 font-normal text-xs mt-1 max-w-2xl font-bold">
            Audit patient clinic stays, automatically aggregate stay duration with pharmacy medications, configure extra diagnostic charges, and discharge active indoor patients.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Billing Desk block */}
        <div className="lg:col-span-7 bg-white border border-emerald-200 rounded-3xl p-6 space-y-6 relative overflow-hidden shadow-sm">
          <span className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></span>
          
          <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
            <h2 className="font-black text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <PlusCircle className="text-emerald-600" size={16} /> Patient Checkout Invoice Builder
            </h2>
            <button 
              type="button"
              onClick={autoPopulatePatientCosts}
              className="py-1.5 px-3 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold transition-all text-[10px] cursor-pointer shadow-sm"
              title="Reset items list to patient standard values"
            >
              Reset & Recalculate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Patient Selector */}
            <div className="space-y-1">
              <label className="block  font-bold uppercase text-[9.5px] tracking-wider font-sans text-slate-900">1. Select Patient (রোগী নির্বাচন)</label>
              <select
                id="invoicePatientId"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 px-3.5 py-3 rounded-xl text-slate-800 font-black text-xs outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-800">
                    {p.name} ({p.id}) — {p.type} {p.bed !== "None" ? `[${p.bed}]` : "[OPD Intake]"}
                  </option>
                ))}
              </select>
              {activePatient?.packageAmount ? (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex justify-between items-center shadow-sm">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Package Contact (চুক্তি মূল্য):</span>
                  <span className="text-sm font-black font-mono text-amber-900">{activePatient.packageAmount} INR</span>
                </div>
              ) : null}
            </div>

            {/* Stay days adjustment */}
            <div className="space-y-1">
              <label className="block  font-bold uppercase text-[9px] tracking-wider text-slate-900">2. Cabin/Bed Stays Duration (দিন)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={stayDays}
                  onChange={(e) => setStayDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 px-3.5 py-2.5 rounded-xl text-slate-800 font-black text-sm outline-none font-mono"
                />
                <span className="text-[10px] text-emerald-800 font-bold shrink-0">Days</span>
              </div>
            </div>
          </div>

          {/* Particular draft list view/edit table */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-emerald-900 font-bold block">
              3. View & Edit Draft Bill Particulars (বিল বিবরণী ও সংশোধন)
            </span>

            <div className="overflow-x-auto rounded-xl border border-emerald-100 bg-emerald-50/10 p-1.5">
              <table className="w-full text-left font-medium">
                <thead>
                  <tr className="border-b border-emerald-100 text-[8.5px] uppercase text-emerald-800 font-black pb-1">
                    <th className="py-2 px-3">Statement Particular</th>
                    <th className="py-2 text-center">Qty / Days</th>
                    <th className="py-2 text-right">Unit Rate (INR)</th>
                    <th className="py-2 text-right">Total Cost (INR)</th>
                    <th className="py-2 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100 font-bold text-slate-700">
                  {draftItems.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30">
                      <td className="py-3 px-3">
                        <span className="block font-black text-slate-900">{item.name}</span>
                        <span className="text-[8.5px] uppercase font-mono text-slate-9000 block tracking-normal mt-0.5 font-bold">
                          {item.selectType}
                        </span>
                      </td>

                      <td className="py-3 text-center">
                        {editingItemId === item.id ? (
                          <input 
                            type="number" 
                            min="1"
                            value={editingQty}
                            onChange={(e) => setEditingQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 bg-white border border-emerald-250 text-center rounded text-xs p-1 font-mono text-slate-900 outline-none"
                          />
                        ) : (
                          <span className="font-mono">{item.qty}</span>
                        )}
                      </td>

                      <td className="py-3 text-right">
                        {editingItemId === item.id ? (
                          <input 
                            type="number" 
                            min="0"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-16 bg-white border border-emerald-250 text-right rounded text-xs p-1 font-mono text-emerald-800 outline-none"
                          />
                        ) : (
                          <span className="font-mono text-slate-600">{item.unitPrice} INR</span>
                        )}
                      </td>

                      <td className="py-3 text-right font-mono text-emerald-800">
                        {item.qty * item.unitPrice} INR
                      </td>

                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {editingItemId === item.id ? (
                            <button type="button"
                              onClick={() => {
                                setDraftItems(prev => prev.map(di => di.id === item.id ? { ...di, qty: editingQty, unitPrice: editingPrice } : di));
                                setEditingItemId(null);
                              }}
                              className="p-1 text-emerald-800 hover:text-emerald-900 bg-emerald-50 border border-emerald-200 rounded cursor-pointer transition-colors"
                              title="Save Row Changes"
                            >
                              <Check size={11} className="font-bold" />
                            </button>
                          ) : (
                            <button type="button"
                              onClick={() => {
                                setEditingItemId(item.id);
                                setEditingQty(item.qty);
                                setEditingPrice(item.unitPrice);
                              }}
                              className="p-1 text-emerald-800 hover:bg-emerald-50 bg-white border border-emerald-200 rounded cursor-pointer transition-colors"
                              title="Edit Charge Amount"
                            >
                              <Edit2 size={11} />
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => {
                              setDraftItems(prev => prev.filter(di => di.id !== item.id));
                            }}
                            className="p-1 text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                            title="Remove Particular"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {draftItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-9000 italic font-medium">
                        No billing statement items. Add custom item below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Predefined Add Options Row */}
            <div className="flex flex-col gap-2 mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex w-full items-center gap-2">
                <select
                  value={predefinedSelection}
                  onChange={(e) => setPredefinedSelection(e.target.value)}
                  className="flex-1 bg-white border border-emerald-200 text-emerald-900 font-bold p-1.5 rounded-lg outline-none text-xs"
                >
                  <option value="reg">Standard Checkin Registration Fee (ভর্তি ফি)</option>
                  <option value="doc">Consulting Physician Round Fee (ডাক্তার রাউন্ড ফি)</option>
                  <option value="med">Pharmacy Dispensed Medicines (ওষুধ বিল)</option>
                  <option value="ot">Surgery & OT Theater Usage charges (ওটি চার্জ)</option>
                  <option value="extra_med">Surgical Dressings / Extra Medicines (অতিরিক্ত ওষুধ)</option>
                  <option value="nurse">General Nursing & Auxiliary Services (নার্সিং চার্জ)</option>
                  <option value="anes">Anesthesia Professional Fees (অ্যানেস্থেশিয়া ফি)</option>
                  <option value="other">Emergency Medical Consumables / Other (অন্যান্য)</option>
                </select>
                {predefinedSelection !== "other" && (
                  <button
                    type="button"
                    onClick={handleAddPredefined}
                    className="btn-action-blue px-4 py-1.5 font-bold rounded-lg text-[10px] w-auto shrink-0 flex items-center gap-1 uppercase"
                  >
                    ADD NEW
                  </button>
                )}
              </div>
              
              {predefinedSelection === "other" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[10px] bg-white p-3 border border-emerald-100 rounded-lg">
                  <div>
                    <label className="block font-bold mb-0.5 text-slate-900 uppercase">Purpose (বিবরণ)</label>
                    <input
                      type="text"
                      placeholder="e.g. Saline, Blood Bag"
                      value={customParticularName}
                      onChange={(e) => setCustomParticularName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-black font-bold p-2 rounded-lg outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-0.5 text-slate-900 uppercase">Unit (পরিমাণ)</label>
                    <input
                      type="number"
                      min="1"
                      value={customParticularQty}
                      onChange={(e) => setCustomParticularQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-50 border border-slate-200 text-black font-bold font-mono p-2 rounded-lg outline-none text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-0.5 text-slate-900 uppercase">Amount (মূল্য)</label>
                    <input
                      type="number"
                      min="0"
                      value={customParticularPrice}
                      onChange={(e) => setCustomParticularPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-slate-50 border border-slate-200 text-black font-bold font-mono p-2 rounded-lg outline-none text-xs text-right"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const desc = customParticularName.trim();
                        if (!desc) return alert("Please specify the purpose / item name.");
                        
                        setDraftItems(prev => [
                          ...prev,
                          {
                            id: Date.now(),
                            type: "other",
                            name: `Emergency/Others: ${desc}`,
                            qty: customParticularQty,
                            unitPrice: customParticularPrice,
                            selectType: "Other Charges (অন্যান্য)"
                          }
                        ]);
                        
                        setCustomParticularName("");
                        setCustomParticularQty(1);
                        setCustomParticularPrice(0);
                      }}
                      className="w-full btn-action-blue px-4 font-bold rounded-lg text-[10px] flex items-center justify-center h-[34px] uppercase"
                    >
                      ADD ITEM
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Discount details inputs & Tax inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl shadow-inner">
            <div>
              <label className="block  font-bold mb-1.5 uppercase tracking-wider text-[8px] text-slate-900">Discount Type Designation</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => { setDiscountType("percentage"); setDiscountValue(0); }}
                  className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center border cursor-pointer transition-all ${discountType === "percentage" ? "border-emerald-500 bg-emerald-600 text-white shadow-inner" : "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"}`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => { setDiscountType("flat"); setDiscountValue(0); }}
                  className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center border cursor-pointer transition-all ${discountType === "flat" ? "border-emerald-500 bg-emerald-600 text-white shadow-inner" : "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"}`}
                >
                  Flat (INR)
                </button>
              </div>
            </div>

            <div>
              <label className="block  font-bold mb-1.5 uppercase tracking-wider text-[8px] text-slate-900">Discount Value ({discountType === "percentage" ? "%" : "INR "})</label>
              <input
                type="number"
                min="0"
                value={discountValue || ""}
                onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 p-2.5 rounded-xl text-slate-800 font-black outline-none font-mono text-center text-xs bg-white"
                placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 500"}
              />
            </div>

            <div>
              <label className="block  font-bold mb-1.5 uppercase tracking-wider text-[8px] text-slate-900">Service Tax / VAT Scale (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 p-2.5 rounded-xl text-slate-800 font-black outline-none font-mono text-center text-xs bg-white"
              />
            </div>
          </div>

          {/* Payment gateway selection */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-700 font-bold block">
              4. Payment Gateway Selection (পেমেন্ট পদ্ধতি)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { mode: "CASH", label: "CASH", icon: <Banknote className="h-4.5 w-4.5" /> },
                { mode: "CARD", label: "CARD", icon: <CreditCard className="h-4.5 w-4.5" /> },
                { mode: "UPI", label: "UPI", icon: <Smartphone className="h-4.5 w-4.5" /> },
                { mode: "HEALTH_CARD", label: "HEALTH CARD", icon: <ShieldCheck className="h-4.5 w-4.5" /> },
                { mode: "CASH_UPI", label: "CASH + UPI", icon: <Banknote className="h-4.5 w-4.5" /> },
              ].map((m) => {
                const isActive = paymentMode === m.mode;
                return (
                  <button
                    key={m.mode}
                    type="button"
                    onClick={() => setPaymentMode(m.mode)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer select-none leading-none border ${
                      isActive 
                        ? "bg-emerald-600 border-emerald-600 text-white font-black" 
                        : "bg-white border-emerald-200 text-emerald-805 hover:bg-emerald-50 hover:text-emerald-900 shadow-sm"
                    }`}
                  >
                    {m.icon}
                    <span className="text-[10.5px] block font-black leading-none">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMode === "HEALTH_CARD" && (
              <div className="mt-3 p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl shadow-sm">
                <label className="block text-[10px] font-black text-slate-700 uppercase mb-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  Select Health Card (স্বাস্থ্য সাথী / আয়ুষ্মান কার্ড)
                </label>
                <select
                  value={healthCardType}
                  onChange={(e) => setHealthCardType(e.target.value)}
                  className="w-full bg-white border border-emerald-300 text-slate-800 font-bold p-2.5 rounded-xl text-sm outline-none cursor-pointer focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                >
                  <option value="" disabled>-- Select Card --</option>
                  <option value="Swasthya Sathi Card">Swasthya Sathi Card</option>
                  <option value="Ayushman Bharat Card">Ayushman Bharat Card</option>
                  <option value="CGHS">CGHS</option>
                  <option value="ECHS">ECHS</option>
                  <option value="ESIC">ESIC</option>
                </select>
              </div>
            )}

            {paymentMode === "CASH_UPI" && (
              <div className="mt-3 grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl shadow-sm">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase mb-1 flex items-center gap-1">
                    <Banknote size={14} className="text-emerald-700" />
                    Enter Cash Amount
                  </label>
                  <input
                    type="number"
                    value={cashAmount || ""}
                    onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Cash Amount"
                    className="w-full bg-white border border-emerald-300 text-slate-800 font-bold p-2.5 rounded-xl text-sm outline-none cursor-text focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase mb-1 flex items-center gap-1">
                    <Smartphone size={14} className="text-emerald-700" />
                    Enter UPI Amount
                  </label>
                  <input
                    type="number"
                    value={upiAmount || ""}
                    onChange={(e) => setUpiAmount(parseFloat(e.target.value) || 0)}
                    placeholder="UPI Amount"
                    className="w-full bg-white border border-emerald-300 text-slate-800 font-bold p-2.5 rounded-xl text-sm outline-none cursor-text focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Calculations Summary Banner */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2 text-[11px] text-slate-800 shadow-sm">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Gross subtotal list bill (উপমোট):</span>
              <strong className="font-mono text-slate-850">{draftSubtotal} INR</strong>
            </div>

            {discountTotalVal > 0 && (
              <div className="flex justify-between items-center text-emerald-700">
                <span className="font-semibold">Adjustment discount reduction (ডিসকাউন্ট):</span>
                <strong className="font-mono">- {Math.round(discountTotalVal)} INR</strong>
              </div>
            )}

            {taxCostVal > 0 && (
              <div className="flex justify-between items-center text-blue-700">
                <span className="font-semibold">VAT/Taxes service add-on ({taxPercentage}%):</span>
                <strong className="font-mono">+ {taxCostVal} INR</strong>
              </div>
            )}

            {advancePaid > 0 && (
              <div className="flex justify-between items-center text-amber-700 font-bold">
                <span className="font-semibold">Deduction of pre-paid advance (অগ্রিম জমা):</span>
                <strong className="font-mono">- {advancePaid} INR</strong>
              </div>
            )}

            <div className="border-t border-emerald-100 pt-2 flex justify-between items-center text-xs w-full">
              <span className="uppercase tracking-wider font-extrabold text-emerald-800">Balance net payable due (পরিশোধযোগ্য বাকি):</span>
              <strong className="font-mono text-rose-600 text-base font-black">
                {calculatedGrandTotal} INR
              </strong>
            </div>

            {paymentMode === "CASH_UPI" && (cashAmount > 0 || upiAmount > 0) && (
              <div className="border-t border-emerald-100 pt-2 flex justify-between items-center text-[10.5px] w-full bg-emerald-50/50 p-2 rounded-lg mt-2">
                <span className="font-semibold text-emerald-800">Entered Amount Breakdown:</span>
                <strong className="font-mono text-emerald-800">
                  Cash: {cashAmount || 0} INR | UPI: {upiAmount || 0} INR | Total: {(cashAmount || 0) + (upiAmount || 0)} INR
                </strong>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCreateBill}
            disabled={draftItems.length === 0}
            className={`w-full py-3.5 rounded-2xl block text-center font-black uppercase text-xs tracking-wider transition-all cursor-pointer ${
              draftItems.length === 0
                ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            }`}
          >
            Reconcile Ledger & Generate Bill (ফাইনাল বিল রসিদ তৈরি)
          </button>
        </div>

        {/* Right receipts list & statements ledger */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-emerald-100 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-emerald-100 pb-3">
              <div>
                <h3 className="font-extrabold uppercase tracking-wider text-slate-800 text-xs flex items-center gap-1.5">
                  <FileText className="text-emerald-700" size={14} /> Receipts Ledger Log
                </h3>
                <span className="text-[10px] text-zinc-700 font-bold block mt-0.5">
                  Statement counts: <strong className="text-emerald-800">{matchedBills.length} slips</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const cols = [
                    { label: "Invoice ID", value: (b: Bill) => b.invoice },
                    { label: "Patient EHR ID", value: (b: Bill) => b.patientId },
                    { label: "Patient Name", value: (b: Bill) => b.patientName },
                    { label: "Payment Mode", value: (b: Bill) => b.paymentMode },
                    { label: "Net Revenue (INR)", value: (b: Bill) => b.total },
                    { label: "Check Date", value: (b: Bill) => b.date },
                  ];
                  handleExportCSV("Hospital_Ledger_Statements", cols, matchedBills);
                }}
                className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/80 rounded-lg text-[9px] uppercase cursor-pointer flex items-center gap-1 transition"
              >
                <Download size={11} /> Extract Excel CSV
              </button>
            </div>

            {/* Searches */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search invoice id, patient, mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 py-2.5 pl-8 pr-3 rounded-xl text-xs font-semibold outline-none text-slate-800 bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-700 absolute left-2.5 top-3.5" />
              </div>

              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500 p-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer text-slate-800 bg-white"
              >
                <option value="All">All Payments</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="UPI">UPI</option>
                <option value="HEALTH_CARD">HEALTH CARD</option>
                <option value="CASH_UPI">CASH + UPI</option>
              </select>
            </div>

            {/* List items holding printed slips */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {matchedBills.map((b) => {
                // Find current status of this patient
                const patientNow = patients.find(p => p.id === b.patientId);
                const isBedAllocated = patientNow && patientNow.bed && patientNow.bed !== "None";

                return (
                  <div
                    key={b.invoice}
                    className="p-4 bg-emerald-50/15 border border-emerald-100 rounded-2xl flex flex-col justify-between gap-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all relative overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <strong className="block text-emerald-800 font-mono text-[11px] font-black">{b.invoice}</strong>
                          <span className="block text-slate-800 font-black uppercase text-[10px] font-sans mt-0.5">{b.patientName}</span>
                          <span className="block text-[8.5px] text-slate-9000 font-bold font-mono">
                            EHR ID: {b.patientId} • Date: {b.date}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-0.5">
                          <span className="px-2 py-0.5 bg-emerald-100/80 border border-emerald-250 text-emerald-800 font-mono text-[8.5px] font-extrabold uppercase rounded leading-none flex gap-1">
                            {b.paymentMode}
                            {b.paymentMode === "CASH_UPI" && <span className="opacity-70">({b.cashAmount || 0}/{b.upiAmount || 0})</span>}
                          </span>
                          {b.healthCardType && (
                            <span className="text-[7.5px] font-bold text-emerald-700 max-w-[100px] truncate" title={b.healthCardType}>
                              {b.healthCardType}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 bg-white p-2 border border-emerald-100/90 rounded-xl flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-700 font-bold font-sans">Gross total billed statement:</span>
                        <strong className="font-mono text-emerald-805 text-emerald-800 font-black">{b.total} INR</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button type="button"
                        onClick={() => setActiveInvoice(b)}
                        className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-700 font-extrabold uppercase text-[9px] rounded-lg tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Printer size={12} /> Print/Download Bill
                      </button>

                      {patientNow && patientNow.condition !== "Discharged" ? (
                        <button type="button"
                          onClick={(e) => handleDischargeAndPrint(e, b, patientNow, !!isBedAllocated)}
                          className="py-2 px-3 bg-[#006400] hover:bg-[#004b00] text-white font-black uppercase text-[9px] rounded-lg tracking-wider cursor-pointer border-none shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
                        >
                          Discharge Patient
                        </button>
                      ) : (
                        <div className="py-1 px-2.5 bg-slate-100 border border-slate-200 text-slate-9000 rounded-lg text-[8.5px] font-bold uppercase flex items-center gap-1 leading-none select-none">
                          <Check size={11} className="text-[#006400] font-bold" /> Discharged Case
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {matchedBills.length === 0 && (
                <div className="py-12 text-center text-slate-9000 italic font-semibold border-2 border-dashed border-emerald-100 rounded-2xl">
                  No matching invoice receipts found in statements database.
                </div>
              )}
            </div>
          </div>

          {/* Quick Discharge Guide card */}
          <div className="p-4 bg-slate-50 border border-emerald-100 rounded-3xl flex items-start gap-3">
            <AlertCircle className="text-amber-500 shrink-0 h-5 w-5 mt-0.5" />
            <div>
              <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">Discharge Protocols (ডিসচার্জ নির্দেশিকা)</h4>
              <p className="text-[10px] text-slate-700 font-normal leading-relaxed mt-0.5">
                Always ensure patient dues are completely paid and invoices generated before executing the final <strong className="text-teal-700">"Discharge Patient"</strong> clearance. This action instantly resets standard stay bed resources in real-time.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
