import { Plus } from 'lucide-react';

export function AddButton() {
  return (
    <button className="mt-4 flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-200">
      <Plus className="h-5 w-5 text-white" />
    </button>
  );
}