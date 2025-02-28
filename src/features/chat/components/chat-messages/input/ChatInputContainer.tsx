import { cn } from '@/lib/utils';
import { ChatInput } from './ChatInput';

interface ChatInputContainerProps {
  onSendMessage: (content: string) => void;
  isExpanded: boolean;
}

export function ChatInputContainer({ onSendMessage, isExpanded }: ChatInputContainerProps) {
  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out",
      isExpanded ? "w-[calc(100%-310px)]" : "w-[772px]"
    )}>
      <ChatInput 
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
