import Navbar from "./components/Navbar";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";

function App() {
  const [newUser, setNewUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [userJoinedNotification, setUserJoinedNotification] = useState("");

  const socket = io("http://localhost:8000");

  useEffect(() => {
    const userName = prompt("Enter your name to join the chat");
    if (userName) {
      setNewUser(userName);
      socket.emit("new-user-joined", userName);
      setUserJoinedNotification('You have joined the chat');
      setTimeout(()=>{
        setUserJoinedNotification("");
      },3000);
    }

    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("user-joined", (data) => {
      setUserJoinedNotification(`${data.name} joined the chat`);
      setTimeout(() => {
        setUserJoinedNotification("");
      }, 3000);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${data.name} joined the chat`, sender: "System" },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (messageInput.trim()) {
      const message = {
        text: messageInput,
        sender: newUser,
      };

      socket.emit("send-message", message);

      setMessageInput("");
    }
  };

  return (
    <>
      <Navbar />
      <div className=" min-h-screen  bg-purple-200 flex flex-col items-center ">
        {userJoinedNotification && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-blue-500 text-white rounded-lg shadow-md">
            <span>{userJoinedNotification}</span>
          </div>
        )}

        <div className="overflow-y-scroll mt-4 mb-4 max-w-3xl h-[60vh] w-full bg-white p-4 rounded-lg shadow-lg border-2 border-violet-200">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === newUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 m-3 rounded-lg max-w-xs shadow-md ${
                  msg.sender === newUser
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                <span className="font-semibold">
                  {msg.sender === "System" ? "" : msg.sender}
                </span>
                : {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-3xl">
          <form
            action="#"
            className="flex items-center gap-3"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              name="messageInp"
              id="messageInp"
              className="flex-grow p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              type="submit"
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none shadow-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
