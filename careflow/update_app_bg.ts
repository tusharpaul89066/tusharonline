import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard panel backgrounds
content = content.replace(/bg-slate-50/g, 'bg-emerald-50');
content = content.replace(/bg-slate-100/g, 'bg-emerald-100');
content = content.replace(/className=\"flex-1 overflow-x-hidden overflow-y-auto bg-slate-50\"/, 'className=\"flex-1 overflow-x-hidden overflow-y-auto bg-emerald-50/30\"');


fs.writeFileSync('src/App.tsx', content);

let files = fs.readdirSync('src/components');
for (let file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(`src/components/${file}`, 'utf8');
    content = content.replace(/bg-slate-50/g, 'bg-emerald-50/50');
    // For specific things like white backgrounds, let's substitute them with emerald-50 slightly texturally
    content = content.replace(/bg-white/g, 'bg-emerald-50/80');
    fs.writeFileSync(`src/components/${file}`, content);
  }
}
