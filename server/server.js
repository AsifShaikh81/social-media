import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
const app = express();
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js'
import { clerkMiddleware } from '@clerk/express'
import UserRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";

await connectDB()

app.use(express.json());
app.use(cors());
//* this clerk middleware is used to auth user ,weather user logged/signed in or not
app.use(clerkMiddleware())
app.get("/", (req, res) => {
    res.send('server is running...')
    
} )   

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/user',UserRouter)
app.use('/api/post',postRouter)
const PORT = process.env.PORT || 4000;



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
