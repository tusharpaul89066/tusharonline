import React, { useState } from "react";
import { useFirebaseCollection } from "./hooks/useFirebaseState";
import {
  Activity,
  Compass,
  UserPlus,
  CalendarDays,
  BedDouble,
  Stethoscope,
  Users,
  ShieldAlert,
  GraduationCap,
  FlaskConical,
  Pill,
  BaggageClaim,
  Receipt,
  BookOpen,
  FolderLock,
  Baby,
  ShieldCheck,
  Trash2,
  Lock,
} from "lucide-react";

import {
  generateDemoPatients,
  defaultDoctors,
  defaultBeds,
  defaultMedicines,
  defaultBills,
  defaultStaff,
  defaultUsers,
  defaultLabCategories,
  defaultLabTestsMaster,
  defaultLabPackages,
  defaultLabReportTemplates,
} from "./data/defaultData";

import { Patient, Doctor, Bed, Medicine, Bill, Staff, User, LabTest, LabTestMaster, LabPackage, PregnancyRecord, PregnancyFollowUp, DeliveryRecord, ChildRecord, VaccinationRecord, DistributionRecord } from "./types";

// Import Modular Tabs
import DashboardTab from "./components/DashboardTab";
import PatientRegistrationTab from "./components/PatientRegistrationTab";
import OpdAppointmentsTab from "./components/OpdAppointmentsTab";
import IpdAdmissionsTab from "./components/IpdAdmissionsTab";
import LiveJourneyTab from "./components/LiveJourneyTab";
import DoctorManagementTab from "./components/DoctorManagementTab";
import StaffManagementTab from "./components/StaffManagementTab";
import NurseAppModuleTab from "./components/NurseAppModuleTab";
import DoctorAppModuleTab from "./components/DoctorAppModuleTab";
import LabManagementDesk from "./components/LabManagementDesk";
import PharmacyStoreTab from "./components/PharmacyStoreTab";
import BedsCabinStayTab from "./components/BedsCabinStayTab";
import BillingAccountsTab from "./components/BillingAccountsTab";
import ReportsCenterTab from "./components/ReportsCenterTab";
import PatientPortalTab from "./components/PatientPortalTab";
import UserManagementTab from "./components/UserManagementTab";
import MaternityModuleTab from "./components/MaternityModuleTab";
import DistributeAmountTab from "./components/DistributeAmountTab";
import ResetDeleteDataTab from "./components/ResetDeleteDataTab";
import PrintOverlays from "./components/PrintOverlays";
import LoginScreen from "./components/LoginScreen";
export default function App() {
  // Global States Initializations
  const [patients, setPatients] = useFirebaseCollection<Patient>("patients", generateDemoPatients());
  const [doctors, setDoctors] = useFirebaseCollection<Doctor>("doctors", defaultDoctors);
  const [beds, setBeds] = useFirebaseCollection<Bed>("beds", defaultBeds);
  const [medicines, setMedicines] = useState<Medicine[]>(() => defaultMedicines); // Keeping non-critical state local for speed, per limit
  const [bills, setBills] = useFirebaseCollection<Bill>("bills", defaultBills);
  const [staff, setStaff] = useState<Staff[]>(() => defaultStaff);
  const [users, setUsers] = useState<User[]>(() => defaultUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Lab Module States
  const [labCategories, setLabCategories] = useState<string[]>(() => defaultLabCategories);
  const [labTestsMaster, setLabTestsMaster] = useState<LabTestMaster[]>(() => defaultLabTestsMaster);
  const [labPackages, setLabPackages] = useState<LabPackage[]>(() => defaultLabPackages);
  const [labReportsTemplates, setLabReportsTemplates] = useState<Record<string, string>>(() => defaultLabReportTemplates);
  const [labTests, setLabTests] = useState<LabTest[]>([]);

  // Lifted Maternity States
  const [pregnancies, setPregnancies] = useState<PregnancyRecord[]>([
    {
      id: "PREG-1001", patientId: "PID-2002", motherName: "Rina Begum", husbandName: "Anisur Rahman",
      age: 36, bloodGroup: "O+", phone: "01823456789", address: "Mirpur, Dhaka", aadhaar: "NID-987654321", emergencyContact: "01711223344",
      lmp: "2025-09-10", edd: "2026-06-17", gravida: 2, para: 1, abortionHistory: 0, previousCesarean: 0,
      isHighRisk: true, riskFactors: ["Diabetes"], status: "Active"
    },
    {
      id: "PREG-1002", patientId: "PID-2004", motherName: "Lipi Chowdhury", husbandName: "Rafiqul Islam",
      age: 29, bloodGroup: "O-", phone: "01523456781", address: "Dhanmondi, Dhaka", aadhaar: "NID-123456789", emergencyContact: "01611223344",
      lmp: "2025-11-05", edd: "2026-08-12", gravida: 1, para: 0, abortionHistory: 0, previousCesarean: 0,
      isHighRisk: false, riskFactors: [], status: "Delivered"
    }
  ]);
  const [followUps, setFollowUps] = useState<PregnancyFollowUp[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([
    {
      id: "DEL-101", pregnancyId: "PREG-1002", deliveryDate: "2026-05-20", deliveryTime: "10:30", 
      deliveryType: "Normal", doctorName: "Dr. Sarah Ahmed", otRoom: "Labour Room 1", 
      complications: "None", deliveryNotes: "Healthy delivery, baby cried immediately.", dischargeSummary: ""
    }
  ]);
  const [children, setChildren] = useState<ChildRecord[]>([
    {
      id: "KID-501", pregnancyId: "PREG-1002", motherId: "PID-2004", deliveryId: "DEL-101",
      babyName: "Baby of Lipi", gender: "Female", birthDate: "2026-05-20", birthTime: "10:30",
      birthWeight: 2.8, height: 48, birthGroup: "O+", apgarScore: "8/10", birthMark: "None", nicuRequired: false
    }
  ]);
  const [vaccines, setVaccines] = useState<VaccinationRecord[]>([
    { id: "VAC-01", childId: "KID-501", vaccineName: "BCG", dueDate: "2026-05-20", completedDate: "2026-05-21", status: "Completed" },
    { id: "VAC-02", childId: "KID-501", vaccineName: "OPV 0", dueDate: "2026-05-20", completedDate: "2026-05-21", status: "Completed" },
    { id: "VAC-03", childId: "KID-501", vaccineName: "Hepatitis B 1", dueDate: "2026-05-20", status: "Pending" }
  ]);
  const [sharedViewedMother, setSharedViewedMother] = useState<PregnancyRecord | null>(null);
  const [sharedActiveSubTab, setSharedActiveSubTab] = useState<"dashboard" | "registration" | "mothers" | "children">("dashboard");

  // Navigation & Control States
  const [activeTab, setActiveTab] = useState<string>("liveTimeline");
  const [selectedTrackingPatient, setSelectedTrackingPatient] = useState<string>("PID-2001");
  const [editModal, setEditModal] = useState<{ type: string; data: any } | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [viewingToken, setViewingToken] = useState<any>(null);
  const [activeInvoice, setActiveInvoice] = useState<Bill | null>(null);

  // Helper Timeline logger
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);

  const pushTimelineEvent = (
    patientId: string,
    status: string,
    updatedBy: string,
    remarks: string,
    signature: string | null = null
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            timeline: [
              ...(p.timeline || []),
              {
                status,
                date: new Date().toISOString().split("T")[0],
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                updatedBy,
                remarks,
                signature,
              },
            ],
          };
        }
        return p;
      })
    );
  };
 
  // Restoration logic for accidental dispensation (ভুল সংশোধন রিস্টোর প্রযুক্তি)
  const restoreMedicineDispensation = (patientId: string, timelineEventIndex: number) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId && p.timeline && p.timeline[timelineEventIndex]) {
          const updatedTimeline = [...p.timeline];
          const event = updatedTimeline[timelineEventIndex];
          if (event.dispensation && !event.dispensation.isRestored) {
            // Mark as restored in timeline
            event.dispensation = {
              ...event.dispensation,
              isRestored: true,
            };
            const { medicineName, qty, billInvoice } = event.dispensation;

            // 1. Revert global stock pharmacy
            setMedicines((mPrev) =>
              mPrev.map((m) =>
                m.name === medicineName ? { ...m, qty: m.qty + qty } : m
              )
            );

            // 2. Revert cost ledger invoice bill
            if (billInvoice) {
              setBills((bPrev) =>
                bPrev.map((b) => {
                  if (b.invoice === billInvoice) {
                    const updatedDisp = (b.dispensedMedicines || []).filter(
                      (dm) => dm.name !== medicineName
                    );
                    const costAmount = event.dispensation!.price * qty;
                    const updatedMedTotal = Math.max(0, (b.breakdown?.med || 0) - costAmount);
                    const updatedBreakdown = { ...b.breakdown, med: updatedMedTotal };
                    const currentSub = 
                      (b.breakdown?.bed || 0) +
                      (b.breakdown?.doc || 0) +
                      (b.breakdown?.ot || 0) +
                      (b.breakdown?.test || 0) +
                      updatedMedTotal +
                      500;
                    const discAmount = currentSub * (10 / 100);
                    const gstAmount = (currentSub - discAmount) * (5 / 100);

                    return {
                      ...b,
                      dispensedMedicines: updatedDisp,
                      breakdown: updatedBreakdown,
                      total: Math.round(currentSub - discAmount + gstAmount),
                    };
                  }
                  return b;
                })
              );
            }

            event.remarks = `${event.remarks} (RESTORED - Accidental dispensation cancelled fully in ledger and stocks reinstated).`;
            alert("ঔষধ বুকিং বাতিল ও রিস্টোর করা হয়েছে!\n(Accidental medicine dispensation restored successfully!)");
          }
          return { ...p, timeline: updatedTimeline };
        }
        return p;
      })
    );
  };

  // Helper spreadsheet export downloader
  const handleExportCSV = (filename: string, columns: any[], dataList: any[]) => {
    const headers = columns.map(col => col.label).join(",");
    const rows = dataList.map((row) =>
      columns
        .map((col) => {
          let val = col.value(row);
          if (typeof val === "string") {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const get3DIcon = (id: string, active: boolean) => {
    // We suppress the generic icons' backgrounds so they use the overall button color scheme.
    const baseOuter = `relative w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 border `;
    
    let iconElement = null;
    switch (id) {
      case "dashboard": iconElement = <Compass className="w-4 h-4" />; break;
      case "patients": iconElement = <UserPlus className="w-4 h-4" />; break;
      case "appointments": iconElement = <CalendarDays className="w-4 h-4" />; break;
      case "admissions": iconElement = <BedDouble className="w-4 h-4" />; break;
      case "liveTimeline": iconElement = <Activity className={active ? "w-4 h-4 animate-pulse" : "w-4 h-4"} />; break;
      case "doctors": iconElement = <Stethoscope className="w-4 h-4" />; break;
      case "staff": iconElement = <Users className="w-4 h-4" />; break;
      case "maternity": iconElement = <Baby className="w-4 h-4" />; break;
      case "nurseDesk": iconElement = <ShieldAlert className="w-4 h-4" />; break;
      case "doctorPrescribe": iconElement = <GraduationCap className="w-4 h-4" />; break;
      case "labDesk": iconElement = <FlaskConical className="w-4 h-4" />; break;
      case "pharmacy": iconElement = <Pill className="w-4 h-4" />; break;
      case "beds": iconElement = <BaggageClaim className="w-4 h-4" />; break;
      case "billing": iconElement = <Receipt className="w-4 h-4" />; break;
      case "reports": iconElement = <BookOpen className="w-4 h-4" />; break;
      case "distributeAmount": iconElement = <Receipt className="w-4 h-4" />; break;
      case "portal": iconElement = <FolderLock className="w-4 h-4" />; break;
      case "userManagement": iconElement = <ShieldCheck className="w-4 h-4" />; break;
      case "resetDeleteData": iconElement = <Trash2 className="w-4 h-4" />; break;
      default: iconElement = <Compass className="w-4 h-4" />; break;
    }

    return (
      <div className={baseOuter + (active ? "border-[#a38a53] text-[#1a3338]" : "border-[#2d555c] text-[#c3d0d3]")}>
        <div className="absolute top-0.5 left-1 w-1 h-0.5 bg-white/10 rounded-full"></div>
        {iconElement}
      </div>
    );
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard Summary" },
    { id: "patients", label: "Patient Registration" },
    { id: "appointments", label: "OPD Appointments" },
    { id: "admissions", label: "IPD Admissions" },
    { id: "liveTimeline", label: "Live Patient Journey" },
    { id: "doctors", label: "Doctor Management" },
    { id: "staff", label: "Nurse & Worker Management" },
    { id: "maternity", label: "Maternity Module" },
    { id: "nurseDesk", label: "Nurse App Module" },
    { id: "doctorPrescribe", label: "Doctor App Module" },
    { id: "labDesk", label: "Lab Management" },
    { id: "pharmacy", label: "Pharmacy Management" },
    { id: "beds", label: "Bed & Cabin stay" },
    { id: "billing", label: "Billing & Accounts" },
    { id: "reports", label: "Reports Center" },
    { id: "distributeAmount", label: "Distribute Amount" },
    { id: "portal", label: "Patient Portal" },
    { id: "userManagement", label: "User Management" },
    { id: "resetDeleteData", label: "Reset and delete data -" },
  ];

  const isTabAllowedForRole = (tabId: string, role: string | undefined): boolean => {
    if (!role) return false;
    const r = role.toLowerCase();
    if (r.includes("admin")) return true;
    
    if (r === "receptionist") {
      const forbidden = ["doctorPrescribe", "nurseDesk", "labDesk", "pharmacy", "staff", "doctors", "userManagement", "resetDeleteData"];
      return !forbidden.includes(tabId);
    }
    
    if (r === "lab") {
      return tabId === "labDesk";
    }
    
    return true; // Default fallback for other roles
  };

  React.useEffect(() => {
    if (currentUser) {
      if (!isTabAllowedForRole(activeTab, currentUser.role)) {
        const allowedTabs = navigationItems.filter(item => isTabAllowedForRole(item.id, currentUser.role));
        if (allowedTabs.length > 0) {
          setActiveTab(allowedTabs[0].id);
        }
      }
    }
  }, [currentUser, activeTab]);

  if (!currentUser) {
    return <LoginScreen users={users} patients={patients} bills={bills} onLogin={(u) => { 
      setCurrentUser(u); 
      // Do not setActiveTab to dashboard here, let the useEffect handle it if dashboard is forbidden
    }} />;
  }

  return (
    <div id="careflow-app" className="min-h-screen bg-transparent flex font-sans text-slate-800 overflow-hidden">
      
      {/* Left Sidebar precisely matching reference layout */}
      <aside className="w-[280px] bg-[#1a3238] text-[#c3d0d3] min-h-screen border-r-[4px] border-[#0f1d21] flex flex-col shrink-0 overflow-visible select-none z-10 shadow-[10px_0_15px_rgba(0,0,0,0.1)]">
        
        {/* Logo and Branding header */}
        <div className="px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full border border-[#2d555c] bg-[#1a3338] flex items-center justify-center relative shadow-sm" style={{ borderBottom: "3px solid #0d1a1c" }}>
              <Activity className="h-5 w-5 text-[#E6D4AA]" />
            </div>
 
            <div>
              <h1 className="text-xl font-black tracking-widest text-[#FDFDF8] leading-none uppercase font-sans">
                CareFlow
              </h1>
              <p className="text-[9px] text-[#93a6a9] tracking-[0.2em] uppercase mt-1.5 leading-none font-semibold font-mono">
                Health Systems
              </p>
            </div>
          </div>
        </div>
 
        <div className="px-5 pb-3 text-[10px] uppercase tracking-[0.15em] text-[#C2D0D2] font-bold font-mono">
          Workspace Rooms
        </div>
 
        <nav className="px-3 space-y-1">
          {navigationItems
            .filter((nav) => isTabAllowedForRole(nav.id, currentUser.role))
            .map((nav) => {
            const isNavActive = activeTab === nav.id;
            const isLiveJourney = nav.id === "liveTimeline";
            
            let btnClass = "";
            
            // Retro theme: Active state is gold/sand, inactive is transparent/dark teal
            if (isNavActive) {
                btnClass = "bg-[#D6B876] text-[#1a3338] font-bold shadow-md rounded-xl rounded-r-none border-l-0 -mr-3 pl-4 scale-[1.02]";
            } else {
                btnClass = "text-[#c3d0d3] hover:bg-[#234247] hover:text-[#fff] border-transparent rounded-xl";
            }

            return (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveTab(nav.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all text-xs font-semibold cursor-pointer text-left leading-none ${btnClass}`}
              >
                {get3DIcon(nav.id, isNavActive)}
                <span className="truncate">{nav.label}</span>
              </button>
            );
          })}
        </nav>
 
        <div className="mt-auto p-5 border-t border-[#0e1b1d]">
          <div className="bg-[#101d21] border border-[#2d555c] rounded-xl p-4 shadow-inner">
            <p className="text-[#a6b8b5] text-[9px] uppercase tracking-widest font-extrabold font-mono leading-none">
              Node Database
            </p>
            <h3 className="text-[#e2cd9a] mt-2 font-black font-sans text-xs flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1f8281] animate-pulse"></span>
              ACTIVE
            </h3>
            <p className="text-[#a6b8b5] text-[10px] mt-1.5 font-semibold leading-none">Local Secure Network</p>
          </div>
        </div>
      </aside>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar/Header with Active Operator info */}
        <header className="px-10 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sticky top-0 z-50 select-none shrink-0">
 
          {/* Left part of topbar */}
          <div className="flex items-center gap-4">
            <div className="retro-pill px-4 py-2 flex items-center gap-3 leading-none">
              <div className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E2CD9A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E2CD9A]"></span>
              </div>
              <div className="text-left font-mono mt-0.5">
                <div className="text-[7px] text-[#A6B8B5] font-bold uppercase tracking-[0.2em]">Active Operator</div>
                <div className="text-[10px] text-[#E2CD9A] font-black tracking-widest uppercase flex items-center gap-1.5 mt-1">
                  <span>{currentUser.name}</span>
                  <span className="text-[8px] text-[#A6B8B5]">• {currentUser.role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 justify-end">
            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
              }}
              className="retro-pill px-5 py-2.5 text-[10px] flex items-center gap-2 cursor-pointer"
            >
              <Lock size={12} className="text-[#a6b8b5]" />
              <span>LOGOUT</span>
            </button>

            {currentUser.role.toLowerCase().includes("admin") && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all telemetry data indices back to factory defaults? This resets admissions, registers, and stocks.")) {
                    setPatients(generateDemoPatients());
                    setBeds(defaultBeds);
                    setMedicines(defaultMedicines);
                    setBills(defaultBills);
                    setStaff(defaultStaff);
                    setActiveTab("dashboard");
                    setActiveInvoice(null);
                    setViewingReceipt(null);
                    setViewingToken(null);
                    alert("Database wiped & reinstated (অপারেশনাল ডাটাবেজ পুনঃস্থাপিত করা হয়েছে)!");
                  }
                }}
                className="retro-pill px-5 py-2.5 text-[10px] flex items-center gap-2 cursor-pointer"
              >
                <ShieldAlert size={12} className="text-[#a6b8b5]" />
                <span>RESET DATABASE</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardTab
              patients={patients}
              beds={beds}
              bills={bills}
              medicines={medicines}
              staff={staff}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "patients" && (
            <PatientRegistrationTab
              patients={patients}
              setPatients={setPatients}
              currentUser={currentUser}
              setEditModal={setEditModal}
              pushTimelineEvent={pushTimelineEvent}
              handleExportCSV={handleExportCSV}
            />
          )}

          {activeTab === "appointments" && (
            <OpdAppointmentsTab
              patients={patients}
              setPatients={setPatients}
              doctors={doctors}
              setEditModal={setEditModal}
              pushTimelineEvent={pushTimelineEvent}
              handleExportCSV={handleExportCSV}
              setBills={setBills}
            />
          )}

          {activeTab === "admissions" && (
            <IpdAdmissionsTab
              patients={patients}
              setPatients={setPatients}
              doctors={doctors}
              beds={beds}
              setBeds={setBeds}
              staff={staff}
              setEditModal={setEditModal}
              pushTimelineEvent={pushTimelineEvent}
              handleExportCSV={handleExportCSV}
              currentUser={currentUser}
            />
          )}

          {activeTab === "maternity" && (
            <MaternityModuleTab 
              patients={patients}
              pregnancies={pregnancies}
              setPregnancies={setPregnancies}
              deliveries={deliveries}
              setDeliveries={setDeliveries}
              children={children}
              setChildren={setChildren}
              vaccines={vaccines}
              setVaccines={setVaccines}
              followUps={followUps}
              setFollowUps={setFollowUps}
              pushTimelineEvent={pushTimelineEvent}
              currentUser={currentUser}
              sharedViewedMother={sharedViewedMother}
              setSharedViewedMother={setSharedViewedMother}
              sharedActiveSubTab={sharedActiveSubTab}
              setSharedActiveSubTab={setSharedActiveSubTab}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "liveTimeline" && (
            <LiveJourneyTab
              patients={patients}
              selectedTrackingPatient={selectedTrackingPatient}
              setSelectedTrackingPatient={setSelectedTrackingPatient}
              pregnancies={pregnancies}
              setSharedViewedMother={setSharedViewedMother}
              setSharedActiveSubTab={setSharedActiveSubTab}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "nurseDesk" && (
            <NurseAppModuleTab
              patients={patients}
              setPatients={setPatients}
              medicines={medicines}
              setMedicines={setMedicines}
              bills={bills}
              setBills={setBills}
              currentUser={currentUser}
              pushTimelineEvent={pushTimelineEvent}
              restoreMedicineDispensation={restoreMedicineDispensation}
            />
          )}

          {activeTab === "doctorPrescribe" && (
            <DoctorAppModuleTab
              patients={patients}
              setPatients={setPatients}
              doctors={doctors}
              pushTimelineEvent={pushTimelineEvent}
              currentUser={currentUser}
            />
          )}

          {activeTab === "doctors" && (
            <DoctorManagementTab
              doctors={doctors}
              setDoctors={setDoctors}
            />
          )}

          {activeTab === "staff" && (
            <StaffManagementTab
              staff={staff}
              setStaff={setStaff}
            />
          )}

          {activeTab === "labDesk" && (
            <LabManagementDesk
              patients={patients}
              setPatients={setPatients}
              doctors={doctors}
              beds={beds}
              setBeds={setBeds}
              bills={bills}
              setBills={setBills}
              medicines={medicines}
              setMedicines={setMedicines}
              staff={staff}
              setStaff={setStaff}
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              pushTimelineEvent={pushTimelineEvent}
              setViewingToken={setViewingToken}
              setViewingReceipt={setViewingReceipt}
              labCategories={labCategories}
              setLabCategories={setLabCategories}
              labTestsMaster={labTestsMaster}
              setLabTestsMaster={setLabTestsMaster}
              labPackages={labPackages}
              setLabPackages={setLabPackages}
              labReportsTemplates={labReportsTemplates}
              setLabReportsTemplates={setLabReportsTemplates}
              labTests={labTests}
              setLabTests={setLabTests}
            />
          )}

          {activeTab === "pharmacy" && (
            <PharmacyStoreTab
              patients={patients}
              medicines={medicines}
              setMedicines={setMedicines}
              bills={bills}
              setBills={setBills}
              pushTimelineEvent={pushTimelineEvent}
              currentUser={currentUser}
              handleExportCSV={handleExportCSV}
            />
          )}

          {activeTab === "beds" && (
            <BedsCabinStayTab
              beds={beds}
              setBeds={setBeds}
            />
          )}

          {activeTab === "billing" && (
            <BillingAccountsTab
              patients={patients}
              setPatients={setPatients}
              beds={beds}
              setBeds={setBeds}
              bills={bills}
              setBills={setBills}
              currentUser={currentUser}
              pushTimelineEvent={pushTimelineEvent}
              handleExportCSV={handleExportCSV}
              setActiveInvoice={setActiveInvoice}
            />
          )}

          {activeTab === "reports" && (
            <ReportsCenterTab
              bills={bills}
              patients={patients}
              handleExportCSV={handleExportCSV}
              distributions={distributions}
            />
          )}

          {activeTab === "distributeAmount" && (
            <DistributeAmountTab
              bills={bills}
              patients={patients}
              distributions={distributions}
              setDistributions={setDistributions}
              handleExportCSV={handleExportCSV}
            />
          )}

          {activeTab === "portal" && (
            <PatientPortalTab
              patients={patients}
              bills={bills}
              users={users}
            />
          )}

          {activeTab === "userManagement" && (
            <UserManagementTab
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              patients={patients}
            />
          )}

          {activeTab === "resetDeleteData" && (
            <ResetDeleteDataTab
              patients={patients}
              setPatients={setPatients}
              beds={beds}
              setBeds={setBeds}
              medicines={medicines}
              setMedicines={setMedicines}
              bills={bills}
              setBills={setBills}
              staff={staff}
              setStaff={setStaff}
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              pregnancies={pregnancies}
              setPregnancies={setPregnancies}
              followUps={followUps}
              setFollowUps={setFollowUps}
              deliveries={deliveries}
              setDeliveries={setDeliveries}
              children={children}
              setChildren={setChildren}
              vaccines={vaccines}
              setVaccines={setVaccines}
              labTests={labTests}
              setLabTests={setLabTests}
              distributions={distributions}
              setDistributions={setDistributions}
              onNavigate={setActiveTab}
            />
          )}
        </main>

      </div>

      {/* Printable overlays manager modals */}
      <PrintOverlays
        editModal={editModal}
        setEditModal={setEditModal}
        doctors={doctors}
        labTestsMaster={labTestsMaster}
        labPackages={labPackages}
        viewingReceipt={viewingReceipt}
        setViewingReceipt={setViewingReceipt}
        viewingToken={viewingToken}
        setViewingToken={setViewingToken}
        activeInvoice={activeInvoice}
        setActiveInvoice={setActiveInvoice}
        patients={patients}
        setPatients={setPatients}
        beds={beds}
        setBeds={setBeds}
        pushTimelineEvent={pushTimelineEvent}
        currentUser={currentUser}
      />

    </div>
  );
}

