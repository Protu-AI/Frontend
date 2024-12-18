import { Navbar } from '../components/layout/Navbar';
import { ChatLayout } from '../components/chat/ChatLayout';
import { useThemeStore } from '../store/themeStore';

export default function Chatbot() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1C0B43]' : 'bg-white'}`}>
      <Navbar />
      <div className="pt-[72px]">
        <ChatLayout />
      </div>
    </div>
  );
}