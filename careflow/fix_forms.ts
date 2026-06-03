import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Replace class in <input ... className="...">, <select ... className="...">, <textarea ... className="...">, <label ... className="...">
    content = content.replace(/<\s*(input|select|textarea|label)([^>]*?)className="([^"]*)"/gi, (match, tag, rest, classes) => {
        let newClasses = classes;
        
        if (tag.toLowerCase() === 'label') {
            newClasses = newClasses.replace(/text-(?:slate|gray|zinc|neutral|emerald|teal)-(?:50|100|200|300|400|500)/g, 'text-slate-900');
            newClasses = newClasses.replace(/text-white/g, 'text-slate-900');
            if (!newClasses.includes('font-')) {
                 newClasses += ' font-bold';
            } else {
                 newClasses = newClasses.replace(/font-(?:light|normal|medium)/g, 'font-bold');
            }
        } else {
            // input, select, textarea
            newClasses = newClasses.replace(/text-(?:slate|gray|zinc|neutral|emerald|teal)-(?:50|100|200|300|400|500)/g, 'text-black');
            newClasses = newClasses.replace(/text-white/g, 'text-black');
            
            // bg transparent or light
            newClasses = newClasses.replace(/bg-transparent/g, 'bg-white');
            newClasses = newClasses.replace(/bg-(?:slate|gray|zinc|neutral)-(?:900|800|700|600|500|950)/g, 'bg-white');
            
            // border
            newClasses = newClasses.replace(/border-(?:slate|gray|zinc)-(?:700|800|900)/g, 'border-slate-300');
            
            // ensure text-black and font-bold
            if (!newClasses.includes('text-black') && !newClasses.includes('text-slate-900') && !newClasses.includes('text-slate-800') && !newClasses.includes('text-teal-900') && !newClasses.includes('text-emerald-900')) {
                newClasses += ' text-black';
            }
            if (!newClasses.includes('font-bold') && !newClasses.includes('font-extrabold') && !newClasses.includes('font-black')) {
                newClasses += ' font-bold';
            }
            
            // placeholder
            if (!newClasses.includes('placeholder:')) {
                newClasses += ' placeholder:text-gray-500 placeholder:font-semibold';
            } else {
                newClasses = newClasses.replace(/placeholder:text-(?:slate|gray|zinc)-(?:50|100|200|300|400|700|800|900)/g, 'placeholder:text-gray-500');
            }
        }
        
        return `<${tag}${rest}className="${newClasses}"`;
    });
    
    // We should also replace spans inside forms or just general span texts that are light.
    // Specially if they act as labels or placeholders. Let's do a pass to convert any remaining text-slate-300 etc to text-slate-800 in the whole file EXCEPT in buttons.
    // Instead of doing it blindly, let's just do it. Wait, buttons might need text-white, let's preserve `text-white` but convert `text-slate-200/300/400/500` to `text-slate-800/700` everywhere.
    
    content = content.replace(/text-slate-300/g, 'text-slate-800');
    content = content.replace(/text-slate-400/g, 'text-slate-700');
    content = content.replace(/text-slate-500/g, 'text-slate-600');
    
    // Fix text colors in block elements
    content = content.replace(/text-slate-200/g, 'text-slate-900');
    content = content.replace(/text-slate-100/g, 'text-slate-900');
    content = content.replace(/text-zinc-500/g, 'text-zinc-700');
    content = content.replace(/text-zinc-400/g, 'text-zinc-800');
    
    // Ensure headings are dark
    content = content.replace(/text-teal-300/g, 'text-teal-800');
    content = content.replace(/text-emerald-300/g, 'text-emerald-800');
    content = content.replace(/text-teal-400/g, 'text-teal-700');
    content = content.replace(/text-emerald-400/g, 'text-emerald-700');

    // Fix opacity
    content = content.replace(/opacity-\d\d/g, 'opacity-100');

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
