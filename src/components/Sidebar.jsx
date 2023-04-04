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
import { AiOutlineHome, AiOutlineSetting, AiOutlineShop } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { urlFor } from "../client";
import { HomeIcon } from "@heroicons/react/solid";
import { GiFireDash } from "react-icons/gi";
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
import { googleLogout } from "@react-oauth/google";
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
      } h-full overflow-y-scroll w-[60px] md:w-full  hide-scrollbar`}
    >
      <div className="flex flex-col">
        <p className="items-center md:flex hidden justify-center w-14 h-14 hoverAnimation p-0  text-2xl font-bold">
          <GiFireDash fontSize={40} />
        </p>
        <p className="flex items-center md:hidden  top-0 justify-center w-14 h-14 hoverAnimation p-0 absolute text-2xl font-bold">
          <GiFireDash fontSize={40} />
        </p>
        <div className="w-14 h-14 md:hidden flex" />
        <div className="space-y-1 mt-4 mb-2.5">
          <SidebarLink
            theme={theme}
            text="Home"
            link="/"
            Icon={HomeIcon}
            active
          />
          <SidebarLink
            theme={theme}
            text="Explore"
            link="/"
            Icon={HashtagIcon}
          />
          <SidebarLink
            theme={theme}
            text="Notifications"
            link="/notifications"
            Icon={BellIcon}
          />
          <SidebarLink
            theme={theme}
            text="Messages"
            link="/"
            Icon={InboxIcon}
          />
          <SidebarLink
            theme={theme}
            text="Bookmarks"
            link="/"
            Icon={BookmarkIcon}
          />
          <SidebarLink
            theme={theme}
            text="Shop"
            link="/shop"
            Icon={AiOutlineShop}
          />
          <SidebarLink
            theme={theme}
            text="Profile"
            link={`/user-profile/${user?.userId ? user?.userId : user?._id}`}
            Icon={UserIcon}
          />
          <SidebarLink
            theme={theme}
            text="Settings"
            link="/settings"
            Icon={AiOutlineSetting}
          />
        </div>
        <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
          Tweet
        </button>
      </div>
      {user && (
        <Link
          to={`user-profile/${user?.userId ? user?.userId : user?._id}`}
          className={`flex my-5 mb-3 gap-2 p-2 items-center transition-all ${
            theme == "dark" ? "hover:bg-[#121212]" : "bg-white"
          } rounded-lg shadow-lg md:mx-3 `}
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
            className="md:w-10 md:h-10 h-[40px] md:relative absolute rounded-full"
            alt="user-profile"
          />
          <p className="md:block hidden">
            {user.userName.length > 10
              ? user.userName.substring(0, 10) + "..."
              : user.userName}
          </p>
          <IoIosArrowForward className="hidden md:block" />
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
