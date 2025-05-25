import React from "react";
import { supabase } from "../Config/Supabase";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Event Management System</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
