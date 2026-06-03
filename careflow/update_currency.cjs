const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function replaceRecursively(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      replaceRecursively(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      let modified = content;

      modified = modified.replace(/\(₹\)/g, "(INR)");
      modified = modified.replace(/\(₹ /g, "(INR ");
      modified = modified.replace(/ ₹ /g, " INR ");
      
      modified = modified.replace(/₹(\{.*?\})/g, "$1 INR");
      modified = modified.replace(/₹(\d+([.,]\d+)?)/g, "$1 INR");
      modified = modified.replace(/₹(\$\{.*?\})/g, "$1 INR");
      modified = modified.replace(/₹/g, "INR ");

      modified = modified.replace(/INR \s*INR/g, "INR");
      modified = modified.replace(/INR\s+INR/g, "INR");
      modified = modified.replace(/INRINR/g, "INR");

      if (modified !== content) {
        fs.writeFileSync(filePath, modified, 'utf-8');
        console.log(`Modified ${filePath}`);
      }
    }
  }
}

replaceRecursively(dir);
