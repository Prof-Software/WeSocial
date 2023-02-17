import React, { useRef } from "react";

const Settings = ({ theme, setTheme,switchtheme,autoPlay,switchPlay }) => {
  const checkboxRef = useRef(null);
  const autoplay = useRef(null);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">General Settings</h1>
      <div className="ml-10 mt-5 text-2xl font-bold flex items-center gap-2">
        Theme:{" "}
        <div className="flex items-center">
            <p className="text-2xl">
              Dark
            </p>
          <label className="switch ml-3">
            <input
              type="checkbox"
              ref={checkboxRef}
              checked={theme === "dark"}
              onChange={switchtheme}
            />{" "}
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="ml-10 mt-5 text-2xl font-bold flex items-center gap-2">
        Autoplay Videos: 
        <div className="flex items-center">
           <p className="text-2xl">
              {autoPlay==='on'?'On':'Off'}
            </p>
          <label className="switch ml-3">
            <input
              type="checkbox"
              ref={autoplay}
              checked={autoPlay === "on"}
              onChange={switchPlay}
            />{" "}
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
