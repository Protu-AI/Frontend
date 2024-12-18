import { ChatSection } from './ChatSection';
import { ChatSidebar } from './sidebar/ChatSidebar';
import { useThemeStore } from '../../store/themeStore';

export function ChatLayout() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="flex h-[calc(100vh-72px)]">
      <div className="w-[320px] mt-[32px] ml-[32px]">
        <ChatSidebar />
      </div>
      <div className={`flex-1 p-[16px_16px_0px_0px] ${
        theme === 'dark' ? 'bg-[#1C0B43]' : 'bg-white'
      }`}>
        <ChatSection />
      </div>
    </div>
  );
}