import { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { ProfileSection } from './ProfileSection';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-white shadow-nav z-50">
      <div className="h-full w-full max-w-[1920px] mx-auto px-4 lg:px-8 flex items-center justify-between">
        <Logo />
        <Navigation className="hidden lg:flex" />
        <div className="flex items-center gap-4">
          <ProfileSection />
          <MobileMenu 
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>
    </nav>
  );
}