const mongoose= require("mongoose");
const Schema = mongoose.Schema;



const bikeSchema= new Schema ({
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    img: String,
    brand: String,
    model: String,
    year: Number,
    price: Number,
    description: String,
    favorited: {type: Boolean, default: false},
    selling: {type: Boolean, default: false}
});

const Bicycle= mongoose.model("Bicycle", bikeSchema);

module.exports= Bicycle;