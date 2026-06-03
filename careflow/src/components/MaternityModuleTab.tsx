import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Baby, Search, PlusCircle, Activity, Stethoscope, 
  Syringe, FileText, LayoutDashboard, UserCheck, 
  HeartPulse, AlertCircle, Phone, ArrowRight, User, Printer
} from 'lucide-react';
import { MaternityEditModals } from './MaternityEditModal';
import { Patient, PregnancyRecord, PregnancyFollowUp, DeliveryRecord, ChildRecord, VaccinationRecord } from '../types';

interface MaternityModuleTabProps {
  patients?: Patient[];
  pregnancies: PregnancyRecord[];
  setPregnancies: React.Dispatch<React.SetStateAction<PregnancyRecord[]>>;
  deliveries: DeliveryRecord[];
  setDeliveries: React.Dispatch<React.SetStateAction<DeliveryRecord[]>>;
  children: ChildRecord[];
  setChildren: React.Dispatch<React.SetStateAction<ChildRecord[]>>;
  vaccines: VaccinationRecord[];
  setVaccines: React.Dispatch<React.SetStateAction<VaccinationRecord[]>>;
  followUps: PregnancyFollowUp[];
  setFollowUps: React.Dispatch<React.SetStateAction<PregnancyFollowUp[]>>;
  pushTimelineEvent?: (
    patientId: string,
    status: string,
    updatedBy: string,
    remarks: string,
    signature?: string | null
  ) => void;
  currentUser?: { name: string } | null;
  sharedViewedMother?: PregnancyRecord | null;
  setSharedViewedMother?: React.Dispatch<React.SetStateAction<PregnancyRecord | null>>;
  sharedActiveSubTab?: 'dashboard' | 'registration' | 'mothers' | 'children';
  setSharedActiveSubTab?: React.Dispatch<React.SetStateAction<'dashboard' | 'registration' | 'mothers' | 'children'>>;
  onNavigate?: (tabId: string) => void;
}

export default function MaternityModuleTab({
  patients = [],
  pregnancies,
  setPregnancies,
  deliveries,
  setDeliveries,
  children,
  setChildren,
  vaccines,
  setVaccines,
  followUps,
  setFollowUps,
  pushTimelineEvent,
  currentUser,
  sharedViewedMother,
  setSharedViewedMother,
  sharedActiveSubTab,
  setSharedActiveSubTab,
  onNavigate,
}: MaternityModuleTabProps) {

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

  const downloadCaseFile = () => {
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
    doc.setDrawColor(200, 200, 200);
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
    const splitNotes = doc.splitTextToSize("No notes provided.", 180);
    doc.text(splitNotes, 15, 132);
    
    // Vaccines
    doc.setFontSize(14);
    doc.setTextColor(20, 184, 166);
    doc.text("Vaccination Record", 15, 170);
    doc.setTextColor(0, 0, 0);
    doc.line(15, 172, 195, 172);
    
    let yPos = 182;
    const childVaccines = vaccines.filter((v: VaccinationRecord) => v.childId === viewedChild.id);
    childVaccines.forEach((v: VaccinationRecord) => {
      doc.setFontSize(10);
      doc.text(v.vaccineName, 15, yPos);
      doc.text(v.status, 80, yPos);
      if(v.completedDate) doc.text(v.completedDate, 120, yPos);
      yPos += 10;
    });
    
    doc.save(viewedChild.id + "_Full_Record.pdf");
  };

  const [activeSubTab, _setActiveSubTab] = useState<'dashboard' | 'registration' | 'mothers' | 'children'>('dashboard');
  const setActiveSubTab = (tab: 'dashboard' | 'registration' | 'mothers' | 'children') => {
    _setActiveSubTab(tab);
    if (setSharedActiveSubTab) setSharedActiveSubTab(tab);
  };

  const [viewedMother, _setViewedMother] = useState<PregnancyRecord | null>(null);
  const setViewedMother = (mother: PregnancyRecord | null) => {
    _setViewedMother(mother);
    if (setSharedViewedMother) setSharedViewedMother(mother);
  };

  const [viewedChild, setViewedChild] = useState<ChildRecord | null>(null);
  const [editingMother, setEditingMother] = useState<PregnancyRecord | null>(null);
  const [editingChild, setEditingChild] = useState<ChildRecord | null>(null);
  const [isAddingVaccine, setIsAddingVaccine] = useState(false);

  const [search, setSearch] = useState('');

  // Synchronize state with shared props from Live Journey
  React.useEffect(() => {
    if (sharedActiveSubTab) {
      _setActiveSubTab(sharedActiveSubTab);
    }
  }, [sharedActiveSubTab]);

  React.useEffect(() => {
    if (sharedViewedMother !== undefined) {
      _setViewedMother(sharedViewedMother);
    }
  }, [sharedViewedMother]);

  // Stats
  const activePregnancies = pregnancies.filter(p => p.status === 'Active').length;
  const highRisk = pregnancies.filter(p => p.isHighRisk).length;
  const delivered = pregnancies.filter(p => p.status === 'Delivered').length;
  const nicuCount = children.filter(c => c.nicuRequired).length;

  const [selectedLinkPatientId, setSelectedLinkPatientId] = useState('');
  const [formMotherName, setFormMotherName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBloodGroup, setFormBloodGroup] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const handleLinkPatientChange = (patientId: string) => {
    setSelectedLinkPatientId(patientId);
    const pat = patients && patients.find(p => p.id === patientId);
    if (pat) {
      setFormMotherName(pat.name);
      setFormAge(pat.age.toString());
      setFormPhone(pat.mobile);
      setFormBloodGroup(pat.blood);
      setFormAddress(pat.address || '');
    } else {
      setFormMotherName('');
      setFormAge('');
      setFormPhone('');
      setFormBloodGroup('');
      setFormAddress('');
    }
  };

  const handleRegisterMother = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const riskCheckboxes = ["Diabetes", "High Blood Pressure", "Thyroid", "Heart Disease", "Anemia", "Twins Pregnancy", "Bleeding"];
    const activeRisks = riskCheckboxes.filter(risk => fd.get(risk) === 'on');
    
    const newPreg: PregnancyRecord = {
      id: `PREG-${1000 + pregnancies.length + 1}`,
      patientId: selectedLinkPatientId || `PID-NEW`,
      motherName: formMotherName || (fd.get('motherName') as string),
      husbandName: fd.get('husbandName') as string,
      age: Number(formAge || fd.get('age')),
      bloodGroup: formBloodGroup || (fd.get('bloodGroup') as string),
      phone: formPhone || (fd.get('phone') as string),
      address: formAddress || (fd.get('address') as string),
      aadhaar: fd.get('aadhaar') as string,
      emergencyContact: fd.get('emergencyContact') as string,
      lmp: fd.get('lmp') as string,
      edd: fd.get('edd') as string,
      gravida: Number(fd.get('gravida')),
      para: Number(fd.get('para')),
      abortionHistory: Number(fd.get('abortionHistory')),
      previousCesarean: Number(fd.get('previousCesarean')),
      isHighRisk: fd.get('isHighRisk') === 'on' || activeRisks.length > 0,
      riskFactors: activeRisks,
      status: 'Active'
    };

    setPregnancies([...pregnancies, newPreg]);
    
    // Link to Live Patient Journey
    if (pushTimelineEvent) {
      pushTimelineEvent(
        newPreg.patientId,
        'Maternity Admission',
        currentUser?.name || 'Maternity Staff',
        `Maternity record ${newPreg.id} opened for ${newPreg.motherName}. Status: Active.`
      );
    }
    
    alert("Pregnancy Registered Successfully: " + newPreg.id);
    
    // Reset States
    setSelectedLinkPatientId('');
    setFormMotherName('');
    setFormAge('');
    setFormPhone('');
    setFormBloodGroup('');
    setFormAddress('');
    
    e.currentTarget.reset();
    setActiveSubTab('mothers');
  };

  const handleAddDelivery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!viewedMother) return;
    const fd = new FormData(e.currentTarget);
    
    const newDelivery: DeliveryRecord = {
      id: `DEL-${100 + deliveries.length + 1}`,
      pregnancyId: viewedMother.id,
      deliveryDate: fd.get('delDate') as string,
      deliveryTime: fd.get('delTime') as string,
      deliveryType: fd.get('delType') as string,
      doctorName: fd.get('docName') as string,
      otRoom: fd.get('otRoom') as string,
      complications: fd.get('complications') as string,
      deliveryNotes: fd.get('notes') as string,
      dischargeSummary: ''
    };

    setDeliveries([...deliveries, newDelivery]);
    setPregnancies(pregnancies.map(p => p.id === viewedMother.id ? { ...p, status: 'Delivered' } : p));
    
    // Link to Live Patient Journey
    if (pushTimelineEvent && viewedMother.patientId !== 'PID-NEW') {
      pushTimelineEvent(
        viewedMother.patientId,
        'Delivery Logged',
        currentUser?.name || 'Maternity Staff',
        `Completed delivery registration (${newDelivery.deliveryType}) under Case ${viewedMother.id}. Doctor: ${newDelivery.doctorName}.`
      );
    }

    alert("Delivery Recorded! You can now register the newborn.");
    setViewedMother({ ...viewedMother, status: 'Delivered' });
  };

  const handleRegisterChild = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!viewedMother) return;
    const fd = new FormData(e.currentTarget);
    const delRec = deliveries.find(d => d.pregnancyId === viewedMother.id);
    if(!delRec) return;

    const newChild: ChildRecord = {
      id: `KID-${500 + children.length + 1}`,
      pregnancyId: viewedMother.id,
      motherId: viewedMother.patientId,
      deliveryId: delRec.id,
      babyName: fd.get('babyName') as string,
      gender: fd.get('gender') as string,
      birthDate: fd.get('birthDate') as string,
      birthTime: fd.get('birthTime') as string,
      birthWeight: Number(fd.get('birthWeight')),
      height: Number(fd.get('height')),
      bloodGroup: fd.get('bloodGroup') as string,
      apgarScore: fd.get('apgar') as string,
      birthMark: fd.get('birthMark') as string,
      nicuRequired: fd.get('nicu') === 'on'
    };

    setChildren([...children, newChild]);
    // Create default vaccines
    const defVacs: VaccinationRecord[] = [
      { id: `VAC-${Date.now()}-1`, childId: newChild.id, vaccineName: 'BCG', dueDate: newChild.birthDate, status: 'Pending' },
      { id: `VAC-${Date.now()}-2`, childId: newChild.id, vaccineName: 'OPV 0', dueDate: newChild.birthDate, status: 'Pending' },
      { id: `VAC-${Date.now()}-3`, childId: newChild.id, vaccineName: 'Hepatitis B', dueDate: newChild.birthDate, status: 'Pending' }
    ];
    setVaccines([...vaccines, ...defVacs]);
    
    // Link to Live Patient Journey
    if (pushTimelineEvent && viewedMother.patientId !== 'PID-NEW') {
      pushTimelineEvent(
        viewedMother.patientId,
        'Newborn Registered',
        currentUser?.name || 'Maternity Staff',
        `Newborn "${newChild.babyName}" registered. Gender: ${newChild.gender}, Weight: ${newChild.birthWeight}kg, APGAR: ${newChild.apgarScore}.`
      );
    }

    alert("Child Registered: " + newChild.id);
    e.currentTarget.reset();
  };

  const handleAddCustomVaccine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!viewedChild) return;
    const fd = new FormData(e.currentTarget);
    const vName = fd.get('vaccineName') as string;
    const dDate = fd.get('dueDate') as string;
    const vStatus = fd.get('status') as 'Pending' | 'Completed';
    const cDate = fd.get('completedDate') as string;

    if (!vName || !dDate) {
      alert("Please provide Vaccine Name and Due Date.");
      return;
    }

    const newVac: VaccinationRecord = {
      id: `VAC-${Date.now()}`,
      childId: viewedChild.id,
      vaccineName: vName,
      dueDate: dDate,
      status: vStatus,
      completedDate: vStatus === 'Completed' ? (cDate || new Date().toISOString().split('T')[0]) : undefined
    };

    setVaccines([...vaccines, newVac]);
    
    // Push a live timeline event if patient ID is valid
    const mother = pregnancies.find(p => p.patientId === viewedChild.motherId);
    if (pushTimelineEvent && mother && mother.patientId !== 'PID-NEW') {
      pushTimelineEvent(
        mother.patientId,
        'Vaccine Added',
        currentUser?.name || 'Maternity Staff',
        `Vaccination "${vName}" added to Newborn "${viewedChild.babyName}". Status: ${vStatus}.`
      );
    }

    alert(`Vaccine "${vName}" added successfully.`);
    e.currentTarget.reset();
    setIsAddingVaccine(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl">
        <button
          onClick={() => { setActiveSubTab('dashboard'); setViewedMother(null); setViewedChild(null); }}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
            activeSubTab === 'dashboard' ? 'bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md border-none transition-all duration-300 shadow-md' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('registration'); setViewedMother(null); setViewedChild(null); }}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
            activeSubTab === 'registration' ? 'bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md border-none transition-all duration-300 shadow-md' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <PlusCircle size={18} />
          <span>New Registration</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('mothers'); setViewedMother(null); setViewedChild(null); }}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
            activeSubTab === 'mothers' ? 'bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md border-none transition-all duration-300 shadow-md' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <UserCheck size={18} />
          <span>Pregnancy Tracking</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('children'); setViewedMother(null); setViewedChild(null); }}
          className={`flex-1 min-w-[120px] py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${
            activeSubTab === 'children' ? 'bg-teal-500 hover:bg-teal-600 text-slate-900 shadow-md border-none transition-all duration-300 shadow-md' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Baby size={18} />
          <span>Newborns</span>
        </button>
      </div>

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && !viewedMother && !viewedChild && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-teal-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-100/40 text-teal-800 rounded-xl">
                <HeartPulse size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{activePregnancies}</h3>
                <p className="text-slate-9000 font-medium">Active Pregnancies</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{highRisk}</h3>
                <p className="text-red-500 font-medium tracking-tight">High Risk Cases</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-100/40 text-blue-500 rounded-xl">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{delivered}</h3>
                <p className="text-slate-9000 font-medium">Deliveries Completed</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                <Baby size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{children.length}</h3>
                <p className="text-slate-9000 font-medium">Newborns Registered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl bg-white rounded-2xl shadow border border-emerald-100/80 text-slate-900 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Stethoscope className="text-teal-700" /> Recent High Risk Alert Monitor</h2>
            <div className="space-y-3">
              {pregnancies.filter(p => p.isHighRisk).map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-500 font-bold shadow-sm">
                      {p.motherName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{p.motherName} ({p.id})</h4>
                      <p className="text-sm text-red-600 font-medium">Risks: {p.riskFactors.join(', ')}</p>
                      <p className="text-xs text-slate-9000 mt-1">EDD: {p.edd}</p>
                    </div>
                  </div>
                  <button onClick={() => { setViewedMother(p); setActiveSubTab('mothers'); }} className="text-red-600 font-bold hover:underline text-sm px-4">Review Case</button>
                </div>
              ))}
              {highRisk === 0 && <p className="text-slate-9000">No high risk pregnancies currently active.</p>}
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION FORM */}
      {activeSubTab === 'registration' && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl">
          <div className="p-6 border-b border-emerald-100 bg-white rounded-t-2xl">
            <h2 className="text-2xl font-black text-slate-900">Pregnancy & Maternity Registration</h2>
            <p className="text-slate-9000 font-medium mt-1">Create a new antenatal care profile for monitoring.</p>
          </div>
          <form className="p-6 space-y-8" onSubmit={handleRegisterMother}>
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2"><User size={18} className="text-teal-700"/> Personal Details</h3>
              
              <div className="bg-white border border-emerald-100 p-4 rounded-xl mb-6 space-y-2">
                <label className="block  text-xs font-bold uppercase tracking-wider text-slate-900">Link to Live Patient File (রোগীর ফাইল লিঙ্ক করুন)</label>
                <select
                  value={selectedLinkPatientId}
                  onChange={(e) => handleLinkPatientChange(e.target.value)}
                  className="w-full border border-emerald-100 bg-white p-2.5 rounded-xl text-slate-800 font-bold outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="">-- Create Independent Profile (সরাসরি নতুন ফাইল তৈরি করুন) --</option>
                  {patients && patients.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.id}] — {p.name} ({p.gender}, Age: {p.age}, UHID: {p.uhid})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-9000 tracking-wide font-medium">Selecting a patient will pre-populate their Name, Age, Phone, Blood Group, and residential address from the system database.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Mother's Full Name</label>
                  <input required name="motherName" value={formMotherName} onChange={e => setFormMotherName(e.target.value)} className="w-full border border-slate-350 bg-white border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-950 font-bold" placeholder="e.g. Fatima Begum" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Husband's Name</label>
                  <input required name="husbandName" className="w-full border border-slate-350  border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white" placeholder="e.g. Rahim Miah" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Age</label>
                  <input required type="number" name="age" value={formAge} onChange={e => setFormAge(e.target.value)} className="w-full border border-slate-350 bg-white border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-950 font-bold" placeholder="Years" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Phone Number</label>
                  <input required name="phone" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="w-full border border-slate-350 bg-white border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-950 font-bold" placeholder="01XXXXXXXXX" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">National ID (NID)</label>
                  <input name="aadhaar" className="w-full border border-slate-350  border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold text-black  placeholder:font-semibold bg-white" placeholder="NID Number" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Blood Group</label>
                  <select required name="bloodGroup" value={formBloodGroup} onChange={e => setFormBloodGroup(e.target.value)} className="w-full border border-slate-350 bg-white border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-950 font-bold">
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="B+">B+</option><option value="O+">O+</option><option value="AB+">AB+</option>
                    <option value="A-">A-</option><option value="B-">B-</option><option value="O-">O-</option><option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Full Address</label>
                  <input required name="address" value={formAddress} onChange={e => setFormAddress(e.target.value)} className="w-full border border-slate-350 bg-white border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500 text-slate-950 font-bold" placeholder="Residential Address" />
                </div>
              </div>
            </section>

            {/* Pregnancy Info */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2"><Activity size={18} className="text-indigo-500"/> Pregnancy Medical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">LMP Date</label>
                  <input required type="date" name="lmp" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">EDD (Expected)</label>
                  <input required type="date" name="edd" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Gravida (G)</label>
                  <input required type="number" defaultValue={1} name="gravida" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Para (P)</label>
                  <input required type="number" defaultValue={0} name="para" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Abortion History</label>
                  <input required type="number" defaultValue={0} name="abortionHistory" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
                <div>
                  <label className="block  text-sm font-bold mb-1 text-slate-900">Previous Cesarean</label>
                  <input required type="number" defaultValue={0} name="previousCesarean" className="w-full border border-slate-300 p-2.5 rounded-xl outline-none focus:border-teal-500  font-bold   placeholder:font-semibold bg-white text-black" />
                </div>
              </div>
            </section>

            {/* Risk Factors */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2 flex items-center gap-2"><AlertCircle size={18} className="text-red-500"/> Risk Factors & Complications</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30">
                {["Diabetes", "High Blood Pressure", "Thyroid", "Heart Disease", "Anemia", "Twins Pregnancy", "Bleeding", "Previous Miscarriage"].map(risk => (
                  <label key={risk} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white transition-colors font-bold text-slate-900 text-sm">
                    <input type="checkbox" name={risk} className="w-5 h-5 accent-red-500 rounded text-black font-bold  placeholder:font-semibold bg-white border border-slate-300" />
                    <span className="font-medium text-slate-800">{risk}</span>
                  </label>
                ))}
                <div className="col-span-2 lg:col-span-4 mt-2">
                  <label className="flex items-center gap-2 p-3 bg-red-100/50 rounded-xl border border-red-200 cursor-pointer font-bold text-slate-900 text-sm">
                    <input type="checkbox" name="isHighRisk" className="w-6 h-6 accent-red-600 rounded text-black font-bold  placeholder:font-semibold bg-white border border-slate-300" />
                    <span className="font-bold text-red-700 text-lg">Mark as HIGH RISK PREGNANCY</span>
                  </label>
                </div>
              </div>
            </section>

            <button type="submit" className="w-full py-4 rounded-xl bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-black text-lg tracking-wide shadow-md transition-all btn-action-blue">
              Save Pregnancy Registration
            </button>
          </form>
        </div>
      )}

      {/* MOTHERS LIST */}
      {activeSubTab === 'mothers' && !viewedMother && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-900">Pregnancy Records Directory</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-9000" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Mother or Reg ID"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-100 shadow-sm rounded-2xl outline-none focus:border-teal-500 text-sm font-medium"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-700 text-sm font-semibold border-y border-emerald-100">
                  <th className="p-4 font-bold border-b">Reg ID</th>
                  <th className="p-4 font-bold border-b">Mother Name</th>
                  <th className="p-4 font-bold border-b">Age</th>
                  <th className="p-4 font-bold border-b">Phone</th>
                  <th className="p-4 font-bold border-b">EDD</th>
                  <th className="p-4 font-bold border-b">Status / Risk</th>
                  <th className="p-4 font-bold border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pregnancies.filter(p => p.motherName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <tr key={p.id} className="border-b hover:bg-white">
                    <td className="p-4 font-bold text-teal-800">{p.id}</td>
                    <td className="p-4 font-bold text-slate-900">{p.motherName}</td>
                    <td className="p-4 text-slate-700 font-medium">{p.age} Yrs</td>
                    <td className="p-4 text-slate-700 font-medium">{p.phone}</td>
                    <td className="p-4 text-slate-900 font-medium bg-emerald-100/40/50">{p.edd}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-1 rounded-md font-bold text-xs ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                          {p.status}
                        </span>
                        {p.isHighRisk && <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md font-bold text-xs uppercase flex items-center gap-1"><AlertCircle size={10}/> High Risk</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setViewedMother(p)} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 rounded-lg font-bold text-xs transition-colors">
                        Manage File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOTHER PROFILE VIEW */}
      {viewedMother && activeSubTab === 'mothers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewedMother(null)} className="p-2 border rounded-xl hover:bg-slate-100">
                <ArrowRight size={20} className="rotate-180 text-slate-700" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                Maternity Case File: <span className="text-teal-800">{viewedMother.id}</span>
              </h2>
            </div>
            <button onClick={() => setEditingMother(viewedMother)} className="bg-indigo-100 text-indigo-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-200 transition-colors">Edit File</button>
            <button onClick={() => downloadCaseFile()} className="bg-teal-500 text-slate-900 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-teal-600 transition-colors">
              <Printer size={16} /> Download Case File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl h-fit sticky top-4">
              <div className="w-20 h-20 bg-emerald-100/40 text-teal-800 rounded-full flex items-center justify-center text-3xl font-black mb-4 mx-auto border-4 border-white shadow-md">
                {viewedMother.motherName.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-1">{viewedMother.motherName}</h3>
              <p className="text-center text-slate-9000 font-medium text-sm mb-6">Husband: {viewedMother.husbandName}</p>

              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between"><span className="text-slate-9000">Age</span><span className="font-bold">{viewedMother.age} Yrs</span></div>
                <div className="flex justify-between"><span className="text-slate-9000">Blood Grp</span><span className="font-bold text-red-500">{viewedMother.bloodGroup}</span></div>
                <div className="flex justify-between"><span className="text-slate-9000">Phone</span><span className="font-bold">{viewedMother.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-9000">Gravida/Para</span><span className="font-bold">G{viewedMother.gravida} P{viewedMother.para}</span></div>
                <div className="flex justify-between"><span className="text-slate-9000">LMP</span><span className="font-bold">{viewedMother.lmp}</span></div>
                <div className="flex justify-between p-2 bg-emerald-100/40 rounded-xl"><span className="text-slate-700 font-medium">EDD</span><span className="font-black text-teal-800">{viewedMother.edd}</span></div>
              </div>

              {viewedMother.isHighRisk && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="flex items-center gap-2 text-red-600 font-bold mb-2"><AlertCircle size={16}/> High Risk Due To:</h4>
                  <ul className="list-disc pl-5 text-sm text-red-700 font-medium">
                    {viewedMother.riskFactors.map(r => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Delivery Gateway */}
              {viewedMother.status === 'Active' ? (
                 <div className="bg-white p-6 rounded-2xl border border-dashed border-teal-400">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Baby className="text-teal-700"/> Delivery Registration</h3>
                    <form className="space-y-4" onSubmit={handleAddDelivery}>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">Date</label>
                          <input required type="date" name="delDate" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">Time</label>
                          <input required type="time" name="delTime" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">Type</label>
                          <select name="delType" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white">
                            <option value="Normal">Normal Vaginal</option>
                            <option value="Cesarean">Cesarean (C-Section)</option>
                            <option value="Vacuum">Vacuum</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">Attending Doc</label>
                          <input required name="docName" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white" placeholder="Dr. Name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">Complications / Notes</label>
                          <input name="complications" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white" placeholder="Any issues during birth?" />
                        </div>
                         <div>
                          <label className="block text-xs font-bold  uppercase mb-1 text-slate-900">OT Room / Labour Ward</label>
                          <input name="otRoom" className="w-full border border-emerald-100 px-3 py-2 rounded-xl  shadow-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all rounded-lg text-black font-bold  placeholder:font-semibold bg-white" placeholder="Room No." />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-slate-900 rounded-xl font-bold hover:from-[#2563eb] hover:to-[#1d4ed8] transition-colors btn-action-blue">
                        Mark Delivered & Record Birth
                      </button>
                    </form>
                 </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-emerald-200">
                  <h3 className="text-lg font-black text-emerald-800 mb-2 flex items-center gap-2"><UserCheck /> Delivered Successfully</h3>
                  {deliveries.filter(d => d.pregnancyId === viewedMother.id).map(del => (
                    <div key={del.id} className="text-sm text-emerald-700 space-y-1 mt-4">
                      <p><strong>Date & Time:</strong> {del.deliveryDate} at {del.deliveryTime}</p>
                      <p><strong>Type:</strong> {del.deliveryType} Delivery</p>
                      <p><strong>Doctor:</strong> {del.doctorName}</p>
                      <p><strong>Notes:</strong> {del.deliveryNotes || 'None'}</p>
                    </div>
                  ))}
                  
                  {/* Linked Children Registration Prompt */}
                  <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-slate-900 mb-4">Mother-Child Links</h4>
                    {children.filter(c => c.pregnancyId === viewedMother.id).length > 0 ? (
                      <div className="space-y-3">
                        {children.filter(c => c.pregnancyId === viewedMother.id).map(c => (
                           <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                             <div className="flex items-center gap-3">
                               <Baby className="text-teal-800" />
                               <div>
                                 <p className="font-bold text-slate-900">{c.babyName} ({c.gender})</p>
                                 <p className="text-xs text-slate-9000">ID: {c.id} | Born: {c.birthDate}</p>
                               </div>
                             </div>
                             <button onClick={() => { setViewedChild(c); setActiveSubTab('children'); }} className="px-3 py-1.5 bg-emerald-100/40 text-teal-200 font-bold text-xs rounded-md">View Baby</button>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <form className="bg-white p-4 border rounded-xl" onSubmit={handleRegisterChild}>
                        <h5 className="font-bold mb-3 text-sm text-teal-200">Register Newborn Form</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div><label className="text-xs font-bold  text-slate-900">Name</label><input required name="babyName" className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white" defaultValue={`Baby of ${viewedMother.motherName}`}/></div>
                          <div><label className="text-xs font-bold  text-slate-900">Gender</label><select name="gender" className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white"><option>Male</option><option>Female</option><option>Other</option></select></div>
                          <div><label className="text-xs font-bold  text-slate-900">Weight (kg)</label><input required type="number" step="0.01" name="birthWeight" className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white" /></div>
                          <div><label className="text-xs font-bold  text-slate-900">Blood Grp</label><select name="bloodGroup" className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white"><option>Unknown</option><option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>A-</option><option>B-</option><option>O-</option><option>AB-</option></select></div>
                          <div><label className="text-xs font-bold  text-slate-900">Birth Date</label><input required type="date" name="birthDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white" /></div>
                          <div><label className="text-xs font-bold  text-slate-900">Birth Time</label><input required type="time" name="birthTime" className="w-full text-sm p-2 border rounded text-black font-bold  placeholder:font-semibold bg-white" /></div>
                          <div className="col-span-2 flex items-center justify-end h-full pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-red-600 bg-red-50 p-2 rounded-lg text-slate-900">
                              <input type="checkbox" name="nicu" className="w-4 h-4 accent-red-600 text-black font-bold  placeholder:font-semibold bg-white border border-slate-300" /> NICU Required?
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-bold py-2 px-4 rounded-lg text-sm hover:from-[#2563eb] hover:to-[#1d4ed8] btn-action-blue">Register Child to Mother Info</button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Follow ups - placeholder for now */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl">
                 <h3 className="text-lg font-bold text-slate-900 mb-4 border-b flex justify-between items-center pb-2">
                   <span>Journey Tracking</span>
                   <button className="text-sm bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium hover:bg-slate-200">
                     <PlusCircle size={14}/> Add Checkup
                   </button>
                 </h3>
                 <div className="text-center p-8 border-2 border-dashed border-emerald-100 rounded-xl text-slate-9000">
                   {followUps.filter(f => f.pregnancyId === viewedMother.id).length === 0 ? "No tracking history yet." : "Follow up records exist."}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHILDREN DIRECTORY */}
      {activeSubTab === 'children' && !viewedChild && (
         <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Baby className="text-teal-700"/> Registered Newborns Directory</h2>
             <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-9000" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Child / Mother"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-100 shadow-sm rounded-2xl outline-none focus:border-teal-500 text-sm font-medium"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-700 text-sm font-semibold border-y border-emerald-100">
                  <th className="p-4 font-bold border-b">Baby ID</th>
                  <th className="p-4 font-bold border-b">Baby Name</th>
                  <th className="p-4 font-bold border-b">Gender / Weight</th>
                  <th className="p-4 font-bold border-b">Birth Information</th>
                  <th className="p-4 font-bold border-b">Mother ID</th>
                  <th className="p-4 font-bold border-b">Status</th>
                  <th className="p-4 font-bold border-b text-right">ProfileAction</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {children.filter(c => c.babyName.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <tr key={c.id} className="border-b hover:bg-white">
                    <td className="p-4 font-bold text-teal-600 underline cursor-pointer hover:text-teal-800 select-none" onClick={() => downloadNewbornToken(c)} title="Click to download token PDF">{c.id}</td>
                    <td className="p-4 font-bold text-slate-900">{c.babyName}</td>
                    <td className="p-4 text-slate-700 font-medium">
                      {c.gender} / <span className="font-bold text-slate-900">{c.birthWeight} kg</span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {c.birthDate} <span className="p-1 bg-slate-200 rounded text-xs ml-1">{c.birthTime}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-700 underline cursor-pointer hover:text-teal-800" onClick={() => {
                      const mod = pregnancies.find(p => p.patientId === c.motherId);
                      if(mod) { setViewedMother(mod); setActiveSubTab('mothers'); }
                    }}>
                      {c.motherId}
                    </td>
                    <td className="p-4">
                      {c.nicuRequired ? <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md font-bold text-xs uppercase">NICU ADMITTED</span> : <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md font-bold text-xs">Healthy</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setViewedChild(c)} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 rounded-lg font-bold text-xs transition-colors">
                        View Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {children.length === 0 && <p className="text-center p-8 text-slate-9000 font-medium font-bold">No newborns registered yet.</p>}
          </div>
        </div>
      )}

      {/* CHILD PROFILE & VACCINES */}
      {viewedChild && activeSubTab === 'children' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewedChild(null)} className="p-2 border rounded-xl hover:bg-slate-100">
                <ArrowRight size={20} className="rotate-180 text-slate-700" />
              </button>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                Neonatal Record: <span className="text-teal-800">{viewedChild.id}</span>
              </h2>
            </div>
            <button onClick={() => setEditingChild(viewedChild)} className="bg-indigo-100 text-indigo-700 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-indigo-200 transition-colors">Edit File</button>
            <button onClick={() => printFullNewbornRecord()} className="btn-action-blue flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow transition-colors">
              <Printer size={16} /> Download Newborn PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 shadow-sm rounded-2xl h-fit sticky top-4">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto border-4 border-white shadow-md">
                 <Baby size={40} />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-4">{viewedChild.babyName}</h3>
              
              <div className="space-y-3 text-sm border-t pt-4">
                 <div className="flex justify-between"><span className="text-slate-9000">Gender</span><span className="font-bold">{viewedChild.gender}</span></div>
                 <div className="flex justify-between"><span className="text-slate-9000">Birth Date</span><span className="font-bold">{viewedChild.birthDate}</span></div>
                 <div className="flex justify-between"><span className="text-slate-9000">Birth Time</span><span className="font-bold bg-slate-100 px-2 py-0.5 rounded">{viewedChild.birthTime}</span></div>
                 <div className="flex justify-between"><span className="text-slate-9000">Weight</span><span className="font-bold text-teal-800">{viewedChild.birthWeight} kg</span></div>
                 <div className="flex justify-between"><span className="text-slate-9000">Blood Grp</span><span className="font-bold text-red-500">{viewedChild.bloodGroup}</span></div>
                 <div className="flex justify-between"><span className="text-slate-9000">APGAR</span><span className="font-bold text-indigo-600">{viewedChild.apgarScore}</span></div>
              </div>

               {viewedChild.nicuRequired && (
                  <div className="mt-6 font-bold bg-red-100 text-red-700 p-3 rounded-lg text-center flex items-center justify-center gap-2">
                    <AlertCircle size={18} /> NICU ASSIGNED
                  </div>
               )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between border-b border-emerald-100 pb-3">
                  <span className="flex items-center gap-2 text-slate-900">
                    <Syringe className="text-teal-700"/> Vaccination Matrix Ledger
                  </span>
                  <button 
                    type="button"
                    onClick={() => setIsAddingVaccine(!isAddingVaccine)}
                    className="py-1.5 px-3 bg-teal-500 hover:bg-teal-600 text-slate-900 font-black text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer border-none animate-pulse hover:animate-none"
                  >
                    {isAddingVaccine ? 'Cancel (বাতিল)' : '+ Add Vaccination (টিকা যোগ করুন)'}
                  </button>
                </h3>

                {isAddingVaccine && (
                  <form onSubmit={handleAddCustomVaccine} className="bg-slate-50 border border-teal-500/50 p-5 rounded-2xl mb-6 space-y-4">
                    <h4 className="font-black text-teal-700 text-xs uppercase tracking-wider">New Vaccination Registration</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Vaccine Name (টিকার নাম)</label>
                        <input 
                          required 
                          type="text" 
                          name="vaccineName"
                          className="w-full border border-emerald-100  px-3.5 py-2.5 rounded-xl text-black font-bold text-sm outline-none focus:border-teal-500  placeholder:font-semibold bg-white" 
                          placeholder="e.g., BCG, Pentavalent 1, Polio"
                        />
                      </div>
                      <div>
                        <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Due Date (টিকা দেওয়ার নির্ধারিত তারিখ)</label>
                        <input 
                          required 
                          type="date" 
                          name="dueDate"
                          className="w-full border border-emerald-100  px-3.5 py-2.5 rounded-xl text-black font-bold text-sm outline-none focus:border-teal-500  placeholder:font-semibold bg-white"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Initial Status (অবস্থা)</label>
                        <select 
                          name="status"
                          className="w-full border border-emerald-100  px-3.5 py-2.5 rounded-xl text-black font-bold text-sm outline-none focus:border-teal-500 cursor-pointer  placeholder:font-semibold bg-white"
                        >
                          <option value="Pending">Pending (বাকি আছে)</option>
                          <option value="Completed">Completed (দেওয়া হয়েছে)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block  text-xs font-bold mb-1 uppercase tracking-wide text-slate-900">Date Administered (যদি দেওয়া হয়ে থাকে)</label>
                        <input 
                          type="date" 
                          name="completedDate"
                          className="w-full border border-emerald-100  px-3.5 py-2.5 rounded-xl text-black font-bold text-sm outline-none focus:border-teal-500  placeholder:font-semibold bg-white"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-1.5">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingVaccine(false)}
                        className="px-4 py-2 border border-emerald-100 hover:border-slate-600 bg-white text-slate-800 hover:text-slate-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-slate-900 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer border-none btn-action-blue"
                      >
                        Save Vaccination
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="space-y-3">
                  {vaccines.filter(v => v.childId === viewedChild.id).map(v => (
                     <div key={v.id} className={`flex items-center justify-between p-4 rounded-xl border ${v.status === 'Completed' ? 'bg-white border-emerald-500/35' : 'bg-white border-emerald-100'}`}>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{v.vaccineName}</h4>
                          <p className="text-xs text-slate-700 font-medium">Due Date: {v.dueDate}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           {v.status === 'Completed' ? (
                              <div className="text-right">
                                <span className="font-bold text-emerald-700 flex items-center gap-1"><UserCheck size={14}/> Completed</span>
                                <p className="text-xs text-slate-9000 mt-1">On: {v.completedDate}</p>
                              </div>
                           ) : (
                              <button onClick={() => {
                                setVaccines(vaccines.map(vx => vx.id === v.id ? {...vx, status: 'Completed', completedDate: new Date().toISOString().split('T')[0]} : vx))
                              }} className="px-4 py-2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-slate-900 shadow-md border-none transition-all duration-300 font-bold text-sm rounded-lg shadow-sm cursor-pointer">
                                Mark Administered
                              </button>
                           )}
                        </div>
                     </div>
                  ))}
                  {vaccines.filter(v => v.childId === viewedChild.id).length === 0 && <p className="text-slate-9000">No vaccination records.</p>}
                </div>
              </div>

              {/* Linked Mother Panel */}
               <div className="bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100 p-6">
                 <h3 className="text-lg font-bold text-indigo-900 mb-4">Mother Link Status</h3>
                 <p className="text-sm font-medium text-indigo-700 mb-4">This profile is cryptographically linked to the mother's IPD maternity record.</p>
                 <button onClick={() => {
                      const mod = pregnancies.find(p => p.id === viewedChild.pregnancyId);
                      if(mod) { setViewedMother(mod); setActiveSubTab('mothers'); setViewedChild(null); }
                 }} className="bg-indigo-600 hover:bg-indigo-700 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow flex items-center gap-2">
                   <UserCheck size={16} /> Open Mother's Profile Panel
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    
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
    </div>
  );
}
