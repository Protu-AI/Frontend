import { useLocation } from 'react-router-dom';
import { NavigationItem } from './NavigationItem';
import { navigationConfig } from './navigation.config';
import { cn } from '../../../utils/cn';

interface NavigationProps {
  className?: string;
  vertical?: boolean;
}

export function Navigation({ className, vertical = false }: NavigationProps) {
  const location = useLocation();

  return (
    <div className={cn(
      'items-center justify-center flex-1',
      vertical ? 'flex flex-col space-y-4' : 'flex space-x-8',
      className
    )}>
      {navigationConfig.map((item) => (
        <NavigationItem 
          key={item.path}
          {...item}
          isActive={location.pathname === item.path}
        />
      ))}
    </div>
  );
}