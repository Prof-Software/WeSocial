import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import {
  IoIosArrowForward,
  IoIosNotificationsOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import logo from "../assets/we.png";
import { categories } from "../utils/data";
import { HiHome } from "react-icons/hi";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { urlFor } from "../client";
import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { googleLogout } from '@react-oauth/google';
import SidebarLink from "./SidebarLink";
const Sidebar = ({ closeToggle, user, theme, autoPlay, to }) => {
  const isNotActiveStyle = `flex items-center  text-2xl  transition-all duration-200 ease-in-out capitalize`;
  const isActiveStyle =
    "flex items-center font-bold text-2xl     border-r-4 border-blue-400  transition-all duration-200 ease-in-out capitalize";
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div
      className={`flex flex-col justify-between ${
        theme == "dark" ? "bg-black" : "bg-white"
      } h-full overflow-y-scroll min-w-210 hide-scrollbar`}
    >
      <div className="flex flex-col">
        <p className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 ml-6 text-2xl font-bold">
          WeSocial
        </p>
        <div className="space-y-1 mt-4 mb-2.5">
          <SidebarLink theme={theme} text="Home" link='/' Icon={HomeIcon} active />
          <SidebarLink theme={theme} text="Explore" link='/' Icon={HashtagIcon}  />
          <SidebarLink theme={theme} text="Notifications" link='/' Icon={BellIcon} />
          <SidebarLink theme={theme} text="Messages" link='/' Icon={InboxIcon}  />
          <SidebarLink theme={theme} text="Bookmarks" link='/' Icon={BookmarkIcon} />
          <SidebarLink theme={theme} text="Lists" link='/' Icon={ClipboardListIcon} />
          <SidebarLink theme={theme} text="Profile" link={`/user-profile/${user?._id}`} Icon={UserIcon} />
          <SidebarLink theme={theme} text="Settings" link='/settings' Icon={AiOutlineSetting} />
        </div>
        <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>

      </div>
      {user && (
        <Link
          to={`user-profile/${user?._id}`}
          className={`flex my-5 mb-3 gap-2 p-2 items-center transition-all ${
            theme == "dark" ? "hover:bg-[#121212]" : "bg-white"
          } rounded-lg shadow-lg mx-3`}
          onClick={handleCloseSidebar}
        >
          <img
            src={
              user?.update === "true"
                ? urlFor(user.image).height(80).width(80)
                : user?.image
            }
            // src={
            //   user.update === "true"
            //     ? urlFor(user.image).height(80).width(80)
            //     : user.image
            // }
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
          <IoIosArrowForward onClick={()=>{googleLogout()}}/>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
