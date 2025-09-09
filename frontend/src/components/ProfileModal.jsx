import React from "react";

function ProfileModal({ user, onClose }) {
  if (!user) return null; // safety check

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {/* Avatar */}
        <div className="flex justify-center">
          <img
            src={user.pic || "https://via.placeholder.com/150"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-2 border-slate-600 object-cover"
          />
        </div>

        {/* User details */}
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-slate-100">{user.name}</h3>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
