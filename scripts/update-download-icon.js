import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const updateDownloadIcon = async () => {
  const files = await glob('src/**/*.{ts,tsx}');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if file contains DownloadIcon
    if (content.includes('DownloadIcon')) {
      // Update import statement
      content = content.replace(
        /import\s*{([^}]*)DownloadIcon([^}]*)}\s*from\s*['"]@heroicons\/react\/24\/outline['"]/g,
        'import {$1ArrowDownTrayIcon$2} from \'@heroicons/react/24/outline\''
      );
      
      // Update usage
      content = content.replace(/DownloadIcon/g, 'ArrowDownTrayIcon');
      
      // Write back the updated content
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
};

updateDownloadIcon().catch(console.error); 