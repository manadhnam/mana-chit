
import { Sun, Moon } from 'lucide-react';

// This is a placeholder component. A full implementation would
// typically use a theme provider (like next-themes).
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would also toggle a class on the `<html>` element.
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle; 