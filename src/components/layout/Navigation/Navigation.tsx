import { useLocation } from 'react-router-dom';
import { NavigationLink } from './NavigationLink';
import { navigationItems } from './NavigationItems';

export function Navigation() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center justify-center flex-1">
      <div className="flex items-center">
        {navigationItems.map(({ path, label }, index) => (
          <div key={path} className={index < navigationItems.length - 1 ? 'mr-[70px]' : ''}>
            <NavigationLink
              path={path}
              label={label}
              isActive={location.pathname === path}
            />
          </div>
        ))}
      </div>
    </div>
  );
}