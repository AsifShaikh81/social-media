import { Inngest } from "inngest";
import User from '../models/User.js';

//*Read it asifff
//*user.created ,user.updated this all events are coming from clerk
//*clerk
// https://dashboard.clerk.com/apps/app_33VEyE3ozFsg89NP9uiahJkLGbl/instances/ins_33VEyF3Pzod68BCt7IRvVefqhIl/webhooks

//*inngest
//https://www.inngest.com/docs/getting-started/nodejs-quick-start
// Create a client to send and receive events
export const inngest = new Inngest({ id: "connexa-app" });

//*Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'}, // check clerk 
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        // to create username
        let username = email_addresses[0].email_address.split('@')[0]

        // Check availability of username
        const user = await User.findOne({username})
        
        // if username is there in database than create unique username with 4 digit random number
        if (user) {
            username = username + Math.floor(Math.random() * 10000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username
        }
        await User.create(userData) // saving to database
        
    }
)

// Inngest Function to update user data in database 
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        
    const updatedUserData = {
        email:  email_addresses[0].email_address,
        full_name: first_name + ' ' + last_name,
        profile_picture: image_url
    }
    await User.findByIdAndUpdate(id, updatedUserData)
        
    }
)

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)
// after creating create,update ,delete function i deployed back end on vercel

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserUpdation,syncUserDeletion];