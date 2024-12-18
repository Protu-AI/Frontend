import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { ProfileSection } from './ProfileSection';
import { useThemeStore } from '../../store/themeStore';

export function Navbar() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[72px] z-50 ${
      theme === 'dark' ? 'bg-[#1C0B43]' : 'bg-white'
    } shadow-[0px_3px_8px_#0000000F]`}>
      <div className="h-full max-w-[1920px] mx-auto px-8 flex items-center justify-between">
        <Logo />
        <Navigation />
        <ProfileSection />
      </div>
    </nav>
  );
}