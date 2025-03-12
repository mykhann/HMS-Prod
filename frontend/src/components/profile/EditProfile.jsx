import { useState } from "react";
import Navbar from "../shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "../../reduxStore/authSlice";
import { FaPhotoFilm } from "react-icons/fa6";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    avatar: null,
  });

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const avatarHandler = (e) => {
    const avatar = e.target.files[0];
    setInput((prevInput) => ({ ...prevInput, avatar }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }
    try {
      const res = await axios.put(
        "https://hms-prod.onrender.com/api/v1/user/Update-Profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-[#0b1633] p-4">
        <div className="bg-[#0f1d44] p-6 rounded-lg shadow-lg w-full max-w-md text-white border-2 border-transparent transition-all duration-300 hover:border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
          <form onSubmit={submitHandler}>
            {/* Avatar Upload */}
            <div className="mb-4">
              <div className="flex items-center justify-center">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="file"
                    name="avatar"
                    className="sr-only"
                    accept="image/*"
                    onChange={avatarHandler}
                  />
                  <span className="inline-flex items-center justify-center w-full p-2 border border-gray-300 rounded-md bg-yellow-700 hover:bg-yellow-600 text-white transition-all duration-300">
                    <FaPhotoFilm className="w-8 h-8" />
                  </span>
                </label>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                onChange={inputHandler}
                value={input.name}
                placeholder="Name"
                className="w-full p-2 bg-[#0b1633] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <input
                type="email"
                onChange={inputHandler}
                value={input.email}
                name="email"
                placeholder="Email"
                className="w-full p-2 bg-[#0b1633] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="mb-4">
              <input
                type="number"
                onChange={inputHandler}
                value={input.phone}
                name="phone"
                placeholder="Phone"
                className="w-full p-2 bg-[#0b1633] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-700 text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-300"
            >
              Update
            </button>
          </form>

          {/* Cancel Link */}
          <div className="flex justify-center mt-3">
            <Link to="/profile">
              <p className="font-medium cursor-pointer text-yellow-500 hover:text-yellow-400">
                Cancel
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;