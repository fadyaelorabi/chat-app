import { useState, useEffect } from "react";
import { ChatState } from "../context/ProviderChat";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const { user } = ChatState();

  return (
    <div>
      {user.name}
      {user.pic}
    </div>
  );
}

export default Profile;
