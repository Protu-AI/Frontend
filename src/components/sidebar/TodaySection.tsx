import { Database } from 'lucide-react';

export function TodaySection() {
  return (
    <div>
      <h3 className="font-archivo font-semibold text-base text-text-secondary">Today</h3>
      <button className="w-full mt-2 text-left px-3 py-2">
        <div className="flex items-center">
          <Database className="h-4 w-4 mr-2" />
          <span className="font-archivo text-nav text-text-tertiary">
            Database Intro
          </span>
        </div>
      </button>
    </div>
  );
}