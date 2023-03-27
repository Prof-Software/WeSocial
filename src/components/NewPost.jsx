import React, { useEffect, useRef, useState } from "react";
import sparkles from "../assets/Vector.png";
import img from "../assets/img.png";
import gif from "../assets/gif.png";
import emoji from "../assets/emoji.png";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { categories } from "../utils/data";
import { client, urlFor } from "../client";
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
  const [videoAsset, setVideoAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);
  const [wrongFileType, setWrongFileType] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const uploadVideo = async (e) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    // uploading asset to sanity
    if (fileTypes.includes(selectedFile.type)) {
      setWrongFileType(false);
      setLoading(true);

      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setVideoAsset(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setWrongFileType(true);
    }
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
    if (title && category) {
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
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
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
        window.location.reload();
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
      id="post"
      style={{
        border:
          user &&
          (theme === "dark" ? "1px solid #2f3336" : "1px solid #999999"),
        borderBottom:
          user &&
          (theme === "dark" ? "3px solid #2f3336" : "3px solid #999999"),
      }}
    >
      {user && (
        <div
          className="flex items-center pr-5 pl-5"
          style={{ borderBottom: "1px solid #2f3336" }}
        >
          <div className="flex w-full">
            <div className="flex w-1/2">
              <h1>Home</h1>
            </div>
            <div className="flex w-1/2 justify-end">
              <img
                src={sparkles}
                alt=""
                className="h-6 w-6 right-0 justify-end"
              />
            </div>
          </div>
        </div>
      )}
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
                src={
                  user.update === "true"
                    ? urlFor(user.image).height(80).width(80)
                    : user.image
                }
                className="w-8 h-8 rounded-full bg-white ml object-cover"
                alt="user-profile"
              />
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } text-[16px] font-light ml-2 w-[100%] mr-3 outline-none`}
                placeholder="What's Happening?"
                rows={2}
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
            {videoAsset ? (
              <div className="ml-10 relative h-[300px] w-[300px]">
                <video
                  src={videoAsset?.url}
                  alt="uploaded-vid"
                  controls="true"
                  className="h-[300px] w-[300px] object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-black text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setVideoAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            ) : (
              ""
            )}

            <div className="flex items-center">
              <div className="mt-3 ml-10 flex gap-5 w-1/2">
                {!videoAsset && (
                  <div className="flex items-center">
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                      id="file-input"
                    />
                    <label htmlFor="file-input">
                      <img
                        src={img}
                        alt=""
                        className="w-6 h-6 cursor-pointer"
                      />
                    </label>
                  </div>
                )}
                {!imageAsset && (
                  <div
                    className="w-6 h-6 flex items-center  rounded justify-center  cursor-pointer"
                    style={{ border: "2px solid #1da1f2" }}
                  >
                    <input
                      type="file"
                      name="upload-vid"
                      onChange={uploadVideo}
                      className="w-0 h-0"
                      id="vid-input"
                    />
                    <label htmlFor="vid-input">
                      <p
                        id="vid"
                        alt=""
                        className=" text-[10px] text-blue-500 cursor-pointer"
                      >
                        VID
                      </p>
                    </label>
                  </div>
                )}

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
                <button
                  onClick={savePin}
                  className="text-[17px] mr-[1rem] text-white bg-[#1da1f2] ml-3 md:h-full pt-1 pr-8 rounded-lg pl-8 pb-1"
                >
                  Post
                </button>
                {title && (
                  <div className="relative">
                    <FormControl
                      sx={{ minWidth: 120 }}
                      className="absolute "
                      size="small"
                    >
                      <InputLabel id="demo-select-small">Category</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={category}
                        label="Category"
                        onChange={handleChange}
                      >
                        
                        {categories.map((item, index) => (
                          <MenuItem
                            key={index}
                            className={`text-base border-0 outline-none capitalize ${
                              theme == "dark" ? "bg-[#181818] " : ""
                            } `}
                            value={item.name}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPost;
