import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHotels } from "../../reduxStore/HotelSlice";
import SideNavbarAdmin from "./SideNavbarAdmin";

const AddHotel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    location: "",
    description: "",
    phone: "",
    email: "",
    image: null,
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChangeFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({
        ...input,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onChangeInputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("location", input.location);
    formData.append("description", input.description);
    formData.append("phone", input.phone);
    formData.append("email", input.email);
    formData.append("ownerName", input.ownerName);
    formData.append("ownerEmail", input.ownerEmail);
    formData.append("ownerPassword", input.ownerPassword);
   console.log(input.phone)
    if (input.image) {
      formData.append("image", input.image);
    }

    try {
      const res = await axios.post(
        "http://localhost:5500/api/v1/hotel/create",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch(setHotels(res.data.hotel));
        toast.success(res.data.message);
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
    <SideNavbarAdmin/>
    <div className="min-h-screen bg-[#0b1633] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-[#0f1d44] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 text-center">
          Add New Hotel
        </h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Hotel Name</label>
              <input type="text" name="name" value={input.name} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Location</label>
              <input type="text" name="location" value={input.location} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea name="description" value={input.description} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" rows="2" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input type="text" name="phone" value={input.phone} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Hotel Email</label>
              <input type="email" name="email" value={input.email} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Owner Name</label>
              <input type="text" name="ownerName" value={input.ownerName} onChange={onChangeInputHandler} className="mt-1 block w-full p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="email" name="ownerEmail" value={input.ownerEmail} onChange={onChangeInputHandler} placeholder="Owner Email" className="mt-1 p-2 bg-[#0f1d44]  border border-gray-600 rounded-md text-white w-full" required />
              <input type="password" name="ownerPassword" value={input.ownerPassword} onChange={onChangeInputHandler} placeholder="Owner Password" className="mt-1 p-2 bg-[#0f1d44] border border-gray-600 rounded-md text-white w-full" required />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
  <label className="text-sm font-semibold text-gray-200">Hotel Image</label>
  <div className="relative flex items-center justify-center w-full h-36 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-gray-300 bg-[#0f1d44]">
    <input
      type="file"
      name="image"
      onChange={onChangeFileHandler}
      accept="image/*"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      required
    />
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg
        className="w-10 h-10 text-gray-400 group-hover:text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 4 4m0 0l4-4m-4 4V4"></path>
      </svg>
      <p className="text-xs text-gray-400">Click to upload or drag & drop</p>
    </div>
  </div>

  {/* Custom Choose File Button */}
  {/* <button
    className="mt-2 w-fit px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-all shadow-lg"
    onClick={() => document.querySelector("input[name='image']").click()}
  >
    Choose File
  </button> */}

  {/* Image Preview */}
  {imagePreview && (
    <img
      src={imagePreview}
      alt="Preview"
      className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-600"
    />
  )}
</div>


          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={handleCancel} className="bg-red-600 text-white px-6 py-2 rounded-md">Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md">{loading ? "Adding..." : "Add Hotel"}</Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddHotel;