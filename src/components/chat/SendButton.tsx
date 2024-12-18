import { Send } from 'lucide-react';

export function SendButton() {
  return (
    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 transition duration-200">
      <Send className="h-5 w-5 text-purple-600 hover:text-purple-700" />
    </button>
  );
}