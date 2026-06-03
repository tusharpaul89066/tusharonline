import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');

    // Make sure we globally convert form texts explicitly
    
    // Convert inputs, select, textareas text colors to text-black font-bold
    content = content.replace(/<(input|select|textarea)(\s+[^>]*?)className=(["'{][^>]*?["'}])/gi, (match, tag, beforeClass, classNameBlock) => {
        let newClasses = classNameBlock;
        
        // Remove light text colors
        newClasses = newClasses.replace(/text-(slate|gray|zinc|neutral|emerald|teal)-\d+/g, '');
        newClasses = newClasses.replace(/text-white/g, '');
        
        // Add strong typography
        newClasses = newClasses.replace(/className=(["'{])/g, 'className=$1text-black font-bold bg-white text-sm ');
        
        // Ensure background is plain white
        newClasses = newClasses.replace(/bg-transparent/g, '');
        newClasses = newClasses.replace(/bg-(slate|gray|zinc|neutral|emerald|teal)-\d+/g, '');
        newClasses = newClasses.replace(/bg-white/g, ''); // we inject it again safely
        newClasses = newClasses.replace(/className=(["'{])/g, 'className=$1bg-white text-black font-bold ');

        // Fix placeholders
        newClasses = newClasses.replace(/placeholder:text-(slate|gray|zinc|neutral|emerald|teal)-\d+/g, '');
        newClasses = newClasses.replace(/placeholder:text-white/g, '');
        
        // Add placeholder color
        newClasses = newClasses.replace(/className=(["'{])/g, 'className=$1placeholder:text-gray-500 placeholder:font-bold ');

        return `<${tag}${beforeClass}className=${newClasses}`;
    });

    // Make labels bold and black
    content = content.replace(/<label(\s+[^>]*?)className=(["'{][^>]*?["'}])/gi, (match, beforeClass, classNameBlock) => {
        let newClasses = classNameBlock;
        
        newClasses = newClasses.replace(/text-(slate|gray|zinc|neutral|emerald|teal)-\d+/g, '');
        newClasses = newClasses.replace(/text-white/g, '');
        
        newClasses = newClasses.replace(/className=(["'{])/g, 'className=$1text-black font-bold text-sm ');

        return `<label${beforeClass}className=${newClasses}`;
    });
    
    content = content.replace(/input-3d-sunken/g, 'bg-white border border-slate-300 shadow-sm text-black font-bold placeholder:text-gray-500');

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
