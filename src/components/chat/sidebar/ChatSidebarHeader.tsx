import { Database, Plus } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

export function ChatSidebarHeader() {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <div className="flex items-center justify-between mb-6">
      <button className={`p-2 border-2 rounded-[3px] ${
        theme === 'dark' ? 'border-[#FFBF00] text-[#FFBF00]' : 'border-[#0E1117]'
      }`}>
        <Database className="h-5 w-5" />
      </button>
      <button className="p-2 bg-[#5F24E0] rounded-lg">
        <Plus className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}