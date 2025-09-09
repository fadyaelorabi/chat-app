import { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ProviderChat";
import { useNavigate } from "react-router-dom";
import UserListItem from "./UserListItem";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = ChatState();
  console.log("user ",user)

  const handleSearch = async () => {
    if (!search) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.data?.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setSearchResult(data.data);
      console.log(data, "dataaaaaaa");
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  return (
    <aside className="w-full rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl shadow-2xl text-slate-100">
      <div className="border-b border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-600 bg-slate-700 font-semibold text-slate-100">
            {user?.data?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Signed in as
            </p>
            <p className="truncate text-sm font-semibold">
              {user?.data?.user?.name || "User"}
            </p>
          </div>
          <button
            onClick={logoutHandler}
            className="ml-auto inline-flex items-center rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search users"
            className="flex-1 rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
          />
          <button
            onClick={handleSearch}
            className="inline-flex items-center rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Go
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-12 w-full animate-pulse rounded-lg bg-slate-700/60" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-slate-700/60" />
              <div className="h-12 w-full animate-pulse rounded-lg bg-slate-700/60" />
            </div>
          ) : (
            <ul className="divide-y divide-slate-700 rounded-lg border border-slate-700">
              {searchResult.length === 0 && (
                <li className="p-4 text-sm text-slate-400">No results</li>
              )}
              {searchResult.map((u) => (
                <li key={u.id}>
                  <UserListItem user={u} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

export default SideDrawer;