import React from "react";
import avatarAdmin from "../assets/avatar-admin.jpg";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center pl-8 p-4">
      <h2 className="text-2xl font-bold text-[#26B8ED]">{title}</h2>
      <img
        src={avatarAdmin}
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
    </div>
  );
};

export default Navbar;
