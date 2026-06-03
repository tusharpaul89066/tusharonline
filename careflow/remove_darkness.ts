import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Replace dark backgrounds
    content = content.replace(/bg-slate-900/g, 'bg-white');
    content = content.replace(/bg-slate-950/g, 'bg-slate-50');
    content = content.replace(/bg-slate-800/g, 'bg-slate-100');
    content = content.replace(/bg-slate-850/g, 'bg-slate-100');
    
    // Replace teal/emerald darks
    content = content.replace(/bg-teal-950/g, 'bg-emerald-50');
    content = content.replace(/bg-teal-900/g, 'bg-emerald-100');
    
    // Replace dark borders
    content = content.replace(/border-slate-700/g, 'border-emerald-100');
    content = content.replace(/border-slate-800/g, 'border-emerald-100');
    content = content.replace(/border-slate-850/g, 'border-emerald-100');
    content = content.replace(/border-slate-900/g, 'border-emerald-200');
    
    // Gradients
    content = content.replace(/from-slate-900/g, 'from-white');
    content = content.replace(/to-slate-900/g, 'to-slate-50');
    content = content.replace(/from-slate-950/g, 'from-slate-50');
    content = content.replace(/to-slate-950/g, 'to-slate-100');
    
    // Lighten text colours when they are supposed to be light on dark? 
    // The user said "Text colour bold black thakbe" so they want black text.
    content = content.replace(/text-slate-200/g, 'text-slate-800');
    content = content.replace(/text-slate-300/g, 'text-slate-800');
    content = content.replace(/text-slate-400/g, 'text-slate-700');
    content = content.replace(/text-slate-50/g, 'text-slate-900'); // Some white text might become black
    content = content.replace(/text-white/g, 'text-white'); // Except explicitly white text like on buttons

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
