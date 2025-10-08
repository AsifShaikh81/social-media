import express from 'express';
import { acceptConnectionRequest, discoverUsers, followUser, getUserConnections, getUserData, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../configs/multer.js';

const UserRouter = express.Router();

UserRouter.get('/data',protect,getUserData)
UserRouter.post('/update',upload.fields([{name: 'profile',maxCount: 1},{name:'cover',maxCount: 1}]),protect,updateUserData)
UserRouter.post('/discover',protect,discoverUsers  )
UserRouter.post('/follow',protect,followUser)
UserRouter.post('/unfollow',protect,unfollowUser)
UserRouter.post('/connect',protect,sendConnectionRequest)
UserRouter.post('/accept',protect,acceptConnectionRequest)
UserRouter.post('/connections',protect,getUserConnections)

export default UserRouter;