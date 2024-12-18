import { Send } from 'lucide-react';

export function MessageInput() {
  return (
    <input
      type="text"
      placeholder="Message to PROTU"
      className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg focus:ring-2 focus:ring-purple-500 transition duration-200"
    />
  );
}