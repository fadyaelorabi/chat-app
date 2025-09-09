import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useState } from "react";
import { ChatState } from "../context/ProviderChat";
import { Eye } from "lucide-react";

function GroupChat({ fetchAgain, setFetchAgain }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { selectedChat } = ChatState();

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">
          {selectedChat.chatName.toUpperCase()}
        </h2>

        {/* Eye button aligned right */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="p-2 rounded-full hover:bg-slate-700 transition"
        >
          <Eye className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <UpdateGroupChatModal
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
}

export default GroupChat;
