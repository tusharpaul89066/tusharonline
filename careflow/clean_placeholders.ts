import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');

    content = content.replace(/placeholder:\s/g, ' ');
    content = content.replace(/placeholder:placeholder:/g, 'placeholder:');
    
    // Any remaining 'text-white' or 'text-slate-100' or similar on inputs/labels?
    
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
