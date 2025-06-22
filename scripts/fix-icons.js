import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Icon mappings for solid vs outline sets
const iconSets = {
  outline: [
    'UserGroupIcon',
    'ShieldCheckIcon',
    'UserIcon',
    'CheckIcon',
    'XMarkIcon',
    'BellIcon',
    'DocumentTextIcon',
    'HomeIcon',
    'PhoneIcon',
    'EnvelopeIcon',
    'MapPinIcon',
    'ClockIcon',
    'MagnifyingGlassIcon',
    'FunnelIcon',
    'ArrowLeftIcon',
    'ChevronDownIcon',
    'ChevronUpIcon',
    'CreditCardIcon',
    'Cog6ToothIcon',
    'QuestionMarkCircleIcon',
    'CalendarIcon',
    'TicketIcon'
  ],
  solid: [
    'BuildingOfficeIcon',
    'ArrowRightOnRectangleIcon',
    'ChartBarIcon',
    'BanknotesIcon',
    'GlobeAltIcon',
    'DocumentChartBarIcon',
    'ArrowDownTrayIcon',
    'Bars3Icon'
  ]
};

async function fixIcons() {
  const files = await glob('src/**/*.{ts,tsx}');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix double semicolons in imports
    content = content.replace(/from\s+['"][^'"]+['"];;/g, 'from \'@heroicons/react/24/outline\';');

    // Fix icon imports
    const outlineImports = iconSets.outline.filter(icon => content.includes(icon));
    const solidImports = iconSets.solid.filter(icon => content.includes(icon));

    if (outlineImports.length > 0 || solidImports.length > 0) {
      let newImports = '';
      
      if (outlineImports.length > 0) {
        newImports += `import { ${outlineImports.join(', ')} } from '@heroicons/react/24/outline';\n`;
      }
      
      if (solidImports.length > 0) {
        newImports += `import { ${solidImports.join(', ')} } from '@heroicons/react/24/solid';\n`;
      }

      // Remove old icon imports
      content = content.replace(/import\s*{[^}]*}\s*from\s*['"]@heroicons\/react\/24\/(outline|solid)['"];?/g, '');
      
      // Add new imports at the top
      content = content.replace(/import\s+React/g, `${newImports}import React`);
      modified = true;
    }

    // Fix icon usage
    const iconRegex = /<([A-Z][A-Za-z0-9]+Icon)([^/>]*)\n([^<]*)/g;
    content = content.replace(iconRegex, (match, iconName, attrs, text) => {
      modified = true;
      return `<${iconName}${attrs} className="h-5 w-5 mr-2" />\n${text}`;
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}

fixIcons().catch(console.error); 