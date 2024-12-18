import { ChatLayout } from './features/chat/components/ChatLayout';
import { Navbar } from './components/common/Navbar';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={true}
    >
      <div className="flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-white to-[#EFE9FC] dark:from-[#1C0B43] dark:to-[#1C0B43]">
        <Navbar />
        <div className="h-8" />
        <ChatLayout onSendMessage={handleSendMessage} />
      </div>
    </ThemeProvider>
  );
}