import { Link, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

const navigationItems = [
  { path: '/home', label: 'Home' },
  { path: '/chat', label: 'Chat' },
  { path: '/courses', label: 'Courses' },
  { path: '/progress', label: 'Progress' },
  { path: '/resources', label: 'Resources' },
  { path: '/community', label: 'Community' },
  { path: '/about', label: 'About Us' },
];

export function Navigation() {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);

  return (
    <div className="hidden lg:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-8">
        {navigationItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`
              relative font-archivo font-semibold text-[20px] text-center
              ${theme === 'dark' ? 'text-[#D6D6D6] hover:text-[#BFA7F3]' : 'text-[#0E1117] hover:text-[#5F24E0]'}
              transition-colors
              after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
              after:w-full after:h-[2px] 
              ${theme === 'dark' ? 'after:bg-[#BFA7F3]' : 'after:bg-[#5F24E0]'}
              after:transform after:scale-x-0 hover:after:scale-x-100 
              after:transition-transform after:duration-300
              ${location.pathname === path ? 'after:scale-x-100' : ''}
            `}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}