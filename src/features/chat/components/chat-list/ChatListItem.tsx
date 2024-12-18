import { Button } from '@/components/ui/button';
import { ChatSession } from '../../types';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatListItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ChatListItem({ session, isActive, onSelect }: ChatListItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'group relative w-full justify-start rounded-[7px] px-3 py-2.5 font-["Archivo"] text-xl font-normal text-[#808080] dark:text-[#EFE9FC] bg-transparent hover:bg-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#808080] transition-all duration-200',
        isActive && 'bg-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#808080]'
      )}
      onClick={() => onSelect(session.id)}
    >
      <span className="truncate pr-8">{session.title}</span>
      <MoreHorizontal 
        className={cn(
          "absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-0 transition-all duration-200 text-[#808080]",
          "group-hover:opacity-100"
        )} 
      />
    </Button>
  );
}