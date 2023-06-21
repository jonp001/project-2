const mongoose= require("mongoose");

const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }, 
    
    avatar: {
      img: String,
    },

    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      trim: true
    },
    
    password: {
      type: String,
      required: true
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }],
    Admin: {type: Boolean, default: false},
    active: {type: Boolean, default: false}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
