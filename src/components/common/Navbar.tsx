import { MainNav } from './MainNav';
import { ThemeToggle } from './ThemeToggle';
import { UserNav } from './UserNav';
import { Brain } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_3px_8px_rgba(0,0,0,0.05)] dark:shadow-[0_3px_20px_#0E111780] dark:bg-[#1C0B43]">
      <div className="flex h-[4.5rem] items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Brain className="h-10 w-10 text-[#0E1117] dark:text-[#EFE9FC]" />
          <span className="font-semibold text-2xl text-[#0E1117] dark:text-[#EFE9FC]">PROTU</span>
        </div>
        <MainNav className="flex-1 px-16" />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}