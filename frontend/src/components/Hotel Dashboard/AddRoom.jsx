import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SideNavbar from "./SideNavbar";

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    type: "",
    price: "",
    amenities: [],
    capacity: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  // Room types
  const roomTypes = ["Single", "Deluxe", "Superior"];

  // Amenities options
  const amenitiesOptions = ["wifi", "tv", "ac", "food", "parking"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  // Handle amenities selection
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRoomData({
        ...roomData,
        amenities: [...roomData.amenities, value],
      });
    } else {
      setRoomData({
        ...roomData,
        amenities: roomData.amenities.filter((a) => a !== value),
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    // Create temporary URLs for image preview
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setRoomData({ ...roomData, images: files }); // Store the actual file objects
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a FormData object
    const formData = new FormData();

    // Append room data to FormData
    formData.append("type", roomData.type);
    formData.append("price", roomData.price);
    formData.append("capacity", roomData.capacity);
    formData.append("description", roomData.description);
    roomData.amenities.forEach((amenity) => {
      formData.append("amenities", amenity);
    });

    // Append images to FormData
    roomData.images.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:5500/api/v1/room/add",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Room added successfully!");
        // Reset form
        setRoomData({
          type: "",
          price: "",
          amenities: [],
          capacity: "",
          description: "",
          images: [],
        });
      } else {
        toast.error(response.data.message || "Failed to add room");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideNavbar />
      <div className="min-h-screen bg-[#0b1633] text-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-[#0f1d44] rounded-lg shadow-lg p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 text-center">
            Add New Room
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                Room Type
              </label>
              <select
                id="type"
                name="type"
                value={roomData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-[#0f1d44] border border-yellow-600 rounded-md text-white"
                required
              >
                <option value="" disabled>
                  Select a room type
                </option>
                {roomTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Price */}
            <div className="">
              <label htmlFor="price" className="block text-sm  font-medium text-gray-300">
                Price per Night ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={roomData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-[#0f1d44]border border-yellow-600 rounded-md text-white"
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Amenities
              </label>
              <div className="mt-2 flex flex-wrap gap-3">
                {amenitiesOptions.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={amenity}
                      value={amenity}
                      checked={roomData.amenities.includes(amenity)}
                      onChange={handleAmenitiesChange}
                      className="w-4 h-4 text-yellow-400 bg-[#0f1d44] border-yellow-600 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor={amenity} className="text-sm text-gray-300">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={roomData.capacity}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-[#0f1d44] border border-yellow-600 rounded-md text-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={roomData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 bg-[#0f1d44] border border-yellow-600 rounded-md text-white"
                rows="3"
                required
              />
            </div>

            {/* Room Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Upload Images (Max 5)
              </label>
              <div className="mt-2">
                <label
                  htmlFor="images"
                  className="cursor-pointer bg-yellow-400 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Choose Images
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                    accept="image/*"
                    required
                  />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {roomData.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Room ${index}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-yellow-400 text-gray-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors"
            >
              {loading ? "Adding Room..." : "Add Room"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoom;