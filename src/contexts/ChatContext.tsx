import React, { createContext, useContext, useState } from "react";
import { config } from "../../config";
import { ChatSession } from "../features/chat/types";

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | undefined;
  handleSendMessage: (content: string, file?: File) => Promise<any>;
  handleNewChat: () => Promise<void>;
  handleSelectSession: (sessionId: string) => void;
  setSessions: (newSessions: ChatSession[]) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  // Function to update sessions
  const handleSetSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
  };

  // Function to set error
  const handleSetError = (error: string | null) => {
    setError(error);
  };

  const createChat = async (name: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in local storage.");
    }

    const response = await fetch(`${config.apiUrl}/v1/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create chat");
    }

    return response.json();
  };

  const handleNewChat = async () => {
    const name = prompt("Enter the name of the chat:");
    if (!name) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found in local storage.");
      return;
    }

    try {
      const responseData = await createChat(name);

      setSessions((prevSessions) => [
        {
          id: responseData.data.id,
          title: responseData.data.name,
          timestamp: new Date(responseData.data.createdAt),
        },
        ...prevSessions,
      ]);

      setCurrentSessionId(responseData.data.id);
      setError(null);
    } catch (error) {
      console.error("Error creating chat:", error);
      setError("An unexpected error occurred");
    }
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content && !file) {
      console.log("No content or file to send.");
      return;
    }

    if (!currentSessionId) {
      await handleNewChat();
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in local storage.");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiUrl}/v1/messages/${currentSessionId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      const responseData = await response.json();
      console.log("Message sent successfully:", responseData);
      return responseData;

      //   if (responseData.error) {
      //     console.log("Failed to get AI response:", responseData);
      //   } else {
      //     console.log("AI response received:", responseData);
      //   }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSessionId,
        handleSendMessage,
        handleNewChat,
        handleSelectSession,
        setSessions: handleSetSessions,
        error,
        setError: handleSetError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
