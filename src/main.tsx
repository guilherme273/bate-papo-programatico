import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home.tsx";

import { SocketProvider } from "./contexts/WebSocketContext.js";
import ListRooms from "./pages/ListRooms/ListRooms.tsx";
import Room from "./pages/room.tsx/Room.tsx";
import { IsLogaded } from "./PrivatesRoutes/isLogaded.tsx";
import Admin from "./pages/Admin/Admin.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/list-rooms",
    element: <IsLogaded />,
    children: [
      {
        path: "",
        element: <ListRooms />,
      },
    ],
  },
  {
    path: "/room/:RoomName",
    element: <IsLogaded />,
    children: [
      {
        path: "",
        element: <Room />,
      },
    ],
  },
  {
    path: "/Admin",
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>
);
