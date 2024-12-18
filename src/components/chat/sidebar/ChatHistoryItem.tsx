import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';

interface ChatHistoryItemProps {
  id: string;
  title: string;
  onSelect: () => void;
}

export function ChatHistoryItem({ id, title, onSelect }: ChatHistoryItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  return (
    <div 
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg transition-colors duration-200 ${
        theme === 'dark' 
          ? 'hover:bg-[#EBEBEB] text-[#EFE9FC] hover:text-[#808080]'
          : 'hover:bg-black/5 text-[#808080] hover:text-[#666666]'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      <div className="flex items-center justify-between p-2">
        <span className="font-archivo text-[20px]">
          {title}
        </span>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="relative"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowOptions(!showOptions);
            }
          }}
        >
          <MoreHorizontal className="h-5 w-5" />
          
          {showOptions && (
            <div 
              className="absolute right-0 mt-1 py-2 px-4 bg-[#EFE9FC] rounded-lg shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="whitespace-nowrap font-archivo font-semibold text-[14px] text-[#0E1117]">
                Options
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}