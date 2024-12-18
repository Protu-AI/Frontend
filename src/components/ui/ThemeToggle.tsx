import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button 
      onClick={toggleTheme}
      className="w-8 h-8 rounded-full flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-[#5F24E0]" />
      ) : (
        <Moon className="h-5 w-5 text-[#5F24E0]" />
      )}
    </button>
  );
}