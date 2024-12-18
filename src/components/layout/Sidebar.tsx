import { Search, Plus, Database } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg">
            <Plus className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Today</h3>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-gray-500" />
              Database Intro
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}