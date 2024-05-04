import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/HomePage";
import ListPage from "./routes/listPage/ListPage";
import { Layout, RequireAuth } from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import ProfileUpdatePage from "./routes/profileUpdatePage/ProfileUpdatePage";
import Login from "./routes/login/Login";
import Register from "./routes/register/Register";
import NewPostPage from "./routes/newPostPage/NewPostPage";
import {
  agentsLoader,
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
  userProfileLoader,
} from "./lib/loaders";
import UserProfile from "./routes/userProfile/UserProfile";
import AgentsPage from "./routes/agentsPage/AgentsPage";
import AboutPage from "./routes/aboutPage/AboutPage";
import ContactPage from "./routes/contactPage/ContactPage";
import PromotePage from "./routes/promotePage/PromotePage";
import SuccessPromotionPage from "./routes/successPromotionPage/SuccessPromotionPage";
import EditPostPage from "./routes/EditPostPage/EditPostPage";
import CancelPaymentPage from "./routes/cancelPaymentPage/CancelPaymentPage";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/agents",
          element: <AgentsPage />,
          loader: agentsLoader,
        },
        {
          path: "/userProfile/:id",
          element: <UserProfile />,
          loader: userProfileLoader,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/promote",
          element: <PromotePage />,
        },
        {
          path: "/promote/successPromotion",
          element: <SuccessPromotionPage />,
        },
        {
          path: "/editPost/:id",
          element: <EditPostPage />,
        },
        {
          path: "/promote/failedPromotion",
          element: <CancelPaymentPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
