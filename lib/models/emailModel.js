import mongoose from "mongoose";

const schema = new mongoose.Schema({
    author:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["admin" || "Admin", "user" || "User"],
        default: "user",
        require: true,
    }
})

const EmailModel = mongoose.models.email || mongoose.model("email", schema);
export default EmailModel;