import React, { useState } from "react";
import { ChatState } from "../context/ProviderChat";
import axios from "axios";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, onClose }) {
  const [isOpen, setIsOpen] = useState(true); // modal opens immediately
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState(
    selectedChat?.chatName || ""
  );
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Rename group chat
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
      setIsOpen(false);
    } catch (error) {
      console.log("❌ Rename failed:", error);
    }
  };

  // ✅ Search users
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );
      setSearchResult(data.data);
      setLoading(false);
    } catch (error) {
      console.log("❌ Search failed:", error);
      setLoading(false);
    }
  };

  // ✅ Add user to group
  const handleAdd = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      alert("User already in group");
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log("❌ Add user failed:", error);
    }
  };

  // ✅ Remove user from group
  const handleRemove = async (userToRemove) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log("❌ Remove user failed:", error);
    }
  };

  if (!isOpen || !selectedChat) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">Group Info</h2>
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="text-slate-400 hover:text-slate-200 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Rename */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
            onChange={(e) => setGroupChatName(e.target.value)}
            placeholder="Change Group name"
          />
          <button
            onClick={handleRename}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Rename
          </button>
        </div>

        {/* Search Users */}
        <input
          type="text"
          placeholder="Search users to add"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
        />
        {loading ? (
          <p className="text-slate-400">Searching...</p>
        ) : (
          <div className="space-y-2">
            {searchResult.map((u) => (
              <div
                key={u._id}
                onClick={() => handleAdd(u)}
                className="cursor-pointer p-2 rounded bg-slate-800 hover:bg-slate-700"
              >
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        )}

        {/* Members */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-300">Members</h4>
          {selectedChat.users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between bg-slate-800 p-2 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={u.pic || "https://via.placeholder.com/150"}
                  alt={u.name}
                  className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
                />
                <div>
                  <p className="text-slate-100">{u.name}</p>
                  <p className="text-slate-400 text-sm">{u.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(u)}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={() => {
            setIsOpen(false);
            if (onClose) onClose();
          }}
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateGroupChatModal;
