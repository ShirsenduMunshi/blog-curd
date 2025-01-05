import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect("mongodb+srv://shirsendumunshi4:ilovedata7@cluster0.d7t2p.mongodb.net/blog-app")
    console.log('DB connected');
    
};