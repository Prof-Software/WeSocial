import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineLogout, AiOutlineSave } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { BiArrowBack, BiCloudUpload } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
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
import { Button, IconButton, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

const activeBtnStyles =
  "border-b-4 border-b-blue-700 text-white hover:bg-[rgb(255,255,255,0.1)]  font-bold p-2 w-1/2 outline-none";
const notActiveBtnStyles =
  " text-white font-bold p-2 w-1/2 hover:bg-[rgb(255,255,255,0.1)] outline-none";

const UserProfile = ({ theme, pin }) => {
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
  const [newId, setNewId] = useState("");
  const [newAbout, setNewAbout] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [followerData, setFollowerData] = useState([]);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleIdChange = (event) => {
    setNewId(event.target.value);
  };

  useEffect(() => {
    if (user?.followers?.length > 0) {
      const followers = user.followers.map(
        (follower) => follower.follower._ref
      );
      const query = `*[_type == "user" && _id in ${JSON.stringify(followers)}]`;
      client.fetch(query).then((data) => setFollowerData(data));
    }
  }, [user]);
  console.log(followerData);
  const handleAboutChange = (event) => {
    setNewAbout(event.target.value);
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

  let alreadySaved = user?.followers?.filter(
    (item) => item?.follower?._ref === User?.sub
  );

  const follow = (id) => {
    client
      .patch(id)
      .setIfMissing({ followers: [] })
      .insert("after", "followers[-1]", [
        {
          _key: uuidv4(),
          userId: User?.sub,
          follower: {
            _type: "postedBy",
            _ref: User?.sub,
          },
        },
      ])
      .commit()
      .then(() => {
        window.location.reload();
      });
  };
  const unfollow = (id) => {
    client
      .patch(id)
      .unset([`followers[userId=="${User?.sub}"]`])
      .commit()
      .then(() => {
        window.location.reload();
      });
  };

  const saveChanges = async (id) => {
    if (newName) {
      client
        .patch(id)
        .set({ userName: newName })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (profileImage) {
      client
        .patch(id)
        .set({ image: profileImage?.url })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (coverImage) {
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
    }
    if (newAbout) {
      client
        .patch(id)
        .setIfMissing({ about: newAbout })
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
    if (newId) {
      const query = `*[userId == "${newId}"]`;
      client
        .fetch(query)
        .then((result) => {
          // If a user with the new ID already exists, display an error message
          if (result.length > 0) {
            alert("The user ID you entered is already taken.");
          } else {
            // If the new ID is available, make the patch request to update the user's ID
            client
              .patch(id)
              .set({ userId: newId })
              .commit()
              .then(() => {
                window.history.replaceState(
                  null,
                  null,
                  `/user-profile/${newId}`
                );
                window.location.reload();
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
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
    <div className="relative pb-2 h-full justify-center items-center ml-5 md:w-[560px] w-full">
      <div
        className="flex flex-col pb-5 "
        style={{
          border: theme === "dark" ? "1px solid  #2f3336" : "1px solid #999999",
        }}
      >
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
            className="w-full h-[220px] 2xl:h-[220px] shadow-lg object-cover"
            src={coverImage?.url}
            alt="user-pic"
          />
        )}
        <div className="mb-2">
          <div>
            {!profileImage && (
              <img
                className="rounded-full w-[135px] h-[135px] bg-white -mt-[4.5rem] ml-3 left-0 shadow-xl object-cover"
                style={{ border: "6px solid black" }}
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
                className="rounded-full w-[135px] h-[135px] bg-white  left-0  -mt-[4.5rem] ml-3 shadow-xl object-cover"
                style={{ border: "6px solid black" }}
                src={profileImage?.url}
                alt="user-pic"
              />
            )}
          </div>
          {user?._id === User.sub && (
            <button
              onClick={handleOpen}
              className="absolute right-[25px] bg-white text-black p-2 px-4 rounded-full font-bold top-[18.5rem]"
            >
              {" "}
              Edit
            </button>
          )}

          {user?._id !== User.sub && (
            <div>
              {alreadySaved?.length === 0 ||
              alreadySaved?.length === undefined ? (
                <button
                  className="absolute right-[25px] bg-white text-black p-2 px-4 rounded-full font-bold top-[18.5rem]"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    follow(user?._id);
                  }}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="absolute right-[25px] bg-white text-black p-2 px-4 rounded-full font-bold top-[18.5rem]"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    unfollow(userId);
                  }}
                >
                  Unfollow
                </button>
              )}
            </div>
          )}

          <Modal
            open={openModal}
            onClose={handleModalClose}
            closeAfterTransition
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="outline-none bg-[rgb(29,155,240,0.2)] flex items-center justify-center"
          >
            <Box className="bg-black text-white p-3 rounded-md">
              <div
                className="flex gap-1 items-center"
                style={{ borderBottom: "1px solid gray", marginBottom: "10px" }}
              >
                <IconButton className="mt-2" onClick={handleModalClose}>
                  <CloseIcon />
                </IconButton>
                <p className="text-md">Edit Profile</p>
              </div>
              <div>
                {!coverImage ? (
                  <div>
                    <label htmlFor="cover-input">
                      <img
                        className=" h-[150px] cursor-pointer  2xl:h-[180px] w-[440px] shadow-lg object-cover"
                        src={
                          user.cover
                            ? urlFor(user.cover).width(500).height(200).url()
                            : "https://source.unsplash.com/1600x900/?nature,photography,technology"
                        }
                        alt="user-pic"
                      />
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-0 h-0"
                      id="cover-input"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="cover-input">
                      <img
                        className=" h-[150px] cursor-pointer  2xl:h-[180px] w-[440px] shadow-lg object-cover"
                        src={coverImage?.url}
                        alt="user-pic"
                      />
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-0 h-0"
                      id="cover-input"
                    />
                  </div>
                )}

                {!profileImage && (
                  <div>
                    <label htmlFor="file-input">
                      <img
                        className="rounded-full cursor-pointer w-[135px] h-[135px] -mt-[4.5rem] ml-3 left-0 shadow-xl object-cover z-50"
                        src={
                          user.update === "true"
                            ? urlFor(user.image).height(180).width(180)
                            : user.image
                        }
                        alt="user-pic"
                      />
                    </label>
                    <input
                      type="file"
                      onChange={uploadImage}
                      className="w-0 h-0"
                      id="file-input"
                    />
                  </div>
                )}
                {profileImage && (
                  <div>
                    <label htmlFor="file-input">
                      <img
                        className="rounded-full cursor-pointer w-[135px] h-[135px]  left-0  -mt-[4.5rem] ml-3 shadow-xl object-cover z-50"
                        src={profileImage?.url}
                        alt="user-pic"
                      />
                    </label>

                    <input
                      type="file"
                      onChange={uploadImage}
                      className="w-0 h-0"
                      id="file-input"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <TextField
                  id="outlined-basic"
                  value={newName}
                  onChange={handleNameChange}
                  label="Name"
                  variant="outlined"
                />
                <TextField
                  id="outlined-multiline-flexible"
                  label="About"
                  value={newAbout}
                  onChange={handleAboutChange}
                  multiline
                  rows={3}
                />
              </div>
              <div className="flex justify-end w-full mt-3">
                <Button
                  variant="outlined"
                  onClick={() => {
                    saveChanges(user?._id);
                  }}
                  color="success"
                >
                  Save Changes
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
        <h1 className="text-xl ml-5 font-extrabold">
          {user?.pass === "gold" ?
            <span className="text">{user.userName}</span>
            :<span>{user.userName}</span>
          }
        </h1>
        <h1 className="text-sm mb-2 ml-5 font-extrabold text-opacity-80 truncate text-[gray]">
          @{user?.userId ? user?.userId : user?._id}
        </h1>
        {user?.about && <p className="ml-5">{user?.about}</p>}
        <div className="ml-5 flex gap-1 mt-2 text-[gray] items-center">
          <GoCalendar className="" fontSize={20} />
          Joined {moment(user._createdAt).format("MMM  YYYY")}
        </div>
        <div className="ml-4 flex gap-1 mt-2 text-[gray] items-center">
          <button
            className="hover:underline cursor-pointer flex gap-1"
            onClick={() => {
              setShowFollowers(!showFollowers);
            }}
          >
            <p className="ml-2 text-white">
              {user?.followers?.length ? user?.followers?.length : 0}
            </p>{" "}
            Followers
          </button>
        </div>
        {showFollowers === false && (
          <div className="text-center flex w-full justify-cente">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              } w-1/2  transition-all`}
            >
              Posts
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              } w-1/2 transition-all`}
            >
              Liked
            </button>
          </div>
        )}

        {showFollowers === false && (
          <div>
            <div className="flex items-center justify-center w-full">
              <MasonryLayout pins={pins} profile theme={theme} />
            </div>

            {pins?.length === 0 && (
              <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                No Pins Found!
              </div>
            )}
          </div>
        )}
        {showFollowers === true && (
          <div className="md:w-[560px] w-full p-5">
            <h1 className="text-xl font-extrabold mb-3">Followers:</h1>
            {followerData.map((follower) => (
              <div key={follower._id} className="flex items-center my-5">
                <img
                  src={follower.image}
                  className="w-14 h-14 rounded-full mr-5"
                  referrerPolicy="no-referrer"
                  alt={follower.userName}
                />
                <div className="flex flex-col">
                  <p className="text-lg">{follower.userName}</p>
                  <p className="text-sm text-[gray]">@{follower.userName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
