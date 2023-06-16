const mongoose= require("mongoose");
const Schema =mongoose.Schema;


const accessorySchema= new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    img: String,
    description: String,
    price: String,
    favorited: {type: Boolean, default: false},
    selling: {type: Boolean, default: false}
});

const Accessory= mongoose.model("Accessory", accessorySchema);

module.exports= Accessory