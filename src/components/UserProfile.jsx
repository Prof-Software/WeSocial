import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineSave } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { AiOutlinePlus } from "react-icons/ai";
import { GoCalendar } from "react-icons/go";
import moment from "moment";
import RightBar from "./RightBar";
import { IconButton } from "@mui/material";
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
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState(null);
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
      console.log("first");
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
  console.log(user);
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
      console.log("first");
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
    await client
      .patch(id)
      .set({ image: profileImage?.url })
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
  const saveCover = async (id) => {
    await client
      .patch(id)
      .set({
        cover: {
          _type: "reference",
          _ref: coverImage._id,
        },
      })
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
  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }
  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center ml-5 w-[600px]"
    
    >
      <div className="flex flex-col pb-5 " style={{
      border: theme === "dark" ? "1px solid  #2f3336" : "1px solid #999999",
    }}>
        <div className="flex gap-2 mt-0 top-0 w-[598px] fixed items-center py-2 backdrop-blur-md z-50">
          <IconButton onClick={handleClick}>
            <BiArrowBack fontSize={24} />
          </IconButton>
          <p className="text-xl font-bold">{user.userName}</p>
        </div>
        <div className="h-[60px] w-full" />
        {!coverImage ? (
          <img
            className=" w-full h-[220px] 2xl:h-[220px] shadow-lg object-cover"
            src={
              user.cover
                ? urlFor(user.cover).width(1600).height(900).url()
                : "https://source.unsplash.com/1600x900/?nature,photography,technology"
            }
            alt="user-pic"
          />
        ) : (
          <img
            className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
            src={coverImage?.url}
            alt="user-pic"
          />
        )}
        <div className="mb-2">
          <div>
            {!profileImage && (
              <img
                className="rounded-full w-[135px] h-[135px] -mt-[4.5rem] ml-3 left-0 shadow-xl object-cover"
                style={{border:'6px solid black'}}
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
                className="rounded-full w-[135px] h-[135px]  left-0  -mt-[4.5rem] ml-3 shadow-xl object-cover"
                style={{border:'6px solid black'}}
                src={profileImage?.url}
                alt="user-pic"
              />
            )}
          </div>
          <button className="absolute right-[25px] bg-white text-black p-2 px-4 rounded-full font-bold top-[18.5rem]">Follow</button>
        </div>
        <h1 className="text-xl ml-5 font-extrabold">{user.userName}</h1>
        <h1 className="text-sm mb-2 ml-5 font-extrabold text-opacity-80 truncate text-[gray]">@{user.userName}</h1>
        <p className="ml-5">about</p>
        <div className="ml-5 flex gap-1 mt-2 text-[gray] items-center">

          <GoCalendar className="" fontSize={20}/>
          Joined {moment(user._createdAt).format("MMM  YYYY")}
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

        <div className="flex items-center justify-center w-full"
        style={{
          border: theme === "dark" ? "1px solid  #2f3336" : "1px solid #999999",
        }}
        >
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
