export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  guardian: string;
  relation: string;
  blood: string;
  type: 'OPD (Outpatient)' | 'IPD (Indoor Patient)';
  bed: string;
  emergency: string;
  history: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  spec: string;
  time: string;
  fees: number;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Nurse' | 'Ward Boy' | 'Receptionist' | 'Accountant';
  shift: 'Day (8 AM - 4 PM)' | 'Evening (4 PM - 12 AM)' | 'Night (12 AM - 8 AM)';
  salary: number;
  status: 'Present' | 'On Leave';
}

export interface Medicine {
  name: string;
  batch: string;
  qty: number;
  price: number;
}

export interface DispensedMedicine {
  name: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface BillBreakdown {
  bed: number;
  doc: number;
  ot: number;
  test: number;
  med: number;
}

export interface Bill {
  invoice: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  total: number;
  date: string;
  isDischarged: boolean;
  dischargeNotes: string;
  dispensedMedicines: DispensedMedicine[];
  breakdown: BillBreakdown;
}

export interface Bed {
  id: string;
  type: string;
  status: 'Available' | 'Occupied';
}

export interface Appointment {
  token: string;
  name: string;
  doc: string;
  date: string;
}
