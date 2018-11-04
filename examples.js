const {
    initializeFirebase,
    ChatRoom
} = require("./index");

const  config = {
  // your firbase config keys ...
};

// initialize the app 
initializeFirebase(config);

// valid user _ids
const userAId = "507f1f77bcf86cd799439011"
const userBId = "507f1f77bcf86fd799439011"

//create chat room

var chatRoomOne = new ChatRoom("chat title", userAId, userBId, (err) => {
    console.log("chat room is created successfully");
    console.log(chatRoomOne.chatRoomRef.key);
    
})

// set new title for chat room  
chatRoomOne.setNewTitle("new chat titel", (title) => {

    console.log("the chat new title is " + title);

})

// sending message
var message = chatRoomOne.sendMessage("Hi", userBId, (err) => {
    if (err) {
        console.log(err);

    } else {
        console.log("message sent");
    }
});


// get chat room messages 
chatRoomOne.getMessagesAndListen((message) => {
    console.log("message: ", message.body);
})


// update message
message.updateBody("new message", (newBody) => {
    console.log("Message updated to " + newBody);

})

// remove message
var remMessage = message.remove(() => {
    console.log("message removed ");
})

// get user chats

ChatRoom.getUserChatRooms(userBId, (err, chats) => {
    if (!err) {
        console.log("all user chat rooms ");
        console.log("Count of chats is :", chats.length);
        chats.map((chatRoom) => {
            console.log("chat title : ",chatRoom.title);
        })
    } else {
        console.log(err);
    }
})

// find chat by key
ChatRoom.findById("-LPK1Rr5mzwkuSDV9U9a",(err,chat)=>{
    if (!err) { 
        console.log(chat);
    }else{
        console.log(err);
        
    }
    
})
