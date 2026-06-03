import fs from 'fs';
import path from 'path';

function processFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Purge lingering dark theme hex codes
  content = content.replace(/bg-\[#0b1329\]/g, 'bg-white'); // Dashboard dark card
  content = content.replace(/bg-\[#1e293b\]\/10/g, 'bg-slate-100'); // Nurse module
  content = content.replace(/bg-\[#1e293b\]/g, 'bg-white'); // Many dark items
  content = content.replace(/bg-\[#10294f\]/g, 'bg-slate-50'); 
  content = content.replace(/bg-\[#071b38\]/g, 'bg-slate-50'); 
  content = content.replace(/bg-\[#f3f5f9\]/g, 'bg-slate-50'); 
  content = content.replace(/bg-\[#03122b\]/g, 'bg-white'); 
  content = content.replace(/text-\[#021325\]/g, 'text-blue-700'); 
  content = content.replace(/text-\[#cbd5e1\]/g, 'text-slate-600'); 
  content = content.replace(/text-\[#03122b\]/g, 'text-slate-800'); 
  content = content.replace(/border-\[#10294f\]/g, 'border-slate-200'); 
  content = content.replace(/border-\[#12305f\]/g, 'border-slate-200'); 
  content = content.replace(/border-\[#0d2348\]/g, 'border-slate-200'); 
  content = content.replace(/bg-\[#16376b\]/g, 'bg-slate-200'); 
  content = content.replace(/bg-\[#021325\]/g, 'bg-white'); 
  content = content.replace(/hover:bg-slate-850/g, 'hover:bg-slate-50');
  content = content.replace(/bg-slate-850/g, 'bg-slate-50');
  content = content.replace(/border-slate-800/g, 'border-slate-200');
  content = content.replace(/border-slate-700/g, 'border-slate-200');

  // App.tsx Specifics
  content = content.replace(/text-slate-300 hover:bg-\[#16376b\] hover:text-white/g, 'text-slate-600 hover:bg-slate-100 hover:text-slate-800');
  content = content.replace(/text-cyan-300/g, 'text-blue-600');
  content = content.replace(/text-cyan-400/g, 'text-blue-600');
  content = content.replace(/text-cyan-500/g, 'text-blue-600');
  content = content.replace(/bg-cyan-400/g, 'bg-blue-600 text-white font-semibold');
  content = content.replace(/shadow-cyan-400\/10/g, 'shadow-blue-600/10');
  content = content.replace(/shadow-cyan-400\/15/g, 'shadow-blue-600/15');
  content = content.replace(/border-cyan-400\/40/g, 'border-blue-600/20');

  // Nav buttons explicitly 
  content = content.replace(/bg-cyan-400 text-\[#03122b\]/g, 'bg-blue-600 text-white');
  content = content.replace(/bg-\[#10294f\] text-slate-300 hover:bg-\[#16376b\] hover:text-white/g, 'bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-slate-200');
  content = content.replace(/bg-cyan-400 text-slate-800 font-extrabold shadow shadow-blue-600\/15/g, 'bg-blue-600 text-white font-extrabold shadow shadow-blue-600/15');
  
  // Clean some weird button text combinations
  content = content.replace(/hover:bg-slate-50 text-white/g, 'text-slate-700 hover:bg-slate-50 border border-slate-200');

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
