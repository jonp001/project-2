const mongoose= require("mongoose");

const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
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
    
    favoriteBicycle: {
      type: [mongoose.Types.ObjectId],
      ref: "Bicycle"
    },

    favoriteAccesory: {
      type: [mongoose.Types.ObjectId],
      ref: "Bicycle"
    },

    sellingBicycle: {
      type: [mongoose.Types.ObjectId],
      ref: "Accessory"
    },

    sellingAccesory: {
      type: [mongoose.Types.ObjectId],
      ref: "Accesory"
    },
    
    biography: {
      type: String
    },
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
