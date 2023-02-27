import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { client } from "../client";

const Notification = ({ user }) => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }
  

  return (
    <div>
      <div className="flex gap-2 mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
        <IconButton onClick={handleClick}>
          <BiArrowBack fontSize={24} />
        </IconButton>
        <p className="text-xl font-bold">Notifications</p>
      </div>
      <div className="h-[70px]"/>
      <div className="gap-2 p-3">
        {/* {data?.map((item,index)=>{
          <p>{item?.save?.postedBy?.userName}</p>
        })} */}
      </div>
    </div>
  );
};

export default Notification;
