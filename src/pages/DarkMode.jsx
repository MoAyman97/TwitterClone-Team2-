import React, { useEffect, useState } from "react";
import Sun from "../assets/Sun.svg";
import Moon from "../assets/Moon.svg";

const DarkMode = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("selectedTheme") || "light"
  );

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
    setSelectedTheme("dark");
  };

  
  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light");
    setSelectedTheme("light");
  };

  useEffect(() => {
    if (selectedTheme === "dark") {
      setDarkMode();
    } else {
      setLightMode();
    }
  }, [selectedTheme]);

  const toggletheme = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setSelectedTheme(newTheme);
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggletheme}
        checked={selectedTheme === "dark"}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <img
          src={Sun}
          alt="Sun"
          className="sun-icon"
          style={{ height: "20px", width: "auto" }}
        />
        <img
          src={Moon}
          alt="Moon"
          className="moon-icon"
          style={{ height: "20px", width: "auto" }}
        />
      </label>
    </div>
  );
};

export default DarkMode;
