import React, { useEffect, useRef, useState } from "react";
import sparkles from "../assets/Vector.png";
import img from "../assets/img.png";
import gif from "../assets/gif.png";
import emoji from "../assets/emoji.png";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";
import TextField from "@mui/material/TextField";

const NewPost = ({ user, theme }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const pickerContainerRef = useRef(null);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();

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
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Upload failed:", error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title  ) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        window.location.reload()
      });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  const handleEmojiClick = (emoji) => {
    setTitle(title + emoji.emoji);
    setShowPicker(false);
  };

  const handleClickOutside = (event) => {
    if (
      showPicker &&
      pickerContainerRef.current &&
      !pickerContainerRef.current.contains(event.target)
    ) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="user-name"
      style={{ border: "1px solid #181818", borderBottom: "3px solid #181818" }}
    >
      <div
        className="flex items-center pr-5 pl-5"
        style={{ borderBottom: "1px solid 181818" }}
      >
        <div className="flex w-1/2">
          <h1>Latest Posts</h1>
        </div>
        <div className="flex w-1/2 justify-end">
          <img src={sparkles} alt="" className="h-6 w-6 right-0 justify-end" />
        </div>
      </div>
      <div>
        {fields && (
          <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
            Please add all fields.
          </p>
        )}
        {user && (
          <div className={`flex gap-2 mt-2 mb-2 rounded-xl pl-5 flex-col`}>
            <div className="flex">
              <img
                src={user.image}
                className="w-8 h-8 rounded-full bg-white ml"
                alt="user-profile"
              />
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } text-[16px] font-light ml-2 w-[100%] mr-3`}
                placeholder="What's Happening?"
                rows={3}
              />
              
            </div>
            {imageAsset ? (
              <div className="ml-10 relative h-[300px] w-[300px]">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-[300px] w-[300px] object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-black text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
              
            ) : (
              ""
            )}

            <div className="flex items-center">
              <div className="mt-3 ml-10 flex gap-5 w-1/2">
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <img src={img} alt="" className="w-6 h-6 cursor-pointer" />
                </label>
                <div
                  className="w-6 h-6 flex items-center justify-center rounded  cursor-pointer"
                  style={{ border: "2px solid #1da1f2" }}
                >
                  <img src={gif} alt="" className="w-4 h-2" />
                </div>

                <button onClick={() => setShowPicker(!showPicker)}>
                  {showPicker ? (
                    <img
                      src={emoji}
                      alt=""
                      className="w-6 h-6  cursor-pointer"
                    />
                  ) : (
                    <img
                      src={emoji}
                      alt=""
                      className="w-6 h-6  cursor-pointer"
                    />
                  )}
                </button>
                {showPicker && (
                  <div className="absolute mt-7 z-50" ref={pickerContainerRef}>
                    <EmojiPicker
                      theme={theme === "dark" ? "dark" : "light"}
                      emojiStyle="twitter"
                      onEmojiClick={handleEmojiClick}
                    />
                  </div>
                )}
              </div>
              <div className="flex w-1/2 justify-end mr-7">
                <button onClick={savePin} className="text-[17px] bg-[#1da1f2] pt-1 pr-8 rounded-lg pl-8 pb-1">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPost;
