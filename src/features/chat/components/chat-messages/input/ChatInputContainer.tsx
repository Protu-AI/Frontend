import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";

interface ChatInputContainerProps {
  onSendMessage: (content: string) => void;
  className?: string; // Add className prop
}

export function ChatInputContainer({
  onSendMessage,
  className,
}: ChatInputContainerProps) {
  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out mb-[32px] w-[1150px] mt-[32px]",
        className
      )}
    >
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
}
