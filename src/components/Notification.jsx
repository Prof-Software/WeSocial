import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import moment from "moment";
const Notification = ({ user }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const query = '*[_type == "notification"] | order(_createdAt desc)';
      const result = await client.fetch(query);
      setNotifications(result);
    };
    fetchNotifications();
  }, []);
  
  console.log(notifications);

  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }

  return (
    <div>
      <div className="flex gap-2 border-l-4 border-[#333333] mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
        <IconButton onClick={handleClick}>
          <BiArrowBack fontSize={24} />
        </IconButton>
        <p className="text-xl font-bold">Notifications</p>
      </div>
      <div className="h-[64px]" />
      <div className="gap-2">
        {notifications.map((notification) => (
          <div className="hover:bg-[#121212]  p-3 w-full border-l-4 border-l-[#333333]  bg-[#0c0c0c] border-b-2 border-b-[#151414]" key={notification?._id}>
            <div className="w-full flex justify-between">
            <h2 className="font-black text-white text-xl">{notification?.title}</h2>
            {moment(`${notification._createdAt}`).fromNow()}
            {/* {notification._createdAt} */}
            </div>
            <p className="text-[#999999]">{notification?.about}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
