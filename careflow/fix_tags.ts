import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');

    // Add text-slate-900 to labels
    content = content.replace(/<(label)(\s+[^>]*?)className=(["'{])([^"'}]+)(["'}])/gi, (match, tag, beforeClass, qStart, classes, qEnd) => {
        let newClasses = classes;
        if (!newClasses.includes('text-black') && !newClasses.includes('text-slate-800') && !newClasses.includes('text-slate-900')) {
             newClasses += ' text-slate-900';
        }
        if (!newClasses.includes('text-sm') && !newClasses.includes('text-[') && !newClasses.includes('text-xs')) {
             newClasses += ' text-sm';
        }
        if (!newClasses.includes('font-')) {
             newClasses += ' font-bold';
        }
        return `<label${beforeClass}className=${qStart}${newClasses}${qEnd}`;
    });
    
    // Check inputs similarly
    content = content.replace(/<(input|textarea|select)(\s+[^>]*?)className=(["'{])([^"'}]+)(["'}])/gi, (match, tag, beforeClass, qStart, classes, qEnd) => {
        let newClasses = classes;
        if (!newClasses.includes('bg-white') && !newClasses.includes('bg-slate-50') && !newClasses.includes('bg-[#ffffff]')) {
             newClasses += ' bg-white';
        }
        if (!newClasses.includes('text-black') && !newClasses.includes('text-slate-900') && !newClasses.includes('text-slate-800') && !newClasses.includes('text-emerald-900') && !newClasses.includes('text-teal-900') && !newClasses.includes('text-slate-700')) {
             newClasses += ' text-black';
        }
        if (!newClasses.includes('font-bold') && !newClasses.includes('font-extrabold') && !newClasses.includes('font-black') && !newClasses.includes('font-semibold')) {
             newClasses += ' font-bold';
        }
        if (!newClasses.includes('border-') && !newClasses.includes('border ')) {
             newClasses += ' border border-slate-300';
        }
        if (!newClasses.includes('placeholder:')) {
             newClasses += ' placeholder:text-gray-500 placeholder:font-bold';
        } else {
             newClasses = newClasses.replace(/placeholder:text-(slate|gray|zinc)-[0-9]+/g, 'placeholder:text-gray-500');
        }
        return `<${tag}${beforeClass}className=${qStart}${newClasses}${qEnd}`;
    });

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
