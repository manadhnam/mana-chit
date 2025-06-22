import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Heroicons v1 to v2 mapping
const iconMappings = {
  // Outline icons
  'MailIcon': 'EnvelopeIcon',
  'PhoneIcon': 'PhoneIcon',
  'ClockIcon': 'ClockIcon',
  'PencilIcon': 'PencilSquareIcon',
  'XMarkIcon': 'XMarkIcon',
  'BuildingOfficeIcon': 'BuildingOfficeIcon',
  'MapPinIcon': 'MapPinIcon',
  'EnvelopeIcon': 'EnvelopeIcon',
  'BanknotesIcon': 'BanknotesIcon',
  'TrashIcon': 'TrashIcon',
  'PlusIcon': 'PlusIcon',
  'UserPlusIcon': 'UserPlusIcon',
  'UserMinusIcon': 'UserMinusIcon',
  'PencilSquareIcon': 'PencilSquareIcon',
  'ArrowRightOnRectangleIcon': 'ArrowRightOnRectangleIcon',
  'SearchIcon': 'MagnifyingGlassIcon',
  'FilterIcon': 'FunnelIcon',
  'LocationMarkerIcon': 'MapPinIcon',
  'TrendingUpIcon': 'ChartBarIcon',
  'MapIcon': 'MapIcon',
};

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Update imports
  const importRegex = /import\s*{([^}]*)}\s*from\s*['"]@heroicons\/react\/24\/outline['"]/g;
  content = content.replace(importRegex, (match, imports) => {
    const newImports = imports.split(',').map(imp => {
      const trimmed = imp.trim();
      const [icon, alias] = trimmed.split(' as ').map(s => s.trim());
      if (iconMappings[icon]) {
        return alias ? `${iconMappings[icon]} as ${alias}` : iconMappings[icon];
      }
      return trimmed;
    }).join(', ');
    modified = true;
    return `import {${newImports}} from '@heroicons/react/24/outline'`;
  });

  // Update usage
  Object.entries(iconMappings).forEach(([oldIcon, newIcon]) => {
    const usageRegex = new RegExp(`<${oldIcon}[^>]*>`, 'g');
    if (content.match(usageRegex)) {
      content = content.replace(usageRegex, `<${newIcon}`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// Find all TypeScript/TSX files
const files = await glob('src/**/*.{ts,tsx}');

// Process each file
files.forEach(processFile);

console.log('Migration complete!'); 