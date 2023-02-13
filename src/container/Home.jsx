import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Routes, Route, Link } from "react-router-dom";
import { Sidebar, UserProfile } from "../components";
import { client } from "../client";
import logo from "../assets/we.png";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Settings from "../components/Settings";

const Home = ({themeset}) => {
  const [user, setUser] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const scrollRef = useRef(null);

  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });
  // Save theme to local storage
  const setTheme = (theme) => {
    localStorage.setItem("theme", theme);
    
  };

  // Get theme from local storage
  const getTheme = () => {
    return localStorage.getItem("theme") || "light";
  };
  const [theme, setCurrentTheme] = useState(getTheme());

  const switchtheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className={`flex items-center justify-center ${theme == "dark" ? "bg-[#000]" : "bg-white"}`}>

    <div
      className={`flex ${theme == "dark" ? "bg-[#000]" : "bg-white"}  ${
        theme == "dark" ? "text-white" : "text-black"
      }  md:flex-row flex-col h-screen md:w-[84%] w-full transition-height duration-75 ease-out`}
    >
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} theme={theme} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <p className={`${theme == "dark" ? "logo" : "logo-dark"}`}>
              WeSocial
            </p>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              referrerPolicy="no-referrer"
              alt={user?.name}
              className="w-9 h-9 rounded-full "
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div
            className={`${
              theme == "dark" ? "bg-[#000]" : ""
            } fixed w-3/5  h-screen overflow-y-auto shadow-md z-10  animate-slide-in`}
          >
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar
              closeToggle={setToggleSidebar}
              theme={theme}
              user={user && user}
            />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll flex" ref={scrollRef}>
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile theme={theme} />}
          />
          <Route
            path="/settings"
            element={<Settings theme={theme} switchtheme={switchtheme} />}
          />
          <Route
            path="/*"
            element={
              <Pins
                switchtheme={switchtheme}
                theme={theme}
                user={user && user}
                themeset={themeset}
              />
            }
          />
        </Routes>
      </div>
    </div>
    </div>
  );
};

export default Home;
