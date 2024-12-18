import { FileText, SendHorizontal } from 'lucide-react';
import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSendMessage, disabled, className }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isHoveringDoc, setIsHoveringDoc] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '72px';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = '72px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '72px';
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      <button
        className="absolute left-[27px] top-[27px] z-10 flex items-center justify-center"
        onMouseEnter={() => setIsHoveringDoc(true)}
        onMouseLeave={() => setIsHoveringDoc(false)}
      >
        <FileText 
          className={cn(
            "h-6 w-6 transition-colors",
            isHoveringDoc ? "text-[#5F24E0] dark:text-[#FFBF00]" : "text-[#A6B5BB] dark:text-[#EFE9FC]"
          )}
        />
      </button>
      <button 
        className={cn(
          "absolute right-[27px] top-[27px] z-10 flex items-center justify-center",
          message.trim() ? "cursor-pointer" : "cursor-default"
        )}
        onClick={message.trim() ? handleSend : undefined}
      >
        <SendHorizontal 
          className={cn(
            "h-6 w-6 transition-colors",
            message.trim() ? "text-[#5F24E0] dark:text-[#FFBF00]" : "text-[#A6B5BB] dark:text-[#EFE9FC]"
          )}
        />
      </button>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message to protu"
        rows={1}
        className="min-h-[72px] w-full resize-none rounded-[24px] border border-[#A6B5BB] dark:border-[#BFA7F3] bg-background dark:bg-[#BFA7F3]/80 px-[72px] py-[27px] font-['Archivo'] text-base font-normal leading-[18px] text-[#A6B5BB] dark:text-[#EFE9FC] placeholder:text-[#A6B5BB] dark:placeholder:text-[#EFE9FC] focus:border-[#5F24E0] dark:focus:border-[#FFBF00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out overflow-hidden"
        disabled={disabled}
      />
    </div>
  );
}