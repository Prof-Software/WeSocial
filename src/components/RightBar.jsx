import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { client, urlFor } from "../client";
import { GoVerified } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { ArrowRightIcon, SearchIcon } from "@heroicons/react/outline";
import { AiFillFire, AiOutlineFire, AiOutlineSetting } from "react-icons/ai";
import Divider from "@mui/material/Divider";
import { MdVerified } from "react-icons/md";
import { Tooltip } from "@mui/material";

const RightBar = ({ theme, switchtheme, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    const query = `*[ _type == 'pin'  && defined(image{
      asset->{
        url
      }
    },)] {
    image{
      asset->{
        url
      }
    },
  }`;
  }, []);

  const [random, setRandom] = useState([]);
  useEffect(() => {
    const query = `*[ _type == 'pin' && defined(image{
      asset->{
        url
      }
    },)] {
    image{
      asset->{
        url
      }
    },
  }`;
    client.fetch(query).then((data) => {
      setRandom(data);
    });
  }, []);
  console.log(data);
  return (
    <div className="md:block hidden md:ml-14 ml-0 overflow-y-scroll overflow-x-hidden h-screen w-full min-w-210">
      <div className="absolute overflow-y-auto overflow-x-hidden h-screen min-w-210">
        <div
          className={`flex items-center bg-[#202327] ${
            theme !== "dark" && "bg-[#eeeeee]"
          } rounded-full mt-3`}
        >
          <SearchIcon
            className={`text-gray-500 ${
              theme !== "dark" && "text-gray-700"
            } ml-3 h-5 z-50 absolute`}
          />
          <input
            type="text"
            className={`bg-transparent abs placeholder-gray-500 ${
              theme !== "dark" && "placeholder-gray-400 focus:bg-white"
            }  outline-none text-[#d9d9d9] pl-10 p-3 pr-10 inset-0  border border-transparent w-full focus:border-[#1d9bf0] rounded-full  focus:bg-black focus:shadow-lg`}
            placeholder="Search WeSocial"
          />
        </div>
        {user && (
          <div className="w-[360px] rounded-xl mt-4 p-[2px] green-pink-gradient">
            <div className="rounded-xl bg-black flex flex-col">
              <div className="p-2">
                <h3 className="text-lg">Events</h3>
              </div>
              <Divider />
              <div className="w-full h-[50px] flex justify-between items-center">
                <Tooltip title="Blue Checkmark">
                  <div className="h-full rounded-bl-xl flex items-center  justify-center w-[70px] bg-[rgb(255,255,255,0.1)]">
                    <MdVerified
                      className="opacity-20 hover:opacity-100 transition-all hover:text-blue-500"
                      fontSize={40}
                    />
                  </div>
                </Tooltip>
                <div className="flex flex-col relative">

                <p className="p-2 font-black text-xl mt-2">Verification Showdown</p>
                <p className="text-[gray] absolute text-sm right-[10px]">Ongoing</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!user && (
          <div
            className={`w-[360px] border p-3 border-[#15181c] ${
              theme !== "dark" && "border-[#7e8389]"
            } mt-3 rounded-xl`}
          >
            <h1 className="text-xl font-extrabold">New to WeSocial?</h1>
            <p
              className={`text-sm font-thin text-gray-400 ${
                theme !== "dark" && "text-gray-500"
              }`}
            >
              Sign up now and get your own personalized timeline!
            </p>
            <button
              className={`bg-[#1d9bf0] p-2 w-full mt-2 text-xl rounded ${
                theme !== "dark" && "text-white"
              }`}
            >
              <Link to={`/login`}>Login</Link>
            </button>
          </div>
        )}
        <div
          className={`bg-[#15181c]  mt-3 rounded-xl ${
            theme !== "dark" && "bg-[#eeeeee]"
          }`}
        >
          <div
            className="flex items-center"
            style={{ borderBottom: "2px solid #444444" }}
          >
            <div className="p-2 text-xl flex w-1/2 justify-start font-bold">
              Popular Topics
            </div>
            <div className="p-2 text-xl flex w-1/2 justify-end font-bold">
              <button className="settings p-1 hover:text-blue-400">
                <AiOutlineSetting fontSize={25} />
              </button>
            </div>
          </div>
          <div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/cars`}>
                  <p className="hover:underline cursor-pointer">#Cars</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/fitness`}>
                  <p className="hover:underline cursor-pointer">#Fitness</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/websites`}>
                  <p className="hover:underline cursor-pointer">#Websites</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/wallpaper`}>
                  <p className="hover:underline cursor-pointer">#Wallpaper</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/photo`}>
                  <p className="hover:underline cursor-pointer">#Photo</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/food`}>
                  <p className="hover:underline cursor-pointer">#Food</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/nature`}>
                  <p className="hover:underline cursor-pointer">#Nature</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/travel`}>
                  <p className="hover:underline cursor-pointer">#Travel</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/quotes`}>
                  <p className="hover:underline cursor-pointer">#Quotes</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/cats`}>
                  <p className="hover:underline cursor-pointer">#Cats</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/dogs`}>
                  <p className="hover:underline cursor-pointer">#Dogs</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
                <p className="text-sm text-[#6E767D] cursor-pointer">
                  Treanding in World
                </p>
                <Link to={`/category/others`}>
                  <p className="hover:underline cursor-pointer">#Others</p>
                </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                  <AiOutlineFire fontSize={25} />
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-col cursor-pointer text-blue-400 mb-10">
              <p>Show More</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
