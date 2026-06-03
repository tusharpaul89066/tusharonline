import fs from 'fs';

let content = fs.readFileSync('src/components/MaternityModuleTab.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-emerald-50/50');
// Some specific elements might need clearer background
content = content.replace(/bg-emerald-50\/50 border-white/g, 'bg-white border-white'); // For the avatar circle maybe

fs.writeFileSync('src/components/MaternityModuleTab.tsx', content);
