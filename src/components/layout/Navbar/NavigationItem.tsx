import { Link } from 'react-router-dom';

interface NavigationItemProps {
  path: string;
  label: string;
  isActive: boolean;
}

export function NavigationItem({ path, label, isActive }: NavigationItemProps) {
  return (
    <Link
      to={path}
      className={`
        relative font-archivo font-semibold text-[20px] leading-[22px] text-center
        text-text-primary hover:text-primary transition-colors whitespace-nowrap
        after:content-[''] after:absolute after:left-0 after:bottom-[-4px]
        after:w-full after:h-[2px] after:bg-primary after:transform
        after:scale-x-0 hover:after:scale-x-100 after:transition-transform
        after:origin-center
        ${isActive ? 'text-primary after:scale-x-100' : ''}
      `}
    >
      {label}
    </Link>
  );
}