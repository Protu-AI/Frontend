import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center h-[32px] w-[159.54px]"
    >
      <Brain className="h-8 w-8 text-primary" />
      <span className="ml-2 font-archivo font-semibold text-text-primary whitespace-nowrap">
        PROTU
      </span>
    </Link>
  );
}