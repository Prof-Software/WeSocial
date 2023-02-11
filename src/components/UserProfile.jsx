import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { BiCloudUpload } from "react-icons/bi";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { AiOutlinePlus } from "react-icons/ai";
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = ({theme}) => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);
  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
  
    reader.onloadend = async () => {
      const imageData = reader.result
      const mutation = `
          mutation {
            updateUser(id: "${userId}", cover: ${imageData}) {
              _id
            }
          }
      `
      const result = await client.patch(mutation)
    }
  
    reader.readAsDataURL(file)
  }
  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }


    
  }, [text, userId]);

  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src={
                user.cover
                  ? urlFor(user.cover).url()
                  : "https://source.unsplash.com/1600x900/?nature,photography,technology"
              }
              alt="user-pic"
            />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.userName}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User.sub && (
              <div className=" bg-white p-2 h-10 rounded-full cursor-pointer outline-none shadow-md">
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <AiOutlinePlus
                      className="cursor-pointer"
                      color="red"
                      fontSize={21}
                    />
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={handleFileChange}
                    className="w-0 h-0"
                  />
                </label>
                {imageAsset ? (
                  <button
                    type="button"
                    className=" bg-white p-2 h-10 rounded-full cursor-pointer outline-none shadow-md"
                  >
                    <BiCloudUpload
                      // onClick={handleSave}
                      className="cursor-pointer"
                      color="red"
                      fontSize={21}
                    />
                  </button>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
            }}
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
          >
            Saved
          </button>
        </div>

        <div className="px-2">
          <MasonryLayout pins={pins} theme={theme} />
        </div>

        {pins?.length === 0 && (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
