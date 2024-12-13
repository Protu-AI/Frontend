import { Home, BookOpen, Users, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Courses', icon: BookOpen, href: '/dashboard/courses' },
  { name: 'Students', icon: Users, href: '/dashboard/students' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Tutor</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-200'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}