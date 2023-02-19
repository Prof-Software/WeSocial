import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { client } from "../client";
import { GoVerified } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { SearchIcon } from "@heroicons/react/outline";

const RightBar = ({ theme, switchtheme, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [data, setData] = useState([])
  // useEffect(() => {
  //   const query = `*[_type == "pin" && _id == "${user?._id}" ]{
  //   image{
  //     asset->{
  //       url
  //     }
  //   },
  // }`;
  //   client.fetch(query)
  //     .then((data)=>{setData(data)})
  // }, [])
  // console.log(data)
  return (
    <div className="md:block hidden md:ml-14 ml-0  h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="absolute">
        <div className="flex items-center bg-[#202327] rounded-full mt-3">
          <SearchIcon className="text-gray-500 ml-3 h-5 z-50 absolute" />
          <input
            type="text"
            className="bg-transparent abs placeholder-gray-500  outline-none text-[#d9d9d9] pl-10 p-3 pr-10 inset-0  border border-transparent w-full focus:border-[#1d9bf0] rounded-full focus:bg-black focus:shadow-lg"
            placeholder="Search Twitter"
          />
        </div>
        <div>
          <div className="flex mt-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoRrImffR17Vv78rQDecLl3ZaXhkf0FBYYyw&usqp=CAU"
              className="w-[120px] object-cover"
              style={{ borderTopLeftRadius: "20px" }}
              alt=""
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRx4RFKIVciDoIZDj8HNlnmV-9mjqBPfwSzw&usqp=CAU"
              className="w-[120px] object-cover"
              alt=""
            />
            <img
              src="https://pbs.twimg.com/media/Fo8ktcYXEBg0jVa?format=jpg&name=medium"
              className="w-[120px] object-cover"
              alt=""
              style={{borderTopRightRadius:'20px'}}
            />
          </div>
          <div className="flex">
            <img
              src="https://pbs.twimg.com/media/FooEASrWAAAR36j?format=jpg&name=large"
              className="w-[120px] object-cover"
              style={{ borderBottomLeftRadius: "20px" }}
              alt=""
            />
            <img
              src="https://pbs.twimg.com/media/FnQa5zSWIAAWBAp?format=png&name=medium"
              className="w-[120px] object-cover"
              alt=""
            />
            <img
              src="https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/815/cached.offlinehbpl.hbpl.co.uk/news/ORP/airasia12-29-2014-20141229065554526.jpg"
              className="w-[120px] object-cover"
              alt=""
              style={{borderBottomRightRadius:'20px'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
