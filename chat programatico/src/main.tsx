import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.tsx";
import ListRooms from "./pages/ListRooms/ListRooms.tsx";
import Room from "./pages/room.tsx/Room.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/list-rooms/:nickName",
    element: <ListRooms />,
  },
  {
    path: "/room/:RoomName",
    element: <Room />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
