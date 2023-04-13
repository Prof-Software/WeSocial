import React, { useState } from "react";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import img from "../assets/login.jpg";
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
  const [showIn, setShowIn] = useState(false);
  const [newId, setNewId] = useState("");
  const [user, setUser] = useState();
  const [log, setLog] = useState(false);
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
            alert("ID is taken");
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

  useEffect(() => {
    if (user?.userId) {
      setShow(true);
    }
  }, [user]);
  useEffect(() => {
    if (user && user?.userId === undefined) {
      setShowIn(true);
    }
  }, [user]);
  return (
    <div className="flex w-full h-[100vh]">
      <div className=" md:w-[30%] w-full bg-[black] flex items-center justify-center">
        <div
          className="shadow-2xl w-[340px]  bg-[#010101] rounded-lg border-b-2 text-white flex items-center flex-col border-b-[white] p-5 py-6"
          style={{ boxShadow: "0px 0px 2px white" }}
        >
          <h1 className="font-black text-xl mb-4">LOGIN</h1>
          {showIn === false && (
            <div>
              {show === false ? (
                <div className="w-[270px]">
                  <GoogleLogin
                    className="w-0 hidden absolute"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    useOneTap
                    cookiePolicy="single_host_origin"
                  />
                </div>
              ) : (
                <div className="bg-[#1d1d1d]  text-white w-full p-3 flex flex-col rounded-lg items-center justify-center">
                  {user?.userId && (
                    <div className="flex items-center flex-col h-[70px] w-[200px] rounded-lg justify-center">
                      <p className="mb-3">Welcome back</p>
                      <Button
                        className="w-full text-black mt-5"
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(`/user-profile/${user.userId}`)}
                        label="User Id"
                      >
                        Go to your profile
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showIn === true && (
            <div className="bg-[#1d1d1d] text-white p-2 rounded">
              <p>Please enter a user ID to continue:</p>
              <input
              type="text"

                value={newId}
                onChange={(e) => {
                  setNewId(e.target.value);
                }}
                color="secondary"
                className="w-full bg-[#1d1d1d] outline-none p-3 mt-3 focus:border-[#1da1f2] border-[#333333] border rounded-lg text-white mb-3"
                variant="outlined" 
                label="User Id"
              />
              <Button
                className="w-full text-black mt-5"
                variant="outlined"
                color="secondary"
                onClick={handleClick}
                label="User Id"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-[70%] w-[10%] bg-white">
        <img className="w-full h-full object-cover" src={img} alt="" />
      </div>
    </div>
  );
};

export default Login;
