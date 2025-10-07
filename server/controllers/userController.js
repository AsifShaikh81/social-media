import imagekit from "../configs/imageKit.js"

import { clerkClient } from "@clerk/express";
import User from "../models/User.js"
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
export const updateUserData = async (req, res) => {
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