import { ChatList } from './chat-list/ChatList';
import { ChatContent } from './chat-messages/ChatContent';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockSessions } from '../data/mock';

interface ChatLayoutProps {
  onSendMessage: (content: string) => void;
}

export function ChatLayout({ onSendMessage }: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleNewChat = () => {
    setCurrentSessionId(undefined);
  };

  return (
    <div className="flex flex-1 overflow-hidden pt-8">
      <div 
        className={cn(
          "ml-8 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[100px]" : "w-[400px]"
        )}
      >
        <div 
          className={cn(
            "h-full rounded-[1rem_1rem_0_0] transition-all duration-300 ease-in-out",
            !isCollapsed && "shadow-[0_3px_6px_rgba(0,0,0,0.1)]"
          )}
        >
          <ChatList
            sessions={mockSessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
      </div>
      <div className="flex-1">
        <ChatContent onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
