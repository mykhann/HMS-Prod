import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../reduxStore/authSlice";
import { toast } from "react-toastify";
import Footer from "../layout/Footer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://hms-prod.onrender.com/api/v1/user/login", input, { withCredentials: true });
  
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
  
        // Check user role and navigate accordingly
        if (res.data.user.role === "hotelOwner") {
          navigate("/hotel-dashboard"); 
        } else {
          navigate("/"); 
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-[#0b1633]">
        <div className="bg-[#0f1d44] p-8 rounded-xl shadow-2xl w-11/12 sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">Login</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                onChange={onChangeInput}
                value={input.email}
                placeholder="Enter your email address"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                value={input.password}
                onChange={onChangeInput}
                name="password"
                placeholder="Enter your password"
                className="mt-1 block w-full p-3 bg-[#11214e] border border-yellow-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-900 mb-6 p-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
            >
              Login
            </button>
          </form>
          
          <div className="flex justify-center">
            <Link to="/signup">
              <p className="font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                CREATE ACCOUNT
              </p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;