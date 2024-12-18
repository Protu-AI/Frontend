import { Brain } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-4">
      <div className="space-y-6 max-w-[1260px] mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="flex items-start space-x-6">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  theme === 'dark' ? 'border-[#BFA7F3] text-[#EFE9FC]' : 'border-[#5F24E0] text-[#5F24E0]'
                }`}>
                  <Brain className="w-7 h-7" />
                </div>
                <div className="pt-2 max-w-[600px]">
                  <p className={`font-archivo text-[22px] ${
                    theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#1C0B43]'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            )}
            {message.isUser && (
              <div className="max-w-[600px]">
                <div className={`p-4 rounded-2xl ${
                  theme === 'dark' ? 'bg-[#BFA7F3]' : 'bg-[#EFE9FC]'
                }`}>
                  <p className={`font-archivo text-[22px] ${
                    theme === 'dark' ? 'text-[#EFE9FC]' : 'text-[#1C0B43]'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}