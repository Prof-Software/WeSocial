import { Divider, IconButton } from "@mui/material";
import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { SiPcgamingwiki } from "react-icons/si";
import { GiBurningSkull, GiHandOfGod } from "react-icons/gi";
import { client } from "../client";
import gold from "../assets/gold.png";
import Coin from "./Coin.svg";
const Shop = ({ user }) => {
  const navigate = useNavigate();

  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }
  const buyPass = async (userId, coins, pass) => {
    if (user?.coins >= coins && user?.pass !== pass) {
      //   // Deduct coins from user account
      const newCoins = user?.coins - coins;
      client
        .patch(userId)
        .set({ coins: newCoins, pass: pass })
        .commit()
        .then(() => {
          window.location.reload();
        });
    } else if (user?.pass === pass && user?.coins >= coins) {
      alert("You already have this pass");
    } else {
      alert("Not enough coins");
    }
  };

  async function handleBuy(userId, coins) {
    try {
      // Retrieve user information from Sanity.io backend
      const user = await client.fetch(
        `*[_type == "user" && _id == "${userId}"][0]`
      );

      // Check if user has enough coins
      if (user?.coins >= coins) {
        // Deduct coins from user account
        const newCoins = user?.coins - coins;

        // Update user schema in the backend
        {
          user?.mark === false
            ? await client
                .patch(userId)
                .set({ coins: newCoins, mark: "true" })
                .commit()
                .then(() => {
                  window.location.reload();
                })
            : alert("You already have this check mark");
        }

        // Process the purchase
        // ...
      } else {
        // Display error message to user
        console.log("Insufficient coins");
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
            <BsCoin className="text-yellow-300" fontSize={25} />
            <p className="text-lg">{user?.coins} coins</p>
          </div>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
          <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
            <MdVerified fontSize={120} />
            <h2 className="font-bold text-xl text-gray-300 mt-2">
              Basic Checkmark
            </h2>
            <button
              onClick={() => {
                handleBuy(user?._id, 200);
              }}
              className="mt-3 w-full flex items-center p-2 rounded-lg justify-around"
              style={{ boxShadow: "0px 0px 4px 1px #333333" }}
            >
              <img src={Coin} />
              200 coins
            </button>
          </div>
          <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
            <MdVerified className="text-[#1DA1F2]" fontSize={120} />
            <h2 className="font-bold text-xl text-gray-300 mt-2">
              Blue Checkmark
            </h2>
            <button
              className="mt-3 w-full flex items-center p-2 rounded-lg justify-around"
              style={{ boxShadow: "0px 0px 4px 1px #333333" }}
            >
              <img src={Coin} />
              2000 coins
            </button>
          </div>
        </div>
      </div>
      <div className=" p-3">
        <div className="text-3xl w-full font-black flex justify-between">
          <h1 className="text-[#b1aeae]">Passes</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
          <div className="silver p-2 rounded-xl">
            <div className="border-2 bg-black w-[200px] border-[#222222] rounded-xl flex items-center justify-center flex-col">
              <img
                src={gold}
                className="w-[130px] h-[120px] filter grayscale brightness-50"
                alt=""
              />
              <h2 className="font-bold text-xl text-gray-300 mt-2">
                Silver Pass
              </h2>
              <button
                className={`mt-3 w-full flex items-center p-2 rounded-lg justify-around ${
                  user?.pass === "gold"
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800 text-gray-100 cursor-pointer"
                }`}
                style={{
                  boxShadow: "0px 0px 4px 1px #333333",
                }}
                disabled={user?.pass === "gold"}
                onClick={() => {
                  buyPass(user?._id, 2500, "silver");
                }}
              >
                <div className="relative mr-2">
                  <BsCoin
                    className={`text-gray-400 ${
                      user?.pass === "gold"
                        ? "text-gray-700"
                        : "text-yellow-500"
                    }`}
                    fontSize={25}
                  />
                  <div
                    className="absolute rounded-full bg-gray-100"
                    style={{
                      width: "16px",
                      height: "16px",
                      top: "3px",
                      right: "-5px",
                      boxShadow: "0px 0px 4px 1px #333333",
                    }}
                  ></div>
                  <div
                    className="absolute rounded-full bg-gray-100"
                    style={{
                      width: "8px",
                      height: "8px",
                      top: "6px",
                      right: "-8px",
                      boxShadow: "0px 0px 4px 1px #333333",
                    }}
                  ></div>
                </div>
                <span className="text-gray-300 font-semibold">2500 coins</span>
              </button>
            </div>
          </div>

          <div className="hand p-2 rounded-xl">
            <div className="border-2 bg-black w-[200px] border-[#222222] rounded-xl flex items-center justify-center flex-col">
              <img src={gold} className="w-[130px] h-[120px]" alt="" />
              <h2 className="font-bold text-xl text-gray-300 mt-2">
                Gold Pass
              </h2>
              <button
                className={`mt-3 w-full flex items-center p-2 rounded-lg justify-around ${
                  user?.pass === "silver"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
                }`}
                style={{
                  boxShadow: "0px 0px 4px 1px #333333",
                }}
                disabled={user?.pass === "silver"}
                onClick={() => {
                  buyPass(user?._id, 4000, "gold");
                }}
              >
                <div className="relative mr-2">
                  <BsCoin
                    className={`text-gray-800 ${
                      user?.pass === "silver"
                        ? "text-gray-500"
                        : "text-yellow-500"
                    }`}
                    fontSize={25}
                  />
                  <div
                    className="absolute rounded-full bg-yellow-500"
                    style={{
                      width: "16px",
                      height: "16px",
                      top: "3px",
                      right: "-5px",
                      boxShadow: "0px 0px 4px 1px #333333",
                    }}
                  ></div>
                  <div
                    className="absolute rounded-full bg-yellow-500"
                    style={{
                      width: "8px",
                      height: "8px",
                      top: "6px",
                      right: "-8px",
                      boxShadow: "0px 0px 4px 1px #333333",
                    }}
                  ></div>
                </div>
                4000 coins
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" p-3">
        <div className="text-3xl w-full font-black flex justify-between">
          <h1 className="text-[#b1aeae]">Coins</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-4 gap-6">
          <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
          <img src={Coin} className="h-[120px]" />
            <h2 className="font-bold text-xl text-gray-300 mt-2">500</h2>
            <button
              className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2"
              style={{ boxShadow: "0px 0px 4px 1px #333333" }}
            >
              $3
            </button>
          </div>

          <div className="border-2 w-[200px] border-[#222222] rounded-xl p-2 flex items-center justify-center flex-col">
            <div className="relative">

          <img src={Coin} className="h-[120px] z-10" />
            </div>
            <h2 className="font-bold text-xl text-gray-300 mt-2">2000</h2>
            <button
              className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2"
              style={{ boxShadow: "0px 0px 4px 1px #333333" }}
            >
              $10
            </button>
          </div>
          <div className="hand p-2 rounded-xl">
            <div className="border-2 bg-black w-[200px]  border-[#222222] rounded-xl flex items-center justify-center flex-col">
            <img src={Coin} className="h-[120px]" />
              <h2 className="font-bold text-xl text-gray-300 mt-2">5000</h2>
              <button
                className="mt-3 text-yellow-100 w-full flex items-center p-2 rounded-lg justify-center gap-2"
                style={{ boxShadow: "0px 0px 4px 1px #333333" }}
              >
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
