import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { client, urlFor } from "../client";
import { GoVerified } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { ArrowRightIcon, SearchIcon } from "@heroicons/react/outline";
import { AiFillFire, AiOutlineFire, AiOutlineSetting } from "react-icons/ai";
import Divider from "@mui/material/Divider";

const RightBar = ({ theme, switchtheme, user }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    const query = `*[ _type == 'pin' && userId == '${user?._id}' && defined(image{
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
    <div className="md:block hidden md:ml-14 ml-0 overflow-y-scroll overflow-x-hidden h-screen w-full min-w-210" >
      <div className="absolute overflow-y-auto overflow-x-hidden h-screen min-w-210">
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
              src={
                data[0]
                  ? data[0] &&
                    urlFor(data[0]?.image?.asset?.url).width(120).height(120)
                  : random[0] && urlFor(random[0]?.image?.asset?.url)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              style={{ borderTopLeftRadius: "20px" }}
              alt=""
            />
            <img
              src={
                data[1]
                  ? data[1] &&
                    urlFor(data[1]?.image?.asset.url).width(120).height(120)
                  : random[1] &&
                    urlFor(random[1]?.image?.asset?.url).width(120).height(120)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              alt=""
            />
            <img
              src={
                data[2]
                  ? data[2] &&
                    urlFor(data[2]?.image?.asset.url).width(120).height(120)
                  : random[2] &&
                    urlFor(random[2]?.image?.asset?.url).width(120).height(120)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              alt=""
              style={{ borderTopRightRadius: "20px" }}
            />
          </div>
          <div className="flex">
            <img
              src={
                data[3]
                  ? data[3] &&
                    urlFor(data[3]?.image?.asset.url).width(120).height(120)
                  : random[3] &&
                    urlFor(random[3]?.image?.asset?.url).width(120).height(120)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              style={{ borderBottomLeftRadius: "20px" }}
              alt=""
            />
            <img
              src={
                data[4]
                  ? data[4] &&
                    urlFor(data[4]?.image?.asset.url).width(120).height(120)
                  : random[4] &&
                    urlFor(random[4]?.image?.asset?.url).width(120).height(120)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              alt=""
            />
            <img
              src={
                data[5]
                  ? data[5] &&
                    urlFor(data[5]?.image?.asset.url)
                      .url()
                      .width(120)
                      .height(120)
                  : random[5] &&
                    urlFor(random[5]?.image?.asset?.url).width(120).height(120)
              }
              className="w-[120px] object-cover h-[120px] bg-yellow-400"
              alt=""
              style={{ borderBottomRightRadius: "20px" }}
            />
          </div>
        </div>
        <div className="bg-[#15181c]  mt-3 rounded-xl">
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
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/cars`}>
              <p className="hover:underline cursor-pointer">#Cars</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/fitness`}>
              <p className="hover:underline cursor-pointer">#Fitness</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/websites`}>
              <p className="hover:underline cursor-pointer">#Websites</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/wallpaper`}>
              <p className="hover:underline cursor-pointer">#Wallpaper</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/photo`}>
              <p className="hover:underline cursor-pointer">#Photo</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/food`}>
              <p className="hover:underline cursor-pointer">#Food</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/nature`}>
              <p className="hover:underline cursor-pointer">#Nature</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/travel`}>
              <p className="hover:underline cursor-pointer">#Travel</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/quotes`}>
              <p className="hover:underline cursor-pointer">#Quotes</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/cats`}>
              <p className="hover:underline cursor-pointer">#Cats</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/dogs`}>
              <p className="hover:underline cursor-pointer">#Dogs</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
                </button>
              </div>
            </div>
            <div className="flex p-2 flex-row border-b-2 border-b-[#444444]">
              <div className="flex flex-col w-1/2">
              <p className="text-sm text-[#6E767D] cursor-pointer">Treanding in World</p>
              <Link to={`/category/others`}>
              <p className="hover:underline cursor-pointer">#Others</p>
              </Link>
              </div>
              <div className="flex justify-end w-1/2 p-2">
                <button className="fire p-1 hover:text-amber-500">
                    <AiOutlineFire fontSize={25}/>
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
