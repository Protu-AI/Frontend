import { SidebarHeader } from './SidebarHeader';
import { SearchBar } from './SearchBar';
import { TodaySection } from './TodaySection';

export function Sidebar() {
  return (
    <div className="fixed left-0 top-nav w-64 h-[calc(100vh-72px)] bg-white">
      <div className="p-4 space-y-4">
        <SidebarHeader />
        <SearchBar />
        <TodaySection />
      </div>
    </div>
  );
}