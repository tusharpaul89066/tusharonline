import React from "react";
import { jsPDF } from "jspdf";
import { Printer, X, ShieldCheck } from "lucide-react";
import { Patient, Doctor, LabTest, LabTestMaster, LabPackage, Bill, Bed } from "../types";
import PatientEditFormModal from "./PatientEditFormModal";
import AppointmentEditModal from "./AppointmentEditModal";
import AdmissionEditModal from "./AdmissionEditModal";

import { toPng } from "html-to-image";

export const downloadTokenPDF = (tokenData: any, labTestsMaster: LabTestMaster[]) => {
  if (!tokenData) return;
  // 4"x6" is 101.6mm x 152.4mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [4, 6]
  });

  // Border:
  doc.setDrawColor(3, 18, 43); // #03122b Core Navy
  doc.setLineWidth(0.04);
  doc.rect(0.12, 0.12, 3.76, 5.76);

  // Decorative header
  doc.setFillColor(3, 18, 43);
  doc.rect(0.15, 0.15, 3.7, 0.65, "F");

  // Title text inside navy rect
  doc.setTextColor(34, 211, 238); // Cyan-400
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("HAZIRA HEALTH LABS", 2.0, 0.38, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("SPECIMEN LAB TOKEN / ল্যাব নমুনা টোকেন", 2.0, 0.58, { align: "center" });

  // Token value
  doc.setTextColor(3, 18, 43);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(26);
  doc.text(tokenData.token || "L-TK-9302", 2.0, 1.45, { align: "center" });

  // Sample Type Highlight Box
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(45, 212, 191); // Teal 400
  doc.setLineWidth(0.01);
  doc.rect(0.4, 1.75, 3.2, 0.45, "FD");
  
  doc.setTextColor(13, 148, 136); // Teal 600
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`SAMPLE: ${tokenData.sampleType || "Blood (রক্ত)"}`, 2.0, 2.02, { align: "center" });

  // Patient / Registration Details:
  doc.setTextColor(100, 116, 139); // Gray
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  
  // Grid coordinates
  const yStart = 2.55;
  const lineSpacing = 0.23;

  doc.text("PATIENT NAME:", 0.35, yStart);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(tokenData.patientName || "Patient", 1.55, yStart);

  doc.setTextColor(100, 116, 139);
  doc.text("UHID / CASE ID:", 0.35, yStart + lineSpacing);
  doc.setTextColor(15, 23, 42);
  doc.text(tokenData.patientId || "N/A", 1.55, yStart + lineSpacing);

  doc.setTextColor(100, 116, 139);
  doc.text("LAB RECORD ID:", 0.35, yStart + lineSpacing * 2);
  doc.setTextColor(15, 23, 42);
  doc.text(tokenData.id || "N/A", 1.55, yStart + lineSpacing * 2);

  doc.setTextColor(100, 116, 139);
  doc.text("ISSUE DATE:", 0.35, yStart + lineSpacing * 3);
  doc.setTextColor(15, 23, 42);
  doc.text(tokenData.date || "N/A", 1.55, yStart + lineSpacing * 3);

  // Ordered tests list
  doc.setTextColor(3, 18, 43);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ORDERED TESTS:", 0.35, 3.75);

  // Draw tests
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const testNames = (tokenData.tests || []).map((tid: string) => {
    const tObj = labTestsMaster.find(t => t.id === tid);
    return tObj ? tObj.name : tid;
  });
  const testsStr = testNames.join(", ");
  
  const splitTests = doc.splitTextToSize(testsStr, 3.2);
  doc.text(splitTests, 0.35, 3.95);

  // Barcode decoration
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.012);
  let barX = 0.5;
  while (barX < 3.5) {
    const w = Math.random() < 0.3 ? 0.04 : (Math.random() < 0.5 ? 0.02 : 0.01);
    doc.setLineWidth(w);
    doc.line(barX, 4.75, barX, 5.15);
    barX += w + (Math.random() * 0.03 + 0.015);
  }

  doc.setTextColor(148, 163, 184);
  doc.setFont("Courier", "bold");
  doc.setFontSize(7.5);
  doc.text(`* ${tokenData.token} * SECURE EHR RFID TRACKING`, 2.0, 5.32, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6.5);
  const noteText = "ATTACH SEAMLESS BARCODE SLIP SECURELY TO SPECIMEN TUBE.\nVerify adequacy before path-lab queue. Hazira Systems.";
  doc.text(noteText, 2.0, 5.52, { align: "center" });

  doc.save(`Lab_Token_${tokenData.token}.pdf`);
};

export const downloadReceiptPDF = (receiptData: any, labTestsMaster: LabTestMaster[]) => {
  if (!receiptData) return;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter"
  });

  // Navy branding aesthetics
  doc.setFillColor(3, 18, 43); // brand core color
  doc.rect(0, 0, 8.5, 0.15, "F");

  // Hazira letterhead top
  doc.setTextColor(3, 18, 43);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("HAZIRA HEALTH LABS", 0.5, 0.7);

  doc.setTextColor(71, 85, 105);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Registered Clinical Laboratory & Real-time Diagnostic Suite", 0.5, 0.9);
  doc.text("Hazira Operational Junction, Bangladesh | Tel: +880-1700-000000 | Support: support@careflow.com", 0.5, 1.05);

  // Invoice Banner
  doc.setFillColor(241, 245, 249);
  doc.rect(5.1, 0.45, 2.9, 0.75, "F");
  
  doc.setTextColor(15, 23, 42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DIAGNOSTIC TEST RECEIPT", 6.55, 0.7, { align: "center" });
  
  doc.setTextColor(79, 70, 229); // indigo
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`Lab Rec ID: ${receiptData.id}`, 6.55, 0.9, { align: "center" });
  
  doc.setTextColor(16, 185, 129); // green status
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Status: PAID IN FULL", 6.55, 1.1, { align: "center" });

  // Divider row
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.015);
  doc.line(0.5, 1.35, 8.0, 1.35);

  // Patient info panel
  doc.setFillColor(248, 250, 252);
  doc.rect(0.5, 1.5, 7.5, 1.1, "F");
  doc.setDrawColor(241, 245, 249);
  doc.rect(0.5, 1.5, 7.5, 1.1, "S");

  doc.setTextColor(100, 116, 139);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);

  doc.text("PATIENT NAME:", 0.7, 1.75);
  doc.setTextColor(15, 23, 42);
  doc.text(receiptData.patientName || "N/A", 1.9, 1.75);

  doc.setTextColor(100, 116, 139);
  doc.text("UHID / CASE ID:", 0.7, 2.0);
  doc.setTextColor(15, 23, 42);
  doc.text(receiptData.patientId || "N/A", 1.9, 2.0);

  doc.setTextColor(100, 116, 139);
  doc.text("SPECIMEN TOKEN:", 0.7, 2.25);
  doc.setTextColor(13, 148, 136); // Teal
  doc.text(receiptData.token || "N/A", 1.9, 2.25);

  doc.setTextColor(100, 116, 139);
  doc.text("RECEIPT DATE:", 4.3, 1.75);
  doc.setTextColor(15, 23, 42);
  doc.text(receiptData.date || "N/A", 5.6, 1.75);

  doc.setTextColor(100, 116, 139);
  doc.text("SAMPLE TYPE:", 4.3, 2.0);
  doc.setTextColor(15, 23, 42);
  doc.text(receiptData.sampleType || "N/A", 5.6, 2.0);

  doc.setTextColor(100, 116, 139);
  doc.text("PATHOLOGIST REMARKS:", 4.3, 2.25);
  doc.setTextColor(15, 23, 42);
  doc.text(receiptData.remarks || "No extra pathologist remarks.", 5.6, 2.25, { maxWidth: 2.2 });

  // Particulars Table Header
  doc.setFillColor(3, 18, 43);
  doc.rect(0.5, 2.8, 7.5, 0.3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("SL", 0.7, 3.0);
  doc.text("DIAGNOSTIC TEST PARTICULAR / বিবরণী", 1.2, 3.0);
  doc.text("REGULAR CHARGE", 6.2, 3.0, { align: "right" });

  // Particulars rows
  let yPos = 3.35;
  const testsList = receiptData.tests || [];
  let baseTotal = 0;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  testsList.forEach((tid: string, index: number) => {
    const testObj = labTestsMaster.find(t => t.id === tid);
    const testName = testObj ? testObj.name : tid;
    const testPrice = testObj ? testObj.price : 0;
    baseTotal += testPrice;

    doc.text(`${index + 1}`, 0.7, yPos);
    doc.text(testName, 1.2, yPos);
    doc.text(`${testPrice} INR`, 6.2, yPos, { align: "right" });

    doc.setDrawColor(241, 245, 249);
    doc.line(0.5, yPos + 0.12, 8.0, yPos + 0.12);
    
    yPos += 0.3;
  });

  const discountVal = receiptData.packageDiscount || 0;
  const extraVal = receiptData.extraCharges || 0;
  const grandVal = receiptData.billTotal || (baseTotal - discountVal + extraVal);

  const sumStart = yPos + 0.15;
  doc.setTextColor(100, 116, 139);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);

  doc.text("BASE REGULAR LIST COST:", 3.5, sumStart);
  doc.text(`${baseTotal} INR`, 6.2, sumStart, { align: "right" });

  let curY = sumStart + 0.25;

  if (discountVal > 0) {
    doc.setTextColor(13, 148, 136); // teal
    doc.text("PACKAGE SAVINGS DISCOUNT (ছাড়):", 3.5, curY);
    doc.text(`- ${discountVal} INR`, 6.2, curY, { align: "right" });
    curY += 0.25;
  }

  if (extraVal > 0) {
    doc.setTextColor(217, 119, 6); // Amber
    doc.text("EXTRA MANUAL SERVICE FEES:", 3.5, curY);
    doc.text(`+ ${extraVal} INR`, 6.2, curY, { align: "right" });
    curY += 0.25;
  }

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.015);
  doc.line(3.5, curY - 0.1, 6.3, curY - 0.1);

  doc.setFillColor(3, 18, 43);
  doc.rect(3.5, curY - 0.05, 2.9, 0.4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("TOTAL INR PAID IN FULL:", 3.65, curY + 0.2);
  doc.text(`${grandVal} INR`, 6.2, curY + 0.2, { align: "right" });

  // Add barcode on bottom
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.015);
  let barX = 1.0;
  while (barX < 3.2) {
    const w = Math.random() < 0.4 ? 0.045 : 0.015;
    doc.setLineWidth(w);
    doc.line(barX, curY - 0.05, barX, curY + 0.35);
    barX += w + (Math.random() * 0.02 + 0.015);
  }

  const footerY = curY + 1.25;
  
  doc.setTextColor(148, 163, 184);
  doc.line(0.8, footerY, 2.6, footerY);
  doc.setTextColor(51, 65, 85);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.text(receiptData.signature || "Dr. K. Zaman, MD (Pathology)", 1.7, footerY + 0.15, { align: "center" });
  doc.setTextColor(148, 163, 184);
  doc.setFont("Helvetica", "normal");
  doc.text("AUTHORIZED SIGNATURE & SEAL", 1.7, footerY + 0.3, { align: "center" });

  doc.line(5.0, footerY, 6.8, footerY);
  doc.setTextColor(51, 65, 85);
  doc.setFont("Helvetica", "bold");
  doc.text("EHR Automated Accountant", 5.9, footerY + 0.15, { align: "center" });
  doc.setTextColor(148, 163, 184);
  doc.setFont("Helvetica", "normal");
  doc.text("RECEIVER SIGNATURE & AUDIT SEAL", 5.9, footerY + 0.3, { align: "center" });

  doc.setTextColor(148, 163, 184);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Terms: Diagnostic reports are synchronized automatically. Log in to Patient Portal to view.\nThis is a certified digital copy of payment ledger reconciled securely inside Hazira CareFlow.", 4.0, footerY + 0.7, { align: "center" });

  doc.save(`Lab_Receipt_${receiptData.id}.pdf`);
};

interface PrintOverlaysProps {
  editModal: { type: string; data: any } | null;
  setEditModal: (modal: any) => void;
  doctors: Doctor[];
  labTestsMaster: LabTestMaster[];
  labPackages: LabPackage[];
  viewingReceipt: any;
  setViewingReceipt: (receipt: any) => void;
  viewingToken: any;
  setViewingToken: (token: any) => void;
  activeInvoice: Bill | null;
  setActiveInvoice: (invoice: Bill | null) => void;
  patients?: Patient[];
  setPatients?: React.Dispatch<React.SetStateAction<Patient[]>>;
  pushTimelineEvent?: (patientId: string, status: string, updatedBy: string, remarks: string, signature?: string | null) => void;
  currentUser?: any;
  beds?: Bed[];
  setBeds?: React.Dispatch<React.SetStateAction<Bed[]>>;
}

export default function PrintOverlays({
  editModal,
  setEditModal,
  doctors,
  labTestsMaster,
  labPackages,
  viewingReceipt,
  setViewingReceipt,
  viewingToken,
  setViewingToken,
  activeInvoice,
  setActiveInvoice,
  patients,
  setPatients,
  pushTimelineEvent,
  currentUser,
  beds,
  setBeds,
}: PrintOverlaysProps) {

  // Execute standard print action
  const handlePrint = async () => {
    try {
      const element = document.querySelector('.print-receipt-sheet') as HTMLElement;
      if (!element) return;
      
      const hideElements = element.querySelectorAll('.no-print-button');
      hideElements.forEach((el: any) => el.style.display = 'none');
      
      const imgData = await toPng(element, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        fontEmbedCSS: '',
        skipFonts: true
      });
      
      hideElements.forEach((el: any) => el.style.display = '');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions properly to fit within page bounds
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Document_${Date.now()}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback
      window.print();
    }
  };

  return (
    <div id="print-overlays-container" className="relative font-bold text-xs">
      {/* 1. PRINTABLE OPD TICKET MODAL */}
      {editModal && editModal.type === "opdTicket" && (() => {
        const { patient, doctor } = editModal.data;
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-sm relative overflow-hidden print-receipt-sheet select-text font-mono border border-slate-200">
              <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-550 via-indigo-500 to-emerald-500 no-print-button"></span>

              <div className="text-center space-y-1">
                <div className="mx-auto w-fit bg-emerald-600 text-white font-sans font-black px-2 py-0.5 rounded uppercase tracking-widest text-[9px] mb-1 flex items-center justify-center gap-1">
                  <span>OPD CONSULTATION SLOT</span>
                </div>
                <h2 className="text-sm font-sans font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
                  Hazira CareFlow Health Systems
                </h2>
                <p className="text-[9px] text-zinc-700 leading-none">
                  Registered Enterprise Hospital OPD Department
                </p>
                <p className="text-[8.5px] text-zinc-800">
                  Hazira Operational Junction, Bangladesh | Tel: +880-1700-000000
                </p>
              </div>

              <div className="border-y-2 border-dashed my-4 py-3 space-y-1.5 text-[10.5px] uppercase font-bold text-zinc-800">
                <div className="flex justify-between">
                  <div>
                    <span className="text-zinc-800">TICKET NO :</span>{" "}
                    <strong className="text-emerald-700 text-xs font-mono">
                      OPD-TKT-{patient.id.replace(/\D/g, "") || "90"}305
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">DATE :</span>{" "}
                    <strong className="text-zinc-900 font-mono">
                      {patient.date}
                    </strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-800">PATIENT NAME :</span>{" "}
                    <strong className="text-zinc-900 font-sans">
                      {patient.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">EHR ID (UHID) :</span>{" "}
                    <strong className="text-zinc-900 font-mono">
                      {patient.id}
                    </strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-800">AGE / GENDER :</span>{" "}
                    <strong className="text-zinc-900">
                      {patient.age}Y / {patient.gender}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">BLOOD GROUP :</span>{" "}
                    <strong className="text-zinc-900">
                      {patient.blood || "N/A"}
                    </strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-dotted border-zinc-200">
                  <div>
                    <span className="text-zinc-800">CONTACT :</span>{" "}
                    <strong className="text-zinc-900 font-mono">
                      {patient.mobile}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">INSURANCE :</span>{" "}
                    <strong className="text-zinc-900 text-[9px] overflow-hidden text-ellipsis whitespace-nowrap block">
                      {patient.insurance || "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 my-3 space-y-1 uppercase font-bold text-[10.5px]">
                <span className="text-[9px] text-slate-9000 tracking-wider block leading-none mb-1">
                  ASSIGNED CONSULTING SPECIALIST
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="text-emerald-700 font-sans font-black text-xs">
                    DR. {doctor.name}
                  </span>
                  <span className="text-slate-9000 font-mono text-[9px]">
                    {doctor.spec}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9.5px] text-slate-9000 pt-1 border-t border-dotted border-emerald-200/60">
                  <span>SCHEDULE TIME:</span>
                  <span className="text-slate-900 font-black">
                    {patient.appointmentTime || doctor.time}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9.5px] text-slate-9000">
                  <span>CONSULTATION FEE:</span>
                  <span className="text-slate-900 font-black">
                    {doctor.fees || 1000} INR
                  </span>
                </div>
                {patient.opdOthersAmount !== undefined && patient.opdOthersAmount > 0 && (
                  <div className="flex justify-between items-center text-[9.5px] text-slate-9000">
                    <span>OTHERS AMOUNT:</span>
                    <span className="text-slate-900 font-black">
                      {patient.opdOthersAmount} INR
                    </span>
                  </div>
                )}
                {patient.opdOthersAmount !== undefined && patient.opdOthersAmount > 0 && (
                  <div className="flex justify-between items-center text-[9.5px] text-zinc-900 pt-1 border-t border-dotted border-emerald-200/60 font-black">
                    <span>TOTAL FEES:</span>
                    <span>
                      {(doctor.fees || 1000) + patient.opdOthersAmount} INR
                    </span>
                  </div>
                )}
              </div>

              <div className="border border-emerald-100 rounded-xl p-3 my-3 space-y-1 bg-emerald-50/20 uppercase font-bold text-[10px]">
                <span className="text-[9px] text-emerald-800 tracking-wider block leading-none mb-1">
                  PRELIMINARY VITAL TRIAGE DATA
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                  <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                    <span className="block text-[8px] text-slate-700 mb-0.5">
                      BLOOD BP
                    </span>
                    <span className="block font-black font-mono text-slate-800">
                      {patient.vitals?.bp || "120/80"}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                    <span className="block text-[8px] text-slate-700 mb-0.5">
                      PULSE RATE
                    </span>
                    <span className="block font-black font-mono text-slate-800">
                      {patient.vitals?.pulse || "74"}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                    <span className="block text-[8px] text-slate-700 mb-0.5">
                      TEMP
                    </span>
                    <span className="block font-black font-mono text-slate-800">
                      {patient.vitals?.temp || "98.4"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center py-2 space-y-1 font-sans">
                <div className="mx-auto w-3/4 h-8 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_6px)]"></div>
                <span className="text-[8.5px] font-mono tracking-widest text-zinc-800 font-semibold uppercase">
                  Hazira Secured Node EHR Autodetect
                </span>
              </div>

              <div className="text-center text-[8.5px] text-zinc-800 select-none pb-2 font-mono">
                Please carry this slip to the consulting room.
                <br />
                টিকিটটি অনুগ্রহ করে ডাক্তারের চেম্বারে সাথে নিয়ে যান।
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-zinc-200 no-print-button">
                <button type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition text-xs flex items-center justify-center gap-2 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" /> Close (বন্ধ করুন)
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black cursor-pointer shadow-md transition duration-150 text-xs flex items-center justify-center gap-2 border-none rounded-xl btn-action-blue"
                >
                  <Printer className="w-3.5 h-3.5 text-white" /> Print Slip (প্রিন্ট)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. PRINTABLE SPECIMEN COLLECTION LAB TOKEN SLIP */}
      {viewingToken && (() => {
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in font-sans overflow-y-auto font-semibold print-dialog-overlay">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-sm w-full overflow-hidden flex flex-col my-8 print-receipt-sheet select-text animate-fade-in">
              <div className="p-6 space-y-5 flex-1 text-slate-800 font-mono text-[11px]" id="labPrintableTokenArea">
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300 font-mono">
                  <div className="text-sm font-black tracking-tight text-slate-900 uppercase">🏥 HAZIRA HEALTH LABS</div>
                  <span className="text-[8.5px] bg-emerald-600 text-white shadow-md border-none px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block select-none font-sans font-black">
                    SPECIMEN LAB TOKEN / ল্যাব নমুনা টোকেন
                  </span>
                  <div className="text-[8px] text-zinc-700 uppercase font-bold tracking-wider pt-1 font-sans">
                    DO NOT DISCARD • ATTACH BARCODE TO SPECIMEN VIAL
                  </div>
                </div>

                <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-4 text-center my-2">
                  <span className="block text-[8px] tracking-widest uppercase font-extrabold text-slate-9000 font-sans font-bold">SPECIMEN COLLECTION RUN TOKEN</span>
                  <strong className="block text-3xl font-mono text-slate-800 tracking-widest font-black py-1">
                    {viewingToken.token}
                  </strong>
                  <span className="block text-[8.5px] text-emerald-850 font-black uppercase tracking-wider mt-1 bg-white border border-emerald-200 py-1 rounded-lg">
                    🧬 SAMPLE: {viewingToken.sampleType}
                  </span>
                </div>

                <div className="space-y-1.5 bg-emerald-55 bg-emerald-50/10 p-3 text-[10px] rounded-xl border border-emerald-100 shadow-sm border-dotted font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans">Patient Name:</span>
                    <strong className="font-sans font-bold text-slate-800">{viewingToken.patientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans">UHID Code:</span>
                    <strong className="text-slate-800 font-mono">{viewingToken.patientId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans">Registered Lab ID:</span>
                    <strong className="text-slate-805 font-mono">{viewingToken.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans">Issue Timestamp:</span>
                    <strong className="text-slate-805 font-mono">{viewingToken.date} • {new Date().toLocaleTimeString()}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 font-bold font-mono">
                  <span className="text-[8.5px] uppercase font-bold text-zinc-800 block tracking-wide font-sans">ORDERED TESTS / টেস্টসমূহ:</span>
                  <div className="flex flex-wrap gap-1 leading-relaxed font-semibold font-sans">
                    {viewingToken.tests.map((tid: string) => {
                      const tObj = labTestsMaster.find(t => t.id === tid);
                      return (
                        <span key={tid} className="text-slate-800 border text-[9px] px-2 py-0.5 rounded font-bold border-zinc-200 bg-zinc-50 font-sans">
                          🧪 {tObj ? tObj.name : tid}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center py-1 space-y-1 select-none">
                  <div className="mx-auto w-11/12 h-10 bg-[repeating-linear-gradient(90deg,black,black_2.5px,transparent_2.5px,transparent_6px,black_1px,transparent_2px)]"></div>
                  <span className="text-[7.5px] tracking-widest text-zinc-800 font-semibold uppercase font-sans">
                    * {viewingToken.token} * SECURE EHR RFID TRACKING
                  </span>
                </div>

                <div className="text-center text-[8px] text-zinc-700 font-sans border-t border-dashed pt-3 leading-tight uppercase font-medium">
                  নমুনা সংগ্রহ করার পর টিউবে বা কাচের পাত্রে লেবেল হিসেবে এই টোকেনটি ব্যবহার করুন। <br />
                  Verify sample volume is adequate before pushing to path-lab.
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2 text-xs select-none no-print-button leading-none font-sans">
                <button type="button"
                  onClick={() => downloadTokenPDF(viewingToken, labTestsMaster)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-none font-black py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span>টোকেন স্লিপ প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingToken(null)}
                  className="px-4 bg-slate-200 text-slate-800 hover:bg-slate-300 font-extrabold border-none rounded-xl cursor-pointer py-3 font-sans font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. PRINTABLE LAB PATHOLOGY INVOICE RECEIPT MODAL */}
      {viewingReceipt && (() => {
        const baseTotal = viewingReceipt.tests.reduce((sum: number, tid: string) => sum + (labTestsMaster.find(t => t.id === tid)?.price || 0), 0);
        const discountVal = viewingReceipt.packageDiscount || 0;
        const extraVal = viewingReceipt.extraCharges || 0;
        const grandVal = viewingReceipt.billTotal || (baseTotal - discountVal + extraVal);

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in font-sans overflow-y-auto font-semibold print-dialog-overlay">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md w-full overflow-hidden flex flex-col my-8 print-receipt-sheet select-text animate-fade-in">
              <div className="p-6 space-y-4 flex-1 text-slate-800 font-mono text-[11px]" id="labPrintableReceiptArea">
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-300 font-mono">
                  <div className="text-sm font-black tracking-tight text-slate-900 uppercase animate-none font-sans">🏥 HAZIRA HEALTH LABS</div>
                  <span className="text-[8.5px] bg-emerald-600 text-white shadow-md border-none px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block select-none font-sans font-black">
                    DIAGNOSTIC TEST RECEIPT / পরীক্ষা বিল রিসিট
                  </span>
                  <div className="text-[8px] text-zinc-700 uppercase font-bold tracking-wider pt-1 font-sans">
                    HAZIRA OPERATIONAL JUNCTION • SUPPORT: +880-1700-000000
                  </div>
                </div>

                <div className="space-y-1.5 bg-emerald-50/10 p-3 text-[10px] rounded-xl border border-emerald-100 shadow-sm border-dotted font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans text-[9px]">Patient Name:</span>
                    <strong className="font-sans font-bold text-slate-805">{viewingReceipt.patientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans text-[9px]">UHID:</span>
                    <strong className="text-slate-805 font-mono">{viewingReceipt.patientId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans text-[9px]">Lab Rec ID:</span>
                    <strong className="text-slate-805 font-mono">{viewingReceipt.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans text-[9px]">Token ID:</span>
                    <strong className="text-emerald-700 font-bold font-mono">{viewingReceipt.token}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-9000 uppercase font-sans text-[9px]">Date:</span>
                    <strong className="text-slate-805 font-mono">{viewingReceipt.date}</strong>
                  </div>
                </div>

                <div className="space-y-2 border-b-2 border-dashed pb-3 text-[10px]">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-800 font-black leading-none font-sans">
                    Bill Particulars / টেস্টসমূহের বিবরণী:
                  </p>
                  <div className="space-y-1 font-bold text-zinc-700 font-mono">
                    {viewingReceipt.tests.map((tid: string, idx: number) => {
                      const tObj = labTestsMaster.find(t => t.id === tid);
                      return (
                        <div key={idx} className="flex justify-between py-1 border-b border-zinc-100">
                          <span>🧪 {tObj ? tObj.name : tid}</span>
                          <span className="font-mono text-zinc-900">{tObj ? tObj.price : 0} INR</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 text-slate-800 text-[10px] font-mono font-semibold">
                  <div className="flex justify-between">
                    <span>Base Diagnostic Fee:</span>
                    <span className="font-mono">{baseTotal} INR</span>
                  </div>
                  {discountVal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Package Saving (ছাড়):</span>
                      <span className="font-mono">- {discountVal} INR</span>
                    </div>
                  )}
                  {extraVal > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold">
                      <span>Extra Manual Charges:</span>
                      <span className="font-mono">+ {extraVal} INR</span>
                    </div>
                  )}
                  <div className="border-t border-dashed my-2 pt-2 flex justify-between text-xs font-black bg-emerald-50/30 border-emerald-100 p-2 text-slate-900 rounded-lg">
                    <span>Grand Total (সর্বমোট পরিশোধিত):</span>
                    <span className="font-mono text-emerald-705 font-black text-emerald-800">{grandVal} INR</span>
                  </div>
                  <div className="text-right text-[8px] text-emerald-600 font-bold font-sans select-none pt-0.5 leading-none">
                    ✓ status: PAID IN FULL
                  </div>
                </div>

                <div className="text-center py-1 select-none">
                  <div className="mx-auto w-11/12 h-8 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_5px,black_1px)]"></div>
                </div>

                <div className="text-center text-[8px] text-zinc-700 font-sans border-t border-dashed pt-3 leading-tight uppercase font-medium">
                  EHR Automated Real-Time Integration Node Sync Verified.
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2 text-xs select-none no-print-button leading-none font-sans">
                <button type="button"
                  onClick={() => downloadReceiptPDF(viewingReceipt, labTestsMaster)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl border-none cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span>রিসিট প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="px-4 bg-slate-200 text-slate-800 hover:bg-slate-300 font-extrabold border-none rounded-xl cursor-pointer py-3 font-sans font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. PRINTABLE GENERAL BILL RECEIPT INVOICE MODAL */}
      {activeInvoice && (() => {
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono text-zinc-900 leading-normal">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-[11px] space-y-4 shadow-sm relative overflow-hidden print-receipt-sheet">
              <span className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-550 via-indigo-550 to-emerald-555 no-print-button"></span>

              <div className="text-center space-y-1">
                <div className="mx-auto w-fit bg-red-100 text-red-700 font-sans font-black px-2 py-0.5 rounded uppercase tracking-widest text-[9px] mb-1 flex items-center gap-1 leading-none justify-center">
                  <span>+ EMERGENCY CARE</span>
                </div>
                <h2 className="text-sm uppercase tracking-wider font-extrabold leading-tight text-slate-900">
                  Hazira CareFlow Nursing Home
                </h2>
                <p className="text-[9.5px] text-zinc-700 leading-none">
                  Registered Enterprise Hospital Ledger & Patient Directory Node
                </p>
                <p className="text-[8.5px] text-zinc-800 font-mono">
                  Hazira Operational Junction, Bangladesh | Tel: +880-1700-000000
                </p>
              </div>

              <div className="border-y-2 border-dashed py-3 space-y-1 text-[10px] uppercase font-bold text-zinc-805">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-800">PATIENT NAME :</span>{" "}
                    <strong className="text-zinc-850 text-slate-800">{activeInvoice.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">INVOICE NO :</span>{" "}
                    <strong className="text-emerald-700">{activeInvoice.invoice}</strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-800">CASE EHR UHID :</span>{" "}
                    <strong className="text-zinc-800 font-mono">{activeInvoice.patientId}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-800">BILLING DATE :</span>{" "}
                    <strong className="text-zinc-800 font-mono">{activeInvoice.date}</strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dotted border-zinc-250 border-slate-100">
                  <div>
                    <span className="text-zinc-800">PAYMENT METHOD :</span>{" "}
                    <span className="px-1.5 py-0.5 bg-zinc-50 text-slate-800 border rounded font-black font-mono text-[9px]">
                      {activeInvoice.paymentMode || "CASH"}
                      {activeInvoice.healthCardType ? ` - ${activeInvoice.healthCardType}` : ""}
                      {activeInvoice.paymentMode === "CASH_UPI" ? ` (Cash: ${activeInvoice.cashAmount || 0}, UPI: ${activeInvoice.upiAmount || 0})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-800">STATUS :</span>{" "}
                    <span className="text-emerald-700 font-black">COMPLETED (পরিশোধিত)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-b-2 border-dotted pb-3">
                <p className="text-[9px] uppercase tracking-wider text-zinc-800 font-black leading-none">
                  Itemized Receipt Statement Particulars
                </p>

                {!activeInvoice.dispensedMedicines || activeInvoice.dispensedMedicines.length === 0 ? (
                  <div className="space-y-1.5 font-bold text-zinc-700">
                    <div className="flex justify-between py-1 border-b border-zinc-100">
                      <span>Base Registration checkup fee:</span>
                      <span className="font-mono text-zinc-900">{activeInvoice.breakdown?.reg || 500} INR</span>
                    </div>
                    {activeInvoice.breakdown?.bed && activeInvoice.breakdown?.bed > 0 && (
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span>Cabin stay ward charges:</span>
                        <span className="font-mono text-zinc-905">{activeInvoice.breakdown.bed} INR</span>
                      </div>
                    )}
                    {activeInvoice.breakdown?.doc && activeInvoice.breakdown?.doc > 0 && (
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span>Specialist consultations:</span>
                        <span className="font-mono text-zinc-900">{activeInvoice.breakdown.doc} INR</span>
                      </div>
                    )}
                    {activeInvoice.breakdown?.test && activeInvoice.breakdown?.test > 0 && (
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span>Lab pathology diagnostics:</span>
                        <span className="font-mono text-zinc-900">{activeInvoice.breakdown.test} INR</span>
                      </div>
                    )}
                    {activeInvoice.breakdown?.med && activeInvoice.breakdown?.med > 0 && (
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span>Prescription pharmacology formulations:</span>
                        <span className="font-mono text-zinc-900">{activeInvoice.breakdown.med} INR</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5 font-bold text-zinc-700">
                    <div className="flex justify-between py-1 border-b border-zinc-100 bg-zinc-50/50">
                      <span>Base Registration checkout checkup fee:</span>
                      <span className="font-mono text-zinc-900">500 INR</span>
                    </div>
                    {activeInvoice.dispensedMedicines.map((item, index) => (
                      <div key={index} className="flex justify-between py-1.5 border-b border-zinc-100">
                        <div>
                          <span className="block text-zinc-900">{item.name}</span>
                          <span className="text-[8px] uppercase text-zinc-800 font-mono tracking-wider block leading-none">
                            {item.selectType}
                          </span>
                        </div>
                        <span className="font-mono text-zinc-900 font-medium">
                          {item.qty} × {item.unitPrice} INR = {item.qty * item.unitPrice} INR
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1 font-bold text-slate-800 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span>Subtotal Billed (উপমোট বিল):</span>
                  <span className="font-mono font-black">{activeInvoice.subtotal || activeInvoice.total} INR</span>
                </div>
                {activeInvoice.breakdown?.discount && activeInvoice.breakdown.discount > 0 && (
                  <div className="flex justify-between text-[10px] text-emerald-700">
                    <span>Discount Adjustment (ডিসকাউন্ট সমন্বয়):</span>
                    <span className="font-mono font-black">- {Math.round(activeInvoice.breakdown.discount)} INR</span>
                  </div>
                )}
                {activeInvoice.breakdown?.tax && activeInvoice.breakdown.tax > 0 && (
                  <div className="flex justify-between text-[10px] text-blue-700">
                    <span>Service Tax/VAT (ভ্যাট) ({activeInvoice.breakdown.tax}%):</span>
                    <span className="font-mono font-black">
                      + {Math.round(((activeInvoice.subtotal || activeInvoice.total) - (activeInvoice.breakdown.discount || 0)) * (activeInvoice.breakdown.tax / 100))} INR
                    </span>
                  </div>
                )}
                {activeInvoice.breakdown?.advance && activeInvoice.breakdown.advance > 0 && (
                  <div className="flex justify-between text-[10px] text-amber-700 border-t border-dotted border-slate-200 pt-1">
                    <span>Paid Advance Deduction (অগ্রিম কর্তন):</span>
                    <span className="font-mono font-black">- {activeInvoice.breakdown.advance} INR</span>
                  </div>
                )}
                <div className="border-t border-dashed pt-2 pb-1 flex justify-between text-xs font-black bg-emerald-50/20 border-emerald-100 p-2.5 rounded-lg text-slate-900 animate-none">
                  <span>{activeInvoice.breakdown?.advance && activeInvoice.breakdown.advance > 0 ? "Net Payable Due (পরিশোধযোগ্য বাকি):" : "Grand Total Paid (মোট পরিশোধিত):"}</span>
                  <span className="font-mono text-rose-650 text-emerald-850 font-black text-[12px] text-emerald-800">{activeInvoice.total} INR</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-[9px] uppercase font-black text-zinc-800 tracking-wider">
                <div>
                  <p className="leading-none text-[8.5px] italic mb-1 text-zinc-700">Subject to standard audit procedures.</p>
                  <p className="leading-none text-[8px] text-zinc-800">Ref: SHA-256 Verified</p>
                </div>
                <div className="text-center w-36">
                  <div className="border-b border-zinc-330 border-slate-200 h-6"></div>
                  <p className="mt-1 leading-none text-zinc-650 text-[8.5px] font-bold">Duty Accountant Desk</p>
                </div>
              </div>

              <div className="flex gap-2 font-sans font-bold no-print-button pt-2 text-center">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm border-none transition-all duration-300 py-2.5 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer flex items-center justify-center gap-1.5 btn-action-blue"
                >
                  <Printer className="w-3.5 h-3.5" /> Execute Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveInvoice(null);
                  }}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 cursor-pointer text-[10px] uppercase tracking-wide transition font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Patient Demographic Editing Modal */}
      {editModal && editModal.type === "patient" && (
        <PatientEditFormModal
          patient={editModal.data}
          onClose={() => setEditModal(null)}
          onSave={(updatedPatient) => {
            if (setPatients) {
              setPatients((prev) =>
                prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
              );
            }
            if (pushTimelineEvent) {
              pushTimelineEvent(
                updatedPatient.id,
                "Case File Updated",
                `${currentUser?.name || "System"} (Authorized User)`,
                "Demographic registries and medical background histories updated via clinical administration desk."
              );
            }
            setEditModal(null);
            alert(`Patient case details updated successfully!\nরোগীর তথ্য সফলভাবে সংশোধন করা হয়েছে!`);
          }}
        />
      )}

      {/* Appointment Slot / Physician Editing Modal */}
      {editModal && editModal.type === "appointment" && (
        <AppointmentEditModal
          appointmentData={editModal.data}
          doctors={doctors}
          onClose={() => setEditModal(null)}
          onSave={(updatedPatient) => {
            if (setPatients) {
              setPatients((prev) =>
                prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
              );
            }
            if (pushTimelineEvent) {
              pushTimelineEvent(
                updatedPatient.id,
                "Appointment Rescheduled",
                `${currentUser?.name || "System"} (Authorized Scheduler)`,
                `OPD Appointment consulting queue rescheduled for specialist doctor assignment.`
              );
            }
            setEditModal(null);
            alert(`Appointment details updated successfully!\nঅ্যাপয়েন্টমেন্ট তথ্য সফলভাবে পরিবর্তন করা হয়েছে!`);
          }}
        />
      )}

      {/* Inpatient Admission Ward Editing Modal */}
      {editModal && editModal.type === "admission" && (
        <AdmissionEditModal
          patient={editModal.data}
          doctors={doctors}
          beds={beds || []}
          onClose={() => setEditModal(null)}
          onSave={(updatedPatient, targetBedId) => {
            if (setPatients) {
              setPatients((prev) =>
                prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
              );
            }
            
            // If bed has been transferred/updated, update corresponding bed statuses in beds global state
            if (targetBedId && setBeds && beds) {
              setBeds((prevBeds) =>
                prevBeds.map((b) => {
                  if (b.id === targetBedId) {
                    return { ...b, status: "Occupied" };
                  }
                  // Release old bed if patient was assigned one
                  if (b.id === editModal.data.bed) {
                    return { ...b, status: "Available" };
                  }
                  return b;
                })
              );
            }

            if (pushTimelineEvent) {
              pushTimelineEvent(
                updatedPatient.id,
                "Admission Modified",
                `${currentUser?.name || "System"} (Ward In-charge)`,
                `IPD admission record adjusted: Bed assigned is ${updatedPatient.bed}, Condition: ${updatedPatient.condition}`
              );
            }
            setEditModal(null);
            alert(`IPD Ward admission details modified successfully!\nভর্তি রোগীর বিবরণী সংশোধন করা হয়েছে!`);
          }}
        />
      )}
    </div>
  );
}
