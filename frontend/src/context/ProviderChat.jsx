import { createContext, useState, useEffect, useContext } from "react";

// 1. create context
const ChatContext = createContext();

// 2. create provider
export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const[selectedChat, setSelectedChat] = useState([]);
  console.log("selectedChat: ", selectedChat);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    console.log("userinfo: ", userInfo);
    if (!userInfo) {
      //not logged in
    }
  }, []);


  console.log("user: ", user);

  return (
    <ChatContext.Provider value={{ user, setUser ,chats, setChats, selectedChat, setSelectedChat}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
