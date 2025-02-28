export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId?: string;
}
