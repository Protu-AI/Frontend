import { useCallback } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { SidebarHeader } from './SidebarHeader';
import { SearchInput } from './SearchInput';
import { ChatHistoryItem } from './ChatHistoryItem';

const chats = [
  { id: '1', title: 'Database Intro' },
  { id: '2', title: 'SQL Basics' },
  { id: '3', title: 'Advanced Queries' },
];

export function SidebarList() {
  const theme = useThemeStore((state) => state.theme);

  const handleChatSelect = useCallback((id: string) => {
    // Handle chat selection
    console.log('Selected chat:', id);
  }, []);

  return (
    <div className={`fixed top-[72px] mt-[32px] ml-[32px] w-[320px] h-[calc(100vh-104px)] ${
      theme === 'dark' ? 'bg-[#BFA7F3]' : 'bg-[#F7F7F7]'
    }`}>
      <div className="p-[33px] h-full">
        <SidebarHeader />
        <SearchInput />
        
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
      </div>
    </div>
  );
}