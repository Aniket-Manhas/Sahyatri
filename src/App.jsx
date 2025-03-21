import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useState } from "react";
import "./App.css";
import AppLayout from "./layout/app-layout";
import LandingPage from "./pages/landing";
import Map from "./pages/map";
import Platform from "./pages/platform";
import BookRide from "./pages/Book_ride";
import TicketGates from "./pages/TicketGates";
import WaitingRoom from "./pages/WaitingRoom";
import RoutePlanner from "./pages/RoutePlanner";
import Help from "./pages/help";
import Login from "./pages/login";
import Settings from "./pages/settings";
import ChatBot from "./component/ChatBot";

// Create a context for user data
export const UserContext = createContext(null);

const GOOGLE_CLIENT_ID =
  "297154809125-vl8toj4ehdotd3u3bsglbt21l9a7q3ij.apps.googleusercontent.com";

function App() {
  const [user, setUser] = useState(null);

  // Create a layout component that includes both AppLayout and ChatBot
  const LayoutWithChatBot = () => (
    <>
      <AppLayout />
      <ChatBot />
    </>
  );

  const router = createBrowserRouter([
    {
      element: <LayoutWithChatBot />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/platform",
          element: <Platform />,
        },
        {
          path: "/map",
          element: <Map />,
        },
        {
          path: "/route-planner",
          element: <RoutePlanner />,
        },
        {
          path: "/book-ride",
          element: <BookRide />,
        },
        {
          path: "/waiting-room",
          element: <WaitingRoom />,
        },
        {
          path: "/ticket-gates",
          element: <TicketGates />,
        },
        {
          path: "/help",
          element: <Help />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
  ]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
