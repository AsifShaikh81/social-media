import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ChatBox from './pages/ChatBox'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
 import CreatePost from './pages/CreatePost'
import { useUser, useAuth } from '@clerk/clerk-react'
import  Layout  from './pages/Layout'
import{Toaster} from 'react-hot-toast'
const App = () => {
  const {user} = useUser() // to checkuser is there or not
  const {getToken} = useAuth() // to get the token
 
  
  useEffect(()=>{
    // to get the token in console if user is there
    if(user){
      getToken().then((token)=>console.log(token));
      
    }
  },[user]) 
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={!user? <Login/>: <Layout/>}>
      <Route index element={<Feed/>}/>
      <Route path='messages' element={<Messages/>}/>
      <Route path='messages/:userId' element={<ChatBox/>}/>
      <Route path='connections' element={<Connections/>}/>
      <Route path='discover' element={<Discover/>}/>
       <Route path='profile' element={<Profile/>}/>
      <Route path='profile/:profileId' element={<Profile/>}/>
      <Route path='create-post' element={<CreatePost/>}/>

      </Route>
    </Routes>
    </>
  )
}  

export default App