import React, { useEffect, useRef, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import { Bars, Comment } from "react-loader-spinner";
import { BiArrowBack } from "react-icons/bi";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { useInView } from "react-intersection-observer";
import moment from "moment";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AiOutlineMore } from "react-icons/ai";
import RightBar from "./RightBar";

const PinDetail = ({ user, theme, autoPlay }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  function handleClick() {
    if (document.referrer === '') {
      navigate('/');
    } else {
      navigate(-1);
    }
  }

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>

      {pinDetail && (
    <div className="flex">
        <div
          className="md:w-[560px] w-[85vw]"
          style={{
            border:
              theme === "dark" ? "1px solid #2f3336" : "1px solid #D3D3D3",
          }}
        >
          <div className="flex gap-2 mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
            <IconButton onClick={handleClick}>
              <BiArrowBack fontSize={24} />
            </IconButton>
            <p className="text-xl font-bold">Thread</p>
          </div>
          <div className="w-full h-[50px]" />
          <div className="p-3 flex flex-col">
            <div className="flex">
              <img
                className="user-profile-image mr-2 bg-white object-cover"
                src={
                  pinDetail.postedBy.update === "true"
                    ? urlFor(pinDetail.postedBy.image).height(80).width(80)
                    : pinDetail.postedBy.image
                }
                // src={postedBy.image}
                alt="user-profile"
                referrerPolicy="no-referrer"
              />
              <p>{pinDetail.postedBy.userName}</p>
            </div>
            <div>
              <p className="mt-3">{pinDetail.title}</p>
            </div>
            <div>
              {pinDetail.image && (
                <div
                  className="cursor-pointer rounded-lg max-h-[750px]   flex items-center justify-center"
                  style={{
                    border:
                      theme === "dark"
                        ? "1px solid #2f3336"
                        : "1px solid #D3D3D3",
                  }}
                >
                  <img
                    className="rounded-lg max-h-[750px] w-full  object-cover"
                    src={urlFor(pinDetail.image)}
                    alt="user-post"
                  />
                </div>
              )}
              {pinDetail.video && (
                <div
                  // onClick={() => navigate(`/pin-detail/${_id}`)}
                  ref={ref}
                  className="cursor-pointer rounded-lg flex items-center justify-center"
                  style={{
                    border:
                      theme === "dark"
                        ? "1px solid #2f3336"
                        : "1px solid #D3D3D3",
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
                    src={pinDetail.video.asset.url}
                    className=" h-[500px] object-cover outline-none bg-black"
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
            </div>
            <div className="flex text-[gray] gap-1 mt-2">
              <p className="uppercase ">
                {moment(pinDetail._createdAt).format(" h:mm a")}
              </p>
              ·
              <p className="capitalize">
                {moment(pinDetail._createdAt).format("MMM Do YYYY")}
              </p>
            </div>
            <hr className="bg-[#2f3336] border-[#2f3336] my-2" />
            <div className="flex gap-3">
              <div className="flex gap-1">
                {pinDetail.comments?.length}
                {!pinDetail.comments?.length && <p>0</p>}
                <p className="text-[gray]">Comments</p>
              </div>
              <div className="flex gap-1">
                {pinDetail.save?.length}
                {!pinDetail.save?.length && <p>0</p>}
                <p className="text-[gray]">Likes</p>
              </div>
            </div>
            <hr className="bg-[#2f3336] border-[#2f3336] my-2" />
            <div
              className="flex items-center justify-around pb-2 w-full px-0"
              style={{ borderBottom: "1px solid #2f3336" }}
            >
              <div>
                <Tooltip title="Share">
                  <IconButton id="share">
                    <ShareIcon
                      className={` ${
                        theme === "dark" ? "text-[#5e6569]" : "text-black"
                      }`}
                    />{" "}
                  </IconButton>
                </Tooltip>
              </div>
              <div>
                <Tooltip title="Share">
                  <IconButton id="share">
                    <FavoriteBorderIcon
                      className={` ${
                        theme === "dark" ? "text-[#5e6569]" : "text-black"
                      }`}
                    />{" "}
                  </IconButton>
                </Tooltip>
              </div>
              <div>
                <Tooltip title="more">
                  <IconButton
                    variant="contained"
                  >
                    <AiOutlineMore
                      className={` ${
                        theme === "dark" ? "text-[#5e6569]" : "text-black"
                      }`}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div>

                <div
                  className={`flex gap-2 relative mt-5 items-center ${
                    theme === "dark" ? "" : "bg-white"
                  } rounded-lg`}
                  key={item.comment}
                >
                  <img
                    src={
                      item.postedBy?.update === "true"
                        ? urlFor(item.postedBy?.image).height(40).width(40)
                        : item.postedBy?.image
                    }
                    referrerPolicy="no-referrer"
                    className="w-[50px] h-[50px] top-0 p-1 z-50 absolute bg-black rounded-full cursor-pointer object-cover"
                    alt="user-profile"
                  />
                  <div className="w-[50px] h-[50px]"/>
                  <div className="w-[2px] top-10 right-[577px] h-full bg-gray-500 absolute"/>
                  <div className="flex flex-col w-[450px]">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p className="break-words w- text-clip">{item.comment}</p>
                  </div>
                </div>
            <hr className="bg-[#2f3336] border-[#2f3336] my-2" />
                </div>


                
              ))}
            </div>
            <div>
              {user &&
              <div className="flex flex-wrap mt-2 gap-3">
                <Link to={`/user-profile/${user?._id}`}>
                  <img
                    src={
                      user?.update === "true"
                        ? urlFor(user?.image).height(40).width(40)
                        : user?.image
                    }
                    referrerPolicy="no-referrer"
                    className="w-10 bg-white h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <input
                  className={` flex-1 ${
                    theme === "dark" ? "border-[#101010]" : "bg-white"
                  }  ${
                    theme === "dark" ? "bg-[#121212]" : "bg-white"
                  } outline-none border-2 p-2 rounded-2xl`}
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-[#1da1f2] flex w-24 items-center justify-center text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                  onClick={addComment}
                >
                  {addingComment ? (
                    <Bars
                      visible={true}
                      height="20"
                      width="30"
                      ariaLabel="comment-loading"
                      wrapperStyle={{}}
                      wrapperClass="comment-wrapper"
                      color="#fff"
                      backgroundColor="#fff"
                    />
                  ) : (
                    "Comment"
                  )}
                </button>
              </div>
              }

            </div>
          </div>
        </div>
        <div className="w-[100%] z-50 "><RightBar theme={theme} user={user && user}/></div>

      </div>
      )}
      {pins ? (
        <MasonryLayout theme={theme} pins={pins} />
        ) : (
          <Spinner message="Loading more pins" />
          )}
    </>
  );
};

export default PinDetail;
