import { Search } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

export function ChatSidebarSearch() {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search"
        className={`w-[256px] h-[40px] pl-10 pr-4 rounded-lg font-archivo text-[14px] ${
          theme === 'dark' 
            ? 'bg-[#1C0B43] text-[#EFE9FC] placeholder-[#EFE9FC]'
            : 'bg-[#EFE9FC] text-[#ABABAB] placeholder-[#ABABAB]'
        }`}
      />
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
        theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#ABABAB]'
      }`} />
    </div>
  );
}