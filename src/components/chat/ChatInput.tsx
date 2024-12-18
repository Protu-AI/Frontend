import { KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface ChatInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  expanded?: boolean;
}

export function ChatInput({ message, onChange, onSend, expanded = false }: ChatInputProps) {
  const theme = useThemeStore((state) => state.theme);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className={`relative ${expanded ? 'w-[1260px]' : 'w-[772px]'}`}>
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message to PROTU"
          className={`w-full h-[72px] pl-[52px] pr-[52px] py-[21px] border rounded-full ${
            theme === 'dark' 
              ? 'bg-[#BFA7F3] border-[#A6B5BB] text-[#EFE9FC] placeholder-[#EFE9FC]' 
              : 'bg-white border-[#A6B5BB] text-[#A6B5BB] placeholder-[#A6B5BB]'
          } focus:outline-none focus:border-[#5F24E0]`}
        />
        <button 
          className="absolute left-[21px] top-1/2 -translate-y-1/2"
          aria-label="Attach file"
        >
          <Paperclip className={`h-5 w-5 ${theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#A6B5BB]'}`} />
        </button>
        <button 
          onClick={onSend}
          className="absolute right-[21px] top-1/2 -translate-y-1/2 transition-colors duration-200"
          aria-label="Send message"
        >
          <Send className={`h-5 w-5 ${
            theme === 'dark' 
              ? 'text-[#EFE9FC] hover:text-[#FFBF00]' 
              : 'text-[#A6B5BB] hover:text-[#5F24E0]'
          }`} />
        </button>
      </div>
    </div>
  );
}