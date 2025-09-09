import React, { useState } from "react";
import { ChatState } from "../context/ProviderChat";
import axios from "axios";

function GroupChatModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();


  // 🔎 Search for users
  const handleSearch = async (query) => {
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
      console.log("Search results:", data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ✅ Create group chat
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupChatName || selectedUsers.length === 0) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.data?.token}` },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data.data, ...chats]);
      setIsOpen(false);
      alert("✅ New Group Chat Created!");
    } catch (error) {
      alert("❌ Failed to create group chat!");
    }
  };

  // ➕ Add or remove user
  const handleSelect = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) return; // avoid duplicates
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  console.log("chat ", chats);

  return (
    <>
      {/* Trigger (button passed as children) */}
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-200">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Create Group Chat</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Group name */}
            <input
              type="text"
              placeholder="Group Chat Name"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring focus:ring-blue-500"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              required
              autoFocus
            />

            {/* User search */}
            <input
              type="text"
              placeholder="Search users"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
            />

            {/* Search results */}
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p className="text-slate-400">Searching...</p>
              ) : searchResult.length > 0 ? (
                searchResult.map((user) => (
                  <div
                    key={user._id}
                    className="px-3 py-1 bg-blue-600 rounded-full text-sm cursor-pointer hover:bg-blue-500"
                    onClick={() => handleSelect(user)}
                  >
                    {user.name}
                  </div>
                ))
              ) : (
                search && <p className="text-slate-500">No users found</p>
              )}
            </div>

            {/* Selected users */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="px-3 py-1 bg-green-600 rounded-full text-sm cursor-pointer hover:bg-green-500"
                  onClick={() => handleDelete(u)}
                >
                  {u.name} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupChatModal;
