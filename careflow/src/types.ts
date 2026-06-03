export interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  oxygen: string;
  weight: string;
  pain: string;
}

export interface Dispensation {
  medicineName: string;
  qty: number;
  price: number;
  billInvoice: string | null;
  isRestored?: boolean;
}

export interface TimelineEvent {
  status: string;
  date: string;
  time: string;
  updatedBy: string;
  remarks: string;
  signature?: string | null;
  dispensation?: Dispensation | null;
}

export interface Patient {
  id: string;
  uhid: string;
  name: string;
  age: number;
  gender: string;
  blood: string;
  mobile: string;
  altMobile: string;
  address: string;
  guardian: string;
  guardianMobile: string;
  aadhar: string;
  insurance: string;
  emergency: string;
  history: string;
  date: string;
  type: string; // "OPD (Outpatient)" or "IPD (Indoor Patient)"
  bed: string;  // "None" or cabin id
  condition: string; // "Stable", "Observation", "Serious", "Critical", "Discharged"
  vitals?: Vitals;
  timeline?: TimelineEvent[];
  packageAmount?: number;
  referBy?: string;
  commissionType?: "amount" | "percentage";
  commissionValue?: number;
  docId?: string;
  appointmentTime?: string;
  appointmentCancelled?: boolean;
  opdOthersAmount?: number;
  opdDoctorFees?: number;
}

export interface PregnancyRecord {
  id: string;
  patientId: string;
  motherName: string;
  husbandName: string;
  age: number;
  bloodGroup: string;
  phone: string;
  address: string;
  aadhaar: string;
  emergencyContact: string;
  
  lmp: string;
  edd: string;
  gravida: number;
  para: number;
  abortionHistory: number;
  previousCesarean: number;
  isHighRisk: boolean;
  
  riskFactors: string[];
  status: 'Active' | 'Delivered' | 'Discharged';
}

export interface PregnancyFollowUp {
  id: string;
  pregnancyId: string;
  date: string;
  weight: number;
  bloodPressure: string;
  babyMovement: string;
  ultrasoundNotes: string;
  labNotes?: string;
  doctorNotes: string;
}

export interface DeliveryRecord {
  id: string;
  pregnancyId: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: string;
  doctorName: string;
  otRoom: string;
  complications: string;
  deliveryNotes: string;
  dischargeSummary: string;
}

export interface ChildRecord {
  id: string;
  pregnancyId: string;
  motherId: string;
  deliveryId: string;
  babyName: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthWeight: number;
  height: number;
  bloodGroup: string;
  apgarScore: string;
  birthMark: string;
  nicuRequired: boolean;
}

export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineName: string;
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'Completed';
}

export interface Doctor {
  id: string;
  name: string;
  spec: string;
  time: string;
  fees: number;
}

export interface Bed {
  id: string;
  type: string;
  status: string; // "Occupied" or "Available"
  chargeAmount?: number;
}

export interface Medicine {
  name: string;
  batch: string;
  qty: number;
  price: number;
  date: string;
  buyPrice?: number;
  salePrice?: number;
}

export interface BillDetailItem {
  id: number;
  type: string;
  name: string;
  qty: number;
  unitPrice: number;
  selectType: string;
}

export interface Bill {
  invoice: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  date: string;
  total: number;
  isDischarged?: boolean;
  dischargeNotes?: string;
  dispensedMedicines?: BillDetailItem[]; // also holds general billing lines
  breakdown?: {
    reg?: number;
    bed?: number;
    doc?: number;
    test?: number;
    med?: number;
    other?: number;
    discount?: number;
    tax?: number;
    ot?: number;
    extraMed?: number;
    nursing?: number;
    anesthesia?: number;
    advance?: number;
  };
  paymentMode: string; // "CASH", "CARD", "ONLINE", "HEALTH_CARD"
  healthCardType?: string;
  cashAmount?: number;
  upiAmount?: number;
  subtotal?: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  shift: string;
  salary: number;
  status: string; // "Present", "Absent", "On Leave"
}

export interface User {
  id?: string;
  username: string;
  password?: string;
  name: string;
  role: string;
  patientId?: string;
}

export interface LabTestMaster {
  id: string;
  name: string;
  category: string;
  price: number;
  sampleType: string;
}

export interface LabPackage {
  id: string;
  name: string;
  tests: string[];
  price: number;
}

export interface DistributionRecord {
  id: string;
  date: string;
  time: string;
  purpose: string; // "Doctor", "Referral Commission", "Others"
  amount: number;
  details: string;
  status?: "Active" | "Canceled";
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  tests: string[];
  packageId: string | null;
  sampleType: string;
  sampleCollected: boolean;
  token: string;
  status: string; // "TEST PROCESSING", "REPORT READY", "BILL GENERATED"
  results: string;
  verified: boolean;
  extraCharges: number;
  extraRemarks?: string;
  packageDiscount: number;
  billTotal: number;
  billPrinted?: boolean;
  date: string;
  signature?: string;
  remarks?: string;
}
