import express from 'express';
import { discoverUsers, followUser, getUserData, unfollowUser, updateUserData } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../configs/multer.js';

const UserRouter = express.Router();

UserRouter.get('/data',protect,getUserData)
UserRouter.post('/update',upload.fields([{name: 'profile',maxCount: 1},{name:'cover',maxCount: 1}]),protect,updateUserData)
UserRouter.post('/discover',protect,discoverUsers  )
UserRouter.post('/follow',protect,followUser)
UserRouter.post('/unfollow',protect,unfollowUser)

export default UserRouter;