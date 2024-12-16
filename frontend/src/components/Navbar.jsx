import React from "react";
import logo from "../assets/logo.webp";

const Navbar = () => {
  return (
    <nav className="bg-indigo-500 flex flex-col items-center p-4 shadow-md">
      <div className="font-semibold text-3xl text-center text-white my-4">
        Welcome to the Chattu chat room
      </div>

      <div className="mb-4">
        <img
          className="h-[60px] w-[60px] rounded-full shadow-lg"
          src={logo}
          alt="Chatapp logo"
        />
      </div>
    </nav>
  );
};

export default Navbar;
