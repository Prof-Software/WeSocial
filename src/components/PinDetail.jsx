import React, { useEffect, useRef, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import { Bars, Comment } from "react-loader-spinner";
import { BiArrowBack } from "react-icons/bi";
import { IconButton } from "@mui/material";
import { useInView } from "react-intersection-observer";
import moment from "moment";
const PinDetail = ({ user, theme,autoPlay }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        console.log(data);
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
        <div
          className=""
          style={{
            border:
              theme === "dark" ? "1px solid #2f3336" : "1px solid #D3D3D3",
          }}
        >
          <div className="flex gap-2 mt-0 top-0 w-full fixed items-center p-3 backdrop-blur-md z-50">
            <IconButton>
              <BiArrowBack fontSize={24} />
            </IconButton>
            <p className="text-xl font-bold">Thread</p>
          </div>
          <div className="w-full h-[50px]"/>
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
                  className="cursor-pointer rounded-lg max-h-[750px] w-[600px]  flex items-center justify-center"
                  style={{
                    border:
                      theme === "dark"
                        ? "1px solid #2f3336"
                        : "1px solid #D3D3D3",
                  }}
                >
                  <img
                    className="rounded-lg max-h-[750px] w-[600px] object-cover"
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
                    className="w-[600px] h-[500px] object-cover outline-none bg-black"
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
            <div className="flex text-[gray] gap-1">
              <p className="uppercase ">
              {moment(pinDetail._createdAt).format(" h:mm a")}
              </p>
              ·
              <p className="capitalize">
              {moment(pinDetail._createdAt).format("MMMM Do YYYY")}
              </p>
            </div>
            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  className={`flex gap-2 mt-5 items-center ${
                    theme === "dark" ? "bg-[#38444D]" : "bg-white"
                  } rounded-lg`}
                  key={item.comment}
                >
                  <img
                  src={
                       item.postedBy?.update==='true'? urlFor(item.postedBy?.image).height(40).width(40):item.postedBy?.image
                    }
                    className="w-10 h-10 bg-white rounded-full cursor-pointer object-cover"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img
                src={
                  user?.update === "true"
                    ? urlFor(user?.image).height(40).width(40)
                    : user?.image
                }
                  className="w-10 bg-white h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className={` flex-1 ${
                  theme === "dark" ? "border-[#101010]" : "bg-white"
                }  ${
                  theme === "dark" ? "bg-[#121212]" : "bg-white"
                } outline-none border-2 p-2 rounded-2xl focus:border-gray-300`}
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 flex w-24 items-center justify-center text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? (
                  <Bars
                    visible={true}
                    height="30"
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
            </div>
          </div>
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
