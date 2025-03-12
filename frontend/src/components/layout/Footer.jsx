import React from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b1633] text-white py-8">
      {/* Top Section */}
      <div className="container mx-auto px-6 flex flex-col items-center space-y-6">
        {/* Logo (Uncomment if needed) */}
        {/* <Link to="/">
          <img src="/logo.png" alt="Logo" className="w-36 h-36 object-contain hover:scale-105 transition-transform" />
        </Link> */}

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center space-x-6 text-gray-300">
          <li>
            <Link to="/" className="hover:text-white transition-all text-lg">
             Home
            </Link>
          </li>
          <li>
            <Link to="/hotels" className="hover:text-white transition-all text-lg">
              Hotels
            </Link>
          </li>
         
         
          <li>
            <Link to="/about" className="hover:text-white transition-all text-lg">
              About 
            </Link>
          </li>
        </ul>

        {/* Social Media Icons */}
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all text-2xl">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all text-2xl">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-all text-2xl">
            <FaTwitter />
          </a>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-700 mx-6" />

      {/* Copyright Section */}
      <Typography className="text-center text-gray-300 font-bold text-lg">
        &copy; 2024. All Rights Reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
