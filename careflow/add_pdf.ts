import fs from 'fs';

let content = fs.readFileSync('src/components/MaternityModuleTab.tsx', 'utf8');

if (!content.includes("import { jsPDF }")) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { jsPDF } from 'jspdf';");
}

const pdfFunc = `
  const downloadNewbornToken = (child: ChildRecord) => {
    const mother = pregnancies.find(p => p.patientId === child.motherId);
    if(!mother) return;
    
    // Create token PDF
    const doc = new jsPDF({ format: 'a5', orientation: 'landscape' });
    
    // Background Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CareFlow Health Systems", 105, 12, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(20, 184, 166); // teal-500
    doc.text("NEWBORN REGISTRATION TOKEN", 105, 22, { align: 'center' });
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    
    doc.text("KID ID:", 20, 50); doc.setFontSize(12); doc.text(child.id, 55, 50);
    doc.setFontSize(11);
    doc.text("KID NAME:", 20, 60); doc.setFontSize(12); doc.text(child.babyName, 55, 60);
    
    doc.setFontSize(11);
    doc.text("MOTHER ID:", 20, 70); doc.setFontSize(12); doc.text(child.motherId, 55, 70);
    doc.setFontSize(11);
    doc.text("MOTHER NAME:", 20, 80); doc.setFontSize(12); doc.text(mother ? mother.motherName : 'N/A', 55, 80);
    
    doc.setFontSize(11);
    doc.text("DATE OF BIRTH:", 20, 90); doc.setFontSize(12); doc.text(child.birthDate, 55, 90);
    doc.setFontSize(11);
    doc.text("TIME OF BIRTH:", 20, 100); doc.setFontSize(12); doc.text(child.birthTime, 55, 100);
    
    doc.setFontSize(11);
    doc.text("GENDER:", 120, 90); doc.setFontSize(12); doc.text(child.gender, 150, 90);
    doc.setFontSize(11);
    doc.text("WEIGHT:", 120, 100); doc.setFontSize(12); doc.text(child.birthWeight.toString() + " kg", 150, 100);
    
    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 120, 190, 120);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("This is an automatically generated token. Please bring this to the reception.", 105, 130, { align: 'center' });
    
    doc.save(child.id + "_Token.pdf");
  };

  const printFullNewbornRecord = () => {
    if(!viewedChild) return;
    const mother = pregnancies.find(p => p.patientId === viewedChild.motherId);
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("CareFlow Health Systems", 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(20, 184, 166); 
    doc.text("FULL NEONATAL RECORD", 105, 28, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Summary Box
    doc.setStrokeColor(200, 200, 200);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, 50, 180, 50, 3, 3, 'FD');
    
    doc.setFontSize(11);
    doc.text("KID ID:", 20, 60); doc.setFontSize(12); doc.text(viewedChild.id, 50, 60);
    doc.setFontSize(11);
    doc.text("NAME:", 20, 70); doc.setFontSize(12); doc.text(viewedChild.babyName, 50, 70);
    doc.setFontSize(11);
    doc.text("MOTHER ID:", 100, 60); doc.setFontSize(12); doc.text(viewedChild.motherId, 130, 60);
    doc.setFontSize(11);
    doc.text("MOTHER NAME:", 100, 70); doc.setFontSize(12); doc.text(mother ? mother.motherName : 'N/A', 130, 70);
    
    doc.setFontSize(11);
    doc.text("DOB:", 20, 80); doc.setFontSize(12); doc.text(viewedChild.birthDate + " " + viewedChild.birthTime, 50, 80);
    doc.setFontSize(11);
    doc.text("GENDER:", 20, 90); doc.setFontSize(12); doc.text(viewedChild.gender, 50, 90);
    doc.setFontSize(11);
    doc.text("WEIGHT:", 100, 80); doc.setFontSize(12); doc.text(viewedChild.birthWeight + " kg", 130, 80);
    doc.setFontSize(11);
    doc.text("STATUS:", 100, 90); doc.setFontSize(12); doc.text(viewedChild.nicuRequired ? "NICU ADMITTED" : "HEALTHY", 130, 90);
    
    // Notes
    doc.setFontSize(14);
    doc.setTextColor(20, 184, 166);
    doc.text("Pediatrician Notes", 15, 120);
    doc.setTextColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 122, 195, 122);
    
    doc.setFontSize(11);
    const splitNotes = doc.splitTextToSize(viewedChild.notes || "No notes provided.", 180);
    doc.text(splitNotes, 15, 132);
    
    // Vaccines
    doc.setFontSize(14);
    doc.setTextColor(20, 184, 166);
    doc.text("Vaccination Record", 15, 170);
    doc.setTextColor(0, 0, 0);
    doc.line(15, 172, 195, 172);
    
    let yPos = 182;
    viewedChild.vaccines.forEach(v => {
      doc.setFontSize(10);
      doc.text(v.vaccineName, 15, yPos);
      doc.text(v.status, 80, yPos);
      if(v.dateGiven) doc.text(v.dateGiven, 120, yPos);
      doc.text(v.administeredBy || '-', 160, yPos);
      yPos += 10;
    });
    
    doc.save(viewedChild.id + "_Full_Record.pdf");
  };
`;

if (!content.includes("downloadNewbornToken")) {
  content = content.replace("export default function MaternityModuleTab() {", "export default function MaternityModuleTab() {\n" + pdfFunc);
}

// Replace Kid ID click action
content = content.replace(
  /<td className="p-4 font-bold text-teal-300">\{c\.id\}<\/td>/g, 
  `<td className="p-4 font-bold text-teal-600 underline cursor-pointer hover:text-teal-800 select-none" onClick={() => downloadNewbornToken(c)} title="Click to download token PDF">{c.id}</td>`
);

// Replace print button action
content = content.replace(
  /onClick=\{[^\}]*window\.print\(\)[^\}]*\}[^>]*>\s*<Printer size=\{16\} \/>\s*Print Newborn PDF/,
  `onClick={() => printFullNewbornRecord()} className="bg-indigo-500 text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-600 transition-colors">
              <Printer size={16} /> Print Newborn PDF`
);
// In case the above replace failed due to className:
content = content.replace(
  /onClick=\{\(\) => window\.print\(\)\}/,
  `onClick={() => printFullNewbornRecord()}`
);

fs.writeFileSync('src/components/MaternityModuleTab.tsx', content);

