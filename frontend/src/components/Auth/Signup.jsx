import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const postDetails = async (file) => {
    if (!file) {
      alert("Please select an image!");
      return;
    }
    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dosemzdmj");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dosemzdmj/image/upload",
        { method: "POST", body: data }
      );
      const uploadedPic = await res.json();
      if (uploadedPic.secure_url) {
        setPic(uploadedPic.secure_url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, pic }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Unknown error");
      }
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chat");
    } catch (error) {
      alert("Error Occurred: " + (error?.message || "Unknown error"));
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPic("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign up to start chatting with your friends.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl shadow-2xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-200"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label
                  htmlFor="pic"
                  className="block text-sm font-medium text-slate-200"
                >
                  Profile Picture
                </label>
                <input
                  id="pic"
                  onChange={(e) => postDetails(e.target.files?.[0])}
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-slate-100 hover:file:bg-slate-600/90"
                />
                {uploading && !pic && (
                  <p className="mt-2 text-xs text-slate-400">Uploading...</p>
                )}
                {pic && (
                  <div className="mt-3">
                    <img
                      src={pic}
                      alt="Profile preview"
                      className="h-16 w-16 rounded-full border border-slate-600 object-cover"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || uploading}
                className="relative inline-flex w-full items-center justify-center rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : "Signup"}
              </button>
            </form>
            \ {/* Login Option */}
            <p className="mt-4 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Login
              </Link>
            </p>
          </div>
          <div className="h-2 w-full rounded-b-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
