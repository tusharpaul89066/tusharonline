import fs from 'fs';
import path from 'path';

function processFile(filepath: string) {
    let content = fs.readFileSync(filepath, 'utf-8');
    let original = content;

    // Replace Currency symbol
    content = content.replace(/৳/g, '₹');
    
    // Replace BDT with INR
    content = content.replace(/BDT/g, 'INR');

    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf-8');
    }
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
