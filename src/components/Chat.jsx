import React, { useState, useEffect, useRef } from "react";
import { Divider, IconButton } from "@mui/material";
import { BiArrowBack, BiMessageRounded } from "react-icons/bi";
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
import { MdDelete, MdKeyboardVoice } from "react-icons/md";
import { AiOutlineLink, AiOutlineSend } from "react-icons/ai";
import EmojiPicker from "emoji-picker-react";
import moment from "moment";
import { format, isToday, isYesterday } from "date-fns";

const ChatPage = ({ user, theme }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [chatting, setChatting] = useState();
  const [messages, setMessages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [imageAsset, setImageAsset] = useState();
  const [loading, setLoading] = useState(false);
  const pickerContainerRef = useRef(null);
  const [isVoiceTyping, setIsVoiceTyping] = useState(false);
  const messageContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const query = `*[_type == "message" && (sender == "${user?._id}" && receiver == "${chatting?._id}" || sender == "${chatting?._id}" && receiver == "${user?._id}")] | order(timestamp asc)`;
      const result = await client.fetch(query);

      setMessages(result);
    };

    if (user && chatting) {
      fetchMessages();
    }

    const subscription = client
      .listen(
        `*[_type == "message" && (sender == "${user?._id}" && receiver == "${chatting?._id}" || sender == "${chatting?._id}" && receiver == "${user?._id}")]`
      )
      .subscribe((result) => {
        console.log("New message received:", result.result);
        setMessages((prevMessages) => [...prevMessages, result.result]);
      });

    return () => subscription.unsubscribe();
  }, [user, chatting]);
  const groupedMessages = {};

  messages.forEach((message) => {
    const date = new Date(message._createdAt);
    const dateStr = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM dd");
    if (!groupedMessages[dateStr]) {
      groupedMessages[dateStr] = [];
    }
    groupedMessages[dateStr].push(message);
  });

  const sortedKeys = Object.keys(groupedMessages)
    .sort((a, b) => {
      // if a or b is "Today", set it to the current date
      if (a === "Today") a = moment().format("MMM DD");
      if (b === "Today") b = moment().format("MMM DD");

      // if a or b is "Yesterday", set it to yesterday's date
      if (a === "Yesterday") a = moment().subtract(1, "days").format("MMM DD");
      if (b === "Yesterday") b = moment().subtract(1, "days").format("MMM DD");

      // compare the dates in descending order
      return moment(b, "MMM DD").diff(moment(a, "MMM DD"));
    })
    .reverse();

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji.emoji);
    setShowPicker(false);
  };
  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message: message,
        image: imageAsset && imageAsset,
        sender: user?._id,
        receiver: chatting?._id,
        timestamp: moment().toISOString(),
      };

      try {
        await client.create({
          _type: "message",
          ...newMessage,
        });
        setMessage("");

        const date = new Date(message._createdAt);
        const dateStr = isToday(date)
          ? "Today"
          : isYesterday(date)
          ? "Yesterday"
          : format(date, "MMM dd");
        if (!groupedMessages[dateStr]) {
          groupedMessages[dateStr] = [];
        }
        groupedMessages[dateStr].push(message);
        messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
        setMessages([...messages, { ...newMessage, isSentByMe: true }]);
        setImageAsset(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };
  const startVoiceTyping = () => {
    setIsVoiceTyping(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };
    recognition.start();
    setIsVoiceTyping(false);
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
  console.log(messages);
  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }

  const filteredUsers = users.filter(
    (e) =>
      user?.userName.toLowerCase().includes(inputValue.toLowerCase()) &&
      e._id !== user?._id
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
        {chatting ? (
          <div className="h-full items-center">
            <div className="text-2xl h-full border-b bg-[#0a0a0a] fixed w-[56%]">
              <div className="p-2 w-full flex items-center justify-between border-b border-b-[#151515] ">
                <div className="flex gap-2 items-center justify-center">
                  <img
                    src={
                      chatting?.update === "true"
                        ? urlFor(chatting.image).height(80).width(80)
                        : chatting?.image
                    }
                    className="h-[50px] border border-black rounded-full bg-white"
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                  {chatting?.userName}
                </div>
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
              <div className="flex flex-col scroll overflow-scroll">
                {sortedKeys.map((dateStr) => (
                  <div key={dateStr} className="gap-4">
                    <div className="my-4 text-[white] flex items-center justify-center w-full font-bold text-center">
                      <p className="bg-[#373737] text-base p-2 rounded-lg">
                        {dateStr}
                      </p>
                    </div>
                    {groupedMessages[dateStr].map((message, index) => (
                      <div
                        className={`w-[100%] my-5 flex  ${
                          message?.sender === user?._id ? "justify-end" : ""
                        }`}
                        key={index}
                      >
                        <div
                          className={`text-base relative mt-4 flex min-w-[90px] flex-col p-2 px-4 max-w-[50%] rounded-md  ${
                            message?.sender === user?._id
                              ? "  mr-4  bg-[#0297fa]"
                              : " ml-4  bg-[#2a2929]"
                          }`}
                        >
                          {message?.message}
                          {message?.image?.url && (
                            <div className="mt-3">
                              <img
                                src={message?.image?.url}
                                className="h-[300px] object-cover  w-[300px]"
                                alt=""
                              />
                            </div>
                          )}
                          <p
                            className={`absolute text-[gray] bottom-[-20px] text-sm ${
                              message?.sender === user?._id
                                ? "right-0"
                                : "left-0"
                            }`}
                          >
                            {moment(message._createdAt).format("hh:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>
              {loading && <div>loading</div>}
              {imageAsset ? (
                <div className="ml-2 rounded absolute top-[40%]  h-[300px] w-[300px]">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-pic"
                    className="h-[300px] bg-black rounded w-[300px] object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-black text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ) : (
                ""
              )}
              {showPicker && (
                <div
                  className="absolute text-sm top-[18%] z-50"
                  ref={pickerContainerRef}
                >
                  <EmojiPicker
                    theme={theme === "dark" ? "dark" : "light"}
                    emojiStyle="twitter"
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
              <div className="bg-[#010101] border-t flex justify-around border-t-[#151515] fixed bottom-0 w-[56%] items-center p-2 right-0">
                <div className="px-3 ml-4 bg-[#1d9bf0] flex gap-3 rounded-2xl">
                  <IconButton
                    onClick={() => {
                      setShowPicker(true);
                    }}
                  >
                    <BsEmojiSmile className="" fontSize={30} />
                  </IconButton>

                  <IconButton>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                      id="file-input"
                    />
                    <label htmlFor="file-input">
                      <AiOutlineLink className="" fontSize={30} />
                    </label>
                  </IconButton>
                </div>

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
                <div
                  className={`p-1 mr-4 rounded-full ${
                    isVoiceTyping ? "bg-[red]" : "bg-[#1d9bf0]"
                  }`}
                >
                  <IconButton onClick={startVoiceTyping}>
                    <MdKeyboardVoice fontSize={30} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0a0a0a]  h-full border-b right-0 flex items-center justify-center fixed w-[56%]">
            <div className="flex items-center font-black text-white text-3xl flex-col">
              <BiMessageRounded fontSize={50} />
              Select A User To start Chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
