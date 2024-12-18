import { useThemeStore } from '../../../store/themeStore';
import { ChatSidebarHeader } from './ChatSidebarHeader';
import { ChatSidebarSearch } from './ChatSidebarSearch';
import { ChatSidebarList } from './ChatSidebarList';

export function ChatSidebar() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={`w-full h-[calc(100vh-104px)] ${
      theme === 'dark' ? 'bg-[#BFA7F3]' : 'bg-[#F7F7F7]'
    }`}>
      <div className="p-[33px] h-full overflow-y-auto">
        <ChatSidebarHeader />
        <ChatSidebarSearch />
        <ChatSidebarList />
      </div>
    </div>
  );
}