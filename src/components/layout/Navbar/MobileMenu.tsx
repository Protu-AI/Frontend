import { Menu, X } from 'lucide-react';
import { Navigation } from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <div className="lg:hidden">
      <button 
        onClick={onToggle}
        className="p-2" 
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-text-primary" />
        )}
      </button>
      
      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white p-6 shadow-lg">
            <div className="flex flex-col h-full">
              <button 
                onClick={onToggle}
                className="self-end p-2 mb-6"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-text-primary" />
              </button>
              <Navigation vertical />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}