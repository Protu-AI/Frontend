import { ChatSession } from '../../types';
import { format } from 'date-fns';
import { ChatListItem } from './ChatListItem';

interface ChatListGroupProps {
  date: Date;
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
}

export function ChatListGroup({
  date,
  sessions,
  currentSessionId,
  onSelectSession,
}: ChatListGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-['Archivo'] text-base font-semibold text-[#565656] dark:text-[#EFE9FC] transition-colors duration-1000">
        {format(date, 'MMMM d, yyyy')}
      </h3>
      <div className="space-y-1">
        {sessions.map((session) => (
          <ChatListItem
            key={session.id}
            session={session}
            isActive={session.id === currentSessionId}
            onSelect={onSelectSession}
          />
        ))}
      </div>
    </div>
  );
}
