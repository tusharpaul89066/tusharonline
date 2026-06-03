import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Nav button active correction
content = content.replace(/bg-blue-600 text-white font-semibold text-blue-700 font-black/g, 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600');
content = content.replace(/shadow-lg shadow-blue-600\/10/g, 'shadow-sm');

// Nav button inactive correction
content = content.replace(/text-slate-600 hover:bg-slate-50 hover:text-white/g, 'text-slate-600 hover:bg-slate-50 hover:text-blue-600');

// Top role toggle active
content = content.replace(/bg-blue-600 text-white font-semibold text-slate-800 font-extrabold shadow shadow-blue-600\/15/g, 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20');
// Top role toggle inactive
content = content.replace(/bg-slate-50 text-slate-300 hover:bg-slate-200 hover:text-white/g, 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600');

// Header Text 
content = content.replace(/text-white text-sm font-semibold leading-none/g, 'text-slate-800 text-sm font-bold leading-none');
content = content.replace(/text-\[\#6b7280\]/g, 'text-slate-500');

fs.writeFileSync('src/App.tsx', content);

