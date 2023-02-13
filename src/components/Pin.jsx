import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiOutlineFlag, AiTwotoneDelete } from "react-icons/ai";
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
import ReactPlayer from 'react-player'

const Pin = ({ pin, theme }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

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

  const { update,postedBy, _createdAt, image, _id, destination, title,video } = pin;
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

  // console.log(pin)
  return (
    <div className="">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        className="relative overflow-hidden transition-all duration-500 ease-in-out"
        style={{ border: theme==='dark'? "1px solid #181818" : '1px solid #D3D3D3', padding: "10px" }}
      >

        <div className="tweet mb-5">
          <Link to={`/user-profile/${postedBy._id}`}>
          <img
            className="user-profile-image bg-white object-cover"
            src={postedBy.update==='true'?urlFor(postedBy.image).height(80).width(80):postedBy.image}
            // src={postedBy.image}
            alt="user-profile"
            referrerPolicy="no-referrer"
          />
          </Link>

          <div className="tweet-content">
            
            <h2 className="user-name flex  items-center gap-1">{postedBy?.userName} {postedBy?.mark == "true" ? (
                  <GoVerified className="text-blue-400 text-[20px]" />
                ) : (
                  ""
                )}<p className="tweet-date ml-5">•{moment(_createdAt).fromNow()}</p></h2>
            <p className="tweet-text">{title}</p>
          </div>
        </div>

        {image && (
          <div
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="cursor-pointer rounded-lg"
            style={{border:theme==='dark'?'1px solid #181818':'1px solid #D3D3D3'}}
          >
            <img
              className="rounded-lg  h-[500px] w-[600px] object-cover"
              src={urlFor(image).url()}
              alt="user-post"
            />
          </div>
        )}
        {video && (
          <div
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="cursor-pointer rounded-lg"
            style={{border:theme==='dark'?'1px solid #181818':'1px solid #D3D3D3'}}
          >
            <video
            controls
            src={video.asset.url}
            className='w-[600px] h-[500px] object-cover outline-none bg-black'
            />
          </div>
        )}
        <div id="actions-tab" className="mt-1 flex justify-around">
          <Tooltip title="Comment">
            <IconButton>
              <ChatBubbleOutlineIcon
                className={` ${theme === "dark" ? "text-white" : "text-black"}`}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={handleClickOpen}>
              <ShareIcon
                className={` ${theme === "dark" ? "text-white" : "text-black"}`}
              />
            </IconButton>
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
            <IconButton>
              <div>
                {alreadySaved?.length !== 0 ? (
                  <div
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                    className={`flex items-center justify-center gap-2 text-sm ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    <FavoriteIcon
                      className={` ${
                        theme === "dark" ? "text-red-500" : "text-red-500"
                      }`}
                    />
                    {pin?.save?.length}
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                    className={`flex items-center justify-center gap-2 text-sm ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                    type="button"
                  >
                    {savingPost ? (
                      <FavoriteBorderIcon
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className={` ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                    )}
                    {pin?.save?.length}{" "}
                  </div>
                )}
              </div>
            </IconButton>
          </Tooltip>
          <Tooltip title="Report">
            <IconButton>
              <AiOutlineFlag
                className={` ${theme === "dark" ? "text-white" : "text-black"}`}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div>{/* Comments Tab */}</div>
      </div>
    </div>
  );
};

export default Pin;
