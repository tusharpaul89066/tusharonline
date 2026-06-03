import fs from 'fs';
import path from 'path';

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace old hex values and gradients with clean tailwind classes
  
  // Backgrounds & Surfaces
  content = content.replace(/bg-gradient-to-b from-\[#f8fafc\] to-\[#f1f5f9\]/g, 'bg-white');
  content = content.replace(/bg-\[#f8fafc\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[#ffffff\]/g, 'bg-white');
  content = content.replace(/bg-\[#f3f4f6\]/g, 'bg-slate-50');
  
  // Text Colors
  content = content.replace(/text-\[#1e293b\]/g, 'text-slate-800');
  content = content.replace(/text-\[#334155\]/g, 'text-slate-700');
  content = content.replace(/text-\[#475569\]/g, 'text-slate-600');
  content = content.replace(/text-\[#64748b\]/g, 'text-slate-500');
  content = content.replace(/text-\[#4b5563\]/g, 'text-slate-600');
  content = content.replace(/text-\[#9ca3af\]/g, 'text-slate-400');
  content = content.replace(/text-\[#ffffff\]/g, 'text-white');
  
  // Borders
  content = content.replace(/border-\[#d1d5db\]\/50/g, 'border-slate-200/60');
  content = content.replace(/border-\[#d1d5db\]\/70/g, 'border-slate-200');
  content = content.replace(/border-\[#d1d5db\]/g, 'border-slate-200');
  content = content.replace(/border-\[#e5e7eb\]/g, 'border-slate-100');
  content = content.replace(/border-slate-200\/60/g, 'border-slate-200');
  
  // Primary Blue 
  content = content.replace(/bg-gradient-to-r from-\[#3b82f6\] to-\[#2563eb\] hover:from-\[#2563eb\] hover:to-\[#1d4ed8\]/g, 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800');
  content = content.replace(/bg-gradient-to-r from-\[#3b82f6\] to-\[#2563eb\]/g, 'bg-blue-600 hover:bg-blue-700');
  content = content.replace(/bg-\[#3b82f6\]/g, 'bg-blue-500');
  content = content.replace(/hover:bg-\[#2563eb\]/g, 'hover:bg-blue-600');
  content = content.replace(/bg-\[#eaf4ff\]/g, 'bg-blue-50');
  
  content = content.replace(/text-\[#3b82f6\]/g, 'text-blue-600');
  content = content.replace(/text-\[#2563eb\]/g, 'text-blue-700');
  content = content.replace(/text-\[#1d4ed8\]/g, 'text-blue-800');
  
  content = content.replace(/border-\[#3b82f6\]/g, 'border-blue-500');
  content = content.replace(/border-\[#60a5fa\]/g, 'border-blue-400');
  content = content.replace(/border-\[#93c5fd\]/g, 'border-blue-300');
  content = content.replace(/border-\[#bfdbfe\]/g, 'border-blue-200');
  
  content = content.replace(/focus:border-\[#3b82f6\]/g, 'focus:border-blue-500');
  content = content.replace(/focus:ring-\[#3b82f6\]\/10/g, 'focus:ring-blue-500/20');
  content = content.replace(/focus:ring-\[#eaf4ff\]/g, 'focus:ring-blue-500/20');
  
  // Success Green
  content = content.replace(/bg-gradient-to-r from-\[#10b981\] to-\[#059669\] hover:from-\[#059669\] hover:to-\[#047857\]/g, 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700');
  
  // Sidebar Logo
  content = content.replace(/bg-gradient-to-br from-\[#3b82f6\] to-\[#14b8a6\]/g, 'bg-gradient-to-br from-blue-600 to-teal-500');
  content = content.replace(/ring-\[#3b82f6\]\/20/g, 'ring-blue-500/20');

  // Input styling
  content = content.replace(/w-full border border-slate-200 p-2.5 shadow-sm rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500\/20 transition-all text-slate-800 font-bold bg-white/g, 'w-full border border-slate-200 px-4 py-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 bg-white shadow-sm');
  content = content.replace(/border border-slate-200 p-2.5 shadow-sm rounded-xl/g, 'border border-slate-200 px-4 py-3 rounded-xl bg-white shadow-sm');
  content = content.replace(/border border-slate-200 p-2 shadow-sm rounded-xl/g, 'border border-slate-200 px-3 py-2 rounded-xl bg-white shadow-sm');

  // Input general replacements for ones containing [#3b82f6] strings:
  // Sometimes they were formatted incorrectly: focus:border-[#3b82f6] is already converted to focus:border-blue-500.
  // Now let's just clean generic inputs:
  content = content.replace(/outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500\/20 transition-all/g, 'outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all');

  // Menu Active Item
  content = content.replace(/bg-gradient-to-r from-blue-50 to-\[#f0f9ff\] text-blue-600 shadow-sm border border-blue-200 transform scale-\[1.02\] font-semibold/g, 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold shadow-[0_0_10px_-3px_rgba(37,99,235,0.1)]');
  
  // Table Zebra
  content = content.replace(/odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors/g, 'odd:bg-white even:bg-slate-50 hover:bg-slate-50 border-b border-slate-100 transition-colors');
  content = content.replace(/bg-slate-100 text-slate-400 text-sm font-semibold border-y border-slate-200/g, 'bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-y border-slate-100');
  content = content.replace(/bg-\[#f3f4f6\] text-slate-600 text-sm font-semibold border-y border-slate-200/g, 'bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-y border-slate-100');

  // General Card
  content = content.replace(/border border-slate-200 shadow-sm rounded-2xl bg-white/g, 'bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100');
  content = content.replace(/bg-white rounded-2xl shadow-sm border border-slate-200/g, 'bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100');

  fs.writeFileSync(filePath, content);
}

function walk(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      processFile(p);
    }
  }
}

processFile('src/App.tsx');
walk('src/components');
