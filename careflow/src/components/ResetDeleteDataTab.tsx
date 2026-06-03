import React, { useState } from "react";
import { Download, Trash2, ShieldAlert, CheckCircle2, FileJson, AlertTriangle } from "lucide-react";
import { 
  Patient, Bed, Medicine, Bill, Staff, User, 
  PregnancyRecord, PregnancyFollowUp, DeliveryRecord, 
  ChildRecord, VaccinationRecord, LabTest, DistributionRecord 
} from "../types";

interface ResetDeleteDataTabProps {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  beds: Bed[];
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;

  // Maternity
  pregnancies: PregnancyRecord[];
  setPregnancies: React.Dispatch<React.SetStateAction<PregnancyRecord[]>>;
  followUps: PregnancyFollowUp[];
  setFollowUps: React.Dispatch<React.SetStateAction<PregnancyFollowUp[]>>;
  deliveries: DeliveryRecord[];
  setDeliveries: React.Dispatch<React.SetStateAction<DeliveryRecord[]>>;
  children: ChildRecord[];
  setChildren: React.Dispatch<React.SetStateAction<ChildRecord[]>>;
  vaccines: VaccinationRecord[];
  setVaccines: React.Dispatch<React.SetStateAction<VaccinationRecord[]>>;

  // Lab & Distribution
  labTests: LabTest[];
  setLabTests: React.Dispatch<React.SetStateAction<LabTest[]>>;
  distributions: DistributionRecord[];
  setDistributions: React.Dispatch<React.SetStateAction<DistributionRecord[]>>;
  
  // Navigation helper to go back to dashboard after deletion
  onNavigate: (tabId: string) => void;
}

export default function ResetDeleteDataTab({
  patients, setPatients,
  beds, setBeds,
  medicines, setMedicines,
  bills, setBills,
  staff, setStaff,
  users, setUsers,
  currentUser, setCurrentUser,
  pregnancies, setPregnancies,
  followUps, setFollowUps,
  deliveries, setDeliveries,
  children, setChildren,
  vaccines, setVaccines,
  labTests, setLabTests,
  distributions, setDistributions,
  onNavigate
}: ResetDeleteDataTabProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [doubleCheckText, setDoubleCheckText] = useState("");

  const convertToCSV = (data: any[]): string => {
    if (!data || !data.length) {
      return "No Data Available in this section\n";
    }

    // Capture all unique keys as headers from the list of objects
    const headers = Array.from(
      new Set(data.flatMap((obj) => Object.keys(obj)))
    );

    // Escape cells for pristine CSV compliance
    const escapeCell = (val: any) => {
      if (val === null || val === undefined) return "";
      let str = "";
      if (typeof val === "object") {
        str = JSON.stringify(val);
      } else {
        str = String(val);
      }
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerRow = headers.map(escapeCell).join(",");
    const rows = data.map((item) =>
      headers.map((h) => escapeCell(item[h])).join(",")
    );

    // Prepend UTF-8 BOM for Microsoft Excel character support
    return "\ufeff" + [headerRow, ...rows].join("\n");
  };

  const triggerSingleDownloadAsCSV = (filename: string, data: any[]) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    setDownloadStatus([]);
    
    const sections = [
      { name: "1. Patients & OPD Registry (patients.csv)", data: patients },
      { name: "2. Bed & Cabin Occupancy (beds.csv)", data: beds },
      { name: "3. Pharmacy Stock & Medicines (medicines.csv)", data: medicines },
      { name: "4. Billing Accounts ledger (bills.csv)", data: bills },
      { name: "5. Nurse & Worker Roster (staff.csv)", data: staff },
      { name: "6. Authorized System Logins (users.csv)", data: users },
      { name: "7. Maternity Pregnancy Registry (pregnancies.csv)", data: pregnancies },
      { name: "8. Maternity Delivery Records (deliveries.csv)", data: deliveries },
      { name: "9. Maternity Kids Registry (children.csv)", data: children },
      { name: "10. Vaccination Tracker (vaccinations.csv)", data: vaccines },
      { name: "11. Lab Reports Records (lab_tests.csv)", data: labTests },
      { name: "12. Financial Distributions (distributions.csv)", data: distributions },
    ];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      setDownloadStatus((prev) => [...prev, `Downloading Excel: ${sec.name}...`]);
      // Small pause to allow browser sequential queue downloads safely
      await new Promise((resolve) => setTimeout(resolve, 350));
      triggerSingleDownloadAsCSV(sec.name.split(" (")[1].replace(")", ""), sec.data);
      setDownloadStatus((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = `✓ Completed Excel: ${sec.name}`;
        return copy;
      });
    }

    setDownloading(false);
  };

  const handleResetAndDeleteAll = () => {
    // Zero out states
    setPatients([]);
    
    // Free up all bed states
    setBeds(beds.map(b => ({
      ...b,
      occupied: false,
      patientId: undefined,
      patientName: undefined,
      admittedDate: undefined
    })));

    setMedicines([]);
    setBills([]);
    setStaff([]);
    
    // Reset maternity
    setPregnancies([]);
    setFollowUps([]);
    setDeliveries([]);
    setChildren([]);
    setVaccines([]);

    // Reset Lab & Distribution
    setLabTests([]);
    setDistributions([]);

    // Keep default admin user so they can still manage users & utilize standard auth paths safely
    const defaultAdminUser = users.find(u => u.username === "admin") || {
      id: "USER-1",
      username: "admin",
      password: "password123",
      name: "Administrator Mode",
      role: "SuperAdmin"
    };

    setUsers([defaultAdminUser]);
    setCurrentUser(defaultAdminUser);
    
    setShowConfirmModal(false);
    setDoubleCheckText("");
    alert("সমস্ত সেকসানের ডাটা সম্পূর্ণ পরিস্কার করা হয়েছে! (All sections data has been wiped successfully!)");
    onNavigate("dashboard");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-400 border border-rose-300 text-white flex items-center justify-center shadow-md">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-950 uppercase tracking-tight">
              Reset and Delete Data Area (ডাটা রিসেট ও ডিলিট অপশন)
            </h2>
            <p className="text-xs text-rose-800 font-semibold mt-1">
              Export and backup all active segments in structured JSON formats sequentially, or purge the clinical workspace databases permanently.
            </p>
          </div>
        </div>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Option 1: Download Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                1) Download All Section Data
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              এটি ক্লিকের মাধ্যমে সিস্টেমের সমস্ত গুরুত্বপূর্ণ বিভাগ (যেমন: রোগী রেজিষ্ট্রেশন, ওষুধ স্টক, বিলিং হিস্ট্রি, মাতৃ স্বাস্থ্য, ল্যাব রিপোর্ট ইত্যাদি) সম্পূর্ণ আলাদা আলাদা ফাইলে পরপর ডাউলোড হয়ে ব্যাকআপ হিসেবে সেভ হয়ে যাবে।
            </p>
            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-[11px] text-teal-800 font-mono space-y-1">
              <p className="font-bold">✓ Sequences triggered on dynamic loop:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-1 text-[10px]">
                <li>Patient Registrations & Appointments</li>
                <li>Maternity & Children Clinical Registers</li>
                <li>Pharmacy store list, billing directories, & Lab reports</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3.5">
            {downloadStatus.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl max-h-40 overflow-y-auto custom-scrollbar font-mono text-[9px] text-zinc-700 space-y-1">
                {downloadStatus.map((status, idx) => (
                  <p key={idx} className={status.startsWith("✓") ? "text-emerald-700 font-bold" : "text-amber-700 animate-pulse"}>
                    {status}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="w-full btn-action-blue py-3 rounded-xl uppercase tracking-wider text-[11px] flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 shrink-0" />
              {downloading ? "Downloading Profiles..." : "Download All Section Data"}
            </button>
          </div>
        </div>

        {/* Option 2: Delete Section */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-black text-red-900 uppercase tracking-wide">
                2) Reset and Delete All Data
              </h3>
            </div>
            <p className="text-xs text-red-800 leading-relaxed font-semibold">
              এখানে ক্লিক করার সাথে সাথে সিস্টেমের সমস্ত রোগী, গর্ভবতী মায়ের প্রোফাইল, ল্যাব ফাইল, স্টাফদের তালিকা, ঔষুধের স্টক এবং বিলিং হিস্ট্রি চিরতরে মুছে যাবে।
            </p>
            <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-[11px] text-red-900 font-mono space-y-1">
              <p className="font-bold text-red-800">⚠️ CRITICAL HARD DISK WARNING:</p>
              <p className="text-[10px]">
                This operation is irreversible! Wiping the parameters will leave the database completely clean. Only a fallback super-administrator credential will be retained for system operations.
              </p>
            </div>
          </div>

          <div>
            <button onClick={() => setShowConfirmModal(true)}
              className="w-full btn-action-blue py-3 rounded-xl uppercase tracking-wider text-[11px] flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Reset and Delete All Data
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white max-w-md w-full rounded-2xl border border-red-200 p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase">
                  CONFIRM MASTER SYSTEM ERASE?
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  নিশ্চিতভাবে সমস্ত সিস্টেমে সংরক্ষিত ডাটা মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব হবে না। কনফার্ম করতে নিচের বক্সে <span className="text-red-700 font-bold font-mono">DELETE</span> টাইপ করুন।
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-black uppercase text-slate-700 block">TYping Check</label>
              <input
                type="text"
                value={doubleCheckText}
                onChange={(e) => setDoubleCheckText(e.target.value)}
                placeholder="Type DELETE to confirm operations"
                className="w-full input-3d-sunken p-2.5 rounded-lg text-xs font-mono font-bold tracking-widest text-center"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setDoubleCheckText("");
                }}
                className="flex-1 btn-action-blue py-2.5 rounded-xl uppercase font-bold text-[10.5px] transition"
              >
                No, Keep My Data
              </button>
              <button
                type="button"
                disabled={doubleCheckText !== "DELETE"}
                onClick={handleResetAndDeleteAll}
                className={`flex-1 py-2.5 rounded-xl uppercase font-black text-[10.5px] tracking-widest transition ${
                  doubleCheckText === "DELETE"
                    ? "btn-action-blue"
                    : "bg-red-200 border-red-300 text-red-100 cursor-not-allowed"
                }`}
              >
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
