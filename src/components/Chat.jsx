import React, { useState, useEffect } from "react";
import { Divider, IconButton } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import {
  BsEmojiLaughing,
  BsEmojiSmile,
  BsFillArrowRightCircleFill,
  BsFillCameraVideoFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { client, urlFor } from "../client";
import { IoMdCall, IoMdMore } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";

const ChatPage = ({ user }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [chatting, setChatting] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const query = `*[_type == "message" && (sender == "${user?._id}" && receiver == "${chatting?._id}" || sender == "${chatting?._id}" && receiver == "${user?._id}")] | order(timestamp asc)`;
      const result = await client.fetch(query);

      setMessages(result);
    };

    if (user && chatting) {
      fetchMessages();
    }
  }, [user, chatting]);
  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message: message,
        sender: user?._id,
        receiver: chatting?._id,
        timestamp: new Date().toISOString(),
      };

      try {
        await client.create({
          _type: "message",
          ...newMessage,
        });
        setMessages([...messages, { ...newMessage, isSentByMe: true }]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    client
      .fetch('*[_type == "user"]')
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const clearAutocomplete = () => {
    setInputValue("");
  };

  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }

  const filteredUsers = users.filter((e) =>
  user.userName.toLowerCase().includes(inputValue.toLowerCase()) && e._id !== user._id
);

  return (
    <div className="h-screen ml-3 w-screen flex flex-col">
      <div className="flex gap-2 bg-[#101010] w-[90vw] mt-0 top-0  fixed items-center py-2 backdrop-blur-md z-50">
        <IconButton onClick={handleClick}>
          <BiArrowBack fontSize={24} />
        </IconButton>
        <p className="text-xl font-bold">Chat</p>
      </div>
      <div className="mt-14 flex">
        <div className="h-[100vh] w-[30%] bg-[#101010]">
          <div className="p-4">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoComplete="off"
                onFocus={clearAutocomplete}
                className="border border-black focus:border-[#1d9bf0] outline-none bg-black p-3 block w-full pl-10 sm:text-sm rounded-md"
                placeholder="Search"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <Divider />
          <div>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="px-4 gap-3 flex items-center justify-between py-2 hover:bg-gray-700"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={
                      user?.update === "true"
                        ? urlFor(user.image).height(80).width(80)
                        : user?.image
                    }
                    className="h-[50px] border border-black rounded-full bg-white"
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                  <h1 className="text-lg font-bold">{user.userName}</h1>
                </div>
                <IconButton
                  onClick={() => {
                    setChatting(user);
                  }}
                >
                  <BsFillArrowRightCircleFill fontSize={25} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
        <div className="h-full items-center">
          <div className="text-2xl h-full border-b bg-[#0a0a0a] fixed w-[56%]">
            <div className="p-2 w-full flex items-center justify-between border-b border-b-[#151515] ">
              {chatting?.userName}
              <div className="text-white gap-3 flex">
                <div className="rounded-full bg-black">
                  <IconButton>
                    <IoMdCall />
                  </IconButton>
                </div>
                <div className="rounded-full bg-black">
                  <IconButton>
                    <BsFillCameraVideoFill />
                  </IconButton>
                </div>
                <div className="rounded-full bg-black">
                  <IconButton>
                    <IoMdMore />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {messages.map((message, index) => (
                <div
                  className={`w-[100%] flex ${
                    message.sender === user?._id ? "justify-end" : ""
                  }`}
                  key={index}
                >
                  <div
                    className={`text-base mt-4 p-2 w-[50%] rounded-bl-2xl ${
                      message.sender === user?._id
                        ? "rounded-tl-2xl mr-4 rounded-br-2xl bg-[#39749b]"
                        : "rounded-tr-2xl ml-4 rounded-br-2xl bg-[gray]"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#010101] border-t flex justify-around border-t-[#151515] fixed bottom-0 w-[56%] items-center p-2 right-0">
              <BsEmojiSmile className="ml-4 text-[#1d9bf0]" fontSize={30} />
              <div className="bg-[#3f3e3e] rounded-2xl flex w-[70%] h-[45px]">
                <input
                  type="text"
                  placeholder="Message.."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  className="w-[85%] text-base border border-black focus:border-[#1d9bf0] px-2 bg-[#101010] outline-none  rounded-l-2xl"
                />
                <div className="w-[15%] flex items-center justify-center text-white">
                  <IconButton onClick={handleSendMessage}>
                    <AiOutlineSend className="text-white" />
                  </IconButton>
                </div>
              </div>
              <div className="p-1 mr-4 rounded-full bg-[#1d9bf0]">
                <IconButton>
                  <MdKeyboardVoice fontSize={30} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
