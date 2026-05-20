import { Patient, Doctor, Staff, Medicine, Bed, Bill, Appointment } from './types';

export const initialPatients: Patient[] = [
  {
    id: 'PID-2841',
    name: 'Anisur Rahman',
    age: 45,
    gender: 'Male',
    mobile: '01712345678',
    guardian: 'Ayesha Rahman',
    relation: 'Spouse',
    blood: 'A+',
    type: 'IPD (Indoor Patient)',
    bed: 'Cabin 102',
    emergency: '01711122233',
    history: 'Hypertension and Type II Diabetes. Admitted for regular monitoring post-minor-cardiac-stress.',
    date: '5/18/2026'
  },
  {
    id: 'PID-9821',
    name: 'Rina Begum',
    age: 36,
    gender: 'Female',
    mobile: '01823456789',
    guardian: 'Abul Kashem',
    relation: 'Father',
    blood: 'O+',
    type: 'OPD (Outpatient)',
    bed: 'None',
    emergency: '01855566677',
    history: 'Severe abdominal pain. Scheduled minor abdominal ultrasound checklist.',
    date: '5/20/2026'
  },
  {
    id: 'PID-4321',
    name: 'Tahmid Ahmed',
    age: 12,
    gender: 'Male',
    mobile: '01934567890',
    guardian: 'Sultan Ahmed',
    relation: 'Father',
    blood: 'B+',
    type: 'IPD (Indoor Patient)',
    bed: 'ICU Bed 2',
    emergency: '01988899900',
    history: 'Admitted under critical pediatric fever status. Oxygen saturation stable.',
    date: '5/19/2026'
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'DOC-101',
    name: 'Amina Rahman',
    spec: 'Cardiology',
    time: '05:00 PM - 09:00 PM',
    fees: 1000
  },
  {
    id: 'DOC-102',
    name: 'Sajid Hasan',
    spec: 'Neurology',
    time: '06:00 PM - 08:30 PM',
    fees: 1200
  },
  {
    id: 'DOC-103',
    name: 'Farhana Yasmin',
    spec: 'Pediatrics',
    time: '10:00 AM - 01:00 PM',
    fees: 800
  }
];

export const initialStaff: Staff[] = [
  {
    id: 'STF-5001',
    name: 'Nur Jahan Begum',
    role: 'Nurse',
    shift: 'Day (8 AM - 4 PM)',
    salary: 22000,
    status: 'Present'
  },
  {
    id: 'STF-5002',
    name: 'Selim Uddin',
    role: 'Ward Boy',
    shift: 'Night (12 AM - 8 AM)',
    salary: 15000,
    status: 'Present'
  },
  {
    id: 'STF-5003',
    name: 'Mizanur Rahman',
    role: 'Receptionist',
    shift: 'Evening (4 PM - 12 AM)',
    salary: 18000,
    status: 'Present'
  }
];

export const initialMedicines: Medicine[] = [
  {
    name: 'Paracetamol 500mg',
    batch: 'B-PR882',
    qty: 150,
    price: 5
  },
  {
    name: 'Amoxicillin 250mg',
    batch: 'B-AM201',
    qty: 8,
    price: 15
  },
  {
    name: 'Metformin 850mg',
    batch: 'B-MT119',
    qty: 200,
    price: 8
  },
  {
    name: 'Omeprazole 20mg',
    batch: 'B-OM545',
    qty: 5,
    price: 7
  }
];

export const initialBeds: Bed[] = [
  { id: 'Cabin 101', type: 'Deluxe', status: 'Available' },
  { id: 'Cabin 102', type: 'Deluxe', status: 'Occupied' },
  { id: 'Cabin 103', type: 'General', status: 'Available' },
  { id: 'ICU Bed 1', type: 'Critical Care', status: 'Available' },
  { id: 'ICU Bed 2', type: 'Critical Care', status: 'Occupied' },
  { id: 'Ward Bed A', type: 'General', status: 'Available' },
  { id: 'Ward Bed B', type: 'General', status: 'Available' }
];

export const initialBills: Bill[] = [
  {
    invoice: 'INV-82190',
    patientId: 'PID-2841',
    patientName: 'Anisur Rahman',
    patientMobile: '01712345678',
    date: '5/18/2026',
    total: 5200,
    isDischarged: false,
    dischargeNotes: '',
    dispensedMedicines: [
      { name: 'Paracetamol 500mg', qty: 20, unitPrice: 5, subtotal: 100 },
      { name: 'Metformin 850mg', qty: 10, unitPrice: 8, subtotal: 80 }
    ],
    breakdown: { bed: 2500, doc: 1000, ot: 0, test: 1540, med: 180 }
  },
  {
    invoice: 'INV-45129',
    patientId: 'PID-9821',
    patientName: 'Rina Begum',
    patientMobile: '01823456789',
    date: '5/20/2026',
    total: 2000,
    isDischarged: true,
    dischargeNotes: 'Discharged under healthy stable recovery conditions. Prescribed standard post-clinical resting routine.',
    dispensedMedicines: [],
    breakdown: { bed: 0, doc: 1200, ot: 0, test: 800, med: 0 }
  }
];

export const initialAppointments: Appointment[] = [
  {
    token: 'TK-101',
    name: 'Jasmin Ara',
    doc: 'Dr. Sajid Hasan (Neurology)',
    date: '2026-05-20'
  },
  {
    token: 'TK-102',
    name: 'Kamrul Islam',
    doc: 'Dr. Amina Rahman (Cardiology)',
    date: '2026-05-21'
  }
];
