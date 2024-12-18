import { useCallback } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { ChatHistoryItem } from './ChatHistoryItem';

const chats = [
  { id: '1', title: 'Database Intro' },
  { id: '2', title: 'SQL Basics' },
  { id: '3', title: 'Advanced Queries' },
];

export function ChatSidebarList() {
  const theme = useThemeStore((state) => state.theme);
  
  const handleChatSelect = useCallback((id: string) => {
    console.log('Selected chat:', id);
  }, []);

  return (
    <div>
      <h3 className={`font-archivo font-semibold text-[16px] mb-4 ${
        theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#565656]'
      }`}>
        Today
      </h3>
      <div className="space-y-2">
        {chats.map((chat) => (
          <ChatHistoryItem
            key={chat.id}
            {...chat}
            onSelect={() => handleChatSelect(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}