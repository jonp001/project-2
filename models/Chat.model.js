const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const chatSchema= new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    messages:[{
        sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User"
        },
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Chat= mongoose.model("Chat", chatSchema);

module.exports= Chat;
