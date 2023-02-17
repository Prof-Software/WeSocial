import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineSave } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
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
import {GoCalendar} from 'react-icons/go'
import moment from "moment";
const activeBtnStyles =
  "bg-blue-700 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 bg-blue-500 text-white font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = ({ theme }) => {
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
  const [input, setInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [coverImage, setCoverImage] = useState(null)
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setProfileImage(document);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      console.log('first')
    }
  };

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
  console.log(user)
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setCoverImage(document);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      console.log('first')
    }
  };
  const saveName = async (id) => {
    client
      .patch(id)
      .set({ userName: newName })
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
  const showinput = () => {
    if (input === true) {
      setInput(false);
    } else {
      setInput(true);
    }
  };
  const saveImage = async (id) => {
    await client.patch(id)
      .set({image: profileImage?.url})
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
  const saveCover = async (id) => {
    await client.patch(id)
      .set({ cover: {
        _type: 'reference',
        _ref: coverImage._id,
      }})
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
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
            {!coverImage ? <img
              className=" w-full h-[300px] 2xl:h-[300px] shadow-lg object-cover"
              src={
                user.cover
                  ? urlFor(user.cover).width(1600).height(900).url()
                  : "https://source.unsplash.com/1600x900/?nature,photography,technology"
              }
              alt="user-pic"
            /> : <img
            className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
            src={coverImage?.url}
            alt="user-pic"
          />}
            
            <div className="relative  flex items-center justify-end">
              {!profileImage && (

                <img
                  className="rounded-full w-[135px] h-[135px] -mt-10 left-0 shadow-xl object-cover"
                  src={
                    user.update === "true"
                    ? urlFor(user.image).height(180).width(180)
                      : user.image
                    }
                    alt="user-pic"
                    />
              )}
              {profileImage && (
                <img
                  className="rounded-full w-[135px] h-[135px]  left-0  -mt-10 shadow-xl object-cover"
                  src={profileImage?.url}
                  alt="user-pic"
                />
              )}
              {userId === User.sub && (
                <div>
                  <input
                    type="file"
                    onChange={uploadImage}
                    className="w-0 h-0"
                    id="file-input"
                  />
                  {!profileImage ? (
                    <label htmlFor="file-input">
                      <AiOutlineEdit
                        className={`absolute top-[-44px] right-[-25px] bg-black text-white rounded-full border-2 border-white p-1`}
                        fontSize={32}
                      />
                    </label>
                  ) : (
                    <AiOutlineSave
                      className={`absolute cursor-pointer top-[-44px] right-[-25px] bg-black text-white rounded-full border-2 border-white p-1`}
                      onClick={()=>{saveImage(userId)}}
                      fontSize={32}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="relative left-0 w-full">
              <div className="ml-5 flex items-center gap-3 text-[gray]"><GoCalendar fontSize={20}/>Joined {moment(user._createdAt).format("MMM  YYYY")}</div>
              <p>{}</p>
            </div>
          </div>
          <div className="font-bold text-3xl text-center flex items-center justify-center gap-2  mt-3">
            {input === false && user.userName}{" "}
            {userId === User.sub && (
              <div className="flex items-center justify-center">
                <AiOutlineEdit onClick={showinput} className="cursor-pointer" />
                {input === true && (
                  <div className="flex">
                    <div>
                      <input
                        type="text"
                        value={newName}
                        onChange={handleNameChange}
                        placeholder="Enter New Name"
                        className={`${
                          theme === "dark"
                            ? "border-b-2 bg-[#181818] border-b-blue-600"
                            : "border-2 border-b-blue-600"
                        } outline-none`}
                      />{" "}
                    </div>
                  </div>
                )}
              </div>
            )}
            {input === true && (
              <button
                className={`${
                  theme === "dark"
                    ? " rounded bg-pink-400"
                    : "rounded bg-pink-400 text-white"
                }`}
                onClick={() => {
                  saveName(userId);
                }}
              >
                Save
              </button>
            )}
          </div>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === User.sub && (
              <div className=" bg-white p-2 h-10 rounded-full cursor-pointer outline-none shadow-md">
                {!coverImage && <label>
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
                </label>}
                
                {coverImage ? (
                  <button
                    type="button"
                    className=" rounded-full cursor-pointer outline-none shadow-md"
                    onClick={()=>{saveCover(userId)}}
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
            } mr-3`}
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
            Liked
          </button>
        </div>

        <div className="flex items-center justify-center">
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
