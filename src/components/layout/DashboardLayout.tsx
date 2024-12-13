import { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../ui/ThemeToggle';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-end p-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}