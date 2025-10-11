import React, { use, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import ChatBox from "./pages/ChatBox";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import { useUser, useAuth } from "@clerk/clerk-react";
import Layout from "./pages/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionSlice";
import { addMessage } from "./features/messages/messagesSlice";
import Notification from "./components/Notification";
const App = () => {
  const { user } = useUser(); // to checkuser is there or not
  const { getToken } = useAuth(); // to get the token
  const dispatch = useDispatch();
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)
  useEffect(() => {
    // to get the token in console if user is there
    const fetchData = async () => {
      if(user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token))
      }
    };
    fetchData();
  }, [user, dispatch, getToken]);

  useEffect(() => {
  pathnameRef.current = pathname
  },[pathname])
  
  useEffect(() => {
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL+ '/api/message/' + user.id)

      eventSource.onmessage = (event,) => {
        const message = JSON.parse(event.data);

        if(pathnameRef.current === ('/messages/' + message.from_user_id._id)){
          dispatch(addMessage(message))
        }else{
          toast.custom((t)=>(
            <Notification t={t} message={message}/>
          ), {position: "bottom-right"})
        }
      }
      return ()=>{
        eventSource.close()
      }
    }
  },[user,dispatch])
   // 👇 Add this here-testing
  // console.log("Clerk user:", user);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
