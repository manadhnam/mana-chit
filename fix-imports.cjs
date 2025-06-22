const fs = require('fs');
const path = require('path');

// Common icon imports that are missing
const commonIcons = [
  'CheckCircleIcon', 'XCircleIcon', 'ClockIcon', 'ExclamationCircleIcon',
  'ArrowPathIcon', 'BellIcon', 'ChatBubbleLeftIcon', 'DocumentCheckIcon',
  'ShieldCheckIcon', 'UserGroupIcon', 'PencilSquareIcon', 'TrashIcon',
  'PlusIcon', 'BuildingOfficeIcon', 'ChartBarIcon', 'CurrencyDollarIcon',
  'BanknotesIcon', 'PhoneIcon', 'EnvelopeIcon', 'MapPinIcon'
];

function addMissingImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file already has heroicons import
    const hasHeroiconsImport = content.includes('@heroicons/react/24/');
    
    if (!hasHeroiconsImport) {
      // Find where to insert the import (after existing imports)
      const importMatch = content.match(/import.*from ['"]/g);
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[importMatch.length - 1]);
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
        
        // Check which icons are actually used in the file
        const usedIcons = commonIcons.filter(icon => content.includes(icon));
        
        if (usedIcons.length > 0) {
          const importStatement = `import { ${usedIcons.join(', ')} } from '@heroicons/react/24/solid';\n`;
          content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added missing imports to: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error.message);
  }
}

// Get all TSX files
function getAllTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const tsxFiles = getAllTsxFiles(srcDir);

console.log(`Checking ${tsxFiles.length} TSX files for missing imports...`);

tsxFiles.forEach(addMissingImports);

console.log('Import fixes completed!'); 