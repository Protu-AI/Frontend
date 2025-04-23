import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WelcomeHeader } from '@/features/chat/components/chat-messages/welcome/WelcomeHeader';
import { ChatInputContainer } from '@/features/chat/components/chat-messages/input/ChatInputContainer';
import { ChatMessages } from '@/features/chat/components/chat-messages/ChatMessages';
import { Message } from '@/features/chat/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface LessonChatWindowProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void; // Use state setter
  userName: string;
}

export function LessonChatWindow({ isOpen, setIsOpen, userName }: LessonChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: content,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Simulate a robot response
      setIsTyping(true);
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString() + '-bot',
          content: `Hello! You said: "${content}". I am a robot placeholder.`,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000); // Simulate delay
    }
  };

  return (
    <>
      {/* Chat Window Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="w-[592px] h-[calc(100%-32px)] bg-[#EFE9FC] dark:bg-[#BFA7F3]/80 rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] mr-[128px] flex flex-col relative transition-colors duration-1000"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Content Area (Messages or Welcome) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center flex-grow pt-[32px]"> {/* Added pt-[32px] to position content at top */}
                  {/* Chatbot Icon Circle */}
                  <div className="w-[80px] h-[80px] rounded-full bg-[#5F24E0] flex items-center justify-center mb-[32px]">
                    <MessageCircle className="w-[40px] h-[40px] text-[#FFBF00]" /> {/* Chat icon */}
                  </div>
                  {/* Welcome Text */}
                  <p className="font-['Archivo'] text-[18px] font-normal text-[#ABABAB] dark:text-[#EFE9FC] text-center mb-[3px] transition-colors duration-1000">
                    Welcome, {userName}!
                  </p>
                  {/* What can I help with? Text */}
                  <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] dark:text-[#BFA7F3] text-center transition-colors duration-1000">
                    What can I help with?
                  </h2>
                </div>
              ) : (
                <ScrollArea className="flex-1 pt-[24px] pb-[24px]"> {/* Added pt-[24px] and pb-[24px] for spacing */}
                   <div className="flex flex-col space-y-6"> {/* Removed pt-[32px] */}
                     <ChatMessages messages={messages} />
                   </div>
                </ScrollArea>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-none mt-[32px]"> {/* Added mt-[32px] */}
              {/* Adjusted ChatInputContainer width for the smaller window */}
              <ChatInputContainer onSendMessage={handleSendMessage} isExpanded={isTyping} className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
