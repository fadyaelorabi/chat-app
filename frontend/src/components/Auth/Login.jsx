import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Login Successful!");
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
    // Clear form fields
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Login to continue the conversation.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex w-full items-center justify-center rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : "Login"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-400">
              Don’t have an account?{" "}
              <Link
                to="/"
                className="font-medium text-slate-200 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
          <div className="h-2 w-full rounded-b-2xl bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500" />
        </div>
      </div>
    </div>
  );
}

export default Login;
