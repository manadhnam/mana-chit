const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace old imports with new ones
  content = content.replace(
    /from '@heroicons\/react\/(outline|24\/outline)'/g,
    'from \'@heroicons/react/24/solid\''
  );
  
  // Write back the file
  fs.writeFileSync(file, content);
});

console.log('Heroicons imports have been updated!'); 