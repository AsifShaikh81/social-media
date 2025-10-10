import imagekit from "../configs/imageKit.js"

import { clerkClient } from "@clerk/express";
import User from "../models/User.js"
import Post from "../models/Post.js";
import Connection from '../models/Connection.js'
import fs from 'fs'
// Get User Data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth() // getting user id from clerk
        const user = await User.findById(userId) // retrieve user id from db 
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//  Update User Data
/* export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        let {username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)
       // if username is not provided in body than add existing username 
        !username && (username = tempUser.username)

        if(tempUser.username !== username){
            const user = await User.findOne({ username})
            if(user){
                // we will not change the username if it is already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }
       // getting profile and cover photo from multer
        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]
       
        // if profile is availabel then convert it into buffer
        if(profile){
            // conveted to buffer
            const buffer = fs.readFileSync(profile.path)
            // uploading to image kit
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })
           // After uploagin creating URL, this url will be added in db
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp' },
                    { width: '512' }
                ]
            })
            updatedData.profile_picture = url;// now adding url to db

            const blob = await fetch(url).then(res => res.blob());
            await clerkClient.users.updateUserProfileImage(userId, { file: blob });
        }

        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, {new : true})

        res.json({success: true, user, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
} */

export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        let {username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)
       // if username is not provided in body than add existing username 
        !username && (username = tempUser.username)

        if(tempUser.username !== username){
            const user = await User.findOne({username})
            if(user){
                // we will not change the username if it is already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp' },
                    { width: '512' }
                ]
            })
            updatedData.profile_picture = url;

            const blob = await fetch(url).then(res => res.blob());
            await clerkClient.users.updateUserProfileImage(userId, { file: blob });
        }

        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,
            })

            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: 'auto'},
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
            updatedData.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, {new : true})

        res.json({success: true, user, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
// Find Users using username, email, location, name
export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { input } = req.body;

        
        const allUsers = await User.find(
            {
                $or: [
                    {username: new RegExp(input, 'i')},
                    {email: new RegExp(input, 'i')},
                    {full_name: new RegExp(input, 'i')},
                    {location: new RegExp(input, 'i')},
                ]
            }
        )
        // Exclude the current/logged in user from the while searching users
        const filteredUsers = allUsers.filter(user=> user._id !== userId);

        res.json({success: true, users: filteredUsers})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Follow User
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const user = await User.findById(userId)
        
        // Check if already following
        if(user.following.includes(id)){
            return res.json({ success: false, message: 'You are already following this user'})
        }
      // Add user to following list
        user.following.push(id);
        await user.save() // Save the user after updating following list

        // Add current user to the followers list of the user being followed, iska mtlb hai ki jise follow kr rhe uske followers me current user ka id add krna
        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save() // Save the toUser after updating followers list

        res.json({success: true, message: 'Now you are following this user'})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
// Unfollow User
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth() // Current logged in user
        const { id } = req.body; // id of the user to be unfollowed

        const user = await User.findById(userId)// Get the current user
        user.following = user.following.filter(user=> user !== id); // Remove the user from following list
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(user=> user !== userId); // Remove the current user from the followers list of the user being unfollowed
        await toUser.save()
        
        res.json({success: true, message: 'You are no longer following this user'})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth() // Current logged in user
        const { id } = req.body; // id of the user to whom connection request is to be sent

        // Check if user has sent more than 20 connection requests in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const connectionRequests = await Connection.find({from_user_id: userId, created_at: { $gt: last24Hours }})
        if(connectionRequests.length >= 20){
            return res.json({success: false, message: 'You have sent more than 20 connection requests in the last 24 hours'})
        }

        // Check if users are already conected
        //The $or operator in MongoDB performs a logical OR operation on an array of expressions. It selects documents that satisfy at least one of the expressions provided in the array. In this case, it checks for existing connections in both directions between the two users.
        const connection = await Connection.findOne({
            $or: [
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId},
            ]
        })
       //  if no connection found then create a new connection request
        if(!connection){
           const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })
            // trigger inngest function to send email 
            await inngest.send({
                name: 'app/connection-request',
                data: {connectionId: newConnection._id}
            })

            return res.json({success: true, message: 'Connection request sent successfully'})
        // if connection found and status is accepted then return already connected
        }else if(connection && connection.status === 'accepted'){
            return res.json({success: false, message: 'You are already connected with this user'})
        }

        return res.json({success: false, message: 'Connection request pending'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// Get User Connections
export const getUserConnections = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({to_user_id: userId, status: 'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id)

        res.json({success: true, connections, followers, following, pendingConnections})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth()
        const { id } = req.body;
        
        // 
        const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

        if(!connection){
            return res.json({ success: false, message: 'Connection not found' });
        }

        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save()

        const toUser = await User.findById(id);
        toUser.connections.push(userId);
        await toUser.save()

        connection.status = 'accepted';
        await connection.save()

        res.json({ success: true, message: 'Connection accepted successfully' });

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// Get User Profiles
export const getUserProfiles = async (req, res) =>{
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId)
        if(!profile){
            return res.json({ success: false, message: "Profile not found" });
        }
        const posts = await Post.find({user: profileId}).populate('user')

        res.json({success: true, profile, posts})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

 