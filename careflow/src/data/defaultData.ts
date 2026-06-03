import { Patient, Doctor, Bed, Medicine, Bill, Staff, User, LabTestMaster, LabPackage } from "../types";

export const todayStr = new Date().toISOString().split("T")[0];

export const generateDemoPatients = (): Patient[] => {
  const raw = [
    {
      name: "Anisur Rahman",
      age: 45,
      gender: "Male",
      mobile: "01712345678",
      blood: "A+",
      bed: "Cabin 101",
      history: "Post stroke cardiovascular monitoring",
      condition: "Stable",
    },
    {
      name: "Rina Begum",
      age: 36,
      gender: "Female",
      mobile: "01823456789",
      blood: "O+",
      bed: "None",
      history: "Refractory migraine aura diagnostic review",
      condition: "Stable",
    },
    {
      name: "Tahmid Ahmed",
      age: 12,
      gender: "Male",
      mobile: "01934567890",
      blood: "B+",
      bed: "ICU Bed 1",
      history: "Pediatric pneumonia respiratory control",
      condition: "Critical",
    },
    {
      name: "Lipi Chowdhury",
      age: 29,
      gender: "Female",
      mobile: "01523456781",
      blood: "O-",
      bed: "Cabin 102",
      history: "Maternal third trimester preeclampsia audit",
      condition: "Observation",
    },
    {
      name: "Kamal Uddin",
      age: 52,
      gender: "Male",
      mobile: "01755566677",
      blood: "B-",
      bed: "Ward Bed A",
      history: "Chronic hypertension therapeutic management",
      condition: "Stable",
    },
    {
      name: "Salma Begum",
      age: 43,
      gender: "Female",
      mobile: "01655544433",
      blood: "AB+",
      bed: "Ward Bed B",
      history: "Diabetes Ketoacidosis recovery",
      condition: "Observation",
    },
    {
      name: "Tareq Rahman",
      age: 31,
      gender: "Male",
      mobile: "01811122233",
      blood: "A-",
      bed: "None",
      history: "Orthopedic soft tissue strain therapy",
      condition: "Stable",
    },
    {
      name: "Nusrat Jahan",
      age: 24,
      gender: "Female",
      mobile: "01944455566",
      blood: "B+",
      bed: "None",
      history: "Acute tonsillitis clinical guidance",
      condition: "Stable",
    },
    {
      name: "Belal Hossain",
      age: 65,
      gender: "Male",
      mobile: "01722233344",
      blood: "O+",
      bed: "ICU Bed 2",
      history: "Acute myocardial stress stabilization",
      condition: "Serious",
    },
    {
      name: "Moriom Khatun",
      age: 58,
      gender: "Female",
      mobile: "01833344455",
      blood: "O-",
      bed: "Cabin 103",
      history: "Chronic obstructive pulmonary distress",
      condition: "Observation",
    },
  ];

  return raw.map((p, idx) => {
    const id = `PID-${2001 + idx}`;
    const dates = [
      todayStr,
      "2026-05-19",
      "2026-05-20",
      "2026-05-21",
      "2026-05-22",
      "2026-05-23",
    ];
    const registrationDate = dates[idx % dates.length];
    return {
      id,
      uhid: `UHID-992${102 + idx}`,
      name: p.name,
      age: p.age,
      gender: p.gender,
      blood: p.blood,
      mobile: p.mobile,
      altMobile: "01555544433",
      address: "Dhaka, Bangladesh",
      guardian: "Mubashshir Rahman",
      guardianMobile: "01999988877",
      aadhar: `7732-4821-290${idx}`,
      insurance:
        p.age > 50
          ? "Bupa Platinum Healthcare Ltd"
          : "MetLife Secure Primary Assurance",
      emergency: "01811223344",
      history: p.history,
      date: registrationDate,
      type: p.bed === "None" ? "OPD (Outpatient)" : "IPD (Indoor Patient)",
      bed: p.bed,
      condition: p.condition,
      vitals: {
        bp: p.condition === "Critical" ? "145/95" : "120/80",
        pulse: p.condition === "Critical" ? "105" : "74",
        temp: p.condition === "Critical" ? "101.5" : "98.4",
        oxygen: p.condition === "Critical" ? "92" : "98",
        weight: "72",
        pain: p.condition === "Critical" ? "8" : "2",
      },
      timeline: [
        {
          status: "Patient Registered",
          date: registrationDate,
          time: "09:15 AM",
          updatedBy: "Mizanur Rahman (Receptionist)",
          remarks: "Files initialized.",
        },
        ...(p.bed !== "None"
          ? [
              {
                status: "Admitted",
                date: registrationDate,
                time: "10:30 AM",
                updatedBy: "Nur Jahan Begum (Nurse)",
                remarks: "IPD bed request authorized.",
              },
              {
                status: "Bed Allocated",
                date: registrationDate,
                time: "11:00 AM",
                updatedBy: "Nur Jahan Begum (Nurse)",
                remarks: `Assigned ward location ${p.bed}`,
              },
              {
                status: "Nurse Assessment",
                date: registrationDate,
                time: "11:30 AM",
                updatedBy: "Nur Jahan Begum (Nurse)",
                remarks: `Vitals registered. Patient is ${p.condition}`,
              },
            ]
          : []),
      ],
    };
  });
};

export const defaultDoctors: Doctor[] = [
  {
    id: "DOC-101",
    name: "Amina Rahman",
    spec: "Cardiology",
    time: "05:00 PM - 09:00 PM",
    fees: 1000,
  },
  {
    id: "DOC-102",
    name: "Sajid Hasan",
    spec: "Neurology",
    time: "06:00 PM - 08:30 PM",
    fees: 1200,
  },
  {
    id: "DOC-103",
    name: "Farhana Yasmin",
    spec: "Pediatrics",
    time: "10:00 AM - 01:00 PM",
    fees: 800,
  },
];

export const defaultBeds: Bed[] = [
  { id: "Cabin 101", type: "Deluxe", status: "Occupied", chargeAmount: 3000 },
  { id: "Cabin 102", type: "Deluxe", status: "Occupied", chargeAmount: 3000 },
  { id: "Cabin 103", type: "General", status: "Occupied", chargeAmount: 1200 },
  { id: "Cabin 104", type: "General", status: "Available", chargeAmount: 1200 },
  { id: "Cabin 105", type: "General", status: "Available", chargeAmount: 1200 },
  { id: "Cabin 106", type: "General", status: "Available", chargeAmount: 1200 },
  { id: "ICU Bed 1", type: "Critical Care", status: "Occupied", chargeAmount: 6000 },
  { id: "ICU Bed 2", type: "Critical Care", status: "Occupied", chargeAmount: 6000 },
  { id: "ICU Bed 3", type: "Critical Care", status: "Available", chargeAmount: 6000 },
  { id: "Ward Bed A", type: "General", status: "Occupied", chargeAmount: 850 },
  { id: "Ward Bed B", type: "General", status: "Occupied", chargeAmount: 850 },
  { id: "Ward Bed C", type: "General", status: "Available", chargeAmount: 850 },
  { id: "Ward Bed D", type: "General", status: "Available", chargeAmount: 850 },
  { id: "Ward Bed E", type: "General", status: "Available", chargeAmount: 850 },
];

export const defaultMedicines: Medicine[] = [
  {
    name: "Paracetamol 500mg",
    batch: "B-PR882",
    qty: 250,
    price: 5,
    buyPrice: 3.8,
    salePrice: 5,
    date: "2026-05-10",
  },
  {
    name: "Amoxicillin 250mg",
    batch: "B-AM201",
    qty: 8,
    price: 15,
    buyPrice: 11.5,
    salePrice: 15,
    date: "2026-05-12",
  }, 
  {
    name: "Omeprazole 20mg",
    batch: "B-OM545",
    qty: 3,
    price: 7,
    buyPrice: 5.2,
    salePrice: 7,
    date: "2026-05-15",
  }, 
];

export const defaultBills: Bill[] = [
  {
    invoice: "INV-90201",
    patientId: "PID-2001",
    patientName: "Anisur Rahman",
    patientMobile: "01712345678",
    date: todayStr,
    total: 4700,
    isDischarged: false,
    dischargeNotes: "",
    dispensedMedicines: [
      { id: 1, type: "med", name: "Paracetamol 500mg", qty: 20, unitPrice: 5, selectType: "Medicine Fee (ওষুধ ফি)" },
    ],
    breakdown: { bed: 2500, doc: 1000, other: 0, test: 1100, med: 100 },
    paymentMode: "CASH",
    subtotal: 4700,
  },
];

export const defaultStaff: Staff[] = [
  {
    id: "STF-5001",
    name: "Nur Jahan Begum",
    role: "Nurse",
    shift: "Day (8 AM - 4 PM)",
    salary: 22000,
    status: "Present",
  },
  {
    id: "STF-5002",
    name: "Selim Uddin",
    role: "Ward Boy",
    shift: "Night (12 AM - 8 AM)",
    salary: 15000,
    status: "Present",
  },
];

export const defaultUsers: User[] = [
  {
    id: "USER-1",
    username: "admin",
    password: "password123",
    name: "Super Admin",
    role: "SuperAdmin",
  },
  {
    id: "USER-2",
    username: "receptionist",
    password: "password123",
    name: "Front Desk Key",
    role: "Receptionist",
  },
  {
    id: "USER-3",
    username: "pid-2001",
    password: "password123",
    name: "Anisur Rahman",
    role: "Patient",
    patientId: "PID-2001",
  },
  {
    id: "USER-4",
    username: "pid-2002",
    password: "password123",
    name: "Rina Begum",
    role: "Patient",
    patientId: "PID-2002",
  },
  {
    id: "USER-5",
    username: "doctor",
    password: "password123",
    name: "Dr. Amina Rahman",
    role: "Doctor",
  },
  {
    id: "USER-6",
    username: "nurse",
    password: "password123",
    name: "Nur Jahan Begum",
    role: "Nurse",
  },
  {
    id: "USER-7",
    username: "labtech",
    password: "password123",
    name: "Kabir Sen (Lab Tech)",
    role: "Lab",
  },
];

export const defaultLabCategories: string[] = [
  "Hematology (হেমাটোলজি)",
  "Biochemistry (বায়োকেমিস্ট্রি)",
  "Cardiology (কার্ডিওলজি)",
  "Radiology (রেডিওলজি)",
  "Immunology (ইমিউনোলজি)",
];

export const defaultLabTestsMaster: LabTestMaster[] = [
  { id: "TEST-101", name: "Complete Blood Count (CBC)", category: "Hematology (হেমাটোলজি)", price: 400, sampleType: "Blood (রক্ত)" },
  { id: "TEST-102", name: "Serum Lipid Profile", category: "Biochemistry (বায়োকেমিস্ট্রি)", price: 800, sampleType: "Blood (রক্ত)" },
  { id: "TEST-103", name: "Fasting Blood Glucose", category: "Biochemistry (বায়োকেমিস্ট্রি)", price: 150, sampleType: "Blood (রক্ত)" },
  { id: "TEST-104", name: "ECG Electrophysical Screen", category: "Cardiology (কার্ডিওলজি)", price: 500, sampleType: "None (নন-ইনভেসিভ)" },
  { id: "TEST-105", name: "Abdominal Ultrasound", category: "Radiology (রেডিওলজি)", price: 1200, sampleType: "None (নন-ইনভেসিভ)" },
  { id: "TEST-106", name: "Thyroid Panel (T3, T4, TSH)", category: "Immunology (ইমিউনোলজি)", price: 900, sampleType: "Blood (রক্ত)" },
];

export const defaultLabPackages: LabPackage[] = [
  { id: "PKG-501", name: "Executive Health Checkup", tests: ["TEST-101", "TEST-102", "TEST-103"], price: 1100 },
  { id: "PKG-502", name: "Cardiac Protection Package", tests: ["TEST-102", "TEST-104"], price: 1000 },
];

export const defaultLabReportTemplates: Record<string, string> = {
  "TEST-101": "Hemoglobin: 13.5 - 17.5 g/dL\nWhite Blood Cells (WBC): 4,000 - 11,000 /mcL\nPlatelet Count: 150,000 - 450,000 /mcL\nRed Blood Cells (RBC): 4.5 - 5.9 million/mcL",
  "TEST-102": "Total Cholesterol: < 200 mg/dL\nTriglycerides: < 150 mg/dL\nHDL Cholesterol: > 40 mg/dL\nLDL Cholesterol: < 100 mg/dL",
  "TEST-103": "Fasting Range: 70 - 99 mg/dL\nImpaired Glucose (Prediabetes): 100 - 125 mg/dL\nDiabetic Range: >= 126 mg/dL",
  "TEST-104": "Heart Rate: 72 bpm\nPR Interval: 0.16s\nQRS Duration: 0.08s\nInterpretation: Normal Sinus Rhythm, no significant ST-T changes.",
  "TEST-105": "Liver: Normal size and echotexture. No focal lesion.\nGallbladder: Well-distended, no stones.\nKidneys: Both kidneys normal size, shape, position.\nSpleen & Pancreas: Within standard normal limits.",
  "TEST-106": "Triiodothyronine (T3): 80 - 200 ng/dL\nThyroxine (T4): 5.4 - 11.5 mcg/dL\nThyroid Stimulating Hormone (TSH): 0.45 - 4.5 uIU/mL",
};
