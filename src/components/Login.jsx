import React from "react";
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

const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
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
      navigate("/", { replace: true });
    });
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
              <GoogleLogin
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
              <div className="flex mt-3">

              <img className="w-[122px] h-[37px] google mt-[2.6rem] gap-2 mr-4" src={googleplay} alt="" />
              <AppStore className='apple' />
             </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
