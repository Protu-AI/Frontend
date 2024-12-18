import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

interface NavigationItemProps {
  path: string;
  label: string;
  isActive: boolean;
}

export function NavigationItem({ path, label, isActive }: NavigationItemProps) {
  const theme = useThemeStore((state) => state.theme);
  
  return (
    <Link
      to={path}
      className={`
        relative font-archivo font-semibold text-[20px] leading-[22px] text-center
        ${theme === 'dark' ? 'text-[#D6D6D6] hover:text-[#BFA7F3]' : 'text-[#0E1117] hover:text-[#5F24E0]'}
        transition-colors whitespace-nowrap
        after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
        after:w-full after:h-[2px] 
        ${theme === 'dark' ? 'after:bg-[#BFA7F3]' : 'after:bg-[#5F24E0]'}
        after:transform after:scale-x-0 hover:after:scale-x-100 
        after:transition-transform after:duration-300 after:ease-in-out
        ${isActive ? 'after:scale-x-100' : ''}
      `}
    >
      {label}
    </Link>
  );
}