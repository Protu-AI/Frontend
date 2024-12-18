import { Sun } from 'lucide-react';

export function ThemeToggle() {
  return (
    <button 
      className="w-8 h-8 rounded-full bg-success flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-white" />
    </button>
  );
}