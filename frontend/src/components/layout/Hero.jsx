import React from "react";
import { Link } from "react-router-dom";
import HotelList from "../Hotel/HotelList";

const Hero = () => {
  return (
    <>
      <section className="relative flex items-center justify-center h-screen bg-[#0b1633] text-white overflow-hidden">
     
        {/* Gradient Overlay */}
        <div className="absolute inset-0 "></div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
            Welcome to <span className="text-yellow-400">Hotel Name</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-300 animate-fade-in-up delay-100">
            Experience unparalleled luxury and comfort at our world-class hotel. Your perfect getaway starts here.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link to="/hotels">
              <button className="bg-gradient-to-r bg-yellow-900 hover:from-yellow-800 hover:to-yellow-800 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                BOOK ROOM
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-400 hover:text-gray-900 hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                About Us
              </button>
            </Link>
          </div>
        </div>
        
        {/* Scrolling Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>
      <HotelList/>

      {/* Premium Features Section */}
      <section className="py-20 bg-[#0b1633]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0f1d44] p-8 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Luxurious Rooms
              </h3>
              <p className="text-gray-300">
                Indulge in our spacious and elegantly designed rooms with stunning views and top-notch amenities.
              </p>
            </div>
            <div className="bg-[#0f1d44] p-8 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Fine Dining
              </h3>
              <p className="text-gray-300">
                Savor exquisite culinary delights prepared by our world-renowned chefs in our fine dining restaurants.
              </p>
            </div>
            <div className="bg-[#0f1d44] p-8 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Spa & Wellness
              </h3>
              <p className="text-gray-300">
                Rejuvenate your mind and body with our luxurious spa treatments and wellness programs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;