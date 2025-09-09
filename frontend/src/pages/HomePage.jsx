import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import ChatPage from "./ChatPage";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h2>Welcome to Chat App</h2>
      <p>This is the home page.</p>
    </div>
  );
}

export default HomePage;
