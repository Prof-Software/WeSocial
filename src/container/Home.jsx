import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Routes, Route, Link } from "react-router-dom";
import { Sidebar, UserProfile } from "../components";
import { client } from "../client";
import logo from "../assets/we.png";
import Pins from "./Pins";
import { homeUser, userQuery } from "../utils/data";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Settings from "../components/Settings";
import Notification from "../components/Notification";
import Splash from "../components/Splash";
import Shop from "../components/Shop";
import Chat from "../components/Chat";
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
const Home = ({themeset}) => {
  const [user, setUser] = useState(null);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const scrollRef = useRef(null);

  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = homeUser(userInfo?.sub);

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
    return localStorage.getItem("theme") || "dark";
  };
  const [theme, setCurrentTheme] = useState(getTheme());

  const switchtheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };
  const setPlay = (theme) => {
    localStorage.setItem("autoplay", theme);
    
  };
  console.log(user)
  // Get theme from local storage
  const getPlay = () => {
    return localStorage.getItem("autoplay") || "off";
  };
  const [autoPlay, setAutoPlay] = useState(getPlay());

  const switchPlay = () => {
    const newPlayer = autoPlay === "off" ? "on" : "off";
    setAutoPlay(newPlayer);
    setPlay(newPlayer);
  };

  return (
    <ThemeProvider theme={theme ==='dark'? darkTheme : lightTheme}>

    <div className={`flex items-center w-full justify-center ${theme == "dark" ? "bg-[#000]" : "bg-white"}`}>

    <div
      className={`flex ${theme == "dark" ? "bg-[#000]" : "bg-white"}  ${
        theme == "dark" ? "text-white" : "text-black"
      }  flex-row h-screen md:w-[84%] w-full transition-height duration-75 ease-out`}
    >
      <div className="flex h-screen flex-initial">
        <Sidebar user={user && user} autoPlay={autoPlay} theme={theme} />
      </div>
      {/* <div className="flex md:hidden flex-row">
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
              autoPlay={autoPlay}
              user={user && user}
            />
          </div>
        )}
      </div> */}
      <div className="pb-2 flex-1 h-full overflow-y-scroll flex" ref={scrollRef}>
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile theme={theme} />}
          />
          <Route
            path="/chat"
            element={<Chat user={user&&user} theme={theme} />}
          />
          <Route
            path="/shop"
            element={<Shop user={user&&user} theme={theme} />}
          />   
          <Route
            path="/settings"
            element={<Settings theme={theme} autoPlay={autoPlay} switchPlay={switchPlay} switchtheme={switchtheme} />}
          />
          <Route
            path="/notifications"
            element={<Notification theme={theme} user={user && user} autoPlay={autoPlay} switchPlay={switchPlay} switchtheme={switchtheme} />}
          />
          <Route
            path="/*"
            element={
              <Pins
                switchtheme={switchtheme}
                theme={theme}
                autoPlay={autoPlay}
                user={user && user}
                themeset={themeset}
              />
            }
          />
          <Route
            path="/splash-screen"
            element={
              <Splash/>
            }
          />
        </Routes>
      </div>
    </div>
    </div>
    </ThemeProvider>

  );
};

export default Home;
