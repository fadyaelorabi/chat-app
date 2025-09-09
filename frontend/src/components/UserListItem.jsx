import axios from "axios";
import { ChatState } from "../context/ProviderChat";
function UserListItem({ user }) {
  const { setSelectedChat, chats, setChats } = ChatState();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // Access the token
  const token = userInfo?.data?.token;

  console.log("Token:", token);

  const chatWithUser = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chat", // this should hit your accessChat route
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If chat already exists, don’t duplicate it
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      console.log(" dataaaaaaaaaaaaa:", data);


      setSelectedChat(data);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <li
      key={user._id}
      className="flex items-center gap-3 p-3 hover:bg-slate-700/40"
    >
      {user.pic ? (
        <img
          src={user.pic}
          alt={user.name}
          className="h-9 w-9 rounded-full border border-slate-600 object-cover"
        />
      ) : (
        <div className="h-9 w-9 rounded-full border border-slate-600 bg-slate-700" />
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-100">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
      <button
        onClick={chatWithUser}
        className="ml-auto rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700/60"
      >
        Message
      </button>
    </li>
  );
}

export default UserListItem;
