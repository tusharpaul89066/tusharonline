import fs from 'fs';
let content = fs.readFileSync('src/index.css', 'utf-8');
content = content.replace(/\.bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500/g, '.input-3d-sunken');
fs.writeFileSync('src/index.css', content);
