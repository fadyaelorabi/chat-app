import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/ProviderChat";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import { useState } from "react";
function ChatPage() {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  console.log("from chatpage:",user);

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
    <header className="sticky top-0 z-30 border-b border-slate-700 bg-slate-800/60 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <h1 className="text-lg font-extrabold tracking-tight text-white">
            Chat App
          </h1>
        </div>
        {user && (
          <span className="hidden text-sm text-slate-300 md:inline">
            Welcome, {user?.data?.user?.name || "User"}
          </span>
        )}
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 py-4">
      {user && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <aside className="md:col-span-3">
            <SideDrawer />
          </aside>

          <section
            className={`${
              selectedChat ? "hidden md:block" : "block"
            } rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl md:col-span-4`}
          >
            <MyChats fetchAgain={fetchAgain}setFetchAgain={setFetchAgain}/>
          </section>

          <section
            className={`${
              selectedChat ? "block" : "hidden md:block"
            } h-[70vh] rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl md:col-span-5 md:h-[75vh]`}
          >
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </section>
        </div>
      )}
    </main>
  </div>
);
}

export default ChatPage;
