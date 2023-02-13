import React, { useRef } from "react";

const Settings = ({ theme, setTheme,switchtheme }) => {
  const checkboxRef = useRef(null);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">General Settings</h1>
      <div className="ml-10 mt-5 text-2xl font-bold flex items-center gap-2">
        Theme:{" "}
        <div className="flex items-center">
            <p className="text-2xl">

          {theme === "dark" ? "Dark" : "Light"}
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
    </div>
  );
};

export default Settings;
