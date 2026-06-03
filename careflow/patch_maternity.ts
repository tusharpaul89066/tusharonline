import fs from 'fs';

let content = fs.readFileSync('src/components/MaternityModuleTab.tsx', 'utf8');

// Add import
if (!content.includes('MaternityEditModals')) {
    content = content.replace("import { PregnancyRecord", "import { MaternityEditModals } from './MaternityEditModal';\nimport { PregnancyRecord");
}

// Add states
if (!content.includes('const [editingMother')) {
    content = content.replace("const [highRiskCount", "const [editingMother, setEditingMother] = useState<PregnancyRecord | null>(null);\n  const [editingChild, setEditingChild] = useState<ChildRecord | null>(null);\n  const [highRiskCount");
}

// Add Edit Actions for Mother
// Only replace if 'Edit File' button isn't already there
if (!content.includes('setEditingMother(viewedMother)')) {
    content = content.replace(
        /<button onClick=\{\(\) => printFullNewbornRecord\(\)\}/,
        `<button onClick={() => setEditingMother(viewedMother)} className="bg-indigo-100 text-indigo-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-200 transition-colors">Edit File</button>\n            <button onClick={() => downloadCaseFile()}`
    );
}

// And change Print Case File to Download Case File
content = content.replace(/Print Case File/g, "Download Case File");

// Add Edit Actions for Newborn
// The second printFullNewbornRecord button is the one in Newborn card
if (!content.includes('setEditingChild(viewedChild)')) {
    // Let's find the newborn printFullNewbornRecord button again and prepend Edit File. 
    // We already replaced the mother one.
    content = content.replace(
        /<button onClick=\{\(\) => printFullNewbornRecord\(\)\}/,
        `<button onClick={() => setEditingChild(viewedChild)} className="bg-indigo-100 text-indigo-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-200 transition-colors">Edit File</button>\n            <button onClick={() => printFullNewbornRecord()}`
    );
}

// Ensure print Newborn PDF reads Download Newborn PDF
content = content.replace(/Print Newborn PDF/g, "Download Newborn PDF");


// Add the missing downloadCaseFile function
if(!content.includes("const downloadCaseFile = () =>")) {
    const fn = `const downloadCaseFile = () => {
    if(!viewedMother) return;
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("CareFlow Health Systems - Maternity Case", 105, 12, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(20, 184, 166); 
    doc.text("MATERNITY CASE FILE", 105, 22, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.text("Case ID: " + viewedMother.id, 20, 40);
    doc.text("Mother Name: " + viewedMother.motherName, 20, 50);
    doc.text("Husband/Partner: " + viewedMother.husbandName, 20, 60);
    doc.text("Age: " + viewedMother.age + " Yrs", 20, 70);
    doc.text("Phone: " + viewedMother.phone, 20, 80);
    doc.text("LMP: " + viewedMother.lmp, 120, 40);
    doc.text("EDD: " + viewedMother.edd, 120, 50);
    doc.text("Gravida: " + viewedMother.gravida, 120, 60);
    doc.text("Para: " + viewedMother.para, 120, 70);
    doc.text("Status: " + viewedMother.status, 120, 80);
    
    doc.save(viewedMother.id + "_Case_File.pdf");
  };`;
  
  content = content.replace("const printFullNewbornRecord = () => {", fn + "\n\n  const printFullNewbornRecord = () => {");
}

// Add the modals root
if (!content.includes('<MaternityEditModals')) {
    
    const modals = `
      {editingMother && (
        <MaternityEditModals 
          mother={editingMother} 
          onClose={() => setEditingMother(null)} 
          onUpdateMother={(data) => {
            setPregnancies(pregnancies.map(p => p.id === data.id ? data : p));
            if(viewedMother && viewedMother.id === data.id) setViewedMother(data);
            setEditingMother(null);
            alert("Maternity Record Updated!");
          }} 
        />
      )}
      {editingChild && (
        <MaternityEditModals 
          child={editingChild} 
          onClose={() => setEditingChild(null)} 
          onUpdateChild={(data) => {
            setChildren(children.map(c => c.id === data.id ? data : c));
            if(viewedChild && viewedChild.id === data.id) setViewedChild(data);
            setEditingChild(null);
            alert("Newborn Record Updated!");
          }} 
        />
      )}
    `;
    
    // Inject before the last closing `</div>`
    const lastClosingDiv = content.lastIndexOf("</div>");
    if (lastClosingDiv !== -1) {
       content = content.substring(0, lastClosingDiv) + modals + content.substring(lastClosingDiv);
    }
}

fs.writeFileSync('src/components/MaternityModuleTab.tsx', content);
