import { cn } from '@/lib/utils';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const routes = [
    { href: '/', label: 'Home' },
    { href: '/chatbot', label: 'Chatbot' },
    { href: '/progress', label: 'Progress' },
    { href: '/resources', label: 'Resources' },
    { href: '/community', label: 'Community' },
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <nav className={cn('flex h-full items-center justify-center space-x-[4.375rem]', className)}>
      {routes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className={cn(
            'nav-link text-[#0E1117] hover:text-[#5F24E0] dark:text-[#EFE9FC] dark:hover:text-[#BFA7F3] transition-colors duration-1000',
            route.href === '/chatbot' && 'text-[#5F24E0] dark:text-[#BFA7F3]'
          )}
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
}