import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiFillCheckCircle, AiOutlineFlag, AiOutlineMore, AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill, BsPatchCheckFill } from "react-icons/bs";
import moment from "moment";
import { client, urlFor } from "../client";
import { FaGlobeAmericas } from "react-icons/fa";
import icon1 from "../assets/comments.png";
import icon2 from "../assets/share.png";
import icon3 from "../assets/like.png";
import icon4 from "../assets/down.png";
import { GoVerified } from "react-icons/go";
import { Verified, VerifiedRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
} from "@mui/material";
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
import CloseIcon from "@mui/icons-material/Close";
import check from '../assets/check.png' 
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
import EmojiPicker from "emoji-picker-react";
import emoji from "../assets/emoji.png";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  border: "2px solid #000",
  boxShadow: "0 0  24px #999999",
};

const Pin = ({ pin, theme, autoPlay, userData, border }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [comment, setComment] = useState("");
  const [savingPost, setSavingPost] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [popper, setPopper] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const pickerContainerRef = useRef(null);
  const handleEmojiClick = (emoji) => {
    setComment(comment + emoji.emoji);
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

  const addComment = () => {
    if (comment) {
      client
        .patch(_id)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: userData._id },
          },
        ])
        .commit()
        .then(() => {
          navigate(`/pin-detail/${_id}`);
          setComment("");
        });
    }
  };

  let alreadySaved = pin?.save?.filter(
    (item) => item?.postedBy?._id === user?.sub
  );
  const formatDate = (date) => {
    const diff = moment().diff(moment(date), "hours");
    if (diff < 24) {
      return moment(date).fromNow(true);
    } else {
      return moment(date).format("MMM D");
    }
  };

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
        className="relative overflow-hidden transition-all duration-500 ease-in-out md:w-[560px] w-full"
        style={{
          border: theme === "dark" ? "1px solid  #2f3336" : "1px solid #999999",
          padding: "10px",
        }}
      >
        <div className={`flex  "justify-between "`}>
          <a
            href={`/user-profile/${
              postedBy?.userId ? postedBy?.userId : postedBy?._id
            }`}
            className="flex"
          >
            <div className="relative w-[60px]">
              <img
                src={
                  postedBy.update === "true"
                    ? urlFor(postedBy?.image).height(80).width(80)
                    : postedBy?.image
                }
                referrerPolicy="no-referrer"
                alt="Profile Pic"
                className={`${postedBy?.pass === "gold" && "goldp"} ${
                  postedBy?.pass === "diamond" ? "diamondp" : ""
                } h-[50px] absolute w-[50px] rounded-full mr-4 object-cover bg-white`}
              />
            </div>
          </a>
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <div className="font-bold text-[14px] mr-2 sm:text-base text-[#d9d9d9] group-hover:underline inline-block">
                <div className="flex gap-1 items-center justify-center">
                  <a
                    href={`/user-profile/${
                      postedBy?.userId ? postedBy?.userId : postedBy?._id
                    }`}
                    className={`flex ${
                      theme !== "dark" && "text-[#000]"
                    } truncate flex items-center justify-center`}
                  >
                    {postedBy?.pass === "gold" && (
                      <span className="text">
                        {postedBy?.userName.length > 12 ? (
                          <>
                            <span className="hidden md:inline">
                              {postedBy?.userName}
                            </span>
                            <span className="inline md:hidden">
                              {postedBy?.userName.substring(0, 3)}...
                            </span>
                          </>
                        ) : (
                          postedBy?.userName
                        )}
                      </span>
                    )}
                    {postedBy?.pass === "silver" && (
                      <span className="">
                        {postedBy?.userName.length > 12 ? (
                          <>
                            <span className="hidden md:inline">
                              {postedBy?.userName}
                            </span>
                            <span className="inline md:hidden">
                              {postedBy?.userName.substring(0, 3)}...
                            </span>
                          </>
                        ) : (
                          postedBy?.userName
                        )}
                      </span>
                    )}
                    {postedBy?.pass === "diamond" && (
                      <span className="diamond-text hero-gradient">
                        {postedBy?.userName.length > 12 ? (
                          <>
                            <span className="hidden md:inline">
                              {postedBy?.userName}
                            </span>
                            <span className="inline md:hidden">
                              {postedBy?.userName.substring(0, 3)}...
                            </span>
                          </>
                        ) : (
                          postedBy?.userName
                        )}
                      </span>
                    )}
                    {postedBy?.pass === null&&(
                      <span className="">
                      {postedBy?.userName.length > 12 ? (
                        <>
                          <span className="hidden md:inline">
                            {postedBy?.userName}
                          </span>
                          <span className="inline md:hidden">
                            {postedBy?.userName.substring(0, 3)}...
                          </span>
                        </>
                      ) : (
                        postedBy?.userName
                      )}
                    </span>
                    )}
                  </a>
                  {postedBy?.mark == "true" && postedBy?.pass !== "diamond"  ? (
                    <AiFillCheckCircle
                    className="text-[#1DA1F2]"
                    fontSize={20}
                    />
                    ) : (
                      ""
                      )}
                      {postedBy?.pass === "diamond" &&(
                        <img src={check} className="h-[20px]" alt="" />
                      )}
                </div>
              </div>

              <span className={`text-sm sm:text-[15px] md:mr-2 mr-1 truncate`}>
                @
                {postedBy?.userId > 12 ? (
                  <>
                    <span className="hidden md:inline">{postedBy?.userId}</span>
                    <span className="inline md:hidden">
                      {postedBy?.userId.substring(0, 0)}...
                    </span>
                  </>
                ) : (
                  postedBy?.userId
                )}
              </span>
            </div>
            •{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              {formatDate(_createdAt)}
            </span>
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        <div className="relative w-[80%] ml-[3.75rem] mb-3">
          <p
            className={`text-[#d9d9d9] text-sm  top-0 ${
              theme !== "dark" && "text-[#000]"
            }`}
          >
            {title}
          </p>
        </div>

        {image && (
          <div
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="cursor-pointer   ml-10 rounded-lg flex  justify-center"
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
            className="cursor-pointer ml-10   rounded-lg flex items-center justify-center "
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
            <div className="flex items-center space-x-1 group hover:text-[#1d9bf0] text-[#727272]">
              <div
                className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10"
                onClick={handleOpen}
              >
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
              <p className=" text-sm">{pin.comments?.length}</p>
            </div>
          </Tooltip>
          <Modal
            open={openModal}
            onClose={handleModalClose}
            closeAfterTransition
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="outline-none bg-[rgb(29,155,240,0.2)]"
          >
            <div
              style={style}
              className="text-white border-2 p-2 h-[350px] border-gray-900 rounded-xl bg-black"
              // style={{ border: "1px solid black" }}
            >
              <IconButton className="mt-2" onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
              <Divider />
              <div className="flex ">
                <img
                  src={
                    postedBy.update === "true"
                      ? urlFor(postedBy.image).height(80).width(80)
                      : postedBy.image
                  }
                  referrerPolicy="no-referrer"
                  alt="Profile Pic"
                  className="h-[50px] mt-2 w-[50px] rounded-full mr-4 object-cover bg-white"
                />
                <div className="font-bold text-[14px] mr-2 sm:text-base  text-[#d9d9d9] group-hover:underline inline-block">
                  <div className="flex gap-1 flex-col">
                    <Link
                      to={`/user-profile/${
                        postedBy?.userId ? postedBy?.userId : postedBy?._id
                      }`}
                      className="flex"
                    >
                      {postedBy?.userName}
                      {postedBy?.mark == "true" ? (
                        <p className="font-bold text-[#1d9bf0] text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                          </svg>
                        </p>
                      ) : (
                        ""
                      )}
                    </Link>
                    <p>{title}</p>
                  </div>
                </div>
              </div>
              <div className="w-[3px] h-[95px] absolute bg-gray-600 left-[30px] top-[107px] "></div>
              <div className="h-[90px] w-[1px]" />

              <div className="flex ">
                <img
                  src={
                    postedBy.update === "true"
                      ? urlFor(userData?.image).height(80).width(80)
                      : userData?.image
                  }
                  referrerPolicy="no-referrer"
                  alt="Profile Pic"
                  className="h-[50px] mt-2 w-[50px] rounded-full mr-4 object-cover bg-white"
                />
                <div className="font-bold text-[14px] mr-2 sm:text-base  text-[#d9d9d9] group-hover:underline inline-block">
                  <div className="flex gap-1 flex-col">
                    <Link
                      to={`/user-profile/${
                        userData?.userId ? userData?.userId : userData?._id
                      }`}
                      className="flex"
                    >
                      {userData?.userName}
                      {userData?.mark == "true" ? (
                        <p className="font-bold text-[#1d9bf0] text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                          </svg>
                        </p>
                      ) : (
                        ""
                      )}
                    </Link>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`${
                        theme === "dark" ? "bg-black" : "bg-white"
                      } text-[16px] font-light w-[100%] outline-none`}
                      placeholder={`Reply to Post`}
                      rows={2}
                    />
                  </div>
                  {/* <button onClick={() => setShowPicker(!showPicker)}>
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
                  <div className="absolute top-0 mt-7 right-0 z-50" ref={pickerContainerRef}>
                    <EmojiPicker
                      theme={theme === "dark" ? "dark" : "light"}
                      emojiStyle="twitter"
                      onEmojiClick={handleEmojiClick}
                      height={300}
                      width={300}
                    />
                  </div>
                )} */}
                </div>
              </div>
              <button
                onClick={addComment}
                className="bg-[#1d9bf0] p-2 rounded-full absolute right-[25px] bottom-[15px]"
              >
                Reply
              </button>
            </div>
          </Modal>

          <Tooltip title="Share">
            <div
              className="flex items-center space-x-1 group"
              onClick={handleClickOpen}
            >
              <div className="share hover:text-[#21f01d] flex items-center justify-center group-hover:bg-opacity-10 text-[#727272]">
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
            className="bg-[rgb(29,155,240,0.2)]"
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
                      {`${window.location.href}pin-detail/` + _id}
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
            <div className="flex items-center justify-center hover:text-pink-600 text-[#727272]">
              {alreadySaved?.length !== 0 ? (
                <div
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className={`flex heart group-hover:bg-pink-600/10 group-hover:text-pink-600  items-center justify-center gap-2 text-sm ${
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
                  className={`flex icon group-hover:bg-pink-600/10 group-hover:text-pink-600 items-center justify-center gap-2 text-sm ${
                    theme === "dark" ? "text-[#727272]" : "text-black"
                  } hover:text-pink-600 heart`}
                >
                  <HeartIcon className="h-5" />
                </button>
              )}
              <p className=" text-sm">
                {pin?.save?.length ? pin?.save?.length : 0}
              </p>
            </div>
          </Tooltip>
          <Tooltip title="Report">
            <button className="icon">
              <SwitchHorizontalIcon
                className={` ${
                  theme === "dark" ? "text-[#727272]" : "text-black"
                } h-5`}
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
