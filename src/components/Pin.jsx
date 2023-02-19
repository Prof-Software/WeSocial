import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiOutlineFlag, AiOutlineMore, AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import moment from "moment";
import { client, urlFor } from "../client";
import { FaGlobeAmericas } from "react-icons/fa";
import icon1 from "../assets/comments.png";
import icon2 from "../assets/share.png";
import icon3 from "../assets/like.png";
import icon4 from "../assets/down.png";
import { GoVerified } from "react-icons/go";
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UploadIcon from "@mui/icons-material/Upload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useInView } from "react-intersection-observer";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
const Pin = ({ pin, theme, autoPlay }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [popper, setPopper] = useState(null);
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handlePopper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopper = () => {
    setAnchorEl(null);
  };

  const openPopper = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const handleVisibilityChange = (isVisible) => {
    if (isVisible) {
      setIsPlaying(true);
      videoRef.current.play();
    } else {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const openReport = Boolean(anchorEl);
  const handleRep = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRepClose = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  const {
    update,
    postedBy,
    _createdAt,
    image,
    _id,
    destination,
    title,
    video,
    comments,
  } = pin;
  const user =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  const handleClick = async () => {
    const transaction = client.transaction();
    const post = await client.getDocument(_id);

    const newLikes = hasLiked ? post.likes - 1 : post.likes + 1;

    const updatedDoc = await transaction.patch(post._id).set({
      likes: newLikes,
    });

    await transaction.commit();

    setLikes(updatedDoc.likes);
    setHasLiked(!hasLiked);
  };

  let alreadySaved = pin?.save?.filter(
    (item) => item?.postedBy?._id === user?.sub
  );

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];
  const savePin = (id) => {
    if (alreadySaved && alreadySaved.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    } else {
      client
        .patch(id)
        .unset([`save[userId=="${user?.sub}"]`])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
  return (
    <div className="">
      <div
        className="relative overflow-hidden transition-all duration-500 ease-in-out  w-[582px]"
        style={{
          border: theme === "dark" ? "1px solid  #2f3336" : "1px solid #D3D3D3",
          padding: "10px",
        }}
      >
        {/* <div className="tweet mb-5 flex flex-col">

          <div className="flex flex-col">
            <div className="tweet-content flex">
          <Link to={`/user-profile/${postedBy._id}`} className='flex'>
          <img
            className="user-profile-image bg-white object-cover"
            src={postedBy.update==='true'?urlFor(postedBy.image).height(80).width(80):postedBy.image}
            // src={postedBy.image}
            alt="user-profile"
            referrerPolicy="no-referrer"
            />
          </Link>

            
            <h2 className="user-name flex  items-center gap-1">{postedBy?.userName} {postedBy?.mark == "true" ? (
              <GoVerified className="text-blue-400 text-[20px]" />
              ) : (
                ""
                )}<p className="tweet-date ml-5">•{moment(_createdAt).fromNow()}</p></h2>
            </div>
            <p className="tweet-text">{title}</p>
          </div>
        </div> */}
        <div className={`flex  "justify-between px-5"`}>
        <Link to={`/user-profile/${postedBy._id}`} className='flex'>
          <img
            src={
              postedBy.update === "true"
                ? urlFor(postedBy.image).height(80).width(80)
                : postedBy.image
            }
            alt="Profile Pic"
            className="h-11 w-11 rounded-full mr-4 object-cover bg-white"
          />
        </Link>
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <div className="font-bold text-[14px] mr-2 sm:text-base text-[#d9d9d9] group-hover:underline inline-block">
                <p className="flex gap-1">
                <Link to={`/user-profile/${postedBy._id}`} className='flex'>
                {postedBy?.userName}
                </Link>
                {postedBy?.mark == "true" ? (
                  <p className="font-bold text-[#1d9bf0]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                </p>
              ) : (
                ""
              )}
                </p>
              </div>
              
              <span className={`text-sm sm:text-[15px] gap-2 mr-2`}>
                @{postedBy?.userName}
              </span>
            </div>•{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              {moment(_createdAt).fromNow()}
            </span>
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        <div className="relative">

            <p className="text-[#d9d9d9] mt-1.5 text-md  top-0">{title}</p>
        </div>

        {image && (
          <div
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="cursor-pointer  w-[500px] ml-10 rounded-lg flex  justify-center md:w-[500px] w-[320px]"
            style={{
              border:
                theme === "dark" ? "1px solid #2f3336" : "1px solid #D3D3D3",
            }}
          >
            <img
              className="rounded-lg max-h-[700px] object-cover"
              src={urlFor(image).height(500).width(600).url()}
              alt="user-post"
            />
          </div>
        )}
        {video && (
          <div
            // onClick={() => navigate(`/pin-detail/${_id}`)}
            ref={ref}
            className="cursor-pointer ml-10  w-[500px] rounded-lg flex items-center justify-center md:w-[500px] w-[320px]"
            style={{
              border:
                theme === "dark" ? "1px solid #2f3336" : "1px solid #D3D3D3",
            }}
          >
            <video
              ref={videoRef}
              onClick={() => {
                setIsPlaying(true);
                videoRef.current.muted = false;
              }}
              onPlay={() => {
                videoRef.current.muted = false;
              }}
              onPause={() => {
                setIsPlaying(false);
              }}
              controls
              src={video.asset.url}
              className="  w-[500px] object-cover outline-none bg-black md:w-[500px] w-[320px]"
              muted={!inView}
              autoPlay={autoPlay === "On" ? true : false}
              onTimeUpdate={() => {
                if (inView) {
                  return;
                }
                if (!videoRef.current.paused) {
                  videoRef.current.pause();
                }
              }}
            />
          </div>
        )}
        <div id="actions-tab" className="mt-1 flex justify-around">
          <Tooltip title="Comment">
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                <div className="h-4  flex items-center justify-center group-hover:text-[#1d9bf0] text-[#727272]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-[#727272] text-sm">
              {pin.comments?.length}
              </p>
            </div>
          </Tooltip>

          <Tooltip title="Share">
            <div className="flex items-center space-x-1 group">
              <div className="share hover:text-[#21f01d] group-hover:bg-opacity-10 h-4 text-[#727272]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </div>
            </div>
          </Tooltip>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div className="border-2">
              <DialogTitle
                id="alert-dialog-title"
                className={`${
                  theme === "dark"
                    ? "bg-[#101010] text-white"
                    : "bg-slate-50 text-black"
                } `}
              >
                {"Share"}
              </DialogTitle>
              <DialogContent
                className={`${
                  theme === "dark"
                    ? "bg-[#101010] text-white"
                    : "bg-slate-50 text-black"
                }`}
              >
                <DialogContentText id="alert-dialog-description">
                  <div className="flex">
                    <div
                      className={`${
                        theme === "dark"
                          ? "bg-black text-white"
                          : "bg-slate-200 text-black"
                      } p-3 flex`}
                    >
                      {"http://localhost:3000/pin-detail/" + _id}
                    </div>
                    <Button
                      type="primary"
                      variant="contained"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "http://localhost:3000/pin-detail/" + _id
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </DialogContentText>
              </DialogContent>
              <DialogActions
                className={`${
                  theme === "dark"
                    ? "bg-[#101010] text-white"
                    : "bg-slate-50 text-black"
                }`}
              >
                <button
                  onClick={handleClose}
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Close
                </button>
              </DialogActions>
            </div>
          </Dialog>
          <Tooltip title="Like">
            <div className="flex items-center justify-center">
              {alreadySaved?.length !== 0 ? (
                <div
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className={`flex heart group-hover:bg-pink-600/10 items-center justify-center gap-2 text-sm ${
                    theme === "dark" ? "text-[#727272]" : "text-black"
                  }`}
                >
                  <HeartIconFilled className="h-5 text-pink-600" />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className={`flex icon group-hover:bg-pink-600/10 items-center justify-center gap-2 text-sm ${
                    theme === "dark" ? "text-[#727272]" : "text-black"
                  } hover:text-pink-600 heart`}
                >
                  <HeartIcon className="h-5" />
                </button>
              )}
              <p className="text-[#727272] text-sm">
              {pin?.save?.length} {!pin?.save?.length && 0}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="Report">
            <button className="icon">

              <SwitchHorizontalIcon
                className={` ${theme === "dark" ? "text-[#727272]" : "text-black"} h-5`}
                />
                </button>
          </Tooltip>
        </div>
        <Link to={`/pin-detail/${_id}`}>
          <p
            className={`ml-10 ${
              theme === "dark" ? "text-[#1DA1F2]" : "text-[#1DA1F2] font-bold"
            }`}
          >
            Show This Thread
          </p>
        </Link>
        <div>{/* Comments Tab */}</div>
      </div>
    </div>
  );
};

export default Pin;
