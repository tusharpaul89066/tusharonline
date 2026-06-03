import fs from 'fs';

let files = fs.readdirSync('src/components');
for (let file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(`src/components/${file}`, 'utf8');
    content = content.replace(/bg-emerald-50\/80/g, 'bg-white');
    content = content.replace(/bg-emerald-50\/50/g, 'bg-slate-50');
    fs.writeFileSync(`src/components/${file}`, content);
  }
}
