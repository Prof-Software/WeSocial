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
import {GoCalendar} from 'react-icons/go'
import moment from "moment";
import RightBar from './RightBar'
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
  function handleClick() {
    if (document.referrer === "") {
      navigate("/");
    } else {
      navigate(-1);
    }
  }
  if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
      <div className="flex gap-2 mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
        <IconButton onClick={handleClick}>
          <BiArrowBack fontSize={24} />
        </IconButton>
        <p className="text-xl font-bold">Profile</p>
      </div>
        <div className="h-[70px] w-full"/>
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
          <MasonryLayout pins={pins} theme={theme}/>
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
