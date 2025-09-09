import { ChatState } from "../context/ProviderChat";
import SingleChat from "./SingleChat";
import GroupChat from "./GroupChat";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user } = ChatState();

  if (!selectedChat || selectedChat.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-900 text-slate-400">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <>
      {selectedChat.isGroupChat ? (
        <GroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
    </>
  );
}
export default ChatBox;
