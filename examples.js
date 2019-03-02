const {
    initializeFirebase,
    ChatRoom
} = require("./index");

const config = {
   // Your firebase config...
};

// initialize the app 
initializeFirebase(config);

// valid user _ids
const userA = {
    userId: 'ABC'
}
const userB = {
    userId: 'DFG',
    username: "userB",
    photo: "Pic URL ... "
}

//create chat room
var chatRoomOne = new ChatRoom("chat title", userA, userB, (err) => {
    console.log("chat room is created successfully");
    console.log(chatRoomOne.chatRoomRef.key);

})

/*
// remove chat room
chatRoomOne.remove(true, (err) => {
    if(!err) console.log("chat room removed successfully ");
})
*/

// set new title for chat room  
chatRoomOne.setNewTitle("new chat title", (title) => {
    console.log("the chat new title is " + title);
})

// sending message
var message = chatRoomOne.sendMessage("Hi", userB.userId, (err) => {
    if (err) {
        console.log(err);

    } else {
        console.log("message sent");
    }
});


// get chat room messages 
chatRoomOne.getMessagesAndListen((message) => {
    console.log("message: ", message.createdAt);
})


// update message
message.updateBody("new message", (newBody) => {
    console.log("Message updated to " + newBody);

})



// get user chats

ChatRoom.getUserChatRooms(userB.userId, (err, chats) => {
    if (!err) {
        console.log("all user chat rooms ");
        console.log("Count of chats is :", chats.length);
        chats.map((chatRoom) => {
            console.log("chat title : ", chatRoom.title);
        })
    } else {
        console.log(err);
    }
})

// find chat by key
ChatRoom.findById("-LRy9VpXnrbk13zMzABo", (err, chat) => {
    if (!err) {
        console.log(chat.members);
    } else {
        console.log(err);

    }

})