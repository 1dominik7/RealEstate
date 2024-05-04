import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Chat from "../../components/chat/Chat";
import PulseAnimationContainerProfile from "../../ui/PulseAnimationContainerProfile";
import Alert from "../../ui/Alert";

const ProfilePage = () => {
  const data = useLoaderData();
  const [openPostDelete, setOpenPostDelete] = useState(false);
  const [postId, setPostId] = useState("");
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              Email: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          {!data ? (
            <PulseAnimationContainerProfile />
          ) : (
            <>
              <div className="title">
                <h1>My List</h1>
                <Link to="/add">
                  <button>Create New Post</button>
                </Link>
              </div>
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => (
                    <List
                      posts={postResponse.data.userPosts}
                      promote={true}
                      setPostId={setPostId}
                      setOpenPostDelete={setOpenPostDelete}
                    />
                  )}
                </Await>
              </Suspense>
              <div className="title">
                <h1>Saved List</h1>
              </div>
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => (
                    <List posts={postResponse.data.savedPosts} />
                  )}
                </Await>
              </Suspense>
            </>
          )}
        </div>
      </div>
      <div className="chatContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.chatResponse}
            errorElement={<p>Error loading chats!</p>}
          >
            {(chatResponse) => <Chat chats={chatResponse.data} />}
          </Await>
        </Suspense>
      </div>
      {openPostDelete && (
        <Alert setOpenPostDelete={setOpenPostDelete} id={postId} />
      )}
    </div>
  );
};

export default ProfilePage;
