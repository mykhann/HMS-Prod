import Home from "./components/layout/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "./reduxStore/store";
import { persistor } from "./reduxStore/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import ProfilePage from "./components/profile/ProfilePage";

import { NextUIProvider } from "@nextui-org/react";
import EditProfile from "./components/profile/EditProfile";
import AboutPage from "./components/layout/AboutPage";
import HotelList from "./components/Hotel/HotelList";
import HotelRooms from "./components/rooms/HotelRooms";
import BookRoom from "./components/rooms/BookRoom";
import BookingHistory from "./components/profile/BookingHistory";
import AdminDashboard from "./components/Admin Dashboard/AdminDashboard";
import AddHotel from "./components/Admin Dashboard/AddHotel";
import FetchAllusers from "./components/Admin Dashboard/FetchAllusers";
import FetchAllAdminBookings from "./components/Admin Dashboard/FetchAllAdminBookings";
import FetchAllRooms from "./components/Admin Dashboard/FetchAllRooms";
import HoteldashboardUi from "./components/Hotel Dashboard/HotelDashboardUi.jsx"
import FetchAllHotelStaffRooms from "./components/Hotel Dashboard/FetchAllHotelStaffRooms";
import FetchAllHotelBookings from "./components/Hotel Dashboard/FetchAllHotelBookings";
import HotelInfoCard from "./components/Hotel Dashboard/HotelInfoCard";
import AddRoom from "./components/Hotel Dashboard/AddRoom.jsx";
import AdminLayout from "./components/Admin Dashboard/AdminLayout.jsx";
import ProtectedRoute from "./components/Admin Dashboard/ProtectedRoute.jsx";

// Error Boundary Component
const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-red-500">
      <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
      <p className="text-lg">
        The page you are looking for might not exist or an error occurred.
      </p>
      <a href="/" className="text-blue-500 mt-4 underline">
        Go Back Home
      </a>
    </div>
  );
};

const router = createBrowserRouter([
  // Profile components 

  { path: "/", element: <Home />, errorElement: <ErrorPage /> },
  { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
  { path: "/signup", element: <Signup />, errorElement: <ErrorPage /> },
  {
    path: "/edit-profile",
    element: <EditProfile />,
    errorElement: <ErrorPage />,
  },
  { path: "/profile", element: <ProfilePage />, errorElement: <ErrorPage /> },
  { path: "/profile/bookings", element: <BookingHistory />, errorElement: <ErrorPage /> },

  // Hotel & rooms component 

  { path: "/about", element: <AboutPage />, errorElement: <ErrorPage /> },
  { path: "/hotels", element: <HotelList />, errorElement: <ErrorPage /> },
  {
    path: `/rooms/:hotelId`,
    element: <HotelRooms />,
    errorElement: <ErrorPage />,
  },
  { path: "/book/:roomId", element: <BookRoom />, errorElement: <ErrorPage /> },

  // Admin Dashboard 
  {
    
    element: <ProtectedRoute/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <AdminDashboard />, errorElement: <ErrorPage /> },
          { path: "add-hotel", element: <AddHotel />, errorElement: <ErrorPage /> },
          { path: "view-hotels", element: <HotelList />, errorElement: <ErrorPage /> },
          { path: "view-users", element: <FetchAllusers />, errorElement: <ErrorPage /> },
          { path: "view-bookings", element: <FetchAllAdminBookings />, errorElement: <ErrorPage /> },
          { path: "view-rooms", element: <FetchAllRooms />, errorElement: <ErrorPage /> },
        ],
      },
    ],
  },

  // Hotel Dashboard 
  { path: "/hotel-dashboard", element: <HoteldashboardUi />, errorElement: <ErrorPage /> },
  { path: "/hotel/view-rooms", element: <FetchAllHotelStaffRooms />, errorElement: <ErrorPage /> },
  { path: "/hotel/view-bookings", element: <FetchAllHotelBookings />, errorElement: <ErrorPage /> },
  { path: "/hotel/view-hotel", element: <HotelInfoCard />, errorElement: <ErrorPage /> },
  { path: "/hotel/add-room", element: <AddRoom />, errorElement: <ErrorPage /> },


]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            pauseOnHover
          />
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
