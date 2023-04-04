import { Divider, IconButton } from "@mui/material";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {SiPcgamingwiki} from 'react-icons/si'
import {GiBurningSkull, GiHandOfGod} from 'react-icons/gi'
import { client } from "../client";
const Shop = ({user}) => {
  const navigate = useNavigate();

  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }
  async function handleBuy(userId, coins) {
    try {
      // Retrieve user information from Sanity.io backend
      const user = await client.fetch(`*[_type == "user" && _id == "${userId}"][0]`);
  
      // Check if user has enough coins
      if (user?.coins >= coins) {
        // Deduct coins from user account
        const newCoins = user?.coins - coins;
  
        // Update user schema in the backend
        await client.patch(userId)
          .set({ coins: newCoins, mark:"true" })
          .commit()
          .then(()=>{
            window.location.reload()
          })
  
        // Process the purchase
        // ...
  
      } else {
        // Display error message to user
        console.log('Insufficient coins');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full ml-3 flex flex-col">
      <div className="flex gap-2 mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
        <IconButton onClick={handleClick}>
          <BiArrowBack fontSize={24} />
        </IconButton>
        <p className="text-xl font-bold">Shop</p>
      </div>
      <div className=" p-3">
        <div className="text-3xl w-full font-black flex justify-between mt-14">
        <h1 className="text-[#b1aeae]">Checkmarks</h1>
        <div className="bg-[rgb(255,255,255,0.1)] p-2 gap-3 flex items-center justify-center rounded-lg">
            <BsCoin className="text-yellow-300" fontSize={25}/>
            <p className="text-lg">{user?.coins} coins</p>
        </div>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <MdVerified fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">Basic Checkmark</h2>
                <button onClick={()=>{handleBuy(user?._id,200)}} className="mt-3 w-full flex items-center p-2 rounded-lg justify-around" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    <BsCoin className="text-yellow-300" fontSize={25}/>
                    200 coins
                </button>
            </div>
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <MdVerified className="text-[#1DA1F2]" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">Blue Checkmark</h2>
                <button className="mt-3 w-full flex items-center p-2 rounded-lg justify-around" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    <BsCoin className="text-yellow-300" fontSize={25}/>
                    2000 coins
                </button>
            </div>
        </div>
      </div>
      <div className=" p-3">
        <div className="text-3xl w-full font-black flex justify-between">
        <h1 className="text-[#b1aeae]">Accessories</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <SiPcgamingwiki fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">Gaming Pc</h2>
                <button className="mt-3 w-full flex items-center p-2 rounded-lg justify-around" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    <BsCoin className="text-yellow-300" fontSize={25}/>
                    200 coins
                </button>
            </div>
                <div className="hand p-2 rounded-xl">
            <div className="border-2 bg-black w-[200px] border-[#222222] rounded-xl flex items-center justify-center flex-col">

                <GiHandOfGod className="" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">Hand of God</h2>
                <button className="mt-3 w-full flex items-center p-2 rounded-lg justify-around" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    <BsCoin className="text-yellow-300" fontSize={25}/>
                    2500 coins
                </button>
            </div>
                </div>
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <GiBurningSkull className="" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">Burning Skull</h2>
                <button className="mt-3 w-full flex items-center p-2 rounded-lg justify-around" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    <BsCoin className="text-yellow-300" fontSize={25}/>
                    1000 coins
                </button>
            </div>
        </div>
      </div>
      <div className=" p-3">
        <div className="text-3xl w-full font-black flex justify-between">
        <h1 className="text-[#b1aeae]">Coins</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <BsCoin className="text-yellow-300  mt-2" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">500</h2>
                <button className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    $3
                </button>
            </div>
                
            <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
                <BsCoin className="text-yellow-300  mt-2" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">2000</h2>
                <button className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    $10
                </button>
            </div>
            <div className="hand p-2 rounded-xl">
            <div className="border-2 bg-black w-[200px]  border-[#222222] rounded-xl flex items-center justify-center flex-col">

                <BsCoin className="text-yellow-300 mt-2" fontSize={120}/>
                <h2 className="font-bold text-xl text-gray-300 mt-2">5000</h2>
                <button className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2" style={{boxShadow:'0px 0px 4px 1px #333333'}}>
                    $25 coins
                </button>
            </div>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
