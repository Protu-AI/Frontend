import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Logo() {
  return (
    <Link 
      to="/" 
      className="flex items-center w-[160px] h-8 mt-5 ml-8"
    >
      <Brain className="h-8 w-8 text-primary" />
      <span className="ml-2 font-archivo font-semibold text-text-primary">
        PROTU
      </span>
    </Link>
  );
}