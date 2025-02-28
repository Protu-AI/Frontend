import { Message } from '../../types';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100vh-13.5rem)]">
      <div className="flex flex-col space-y-6 pb-[50px]">
        <div className="flex flex-col space-y-6 px-[155px]">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
