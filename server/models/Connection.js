import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    from_user_id: {type: String, ref: 'User', required: true,},
    to_user_id: {type: String, ref: 'User', required: true,},
    status: {type: String, enum: ['pending', 'accepted'], default: 'pending'},
},{timestamps: true})

const Connection = mongoose.model('Connection', connectionSchema)

export default Connection

//what is ref in mongoose schema?
// ref ka matlab hai ki yeh field kisi aur model se reference le raha hai.
// Is case mein, from_user_id aur to_user_id fields User model se reference le rahe hain. Iska matlab hai ki yeh fields User model ke documents ke IDs ko store karenge. Jab hum populate method ka use karte hain, toh yeh references ko actual User documents se replace kar deta hai, jisse humein related user information mil jaati hai.