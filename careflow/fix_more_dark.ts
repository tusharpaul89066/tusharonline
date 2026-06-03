import fs from 'fs';
import path from 'path';

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix modal/backdrop and diagram contexts making them light theme
  content = content.replace(/bg-slate-950\/35 text-slate-400/g, 'bg-slate-100 text-slate-500');
  content = content.replace(/bg-slate-950\/35/g, 'bg-slate-100');
  
  // Dashboard card sub-card
  content = content.replace(/bg-slate-950\/80 border/g, 'bg-blue-50 border');
  content = content.replace(/bg-slate-950\/95/g, 'bg-slate-50');

  // LabManagementDesk hover artifacts
  content = content.replace(/bg-white hover:bg-slate-950 text-white/g, 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-slate-950\/20 border-slate-200 hover:text-white/g, 'bg-white border-slate-200 hover:bg-slate-50 hover:text-blue-600');
  content = content.replace(/bg-teal-950\/40 border-blue-500\/40 text-teal-300/g, 'bg-blue-50 border-blue-500 text-blue-700');
  content = content.replace(/bg-slate-805/g, 'bg-slate-50');

  fs.writeFileSync(filePath, content);
}

processFile('src/components/ClinicalWorkflowDiagram.tsx');
processFile('src/components/LabManagementDesk.tsx');
processFile('src/components/DashboardTab.tsx');
processFile('src/components/PrintOverlays.tsx');
