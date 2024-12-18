import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from './ChatInput';
import { WelcomeMessage } from './WelcomeMessage';
import { BackgroundDecoration } from './BackgroundDecoration';
import { ChatMessages } from './ChatMessages';
import { useThemeStore } from '../../store/themeStore';

export function ChatSection() {
  const [message, setMessage] = useState('');
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const theme = useThemeStore((state) => state.theme);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      setHasStartedChat(true);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm here to help! Let me know what you'd like to learn about.",
          isUser: false 
        }]);
      }, 1000);
      
      setMessage('');
    }
  }, [message]);

  return (
    <div className="h-full flex flex-col relative">
      {!hasStartedChat ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-7 relative z-10">
            <WelcomeMessage username="Mahmoudi" />
            <ChatInput
              message={message}
              onChange={setMessage}
              onSend={handleSendMessage}
            />
          </div>
          <AnimatePresence>
            <BackgroundDecoration />
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <ChatMessages messages={messages} />
          <motion.div 
            className="p-8 flex justify-center"
            initial={{ width: 772 }}
            animate={{ width: 1260 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ChatInput
              message={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              expanded
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}