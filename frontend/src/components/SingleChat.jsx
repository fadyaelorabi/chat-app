import { useState, useEffect } from "react";
import { getSender, getSenderFull } from "../config/ChatLogic";
import { ChatState } from "../context/ProviderChat";
import { Eye } from "lucide-react";
import ProfileModal from "../components/ProfileModal";
import ChatInput from "../components/TailwindCustomComponets/ChatInput";
import { Send } from "lucide-react";
import axios from "axios";


function SingleChat({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user } = ChatState();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log("selectedChat: ", selectedChat);
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();  }, [selectedChat]);

  const sendMessage = async (e) => {
    console.log("newMessage: ", newMessage);
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.data?.token}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data.data);
        setMessages([...messages, data.data]); //////******* */
        console.log("new messageeeeee: ", data.data);
        console.log(" messages: ", messages);

        setNewMessage("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(" messages: ", messages);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indcator
  };

  return (
    <div className="flex flex-col w-full h-full border-l border-slate-700 bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">
          {getSender(user, selectedChat.users).toUpperCase()}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-4">
            {/* Tailwind spinner */}
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : (
          <div>
            <p>Data loaded ✅</p>
          </div>
        )}

        {/* Eye button */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="p-2 rounded-full hover:bg-slate-700 transition"
        >
          <Eye className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender._id === user._id
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-slate-700 text-slate-100"
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-slate-400">
            No messages yet 👀
          </div>
        )}
      </div>

      {/* Chat input (WhatsApp-style) *
       /<ChatInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={() => {
          if (!newMessage.trim()) return;
          setMessages([...messages, { sender: user, content: newMessage }]);
          setNewMessage("");
        }}
      /> */}
      <div className="flex items-center px-3 py-2 bg-slate-800 border-t border-slate-700">
        {/* Input field */}
        <input
          onChange={typingHandler}
          value={newMessage}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send button */}
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          user={getSenderFull(user, selectedChat.users)}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default SingleChat;
