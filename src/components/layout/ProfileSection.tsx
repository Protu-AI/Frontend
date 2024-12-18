import { Sun } from 'lucide-react';

export function ProfileSection() {
  return (
    <div className="flex items-center space-x-4">
      <button className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
        <Sun className="h-5 w-5 text-white" />
      </button>
      <button className="flex items-center">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="h-8 w-8 rounded-full"
        />
      </button>
    </div>
  );
}