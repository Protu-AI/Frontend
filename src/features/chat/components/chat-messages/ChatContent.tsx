import { useState } from 'react';
import { cn } from '@/lib/utils';
import { WelcomeHeader } from './welcome/WelcomeHeader';
import { ChatInputContainer } from './input/ChatInputContainer';
import { ChatMessages } from './ChatMessages';
import { Message } from '../../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatContentProps {
  onSendMessage: (content: string) => void;
}

export function ChatContent({ onSendMessage }: ChatContentProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    setIsTyping(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "I understand you're interested in this topic. Let me help you with that. Here's what you need to know about it. This is a longer response to demonstrate how the scrolling works with multiple lines of text.",
      role: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, botMessage]);
    onSendMessage(content);
  };

  return (
    <div className="flex h-full relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F7F7F7] dark:bg-[#BFA7F3]/80 rounded-tl-[64px] -z-10 transition-colors duration-1000" />
      
      <div className="w-full flex flex-col">
        <div className={cn(
          "flex-1 transition-opacity duration-500",
          messages.length === 0 && "opacity-0"
        )}>
          <ScrollArea className="h-[calc(100vh-13.5rem)]">
            <ChatMessages messages={messages} />
          </ScrollArea>
        </div>
        
        <div 
          className={cn(
            "flex flex-col items-center w-full absolute transition-all duration-500 ease-in-out",
            isTyping 
              ? "top-auto bottom-8" 
              : "top-1/2 -translate-y-1/2"
          )}
        >
          <WelcomeHeader 
            userName="Talaat"
            isVisible={!isTyping}
          />
          <ChatInputContainer 
            onSendMessage={handleSendMessage}
            isExpanded={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
