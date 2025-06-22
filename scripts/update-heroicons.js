import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript files
const files = await glob('src/**/*.{ts,tsx}');

// Update imports in each file
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace old imports with new ones
  content = content.replace(
    /from ['"]@heroicons\/react\/(solid|outline)['"]/g,
    'from \'@heroicons/react/24/outline\''
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
} 