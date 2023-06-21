const express= require("express");
const router= express.Router();
const User= require("../models/User.model");
const Chat= require("../models/Chat.model");
isLoggedIn= require("../utils/isLoggedIn");


router.post("/users/:id/chats", async (req, res, next) => {

    const {id}= req.params; 
    const {recipientId, message} = req.body;

    try{
        const chat= new Chat({
            users: [id, recipientId],
            messages: [{
                sender: id,
                message: message
            }]
        });

        await chat.save();

        const user= await User.findById(id);
        user.chats.push(chat._id);
        await user.save();

        const recipient= await User.findById(recipientId);
        recipient.chats.push(chat._id);
        await recipient.save();


        res.redirect("/inbox");
    } catch(error) {
        next(error);
    }
});


router.post("/chats/:id/messages", async (req, res, next) => {
    const {id}= req.params;
    const {senderId, message}= req.body;


    try{
        const chat= await Chat.findById(id);
        chat.messages.push({
            sender: senderId,
            message: message
        });

        await chat.save();

        res.redirect("/inbox/" + id);
    } catch(error){
        next(error)
    }
});


module.exports= router;