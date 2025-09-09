import { Send } from "lucide-react"; // install with: npm install lucide-react

export default function ChatInput() {
  return (
    <div className="flex items-center px-3 py-2 bg-gray-100 border-t border-gray-300">
      {/* Input */}
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Send button */}
      <button className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
