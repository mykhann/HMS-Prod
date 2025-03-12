import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    username: "",
  });

  const onchangeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation checks
    if (input.name.length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(input.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (input.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!/^\d{10}$/.test(input.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (input.username.length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    try {
      const res = await axios.post("https://hms-prod.onrender.com/api/v1/user/register", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-[#0b1633]  ">
        <div className="bg-[#0f1d44] p-8 rounded-xl shadow-2xl w-11/12 sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Sign Up</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <input
                type="text"
                name="name"
                onChange={onchangeInputHandler}
                value={input.name}
                placeholder="Enter your name"
                className="mt-1 block w-full p-3 bg-[#11214e]  border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="email"
                name="email"
                onChange={onchangeInputHandler}
                value={input.email}
                placeholder="Enter your email address"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="text"
                name="username"
                onChange={onchangeInputHandler}
                value={input.username}
                placeholder="Enter your username"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                name="password"
                onChange={onchangeInputHandler}
                value={input.password}
                placeholder="Enter your password"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="number"
                name="phone"
                onChange={onchangeInputHandler}
                value={input.phone}
                placeholder="Enter your phone number"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 mb-6 p-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="flex justify-center">
            <Link to="/login">
              <p className="font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                Already have an account? <span className="text-yellow-400 hover:text-yellow-500">Log In</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
