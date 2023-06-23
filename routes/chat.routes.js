const express= require("express");
const router= express.Router();
const User= require("../models/User.model");
const Chat= require("../models/Chat.model");
isLoggedIn= require("../utils/isLoggedIn");
const axios= require("axios");


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

        const recipientEmail= recipient.email;
    
    //copy & pasted from rapidapi site to set up email notifications

    const options = {
        method: 'POST',
        url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPIKEY,
          'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com'
        },
        data: {
          personalizations: [
            {
              to: [
                {
                    
                  email: recipientEmail
                }
              ],
              subject: 'New Message Recieved'
            }
          ],
          from: {
            email: 'noreply@bicycle-marketplace.co'
          },
          content: [
            {
              type: 'text/html',
              value: `<h3>You have recieved a new message</h3>.
              <p>Please click <a href="https://bicycle-marketplace.fly.dev/chats/inbox"here</a> to view your inbox</p>`
            }
          ]
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data);
      } catch (error) {
          console.error(error);
      }

        res.redirect("/chats/inbox");
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

        res.redirect("chats/inbox/" + id);
    } catch(error){
        next(error)
    }
});

router.get("/chats/:id/messages", isLoggedIn, async (req, res, next) => {
    try {
        const chat= await Chat.findById(req.params.id).populate("messages.sender")
        const users = await User.find({ _id: { $ne: req.session.currentUser._id } }); // get all users excluding the current user
        res.render("chats/message", { chat, users });
    } catch(error) {
        next(error);
    }
});

router.get("/chats/inbox", isLoggedIn, async (req, res, next) => {
    try {
        const user= await User.findById(req.session.currentUser._id).populate({
            path:"chats",
            populate: {
                path: "messages.sender",
                model: "User"
            }
        });

        console.log(user);

        const inboxChats= user.chats.filter(chat => {
            if(chat.messages.length >0) {
            const lastMessage= chat.messages[chat.messages.length - 1];
            if (lastMessage && lastMessage.sender) { 
                return !lastMessage.sender._id.equals(user._id);
            }
        }
        return false;
    });

        res.render("chats/inbox", { chats: inboxChats });
    } catch(error) {
        next(error);
    }
});


router.get("/sent", isLoggedIn, async (req, res, next) => {
    try{
        const user= await User.findById(req.session.currentUser._id).populate({
            path: "chats",
            populate: [
                { path: "messages.sender", model: "User" },
                { path: "users", model: "User" }
              ]
        });
        const sentChats= user.chats.filter(chat => {
            if(chat.messages.length >0) {
            const lastMessage= chat.messages[chat.messages.length -1];
            return lastMessage.sender._id.equals(user._id);
            }
            return false;
        });
        const chatWithRecipient = sentChats.map(chat => { 
            const recipient = chat.users.find(u => !u._id.equals(user._id));
            return {...chat._doc, recipient}; //this allows  you to find the receipent the message was sent too
        });

        res.render("chats/sentMessages", { chats: chatWithRecipient });
    } catch(error) {
        next(error);
    }
});


router.get("/chats/new", isLoggedIn, async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.currentUser._id } }); // get all users excluding the current user
    res.render("chats/message", { users });
});


router.get("/inbox/:id", isLoggedIn, async (req, res, next) => {
    try {
        const chat= await Chat.findById(req.params.id).populate("messages.sender")
        res.render("chats/messageDetails", { chat });
    } catch(error) {
        next(error);
       }
});

module.exports= router;