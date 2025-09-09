import { ChatState } from "../context/ProviderChat";
import { useState, useEffect } from "react";
import axios from "axios";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";
function MyChats({ fetchAgain, setFetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [chatLoading, setChatLoading] = useState(false);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      console.log("chatssssss: ", data.data);
      setChats(data.data);
      setChatLoading(false);
    } catch (error) {
      console.log(error);
      setChatLoading(false);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  console.log(loggedUser?.data?.user?.id, "loggedUser");
  console.log("user", user);
  console.log("loggedUser", loggedUser);
  console.log("chats", chats);
  return (
    <div
      className={`
        flex flex-col items-center p-3 rounded-lg border border-slate-700 
        bg-slate-900 text-slate-200
        ${selectedChat ? "hidden md:flex" : "flex"}
        ${selectedChat ? "" : "w-full md:w-[31%]"}
      `}
    >
      <h1 className="text-lg font-semibold mb-3 text-slate-100">My Chats</h1>
      {chatLoading && <p className="text-slate-400">Loading chats...</p>}
      {chats &&
        chats.map((chat) => (
          <div
            onClick={() => setSelectedChat(chat)}
            key={chat._id}
            className={`w-full p-2 mb-2 rounded cursor-pointer transition 
            ${
              selectedChat?._id === chat._id
                ? "bg-blue-600 text-white"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {chat.isGroupChat
              ? chat.chatName
              : getSender(loggedUser, chat.users)}
          </div>
        ))}
      <GroupChatModal>
        <button className="w-full p-2 mt-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600">
          Create Group Chat
        </button>
      </GroupChatModal>
    </div>
  );
}

export default MyChats;
