import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Users,
  Stethoscope,
  Shield,
  CalendarCheck,
  Receipt,
  BedDouble,
  Pill,
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  Printer,
  X,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  Database,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Patient, Doctor, Staff, Medicine, Bed, Bill, Appointment } from './types';
import {
  initialPatients,
  initialDoctors,
  initialStaff,
  initialMedicines,
  initialBeds,
  initialBills,
  initialAppointments,
} from './initialData';

export default function App() {
  // Navigation active tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patient' | 'doctor' | 'staff' | 'pharmacy' | 'billing' | 'beds' | 'appointments'>('dashboard');

  // Database States
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('hms_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('hms_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('hms_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('hms_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('hms_beds');
    return saved ? JSON.parse(saved) : initialBeds;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('hms_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('hms_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('hms_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hms_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('hms_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('hms_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('hms_beds', JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem('hms_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('hms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // LIVE SEARCH STATES
  const [searchPatient, setSearchPatient] = useState('');
  const [searchBillName, setSearchBillName] = useState('');
  const [searchBillPhone, setSearchBillPhone] = useState('');
  const [billStartDate, setBillStartDate] = useState('');
  const [billEndDate, setBillEndDate] = useState('');

  // EDIT STATE ENTITIES
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingMedName, setEditingMedName] = useState<string | null>(null);
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editingAppToken, setEditingAppToken] = useState<string | null>(null);

  // ACTIVE COMPONENT INPUT BINDINGS
  // Patient Form State
  const [pForm, setPForm] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    mobile: '',
    guardian: '',
    relation: 'Father',
    blood: 'O+',
    type: 'OPD (Outpatient)' as 'OPD (Outpatient)' | 'IPD (Indoor Patient)',
    bed: 'None',
    emergency: '',
    history: '',
  });

  // Doctor Form State
  const [dForm, setDForm] = useState({
    name: '',
    spec: '',
    time: '',
    fees: '',
  });

  // Staff Form State
  const [sForm, setSForm] = useState({
    name: '',
    role: 'Nurse' as 'Nurse' | 'Ward Boy' | 'Receptionist' | 'Accountant',
    shift: 'Day (8 AM - 4 PM)' as 'Day (8 AM - 4 PM)' | 'Evening (4 PM - 12 AM)' | 'Night (12 AM - 8 AM)',
    salary: '',
  });

  // Medicine Form State
  const [mForm, setMForm] = useState({
    name: '',
    batch: '',
    qty: '',
    price: '',
  });

  // Bed Form State
  const [bForm, setBForm] = useState({
    id: '',
    type: 'General',
    status: 'Available' as 'Available' | 'Occupied',
  });

  // Appointment Form State
  const [aForm, setAForm] = useState({
    name: '',
    doc: '',
    date: '',
  });

  // Billing Form State
  const [bPatient, setBPatient] = useState('');
  const [bDate, setBDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // MODAL STATES
  // Invoice Viewer Modal
  const [activeInvoice, setActiveInvoice] = useState<Bill | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Generate / Adjusted Bill Modal
  const [activeBillAdjustment, setActiveBillAdjustment] = useState<Bill | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [adjBed, setAdjBed] = useState<number>(0);
  const [adjDoc, setAdjDoc] = useState<number>(0);
  const [adjOt, setAdjOt] = useState<number>(0);
  const [adjTest, setAdjTest] = useState<number>(0);
  const [adjMedSelected, setAdjMedSelected] = useState<string>('');
  const [adjMedQty, setAdjMedQty] = useState<number>(1);

  // Discharge Modal
  const [activeDischargeBill, setActiveDischargeBill] = useState<Bill | null>(null);
  const [isDischargeOpen, setIsDischargeOpen] = useState(false);
  const [dischargeNotesText, setDischargeNotesText] = useState('');

  // HANDLERS FOR FORMS
  // Patient Save & Edit
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatientId) {
      // Edit Update flow
      setPatients(prev => {
        return prev.map(p => {
          if (p.id === editingPatientId) {
            // If bed has changed, release old occupied bed
            const oldBed = p.bed;
            const newBed = p.bed !== pForm.bed ? pForm.bed : oldBed;

            if (oldBed !== 'None' && oldBed !== newBed) {
              setBeds(prevBeds => prevBeds.map(b => b.id === oldBed ? { ...b, status: 'Available' } : b));
            }
            if (newBed !== 'None' && oldBed !== newBed) {
              setBeds(prevBeds => prevBeds.map(b => b.id === newBed ? { ...b, status: 'Occupied' } : b));
            }

            return {
              ...p,
              name: pForm.name,
              age: parseInt(pForm.age) || 0,
              gender: pForm.gender,
              mobile: pForm.mobile,
              guardian: pForm.guardian,
              relation: pForm.relation,
              blood: pForm.blood,
              type: pForm.type,
              bed: pForm.bed,
              emergency: pForm.emergency,
              history: pForm.history,
            };
          }
          return p;
        });
      });
      setEditingPatientId(null);
      alert('Patient Details Updated Successfully!');
    } else {
      // New Admissions flow
      const newPid = 'PID-' + Math.floor(1000 + Math.random() * 9000);
      const newPatient: Patient = {
        id: newPid,
        name: pForm.name,
        age: parseInt(pForm.age) || 0,
        gender: pForm.gender,
        mobile: pForm.mobile,
        guardian: pForm.guardian,
        relation: pForm.relation,
        blood: pForm.blood,
        type: pForm.type,
        bed: pForm.bed,
        emergency: pForm.emergency,
        history: pForm.history,
        date: new Date().toLocaleDateString(),
      };

      setPatients(prev => [...prev, newPatient]);

      // Occupy Bed
      if (pForm.bed !== 'None') {
        setBeds(prevBeds => prevBeds.map(b => b.id === pForm.bed ? { ...b, status: 'Occupied' } : b));
      }

      alert('Patient Registered Successfully! Confirmation Alert added to queue.');
    }

    // Reset Form Input
    setPForm({
      name: '',
      age: '',
      gender: 'Male',
      mobile: '',
      guardian: '',
      relation: 'Father',
      blood: 'O+',
      type: 'OPD (Outpatient)',
      bed: 'None',
      emergency: '',
      history: '',
    });
  };

  const handleEditPatient = (p: Patient) => {
    setEditingPatientId(p.id);
    setPForm({
      name: p.name,
      age: p.age.toString(),
      gender: p.gender,
      mobile: p.mobile,
      guardian: p.guardian,
      relation: p.relation,
      blood: p.blood,
      type: p.type,
      bed: p.bed,
      emergency: p.emergency,
      history: p.history,
    });
  };

  const handleDeletePatient = (id: string, bed: string) => {
    if (confirm('Are you sure you want to permanently delete this patient record?')) {
      setPatients(prev => prev.filter(p => p.id !== id));
      if (bed && bed !== 'None') {
        setBeds(prevBeds => prevBeds.map(b => b.id === bed ? { ...b, status: 'Available' } : b));
      }
    }
  };

  // Doctors Save & Edit
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctorId) {
      setDoctors(prev =>
        prev.map(d =>
          d.id === editingDoctorId
            ? {
                ...d,
                name: dForm.name,
                spec: dForm.spec,
                time: dForm.time,
                fees: parseInt(dForm.fees) || 0,
              }
            : d
        )
      );
      setEditingDoctorId(null);
      alert('Doctor Registry Updated Successfully!');
    } else {
      const newDoc: Doctor = {
        id: 'DOC-' + Math.floor(100 + Math.random() * 900),
        name: dForm.name,
        spec: dForm.spec,
        time: dForm.time,
        fees: parseInt(dForm.fees) || 0,
      };
      setDoctors(prev => [...prev, newDoc]);
      alert('Specialist Registered successfully.');
    }
    setDForm({ name: '', spec: '', time: '', fees: '' });
  };

  const handleEditDoctor = (d: Doctor) => {
    setEditingDoctorId(d.id);
    setDForm({
      name: d.name,
      spec: d.spec,
      time: d.time,
      fees: d.fees.toString(),
    });
  };

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Delete this Doctor specialist profile?')) {
      setDoctors(prev => prev.filter(d => d.id !== id));
    }
  };

  // Staff Save & Edit
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaffId) {
      setStaff(prev =>
        prev.map(s =>
          s.id === editingStaffId
            ? {
                ...s,
                name: sForm.name,
                role: sForm.role,
                shift: sForm.shift,
                salary: parseInt(sForm.salary) || 0,
              }
            : s
        )
      );
      setEditingStaffId(null);
      alert('Staff Details Updated Successfully!');
    } else {
      const newStaff: Staff = {
        id: 'STF-' + Math.floor(1000 + Math.random() * 9000),
        name: sForm.name,
        role: sForm.role,
        shift: sForm.shift,
        salary: parseInt(sForm.salary) || 0,
        status: 'Present',
      };
      setStaff(prev => [...prev, newStaff]);
      alert('Support Staff admitted successfully into daily active rosters.');
    }
    setSForm({ name: '', role: 'Nurse', shift: 'Day (8 AM - 4 PM)', salary: '' });
  };

  const handleEditStaff = (s: Staff) => {
    setEditingStaffId(s.id);
    setSForm({
      name: s.name,
      role: s.role,
      shift: s.shift,
      salary: s.salary.toString(),
    });
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm('Permanently discharge this staff member from CareFlow?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleStaffAttendance = (id: string, status: 'Present' | 'On Leave') => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  };

  // Pharmacy Save & Edit
  const handleMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMedName) {
      setMedicines(prev =>
        prev.map(m =>
          m.name === editingMedName
            ? {
                ...m,
                name: mForm.name,
                batch: mForm.batch,
                qty: parseInt(mForm.qty) || 0,
                price: parseFloat(mForm.price) || 0,
              }
            : m
        )
      );
      setEditingMedName(null);
      alert('Medicine details successfully adjusted!');
    } else {
      // Check duplicate
      const duplicate = medicines.find(m => m.name.toLowerCase() === mForm.name.toLowerCase());
      if (duplicate) {
        alert('Medicine already listed! Use the edit capability below to adjust stock quantity status.');
        return;
      }

      const newMed: Medicine = {
        name: mForm.name,
        batch: mForm.batch,
        qty: parseInt(mForm.qty) || 0,
        price: parseFloat(mForm.price) || 0,
      };
      setMedicines(prev => [...prev, newMed]);
      alert('Inventory batch successfully recorded.');
    }
    setMForm({ name: '', batch: '', qty: '', price: '' });
  };

  const handleEditMedicine = (m: Medicine) => {
    setEditingMedName(m.name);
    setMForm({
      name: m.name,
      batch: m.batch,
      qty: m.qty.toString(),
      price: m.price.toString(),
    });
  };

  const handleDeleteMedicine = (name: string) => {
    if (confirm('Remove medicine item from pharmacy ledger catalogue?')) {
      setMedicines(prev => prev.filter(m => m.name !== name));
    }
  };

  // Bed Save & Edit
  const handleBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBedId) {
      setBeds(prev =>
        prev.map(b =>
          b.id === editingBedId
            ? {
                ...b,
                id: bForm.id,
                type: bForm.type,
                status: bForm.status,
              }
            : b
        )
      );
      setEditingBedId(null);
      alert('Bed config options modified.');
    } else {
      // duplicate check
      if (beds.find(b => b.id.toLowerCase() === bForm.id.toLowerCase())) {
        alert('A Cabin/Bed with this exact code label already exists.');
        return;
      }
      const newBed: Bed = {
        id: bForm.id,
        type: bForm.type,
        status: bForm.status,
      };
      setBeds(prev => [...prev, newBed]);
      alert('Cabin inventory matrix extended successfully.');
    }
    setBForm({ id: '', type: 'General', status: 'Available' });
  };

  const handleEditBed = (b: Bed) => {
    setEditingBedId(b.id);
    setBForm({
      id: b.id,
      type: b.type,
      status: b.status,
    });
  };

  const handleDeleteBed = (id: string) => {
    if (confirm('Delete this Bed / Cabin instance from system configurations?')) {
      setBeds(prev => prev.filter(b => b.id !== id));
    }
  };

  // Appointment Save & Edit
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppToken) {
      setAppointments(prev =>
        prev.map(a =>
          a.token === editingAppToken
            ? {
                ...a,
                name: aForm.name,
                doc: aForm.doc,
                date: aForm.date,
              }
            : a
        )
      );
      setEditingAppToken(null);
      alert('Appointment Ticket details modified!');
    } else {
      const newTokenNo = 'TK-' + (appointments.length + 101);
      const newApp: Appointment = {
        token: newTokenNo,
        name: aForm.name,
        doc: aForm.doc,
        date: aForm.date,
      };
      setAppointments(prev => [...prev, newApp]);
      alert('Live OPD token generated and added to dispatch screen.');
    }
    setAForm({ name: '', doc: '', date: '' });
  };

  const handleEditAppointment = (a: Appointment) => {
    setEditingAppToken(a.token);
    setAForm({
      name: a.name,
      doc: a.doc,
      date: a.date,
    });
  };

  const handleDeleteAppointment = (token: string) => {
    if (confirm('Revoke appointment token?')) {
      setAppointments(prev => prev.filter(a => a.token !== token));
    }
  };

  // Billing Flow - Standard Generation
  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === bPatient);
    if (!pat) {
      alert('Please select a valid admitted patient first.');
      return;
    }

    // Default calculations: OPD vs IPD differences
    const isIPD = pat.type.includes('IPD');
    const computedBed = isIPD ? 2500 : 0;
    // Find doc fee if any
    const firstDoc = doctors[0];
    const computedDoc = firstDoc ? firstDoc.fees : 1200;
    const computedOt = 0;
    const computedTest = isIPD ? 1500 : 800;
    const computedTotal = computedBed + computedDoc + computedOt + computedTest;

    let billingDate = bDate;
    if (billingDate) {
      const dObj = new Date(billingDate);
      billingDate = `${dObj.getMonth() + 1}/${dObj.getDate()}/${dObj.getFullYear()}`;
    } else {
      billingDate = new Date().toLocaleDateString();
    }

    const newBill: Bill = {
      invoice: 'INV-' + Math.floor(10000 + Math.random() * 90000),
      patientId: pat.id,
      patientName: pat.name,
      patientMobile: pat.mobile,
      total: computedTotal,
      date: billingDate,
      isDischarged: false,
      dischargeNotes: '',
      dispensedMedicines: [],
      breakdown: {
        bed: computedBed,
        doc: computedDoc,
        ot: computedOt,
        test: computedTest,
        med: 0,
      },
    };

    setBills(prev => [newBill, ...prev]);
    alert(`Case Statement Generated!\nInvoice ID: ${newBill.invoice}\nTotal Calculated Ledger: ৳${computedTotal}`);
  };

  const handleDeleteBill = (invoice: string) => {
    if (confirm('Permanently delete this invoice bill and purge ledger balance?')) {
      setBills(prev => prev.filter(b => b.invoice !== invoice));
    }
  };

  // ADVANCED ADJUSTMENT MODAL HANDLERS
  const openAdjuster = (bill: Bill) => {
    setActiveBillAdjustment(bill);
    setAdjBed(bill.breakdown.bed);
    setAdjDoc(bill.breakdown.doc);
    setAdjOt(bill.breakdown.ot);
    setAdjTest(bill.breakdown.test);
    setIsAdjustmentOpen(true);

    if (medicines.length > 0) {
      setAdjMedSelected(medicines[0].name);
    }
  };

  const handleAddMedicineToInvoice = () => {
    if (!activeBillAdjustment || !adjMedSelected) return;

    const medStock = medicines.find(m => m.name === adjMedSelected);
    if (!medStock || medStock.qty < adjMedQty) {
      alert(`Only ${medStock ? medStock.qty : 0} units left in stock.`);
      return;
    }

    // Deduct stock levels
    setMedicines(prev => prev.map(m => m.name === adjMedSelected ? { ...m, qty: m.qty - adjMedQty } : m));

    // Update active bill state
    const itemSubtotal = adjMedQty * medStock.price;

    setBills(prev =>
      prev.map(b => {
        if (b.invoice === activeBillAdjustment.invoice) {
          const renewedDispensed = [...(b.dispensedMedicines || [])];
          const matchedIdx = renewedDispensed.findIndex(dm => dm.name === adjMedSelected);

          if (matchedIdx !== -1) {
            renewedDispensed[matchedIdx].qty += adjMedQty;
            renewedDispensed[matchedIdx].subtotal += itemSubtotal;
          } else {
            renewedDispensed.push({
              name: adjMedSelected,
              qty: adjMedQty,
              unitPrice: medStock.price,
              subtotal: itemSubtotal,
            });
          }

          const currentMedTotal = (b.breakdown.med || 0) + itemSubtotal;
          const finalSum = b.breakdown.bed + b.breakdown.doc + b.breakdown.ot + b.breakdown.test + currentMedTotal;

          const updatedBill = {
            ...b,
            dispensedMedicines: renewedDispensed,
            breakdown: {
              ...b.breakdown,
              med: currentMedTotal,
            },
            total: finalSum,
          };

          // Keep activeBillAdjustment state synchronized
          setActiveBillAdjustment(updatedBill);
          return updatedBill;
        }
        return b;
      })
    );

    alert(`Dispensed ${adjMedQty} units of ${adjMedSelected} successfully!`);
  };

  const handleSaveInvoiceAdjustments = () => {
    if (!activeBillAdjustment) return;

    setBills(prev =>
      prev.map(b => {
        if (b.invoice === activeBillAdjustment.invoice) {
          const updatedTotal = adjBed + adjDoc + adjOt + adjTest + (b.breakdown.med || 0);
          return {
            ...b,
            breakdown: {
              ...b.breakdown,
              bed: adjBed,
              doc: adjDoc,
              ot: adjOt,
              test: adjTest,
            },
            total: updatedTotal,
          };
        }
        return b;
      })
    );

    setIsAdjustmentOpen(false);
    setActiveBillAdjustment(null);
    alert('Bill Ledger updated successfully.');
  };

  // DISCHARGE PROTOCOLS HANDLERS
  const openDischargeModal = (bill: Bill) => {
    setActiveDischargeBill(bill);
    setDischargeNotesText('');
    setIsDischargeOpen(true);
  };

  const handleConfirmDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDischargeBill) return;

    // Check if patient has any active occupied bed
    const patId = activeDischargeBill.patientId;
    const attachedPatient = patients.find(p => p.id === patId);

    if (attachedPatient && attachedPatient.bed !== 'None') {
      const occupiedBed = attachedPatient.bed;
      // Mark bed as Free/Available
      setBeds(prev => prev.map(b => (b.id === occupiedBed ? { ...b, status: 'Available' } : b)));
    }

    setBills(prev =>
      prev.map(b =>
        b.invoice === activeDischargeBill.invoice
          ? {
              ...b,
              isDischarged: true,
              dischargeNotes: dischargeNotesText,
            }
          : b
      )
    );

    setIsDischargeOpen(false);
    setActiveDischargeBill(null);
    alert('Discharge process complete! Attached Bed released.');
  };

  // ADVANCED ANALYTICS CALCULATIONS
  const stats = useMemo(() => {
    const totalIncome = bills.reduce((acc, b) => acc + b.total, 0);
    const lowStockCount = medicines.filter(m => m.qty < 10).length;
    const availableBedsCount = beds.filter(b => b.status === 'Available').length;
    const admittedPatientsCount = patients.length;

    return {
      totalIncome,
      lowStockCount,
      availableBedsCount,
      admittedPatientsCount,
    };
  }, [bills, medicines, beds, patients]);

  // Dynamic filter lists for Bills Table
  const filteredInvoices = useMemo(() => {
    let startTimestamp = billStartDate ? new Date(billStartDate).setHours(0, 0, 0, 0) : null;
    let endTimestamp = billEndDate ? new Date(billEndDate).setHours(23, 59, 59, 999) : null;

    return bills.filter(b => {
      if (startTimestamp || endTimestamp) {
        const bd = new Date(b.date).setHours(0, 0, 0, 0);
        if (startTimestamp && bd < startTimestamp) return false;
        if (endTimestamp && bd > endTimestamp) return false;
      }
      if (searchBillName && !b.patientName.toUpperCase().includes(searchBillName.toUpperCase())) {
        return false;
      }
      if (searchBillPhone && !b.patientMobile.includes(searchBillPhone)) {
        return false;
      }
      return true;
    });
  }, [bills, billStartDate, billEndDate, searchBillName, searchBillPhone]);

  // Filters for Patients Search Table
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const norm = searchPatient.toUpperCase();
      return (
        p.id.toUpperCase().includes(norm) ||
        p.name.toUpperCase().includes(norm) ||
        (p.guardian && p.guardian.toUpperCase().includes(norm)) ||
        p.mobile.includes(norm)
      );
    });
  }, [patients, searchPatient]);

  // Set default patient key for billing form selection
  useEffect(() => {
    if (patients.length > 0 && !bPatient) {
      setBPatient(patients[0].id);
    }
  }, [patients, bPatient]);

  // Global CSV / Excel Exporter logic
  const handleExportPatientsExcel = () => {
    if (patients.length === 0) {
      alert('No Clinical Patient records loaded to export.');
      return;
    }
    const headers = 'PatientID,Name,Age,Gender,Mobile,Guardian,Relation,Blood,AdmissionType,AssignedBed,EmergencyContact,History,Date';
    const rows = patients
      .map(
        p =>
          `"${p.id}","${p.name.replace(/"/g, '""')}",${p.age},"${p.gender}","${p.mobile}","${
            p.guardian?.replace(/"/g, '""') || ''
          }","${p.relation || ''}","${p.blood}","${p.type}","${p.bed || 'None'}","${p.emergency}","${
            p.history?.replace(/"/g, '""').replace(/\n/g, ' ') || ''
          }","${p.date}"`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'CareFlow_HMS_Patients_Records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-800">
      {/* SIDEBAR NAVIGATION UNIT */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-lg border-r border-slate-800">
        <div className="p-5 flex flex-col h-full overflow-y-auto">
          {/* Logo Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-wider flex items-center gap-2 text-white">
              <Activity className="h-6 w-6 text-blue-400 shrink-0" />
              <span>CareFlow HMS</span>
            </h1>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-mono">Real-Time Core Admin Console</p>
          </div>
          <hr className="border-slate-800 mb-5" />

          {/* Navigation Items */}
          <nav className="space-y-1 flex-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'dashboard' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('patient')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'patient' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Patients Log</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'doctor' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Stethoscope className="h-4 w-4 shrink-0" />
              <span>Doctors Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'staff' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>Nurse & Staff</span>
            </button>

            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'pharmacy' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Pill className="h-4 w-4 shrink-0" />
              <span>Pharmacy Store</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'billing' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Receipt className="h-4 w-4 shrink-0" />
              <span>Invoices & Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('beds')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'beds' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <BedDouble className="h-4 w-4 shrink-0" />
              <span>Beds & Cabin Rooms</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition cursor-pointer text-left ${
                activeTab === 'appointments' ? 'bg-blue-600 border-l-4 border-blue-400 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <CalendarCheck className="h-4 w-4 shrink-0" />
              <span>OPD Appointments</span>
            </button>
          </nav>
        </div>
        {/* Sidebar Footer Copyright */}
        <div className="p-4 bg-slate-950 text-[11px] text-center text-gray-400 font-mono tracking-wider border-t border-slate-900">
          &copy; 2026 CareFlow V1.2.0 Pro
        </div>
      </aside>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
        {/* Dynamic Nav Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard Analysis'}
              {activeTab === 'patient' && 'Admitted Patients & Registrations'}
              {activeTab === 'doctor' && 'Medical Specialists Directory'}
              {activeTab === 'staff' && 'Internal Staff Members & Rosters'}
              {activeTab === 'pharmacy' && 'Pharmacy Catalogues & Stock Matrix'}
              {activeTab === 'billing' && 'Revenue Receipts & Billing Ledgers'}
              {activeTab === 'beds' && 'Facility Cabins & Critical Beds Room'}
              {activeTab === 'appointments' && 'Outdoor Dispatch Ticket Scheduling'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM ONLINE (REAL-TIME DB)
            </span>
            <button
              onClick={handleExportPatientsExcel}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition shadow cursor-pointer uppercase"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* Action Window Content area with layout scrolling */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* ================ DASHBOARD VIEW ================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Analytics Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-blue-600 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Today's Total Patients</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.admittedPatientsCount}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-300" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-emerald-600 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Total System Revenue</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">৳{stats.totalIncome}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-emerald-300" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-amber-500 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Available Bed Cabins</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.availableBedsCount}</p>
                  </div>
                  <BedDouble className="h-8 w-8 text-amber-300" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-red-500 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Low Drug Stock Alerts</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.lowStockCount}</p>
                  </div>
                  <Pill className="h-8 w-8 text-red-300" />
                </div>
              </div>

              {/* Advanced logs & details widgets in Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    <span>Real-Time Notifications & Smart SMS Queue</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50/70 border-l-4 border-blue-500 rounded text-xs text-blue-950 flex justify-between items-center">
                      <span><strong>Reminder Triggered:</strong> Patient admission confirmation dispatched via SMS Gateway APIs successfully.</span>
                      <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shrink-0 ml-2">Sent</span>
                    </div>

                    <div className="p-3 bg-green-50/70 border-l-4 border-green-500 rounded text-xs text-green-950 flex justify-between items-center">
                      <span><strong>Ledger Surcharges Action:</strong> Completed automated billing ledger sync audit status for Cabin stays.</span>
                      <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shrink-0 ml-2">Verified</span>
                    </div>

                    {stats.lowStockCount > 0 && (
                      <div className="p-3 bg-red-50/70 border-l-4 border-red-500 rounded text-xs text-red-950 flex justify-between items-center">
                        <span><strong>Critical Alert Alert:</strong> {stats.lowStockCount} Drugs in Pharmacy Stock reached critical restock thresholds.</span>
                        <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shrink-0 ml-2">Action Needed</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-600" />
                    <span>Secure Local Cloud Sync State & Console Logs </span>
                  </h3>
                  <div className="p-4 bg-slate-950 rounded-lg text-[11px] font-mono text-cyan-400 space-y-1.5 max-h-[160px] overflow-y-auto">
                    <p><span className="text-green-400 font-bold">[SUCCESS]</span> CareFlow Core Local Storage sync transaction completed.</p>
                    <p><span className="text-blue-400 font-bold">[INFO]</span> Action Log: Registered active sessions mapping successfully.</p>
                    <p><span className="text-amber-400 font-bold">[WARN]</span> Paracetamol 500mg batch warning metrics generated. Minimum Safety levels low.</p>
                    <p><span className="text-purple-400 font-bold">[REVENUE]</span> Current calculated operational balance validated successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================ ADMITTED PATIENTS TAB ================ */}
          {activeTab === 'patient' && (
            <div className="space-y-6">
              {/* Patient registration Form Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  <span>
                    {editingPatientId ? `✏️ Edit Patient Admissions Logs: ${editingPatientId}` : 'Register New Admitted Patient (OPD/IPD)'}
                  </span>
                </h3>

                <form onSubmit={handlePatientSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={pForm.name}
                      onChange={e => setPForm({ ...pForm, name: e.target.value })}
                      placeholder="e.g. Abul Kalam Azad"
                      className="w-full border border-gray-200 p-2 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Age & Gender *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        placeholder="Age"
                        value={pForm.age}
                        onChange={e => setPForm({ ...pForm, age: e.target.value })}
                        className="w-1/2 border border-gray-200 p-2 rounded text-xs outline-none"
                      />
                      <select
                        value={pForm.gender}
                        onChange={e => setPForm({ ...pForm, gender: e.target.value as any })}
                        className="w-1/2 border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017xxxxxxxx"
                      value={pForm.mobile}
                      onChange={e => setPForm({ ...pForm, mobile: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Guardian / Parent Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Father/Mother/Spouse"
                      value={pForm.guardian}
                      onChange={e => setPForm({ ...pForm, guardian: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Relation status *</label>
                    <select
                      value={pForm.relation}
                      onChange={e => setPForm({ ...pForm, relation: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Spouse</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Brother</option>
                      <option>Sister</option>
                      <option>Other / Relative</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Blood Group status</label>
                    <select
                      value={pForm.blood}
                      onChange={e => setPForm({ ...pForm, blood: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Admission Type</label>
                    <select
                      value={pForm.type}
                      onChange={e => {
                        const val = e.target.value as any;
                        setPForm({
                          ...pForm,
                          type: val,
                          bed: val.includes('OPD') ? 'None' : pForm.bed,
                        });
                      }}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option value="OPD (Outpatient)">OPD (Outpatient)</option>
                      <option value="IPD (Indoor Patient)">IPD (Indoor Patient)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assign Bed Cabin Slot</label>
                    <select
                      disabled={pForm.type.includes('OPD')}
                      value={pForm.bed}
                      onChange={e => setPForm({ ...pForm, bed: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="None">None / OPD Slot</option>
                      {beds.map(b => (
                        <option key={b.id} value={b.id} disabled={b.status === 'Occupied' && pForm.bed !== b.id}>
                          {b.id} ({b.type}) - {b.status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Alternate Emergency Companion Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. 015xxxxxxxx"
                      value={pForm.emergency}
                      onChange={e => setPForm({ ...pForm, emergency: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Clinical Diagnostics Notes & History</label>
                    <textarea
                      rows={2}
                      value={pForm.history}
                      onChange={e => setPForm({ ...pForm, history: e.target.value })}
                      placeholder="Primary complains, medical observations, prescription records..."
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    ></textarea>
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-2 border-t pt-3">
                    {editingPatientId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPatientId(null);
                          setPForm({
                            name: '',
                            age: '',
                            gender: 'Male',
                            mobile: '',
                            guardian: '',
                            relation: 'Father',
                            blood: 'O+',
                            type: 'OPD (Outpatient)',
                            bed: 'None',
                            emergency: '',
                            history: '',
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded text-xs transition shadow cursor-pointer"
                    >
                      {editingPatientId ? 'Update Patient Records' : 'Save & Admit Patient'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Patient Records List Grid */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-base font-bold text-slate-800">Facility Ward Admissions Roster</h3>
                  {/* Search bar widget */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Live Search Name, ID, Guardian..."
                      value={searchPatient}
                      onChange={e => setSearchPatient(e.target.value)}
                      className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Patient ID</th>
                        <th className="p-3">Name (Age/Gen)</th>
                        <th className="p-3">Guardian Profile</th>
                        <th className="p-3">Status type</th>
                        <th className="p-3">Cabin Code</th>
                        <th className="p-3">Blood Type</th>
                        <th className="p-3">Admitted Date</th>
                        <th className="p-3 text-center">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-3 text-center text-gray-400 italic">No corresponding patient data currently registered.</td>
                        </tr>
                      ) : (
                        filteredPatients.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/55 transition text-xs">
                            <td className="p-3 font-mono font-bold text-blue-600">{p.id}</td>
                            <td className="p-3 font-semibold text-gray-800">
                              <div>{p.name}</div>
                              <span className="text-[10px] text-gray-400">{p.age} Yrs / {p.gender}</span>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-gray-700">{p.guardian}</div>
                              <div className="text-[10px] text-gray-400">{p.relation}</div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.type.includes('IPD') ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-green-100 text-green-900 border border-green-200'}`}>
                                {p.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="flex items-center gap-1 font-semibold text-gray-600">
                                <BedDouble className="h-3.5 w-3.5 text-blue-500" />
                                <span>{p.bed || 'OPD Slot'}</span>
                              </span>
                            </td>
                            <td className="p-3 font-extrabold text-red-600 font-mono text-xs">{p.blood}</td>
                            <td className="p-3 text-gray-500">{p.date}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center items-center gap-3">
                                <button
                                  onClick={() => handleEditPatient(p)}
                                  className="text-blue-500 hover:text-blue-700 cursor-pointer p-1 rounded hover:bg-blue-50 transition"
                                  title="Edit Patient Information Record"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePatient(p.id, p.bed)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer p-1 rounded hover:bg-red-50 transition"
                                  title="Purge Active Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================ DOCTORS CHAMBERS TAB ================ */}
          {activeTab === 'doctor' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Doctor inputs */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                  <Stethoscope className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{editingDoctorId ? '✏️ Edit Doctor Details' : 'Register Consultant'}</span>
                </h3>

                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Amina Rahman"
                      value={dForm.name}
                      onChange={e => setDForm({ ...dForm, name: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Specialization Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Neurology"
                      value={dForm.spec}
                      onChange={e => setDForm({ ...dForm, spec: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Visiting Hours Shift Schedule</label>
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM - 09:00 PM"
                      value={dForm.time}
                      onChange={e => setDForm({ ...dForm, time: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Consultation Charge (৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Fees per consultancy"
                      value={dForm.fees}
                      onChange={e => setDForm({ ...dForm, fees: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    {editingDoctorId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDoctorId(null);
                          setDForm({ name: '', spec: '', time: '', fees: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-3 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded font-bold text-xs transition uppercase tracking-wider"
                    >
                      {editingDoctorId ? 'Update Doctor Profile' : 'Register Doctor'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Specializations columns */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-800">Operational Specialists list</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Doc ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Specialization</th>
                        <th className="p-3">Visiting Shift</th>
                        <th className="p-3 text-right">Consultancy Fee</th>
                        <th className="p-3 text-center">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {doctors.map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/55 transition text-xs">
                          <td className="p-3 font-mono font-bold text-slate-500">{d.id}</td>
                          <td className="p-3 font-bold text-slate-800">Dr. {d.name}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">{d.spec}</span></td>
                          <td className="p-3 text-gray-500 font-medium">{d.time || 'N/A'}</td>
                          <td className="p-3 text-right font-extrabold text-emerald-600 font-mono">৳{d.fees}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEditDoctor(d)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Doctor profile"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(d.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                title="Delete profile"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================ SUPPORT STAFF MEMBERS TAB ================ */}
          {activeTab === 'staff' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Staff registrations */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                  <Shield className="h-4.5 w-4.5 text-blue-600" />
                  <span>{editingStaffId ? '✏️ Edit Staff Profile' : 'Register Nurse / Support Staff'}</span>
                </h3>

                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jasmin Begum"
                      value={sForm.name}
                      onChange={e => setSForm({ ...sForm, name: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Role Type Designation *</label>
                    <select
                      value={sForm.role}
                      onChange={e => setSForm({ ...sForm, role: e.target.value as any })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option value="Nurse">Nurse</option>
                      <option value="Ward Boy">Ward Boy</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Accountant">Accountant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Assigned Shift Roster *</label>
                    <select
                      value={sForm.shift}
                      onChange={e => setSForm({ ...sForm, shift: e.target.value as any })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option value="Day (8 AM - 4 PM)">Day (8 AM - 4 PM)</option>
                      <option value="Evening (4 PM - 12 AM)">Evening (4 PM - 12 AM)</option>
                      <option value="Night (12 AM - 8 AM)">Night (12 AM - 8 AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Monthly Salary (৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Pay scale index"
                      value={sForm.salary}
                      onChange={e => setSForm({ ...sForm, salary: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    {editingStaffId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStaffId(null);
                          setSForm({ name: '', role: 'Nurse', shift: 'Day (8 AM - 4 PM)', salary: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-3 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold text-xs transition uppercase tracking-wider"
                    >
                      {editingStaffId ? 'Update Staff Member' : 'Register Staff Member'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Attendance Table logs info */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-800">Support roster list & status logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Staff ID</th>
                        <th className="p-3">Support Staff Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Daily Shift Info</th>
                        <th className="p-3">Basic Salary</th>
                        <th className="p-3">Security Attendance Status</th>
                        <th className="p-3 text-center">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {staff.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/55 transition text-xs">
                          <td className="p-3 font-mono text-gray-500">{s.id}</td>
                          <td className="p-3 font-bold text-slate-800">{s.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-900 border border-blue-200">
                              {s.role}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-gray-600">{s.shift}</td>
                          <td className="p-3 font-semibold text-gray-800">৳{s.salary}</td>
                          <td className="p-3">
                            <select
                              value={s.status}
                              onChange={e => toggleStaffAttendance(s.id, e.target.value as any)}
                              className={`text-xs border px-2 py-1 rounded bg-white font-bold cursor-pointer ${
                                s.status === 'Present' ? 'text-emerald-700 border-emerald-300' : 'text-rose-700 border-rose-300'
                              }`}
                            >
                              <option value="Present">🟢 Present</option>
                              <option value="On Leave">🔴 On Leave</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEditStaff(s)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                title="Edit staff profile details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(s.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                title="Delete staff info"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================ PHARMACY STOCK TAB ================ */}
          {activeTab === 'pharmacy' && (
            <div className="space-y-6">
              {/* Medicine registration Form */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5 mb-4">
                  <Pill className="h-4.5 w-4.5 text-purple-600" />
                  <span>{editingMedName ? `✏️ Edit Drug Stock: ${editingMedName}` : 'Add Medicine Inventory Entry'}</span>
                </h3>

                <form onSubmit={handleMedicineSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Medicine generic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Paracetamol 500mg"
                      value={mForm.name}
                      onChange={e => setMForm({ ...mForm, name: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Batch Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B-ST89"
                      value={mForm.batch}
                      onChange={e => setMForm({ ...mForm, batch: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Initial Stock Count *</label>
                    <input
                      type="number"
                      required
                      placeholder="Stock levels quantity"
                      value={mForm.qty}
                      onChange={e => setMForm({ ...mForm, qty: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Selling Price Per Unit (৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="Unit rate costs"
                      value={mForm.price}
                      onChange={e => setMForm({ ...mForm, price: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end gap-2 border-t pt-3">
                    {editingMedName && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMedName(null);
                          setMForm({ name: '', batch: '', qty: '', price: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded text-xs transition cursor-pointer uppercase tracking-wider"
                    >
                      {editingMedName ? 'Update Medicine' : 'Add Medication Entry'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Medicine Inventory Grid list */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Pharmacy Medication Stock & Warnings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Drug Generic label Name</th>
                        <th className="p-3">Batch Code</th>
                        <th className="p-3">Available units Stock</th>
                        <th className="p-3">Price Per unit</th>
                        <th className="p-3">Safety Status Thresholds</th>
                        <th className="p-3 text-center">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {medicines.map(m => (
                        <tr key={m.name} className="hover:bg-slate-50/55 transition text-xs">
                          <td className="p-3 font-semibold text-slate-800">{m.name}</td>
                          <td className="p-3 font-mono text-xs text-gray-500">{m.batch}</td>
                          <td className={`p-3 font-bold ${m.qty < 10 ? 'text-rose-600' : 'text-gray-700'}`}>{m.qty} Units</td>
                          <td className="p-3 font-semibold text-slate-700">৳{m.price}</td>
                          <td className="p-3">
                            {m.qty < 10 ? (
                              <span className="text-[10px] bg-red-100 text-red-900 border border-red-200 uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                <AlertTriangle className="h-3 w-3 inline shrink-0 text-red-700" />
                                <span>CRITICAL RESTOCK</span>
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase font-bold px-2 py-0.5 rounded w-fit">
                                Stable Stocks
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEditMedicine(m)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                title="Modify medication profile"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedicine(m.name)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                title="Delete records"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================ BILLING & INVOICES TAB ================ */}
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Billing generation Panel */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
                  <Receipt className="h-4.5 w-4.5 text-blue-600" />
                  <span>Interactive Billing System Engine</span>
                </h3>

                <form onSubmit={handleGenerateInvoice} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Select Admission Date *</label>
                    <input
                      type="date"
                      required
                      value={bDate}
                      onChange={e => setBDate(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Select Admitted Patient *</label>
                    <select
                      value={bPatient}
                      onChange={e => setBPatient(e.target.value)}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none font-medium"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.id} - {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Generate Base Invoice Profile
                  </button>
                </form>
              </div>

              {/* Transactions search Table columns */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-slate-800">Transactional History Receipts Roster</h3>

                {/* Filter section block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={billStartDate}
                      onChange={e => setBillStartDate(e.target.value)}
                      className="w-full border border-gray-200 p-1.5 rounded bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={billEndDate}
                      onChange={e => setBillEndDate(e.target.value)}
                      className="w-full border border-gray-200 p-1.5 rounded bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Patient Name</label>
                    <input
                      type="text"
                      placeholder="Search name..."
                      value={searchBillName}
                      onChange={e => setSearchBillName(e.target.value)}
                      className="w-full border border-gray-200 p-1.5 rounded bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Phone number</label>
                    <input
                      type="text"
                      placeholder="Search phone..."
                      value={searchBillPhone}
                      onChange={e => setSearchBillPhone(e.target.value)}
                      className="w-full border border-gray-200 p-1.5 rounded bg-white outline-none font-mono"
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setBillStartDate('');
                        setBillEndDate('');
                        setSearchBillName('');
                        setSearchBillPhone('');
                      }}
                      className="text-[10px] font-bold bg-gray-200 hover:bg-gray-300 text-slate-700 px-3 py-1 rounded transition cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Invoice Code</th>
                        <th className="p-3">Patient Profile</th>
                        <th className="p-3">Emergency Contact</th>
                        <th className="p-3">Ledger Amount</th>
                        <th className="p-3">Invoice Date</th>
                        <th className="p-3 text-center">Action Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-3 text-center text-gray-400 italic">No corresponding invoice data matched filter query.</td>
                        </tr>
                      ) : (
                        filteredInvoices.map(b => (
                          <tr key={b.invoice} className="hover:bg-slate-50/55 transition text-xs">
                            <td className="p-3 font-mono font-bold text-purple-700 underline cursor-pointer" onClick={() => { setActiveInvoice(b); setIsInvoiceOpen(true); }}>
                              {b.invoice}
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              <div>{b.patientName}</div>
                              <span className="text-[10px] text-gray-400 font-mono font-medium">{b.patientId}</span>
                            </td>
                            <td className="p-3 font-mono text-gray-600 font-semibold">{b.patientMobile}</td>
                            <td className="p-3 font-extrabold text-blue-950 font-mono text-sm">৳{b.total}</td>
                            <td className="p-3 text-gray-550 font-medium">{b.date}</td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => openAdjuster(b)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-[10px] transition cursor-pointer shrink-0 uppercase tracking-wider"
                                >
                                  Generate / Edit Bill
                                </button>
                                <button
                                  onClick={() => { setActiveInvoice(b); setIsInvoiceOpen(true); }}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                  title="View Full Case Sheet Summary & Print Invoice Receipt"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                </button>
                                {!b.isDischarged ? (
                                  <button
                                    onClick={() => openDischargeModal(b)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2 py-1 rounded text-[10px] transition uppercase cursor-pointer"
                                  >
                                    discharge patient
                                  </button>
                                ) : (
                                  <span className="text-slate-400 italic font-bold text-[11px]">Discharged</span>
                                )}
                                <button
                                  onClick={() => handleDeleteBill(b.invoice)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition ml-2 cursor-pointer"
                                  title="Purge Invoice transaction"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================ BED CONFIGURATIONS & STATUS LIST ================ */}
          {activeTab === 'beds' && (
            <div className="space-y-6">
              {/* Add/Edit Bed configurations panel */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5 mb-4">
                  <BedDouble className="h-4.5 w-4.5 text-blue-600" />
                  <span>{editingBedId ? `✏️ Edit Bed Configuration: ${editingBedId}` : 'Add New Bed / Cabin Facility Room Instance'}</span>
                </h3>

                <form onSubmit={handleBedSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Bed/Cabin Identifier Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cabin-104 or Bed ICU-3"
                      value={bForm.id}
                      onChange={e => setBForm({ ...bForm, id: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Room Facility Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Deluxe Suite / Pediatric ICU"
                      value={bForm.type}
                      onChange={e => setBForm({ ...bForm, type: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Occupancy state status *</label>
                    <select
                      value={bForm.status}
                      onChange={e => setBForm({ ...bForm, status: e.target.value as any })}
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-2">
                    {editingBedId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBedId(null);
                          setBForm({ id: '', type: 'General', status: 'Available' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded text-xs transition uppercase tracking-wider"
                    >
                      {editingBedId ? 'Update Bed' : 'Register Cabin Room'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Beds representation matrix */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Bed Cabin Registry Status Monitor</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {beds.map(b => (
                    <div
                      key={b.id}
                      className={`p-4 rounded-xl border text-center transition flex flex-col justify-between ${
                        b.status === 'Available'
                          ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950 hover:bg-emerald-50'
                          : 'bg-rose-50/50 border-rose-300 text-rose-950 hover:bg-rose-50'
                      }`}
                    >
                      <div>
                        <BedDouble className="h-6 w-6 mx-auto mb-2 text-slate-600" />
                        <div className="font-extrabold text-sm font-mono tracking-tight text-slate-800">{b.id}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{b.type}</div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <span className={`inline-block text-[9ps] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          b.status === 'Available' ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}>
                          {b.status}
                        </span>

                        <div className="flex justify-center items-center gap-2 border-t border-gray-200 pt-2">
                          <button
                            onClick={() => handleEditBed(b)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-semibold p-1 bg-white border border-gray-200 rounded transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBed(b.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 bg-white border border-gray-200 rounded transition cursor-pointer"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================ OPD APPOINTMENTS TAB ================ */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Appointments scheduler input form */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5 mb-4">
                  <CalendarCheck className="h-4.5 w-4.5 text-indigo-600" />
                  <span>{editingAppToken ? `✏️ Edit Appointment Ticket: ${editingAppToken}` : 'OPD Token Appointment Scheduler'}</span>
                </h3>

                <form onSubmit={handleAppointmentSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rokeya Sultana"
                      value={aForm.name}
                      onChange={e => setAForm({ ...aForm, name: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Select Chamber Specialist Doctor *</label>
                    <select
                      value={aForm.doc}
                      onChange={e => setAForm({ ...aForm, doc: e.target.value })}
                      required
                      className="w-full border border-gray-200 p-2 rounded text-xs bg-white outline-none"
                    >
                      <option value="">-- Choose Specialist Doctor --</option>
                      {doctors.map(d => (
                        <option key={d.id} value={`Dr. ${d.name} (${d.spec})`}>
                          Dr. {d.name} - {d.spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      value={aForm.date}
                      onChange={e => setAForm({ ...aForm, date: e.target.value })}
                      className="w-full border border-gray-200 p-2 rounded text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    {editingAppToken && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAppToken(null);
                          setAForm({ name: '', doc: '', date: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded text-xs transition uppercase tracking-wide cursor-pointer shadow-sm"
                    >
                      {editingAppToken ? 'Update Appointment' : 'Generate Token Slot'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Appointment Listings grid lists */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Operational active Appointment roster</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                        <th className="p-3">Token code No</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Assigned Specialist Doctor</th>
                        <th className="p-3">Schedule Date Slot</th>
                        <th className="p-3 text-center">Action Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {appointments.map(a => (
                        <tr key={a.token} className="hover:bg-slate-50/55 transition text-xs">
                          <td className="p-3 font-mono font-extrabold text-indigo-700 text-xs">{a.token}</td>
                          <td className="p-3 font-semibold text-slate-800">{a.name}</td>
                          <td className="p-3"><span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-950 border border-indigo-200">{a.doc}</span></td>
                          <td className="p-3 text-gray-500 font-medium font-mono">{a.date}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEditAppointment(a)}
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Appt token details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAppointment(a.token)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                                title="Revoke slot token"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================== MODAL WINDOWS CONTROLLERS ===================== */}

      {/* 2. CASE SHEET SUMMARY & INVOICE PRINTER MODAL */}
      {isInvoiceOpen && activeInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-purple-600" />
                <span>Admission Case Ledger Sheet: </span>
                <span className="text-purple-700 font-mono">{activeInvoice.invoice}</span>
              </h3>
              <button
                onClick={() => {
                  setIsInvoiceOpen(false);
                  setActiveInvoice(null);
                }}
                className="text-gray-400 hover:text-gray-650 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs flex-1">
              {/* Basic Patient info card inside invoice case wrapper */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Age & Gender status</p>
                  <p className="font-bold text-slate-800">{activeInvoice.patientName} (Contact Index)</p>
                  <p className="text-gray-500 text-[10px]">{activeInvoice.patientId}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mobile details</p>
                  <p className="font-semibold text-slate-800 font-mono">{activeInvoice.patientMobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Invoiced Dates</p>
                  <p className="font-semibold text-slate-800 font-mono">{activeInvoice.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Discharged state status</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${activeInvoice.isDischarged ? 'bg-green-150 text-green-900 border border-green-300' : 'bg-red-50 text-red-900 border border-red-200'}`}>
                    {activeInvoice.isDischarged ? 'Discharged Status' : 'Admitted Active'}
                  </span>
                </div>
              </div>

              {/* Case History summaries logs from Admissions */}
              <div className="border border-slate-250 rounded-lg p-4 space-y-3 bg-white">
                <h4 className="font-bold text-slate-850 flex items-center gap-2 border-b pb-1">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Clinical Case Record Details log</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-extrabold uppercase">Doctor Chamber visits</span>
                    <p className="mt-1 text-gray-500 italic p-2 rounded bg-slate-50/50">Regular clinical rounds verification logged.</p>
                  </div>
                  <div>
                    <span className="text-[9px] bg-indigo-50 text-indigo-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Support Nurse Observations</span>
                    <p className="mt-1 text-gray-500 italic p-2 rounded bg-slate-50/50">Internal Vitals tracking stable throughout.</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[9px] bg-purple-50 text-purple-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Medicines Administered</span>
                    <div className="mt-1 border border-slate-100 rounded p-2 bg-slate-50/30 text-xs">
                      {activeInvoice.dispensedMedicines && activeInvoice.dispensedMedicines.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {activeInvoice.dispensedMedicines.map((m, idx) => (
                            <li key={idx} className="font-medium text-slate-700">
                              {m.name} (Qty: {m.qty} x ৳{m.unitPrice} = ৳{m.subtotal})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 italic">No drug stock entries associated with this specific case invoice yet.</p>
                      )}
                    </div>
                  </div>
                  {activeInvoice.isDischarged && (
                    <div className="md:col-span-2 bg-green-50/50 p-2.5 rounded border border-green-200">
                      <span className="text-[9px] bg-green-250 text-green-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Final Release Clinical notes</span>
                      <p className="mt-1 text-green-950 font-medium">{activeInvoice.dischargeNotes || 'Patient released under stable vitals condition.'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account statement Ledger items calculation */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-3 font-semibold text-xs tracking-wider border-b border-gray-200 text-slate-700">Ledger balance Calculation Statement</div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b text-gray-500 font-bold uppercase tracking-wider">
                      <th className="p-2.5">Accounts Statement description index</th>
                      <th className="p-2.5 text-right">Computed Subtotals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2.5">Cabin stay / Room Occupancy Rates (৳)</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">৳{activeInvoice.breakdown?.bed || 0}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Registered specialist consultancy fees (৳)</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">৳{activeInvoice.breakdown?.doc || 0}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Operations / Operation Theatre (OT) indices (৳)</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">৳{activeInvoice.breakdown?.ot || 0}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Diagnostics Pathology Clinic Tests Indices (৳)</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">৳{activeInvoice.breakdown?.test || 0}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Pharmacy dispensed Medicine total subtotal (৳)</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-700">৳{activeInvoice.breakdown?.med || 0}</td>
                    </tr>
                    <tr className="bg-purple-100/50 font-extrabold text-sm text-slate-900">
                      <td className="p-3">Grand Invoice Settled Balance (৳)</td>
                      <td className="p-3 text-right text-purple-700 font-mono">৳{activeInvoice.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsInvoiceOpen(false);
                  setActiveInvoice(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-xs transition cursor-pointer font-bold"
              >
                Close Case Board
              </button>
              <button
                onClick={() => {
                  setIsInvoiceOpen(false);
                  openAdjuster(activeInvoice);
                }}
                className="bg-white hover:bg-slate-100 border border-black font-extrabold text-black px-4 py-2 rounded text-xs transition cursor-pointer"
              >
                Edit and make bill
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Case Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. GENERATE ADJUSTED BILL & DISPENSE DRUG MODAL PANEL */}
      {isAdjustmentOpen && activeBillAdjustment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <span>Custom Ledger adjustments: </span>
                <span className="text-gray-900">{activeBillAdjustment.invoice}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAdjustmentOpen(false);
                  setActiveBillAdjustment(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs text-gray-750 max-h-[75vh] overflow-y-auto flex-1">
              {/* Target info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded tracking-tight">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5 text-slate-500">Target Patient Profile ID</span>
                <span className="font-extrabold text-slate-900">
                  {activeBillAdjustment.patientId} - {activeBillAdjustment.patientName} ({activeBillAdjustment.invoice})
                </span>
              </div>

              {/* Medicine dispenser section */}
              <div className="border border-purple-200 bg-purple-50/40 p-3 rounded-lg space-y-3">
                <h4 className="font-bold text-purple-950 flex items-center gap-1">
                  <Pill className="h-4 w-4 text-purple-700" />
                  <span>Dispense Medicines from Pharmacy Stocks</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Select Available Drug</label>
                    <select
                      value={adjMedSelected}
                      onChange={e => setAdjMedSelected(e.target.value)}
                      className="w-full border border-gray-200 bg-white p-1.5 rounded outline-none"
                    >
                      {medicines.map(m => (
                        <option key={m.name} value={m.name}>
                          {m.name} (Qty Left: {m.qty} | rate: ৳{m.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Dispense Count</label>
                    <input
                      type="number"
                      min={1}
                      value={adjMedQty}
                      onChange={e => setAdjMedQty(parseInt(e.target.value) || 1)}
                      className="w-full border border-gray-200 bg-white p-1.5 rounded outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicineToInvoice}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold p-1.5 rounded uppercase tracking-wider transition cursor-pointer"
                >
                  + Add & Deduct from stocks
                </button>
              </div>

              {/* Financial numerical ledger updates section */}
              <div className="border border-slate-200 p-3 rounded bg-white space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-1 uppercase tracking-wider text-[10px] text-slate-500">Manual Financial adjustments</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Cabin Room charges (৳)</label>
                    <input
                      type="number"
                      value={adjBed}
                      onChange={e => setAdjBed(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-200 p-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Doctor Consultancy fees (৳)</label>
                    <input
                      type="number"
                      value={adjDoc}
                      onChange={e => setAdjDoc(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-200 p-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">OT Surcharges (৳)</label>
                    <input
                      type="number"
                      value={adjOt}
                      onChange={e => setAdjOt(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-200 p-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-bold mb-1">Diagnostics Pathology (৳)</label>
                    <input
                      type="number"
                      value={adjTest}
                      onChange={e => setAdjTest(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-200 p-1 rounded"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center font-bold text-xs text-slate-900 border-t">
                  <span>Running Medicine dispenser total:</span>
                  <span className="text-purple-700 font-mono text-sm">৳{activeBillAdjustment.breakdown?.med || 0}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end gap-2 rounded-b-xl shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsAdjustmentOpen(false);
                  setActiveBillAdjustment(null);
                }}
                className="bg-gray-550 hover:bg-gray-600 text-slate-700 border font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInvoiceAdjustments}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded cursor-pointer transition uppercase"
              >
                Save & Update Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLINICAL PATIENT DISCHARGE CONDITIONS MODAL */}
      {isDischargeOpen && activeDischargeBill && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <X className="h-5 w-5 text-rose-500" />
                <span>Release Patients & discharge sheets</span>
              </h3>
              <button
                onClick={() => {
                  setIsDischargeOpen(false);
                  setActiveDischargeBill(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmDischarge} className="p-4 space-y-4 text-xs">
              <div className="p-3 bg-red-50/50 border border-rose-200 rounded">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Patient Profile Admissions meta</span>
                <span className="font-extrabold text-slate-900">
                  {activeDischargeBill.patientId} - {activeDischargeBill.patientName} ({activeDischargeBill.invoice})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Final discharge notes / Prescriptions / Clinical recovery advisory *</label>
                <textarea
                  required
                  rows={4}
                  value={dischargeNotesText}
                  onChange={e => setDischargeNotesText(e.target.value)}
                  placeholder="E.g. Vitals checked and stable during clinical round metrics audits. Adhere strictly to 2-weeks physical bed resting schedules..."
                  className="w-full border border-gray-200 p-2.5 rounded text-xs outline-none focus:ring-1 focus:ring-red-400"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDischargeOpen(false);
                    setActiveDischargeBill(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-650 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow-sm cursor-pointer uppercase"
                >
                  Confirm release & close Room Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
