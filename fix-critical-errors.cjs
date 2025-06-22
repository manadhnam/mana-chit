const fs = require('fs');
const path = require('path');

// Critical fixes for build-blocking errors
const criticalFixes = [
  // Fix unclosed JSX elements
  {
    pattern: /<([A-Z][a-zA-Z]*Icon)([^>]*)$/gm,
    replacement: '<$1$2 />'
  },
  // Fix missing closing tags for icons
  {
    pattern: /return <([A-Z][a-zA-Z]*Icon)([^>]*)$/gm,
    replacement: 'return <$1$2 />'
  },
  // Fix template literal syntax errors in JSX
  {
    pattern: /\$\{([^}]+)\}/g,
    replacement: (match, content) => {
      // Only fix if it's not already properly formatted
      if (match.includes('{') && match.includes('}')) {
        return match;
      }
      return `\${${content}}`;
    }
  }
];

function fixCriticalErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    criticalFixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed critical errors in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Get all TSX files with errors
const errorFiles = [
  'src/pages/mandal-head/MandalStaffAnalytics.tsx',
  'src/pages/branch-manager/BranchStaffNotifications.tsx',
  'src/pages/agent/MeetingNotes.tsx',
  'src/pages/mandal-head/CustomerCommunication.tsx',
  'src/components/branch/BranchManagement.tsx',
  'src/pages/agent/AgentAnalytics.tsx',
  'src/pages/customer/LoanRepaymentSchedule.tsx',
  'src/pages/customer/MyProfile.tsx',
  'src/pages/department-head/DepartmentStaffDirectory.tsx',
  'src/pages/department-head/StaffList.tsx',
  'src/pages/department-head/StaffManagement.tsx',
  'src/pages/mandal-head/AgentManagement.tsx',
  'src/pages/mandal-head/BranchManagement.tsx',
  'src/pages/mandal-head/BranchSetup.tsx',
  'src/pages/mandal-head/CustomerAccountManagement.tsx',
  'src/pages/mandal-head/CustomerActivity.tsx',
  'src/pages/mandal-head/CustomerManagement.tsx',
  'src/pages/mandal-head/CustomerOnboarding.tsx',
  'src/pages/mandal-head/CustomerProfile.tsx',
  'src/pages/mandal-head/MandalStaffDirectory.tsx',
  'src/pages/mandal-head/MandalStaffNotifications.tsx',
  'src/pages/super-admin/BranchManagement.tsx',
  'src/pages/super-admin/ControlPanel.tsx',
  'src/pages/super-admin/IVRSettings.tsx'
];

console.log('Fixing critical syntax errors...');

errorFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    fixCriticalErrors(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('Critical error fixes completed!'); 