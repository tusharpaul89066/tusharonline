const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');

function replaceRecursively(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      replaceRecursively(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      const buttonRegex = /<button\s+([^>]*?)>([\s\S]*?)<\/button>/gm;
      
      let modified = content.replace(buttonRegex, (match, attrs, innerHTML) => {
        const textToMatch = innerHTML.toLowerCase();
        
        if (
          textToMatch.includes('edit') || textToMatch.includes('delete') || textToMatch.includes('save') || 
          textToMatch.includes('submit') || textToMatch.includes('print') || textToMatch.includes('update') ||
          textToMatch.includes('ডিলিট') || textToMatch.includes('সেভ') || textToMatch.includes('প্রিন্ট') || 
          textToMatch.includes('সংরক্ষণ') || textToMatch.includes('এডিট') || textToMatch.includes('আপডেট') ||
          attrs.toLowerCase().includes('submit')
        ) {
          // If it already has btn-action-blue, skip
          if (attrs.includes('btn-action-blue')) return match;

          // If there is className="...", add it there
          if (/className="([^"]*)"/.test(attrs)) {
            const newAttrs = attrs.replace(/className="([^"]*)"/, 'className="$1 btn-action-blue"');
            return `<button ${newAttrs}>${innerHTML}</button>`;
          } 
          // If there is className={`...`}, add it there
          else if (/className=\{`(.*?)`\}/.test(attrs)) {
            const newAttrs = attrs.replace(/className=\{`(.*?)`\}/, 'className={`$1 btn-action-blue`}');
            return `<button ${newAttrs}>${innerHTML}</button>`;
          }
          // If there is no className, add it
          else if (!attrs.includes("className=")) {
             return `<button className="btn-action-blue" ${attrs}>${innerHTML}</button>`;
          }
          // If there's className={someVar}, we could change it to className={`${someVar} btn-action-blue`}
          else {
             const newAttrs = attrs.replace(/className=\{(.*?)\}/, 'className={`btn-action-blue ${$1}`}');
             return `<button ${newAttrs}>${innerHTML}</button>`;
          }
        }
        return match;
      });
      
      if (modified !== content) {
        fs.writeFileSync(filePath, modified, 'utf-8');
        console.log(`Modified ${filePath}`);
      }
    }
  }
}

replaceRecursively(dir);
