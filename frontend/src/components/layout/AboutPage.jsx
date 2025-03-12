import React from "react";
import Navbar from "../shared/Navbar";
import Footer from "./Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1633] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Us Section */}
        <section className="bg-[#0f1d44] rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-yellow-400 mb-6">
            About Us
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            At <span className="font-semibold text-yellow-400">Grand Horizon</span>, we are passionate about creating unforgettable experiences for our guests. Our platform is designed to make hotel booking seamless, offering a wide range of luxurious accommodations, personalized services, and exclusive deals. Whether you're planning a relaxing getaway, a business trip, or a family vacation, we are here to ensure your stay is nothing short of extraordinary.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="bg-[#0f1d44] rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-yellow-400 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-300 text-center leading-relaxed">
            Our mission is to redefine hospitality by providing exceptional service, luxurious accommodations, and unforgettable experiences. We strive to make every guest feel valued and cared for, ensuring their stay with us is memorable and stress-free.
          </p>
        </section>

        {/* Our Strengths */}
        <section className="bg-[#0f1d44] rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-yellow-400 mb-6">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            At <span className="font-semibold text-yellow-400">Grand Horizon</span>, we stand out for our commitment to excellence and attention to detail. Here’s what makes us the best choice for your next stay:
          </p>
          <ul className="mt-6 space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">✔</span>
              <span className="flex-1">
                <strong>Wide Selection:</strong> Choose from a curated list of luxury hotels, resorts, and boutique accommodations.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">✔</span>
              <span className="flex-1">
                <strong>Exclusive Deals:</strong> Enjoy special discounts and packages tailored to your needs.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">✔</span>
              <span className="flex-1">
                <strong>Personalized Service:</strong> Our dedicated team is available 24/7 to assist you with bookings, special requests, and more.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">✔</span>
              <span className="flex-1">
                <strong>Seamless Booking:</strong> Our user-friendly platform makes it easy to find and book your perfect stay in just a few clicks.
              </span>
            </li>
          </ul>
        </section>

        {/* Our Story */}
        <section className="bg-[#0f1d44]rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-4xl font-bold text-center text-yellow-400 mb-6">
            Our Story
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Founded in 2024, <span className="font-semibold text-yellow-400">Grand Horizon</span> was born out of a passion for travel and hospitality. Our founders, seasoned travelers themselves, recognized the need for a platform that combines luxury, convenience, and personalized service. Today, we are proud to be a trusted name in the hospitality industry, helping thousands of guests create unforgettable memories around the world.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;