import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ChatBox from './pages/ChatBox'
import Feed from './pages/Feed'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
 import CreatePost from './pages/CreatePost'
import { useUser } from '@clerk/clerk-react'
import  Layout  from './pages/Layout'
const App = () => {
  const {user} = useUser() // to checj user is there or not
  return (
    <>
    <Routes>
      <Route path='/' element={!user? <Login/>: <Layout/>}>
      <Route path='messages' element={<Feed/>}/>
      <Route path='messages/:userId' element={<ChatBox/>}/>
      <Route path='connections' element={<Connections/>}/>
      <Route path='discover' element={<Discover/>}/>
      <Route path='profile/:profileId' element={<Profile/>}/>
      <Route path='create-post' element={<CreatePost/>}/>

      </Route>
    </Routes>
    </>
  )
}  

export default App