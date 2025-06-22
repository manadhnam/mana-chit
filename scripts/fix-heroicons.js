const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript files in src directory
const files = glob.sync('src/**/*.{ts,tsx}');

// Process each file
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace old imports with new ones
  const newContent = content
    .replace(/from '@heroicons\/react\/(outline|24\/outline)'/g, "from '@heroicons/react/24/solid'")
    .replace(/from '@heroicons\/react\/24\/solid'/g, "from '@heroicons/react/24/solid'");
  
  // Write back if changes were made
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
}); 