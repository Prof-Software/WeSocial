import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../assets/we.png";
import { categories } from "../utils/data";
import { HiHome } from "react-icons/hi";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { AiFillHome } from "react-icons/ai";
import { urlFor } from "../client";

const Sidebar = ({ closeToggle, user, theme }) => {
  const isNotActiveStyle = `flex items-center px-5 gap-3 text-2xl  transition-all duration-200 ease-in-out capitalize`;
  const isActiveStyle =
    "flex items-center font-bold text-2xl  px-5 gap-3  border-r-4 border-blue-400  transition-all duration-200 ease-in-out capitalize";
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
        <Link
          to="/"
          className="flex w-190 flex-col items-center p-5 justify-center"
          onClick={handleCloseSidebar}
        >
          <p className={`${theme == "dark" ? "logo" : "logo-dark"}`}>
            WeSocial
          </p>
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            {isActiveStyle ? <AiFillHome fontSize={25} /> : <AiOutlineHome />}
            Home
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            {isActiveStyle ? (
              <AiOutlineSetting fontSize={25} />
            ) : (
              <AiOutlineHome />
            )}
            Settings
          </NavLink>
          {/* <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover cateogries</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img src={category.image} className="w-8 h-8 rounded-full shadow-sm" />
              {category.name}
            </NavLink>
          ))} */}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className={`flex my-5 mb-3 gap-2 p-2 items-center ${
            theme == "dark" ? "bg-[#121212]" : "bg-white"
          } rounded-lg shadow-lg mx-3`}
          onClick={handleCloseSidebar}
        >
          <img
            src={
              user.update === "true"
                ? urlFor(user.image).height(80).width(80)
                : user.image
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
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
