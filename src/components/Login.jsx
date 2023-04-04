import React, { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../client";
import jwt_decode from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import googleplay from "../assets/goplay.png";
import { ReactComponent as AppStore } from "../assets/appstore.svg";
import { Input } from "@mui/material";
import Button from "@mui/material/Button";
import { homeUser, userQuery } from "../utils/data";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [newId, setNewId] = useState("");
  const [user, setUser] = useState();

  const responseGoogle = (response) => {
    const userResponse = jwt_decode(response.credential);

    localStorage.setItem("user", JSON.stringify(userResponse));
    const { name, sub, picture } = userResponse;

    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      const query = userQuery(sub);
      client.fetch(query).then((data) => {
        setUser(data[0]);
      });
      setShow(true);
    });
  };

  const handleClick = () => {
    if (newId) {
      const query = `*[userId == "${newId}"]`;
      client
        .fetch(query)
        .then((result) => {
          // If a user with the new ID already exists, just show the user's profile
          if (result.length > 0) {
            alert('ID is taken')
          } else {
            // If the new ID is available, make the patch request to update the user's ID
            client
              .patch(user._id)
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

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute  flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0     bg-blackOverlay">
          <div className="bg-[rgb(0,0,0,0.7)] rounded-lg border-slate-700 border p-10 flex items-center flex-col">
            <div className="p-5 flex items-center justify-center flex-col text-3xl text-white font-bold">
              WeSocial
              <p className="font-extralight text-sm">
                Login to know What the world is doing!
              </p>
            </div>

            <div className="shadow-2xl">
              {show === false ? (
                <GoogleLogin
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy="single_host_origin"
                />
              ) : (
                <div className="bg-white text-black w-full p-3 flex flex-col items-center justify-center">
                  {user && user.userId ? (
                    <>
                      <p>Welcome back, {user.userName}!</p>
                      <Button
                        className="w-full text-black mt-5"
                        onClick={() => navigate(`/user-profile/${user.userId}`)}
                        variant="contained"
                        label="User Id"
                      >
                        Go to your profile
                      </Button>
                    </>
                  ) : (
                    <div>
                      <p>Please enter a user ID to continue:</p>
                      <Input
                        value={newId}
                        onChange={(e) => {
                          setNewId(e.target.value);
                        }}
                        className="w-full text-black mb-3"
                        variant="outlined"
                        label="User Id"
                      />
                      <Button
                        className="w-full text-black mt-5"
                        onClick={handleClick}
                        variant="contained"
                        label="User Id"
                      >
                        Submit
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
