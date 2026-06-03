import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Remove backdrop-blur-* classes
    content = content.replace(/\S*backdrop-blur\S*/g, '');
    
    // Remove large shadows
    content = content.replace(/shadow-2xl/g, 'shadow-sm');
    content = content.replace(/shadow-xl/g, 'shadow-sm');
    content = content.replace(/shadow-lg/g, 'shadow-sm');
    
    // Remove complex gradient box shadows like shadow-[...]
    content = content.replace(/shadow-\[[^\]]+\]/g, 'shadow-sm');
    
    // Remove mix-blend-* classes
    content = content.replace(/\s*mix-blend-\S+/g, '');
    
    // For modals specifically
    content = content.replace(/fixed\s+inset-0\s+bg-(?:slate|emerald|zinc|teal|sky)-(?:900|950)\/[0-9]+/g, 'fixed inset-0 bg-slate-900/20');
    content = content.replace(/absolute\s+inset-0\s+bg-(?:slate|emerald|zinc|teal|sky)-(?:900|950)\/[0-9]+/g, 'absolute inset-0 bg-slate-900/20');
    
    // Replace any text opacity issues, e.g., opacity-75
    content = content.replace(/\s*opacity-[0-9]+/g, '');
    
    // Replace dark gradient backgrounds in containers replacing from-slate-900 to-slate-950 etc
    content = content.replace(/bg-gradient-to-[a-z]+\s+from-slate-900\/?(\d+)?\s+(?:via-slate-9[0-9]0\/?(\d+)?\s+)?to-slate-9[0-9]0\/?(\d+)?/g, 'bg-white');
    
    // In case there are some rgba in inline styles or other places
    content = content.replace(/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.4\s*\)/g, 'rgba(0,0,0,0.1)');
    
    fs.writeFileSync(filepath, content, 'utf-8');
}

function processDirectory(directory: string) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

processDirectory('src/components');
processFile('src/App.tsx');
processFile('src/index.css');

