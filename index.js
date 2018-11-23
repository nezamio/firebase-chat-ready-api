const initializeApp = require("firebase").initializeApp;
const firebase = require("firebase").database;
const _ = require("lodash")

// add new errors references
class ChatRoomError extends Error {}
class InitializeAppError extends Error {}
class MessageError extends Error {}

/**
 * initialize Firebase connection and configuration 
 * @param {Object} configures your config object 
 */
function initializeFirebase(configures) {
    // set configurations 
    if (!_.isObjectLike(configures))
        throw new InitializeAppError("The configures must be an object")

    if (_.isEmpty(configures))
        throw new InitializeAppError("The configures shouldn't be empty")

    // Initialize Firebase
    initializeApp(configures);
}
/**@class */
class ChatRoom {

    /**
     * create chat room between two users .
     * @constructor
     * @param {String} title  the title of this chat room.
     * @param {{userId:String, username:String, photo:String}} userA userId , username and photo of the users in this chat room.
     * @param {{userId:String, username:String, photo:String}} userB userId , username and photo of the second user in this chat room.
     * @param {(err:Error)=>void} [onComplete] Callback function call after creating chat room or with err if not
     * @param {null} fromRef shouldn't be calld at all
     * @returns {ChatRoom} object contains all chat room properties  
     */
    constructor(title, userA,userB, onComplete, fromRef) {
        // validate title string
        if (_.isEmpty(title) || !_.isString(title))
            throw new ChatRoomError("title should be not empty and be string");
        this.title = title
        //  validate users Ids strings 
        if (_.isEmpty( userA.userId) || _.isEmpty(userB.userId) || !_.isString( userA.userId) || !_.isString(userB.userId))
            throw new ChatRoomError('Users must be a string and not empty ,your Object keys must be  {userId, username if any, photo if any} ');

        if ((userA.username && !_.isString(userA.username)) || ( userB.username && !_.isString( userB.username)))
            throw new ChatRoomError("User names should be strings");

        if ((userA.photo && !_.isString(userA.photo)) || (userB.photo && !_.isString(userB.photo)))
            throw new ChatRoomError("Photos should be strings");

        this.members = [{
            userId: userA.userId,
            username: userA.username || '',
            photo: userA.photo || '',
        }, {
            userId: userB.userId,
            username:userB.username || '',
            photo: userB.photo || ''
        }];

        this.createdAt = Date.now()
        if (_.isEmpty(fromRef)) {
            this._sendTofirebase(onComplete)
        } else {
            this.chatRoomRef = fromRef
        }

    }

    /**
     * private function send the data to firebase
     * @private this is private function 
     * @param {(err:Error)=>void} [onComplete] callback on success sending to firebase database 
     */
    _sendTofirebase(onComplete) {
        // create chat room reference in firebase
        this.chatRoomRef = firebase().ref('ChatRooms/').push({
            title: this.title,
            members: this.members,
            createdAt: this.createdAt
        }, onComplete);

        var chatKey = this.chatRoomRef.key
        // create user chat reference in firebase
        this.UserChatRef = firebase().ref("UsersChat").child(this.members[0].userId).child(chatKey).set(chatKey, (err) => {
            if (err) {
                throw new ChatRoomError(err)
            }
        });

        // create user chat reference in firebase
        this.UserChatRef = firebase().ref("UsersChat").child(this.members[1].userId).child(chatKey).set(chatKey, (err) => {
            if (err) {
                throw new ChatRoomError(err)
            }
        });

    }

    /**
     * change the title of the chat room 
     * @param {String} title  the new title to be changed 
     * @param {(title:String)=>void} [onComplete] Callback function call after changing chat room title or with err if not
     */
    setNewTitle(title, onComplete) {
        // validate title
        if (!_.isString(title) || _.isEmpty(title)) {
            throw new ChatRoomError("title should be not empty and string")
        }
        // update chat room title
        this.chatRoomRef.update({
            title,
        }, onComplete(title));
    }

    /**
     * send message in this chat room 
     * @param  {String} body the message body (message it self)
     * @param  {String} from the id of the user sent this message
     * @param {(err:Error)=>void}  [onComplete] Callback function call after changing chat room title or with err if not     * 
     * @returns {Message} Message that has been sent 
     * 
     */
    sendMessage(body, from, onComplete) {
        return new Message(body, from, this, onComplete);
    }

    /**
     * get all user chat rooms with his _id
     * @param {String|{userId:String}} user
     * @param {(err:Error,chats:ChatRoom[])=>void} onComplete Callback function call after receiving the chat rooms  or with err if not
     */
    static getUserChatRooms(user, onComplete) {
        // check validation of the user id string
        if (_.isEmpty(user))
            throw new ChatRoomError("userId should be string")

        if (_.isObject(user)) {
            user = user.userId;
        }
        var userChatRoomsRef = firebase().ref("UsersChat").child(user);

        // check if the user exist 
        firebase().ref("UsersChat").once('value', function (snapshot) {
            if (!snapshot.hasChild(user))
                throw new ChatRoomError("user not exist you not put him in any chat room ?")
        });

        // get data through firebase
        userChatRoomsRef.once("value", function (chatSnapshot) {
            var list = []
            var chatsCount = chatSnapshot.numChildren()
            chatSnapshot.forEach((ch) => {
                var chatRoomRef = firebase().ref("ChatRooms").child(ch.key)
                chatRoomRef.once("value", function (snapshot) {
                    var snap = snapshot.val()
                    const userAFire = {
                        userId: snap.members[0].userId,
                        username: snap.members[0].username,
                        photo: snap.members[0].photo
                    }
                    const userBFire = {
                        userId: snap.members[1].userId,
                        username: snap.members[1].username,
                        photo: snap.members[1].photo
                    }
                    var newChat = new ChatRoom(snap.title, userAFire, userBFire, undefined, chatRoomRef)
                    newChat.createdAt = snap.createdAt
                    list.push(newChat)
                    if (list.length == chatsCount) {
                        // passing list if all user chatrooms ChatRoom instance 
                        onComplete(undefined, list)
                    }
                }, onComplete);
            })
        }, onComplete);
    }

    // TODO: should remove this function as it redundant to getMessagesAndListen
    /**
     * Edit you should not use this function instead use getMessagesAndListen
     * get all the messages related to this chat room
     * get message by message
     * 
     * @param {Function} onComplete callback after receive each message
     */
    getAllMessages(onComplete) {
        // ! remove this error to make it work
        throw new ChatRoomError("You should not use this method use getMessagesAndListen instead ");

        // ?  working ? 
        this.chatRoomRef.child("messages").once("value", (messagesSnapshot) => {
            messagesSnapshot.forEach((message) => {
                var messageRef = this.chatRoomRef.child("messages").child(message.key);
                var message = message.toJSON()
                var newMessage = new Message(message.body, message.from, this, undefined, messageRef)
                onComplete(undefined, newMessage)
            })
        }, onComplete)
    }

    /**
     * get all messages and listen to new messages 
     * make an action when received a new mesage
     * @param {(newMessage:Message)=>void} action that should happen when receiving this message
     */
    getMessagesAndListen(action) {
        this.chatRoomRef.child("messages").on("child_added", (snapshot, prevChildKey) => {
            var messageRef = this.chatRoomRef.child("messages").child(snapshot.key);
            var message = snapshot.toJSON();
            var newMessage = new Message(message.body, message.from, this, undefined, messageRef)
            newMessage.createdAt = message.createdAt
            action(newMessage)
        })
    }

    /**
     * get chat by firebase uid  
     * @param {String} uid chat unique id
     * @param {(err:Error,chatroom:ChatRoom)=>void} onSuccess Callback function call after receiving the chat room  or with err if not
     */
    static findById(uid, onSuccess) {
        var chat = firebase().ref("ChatRooms").child(uid);
        chat.once('value', (snapshot) => {
            try {
                var snap = snapshot.val();
                if (snap === null) {
                    return onSuccess("Chat not found!", undefined);
                }
                const userAFire = {
                    userId: snap.members[0].userId,
                    username: snap.members[0].username,
                    photo: snap.members[0].photo
                }
                const userBFire = {
                    userId: snap.members[1].userId,
                    username: snap.members[1].username,
                    photo: snap.members[1].photo
                }
                var newChat = new ChatRoom(snap.title, userAFire, userBFire, undefined, chatRoomRef)
                return onSuccess(undefined, newChat);
            } catch (error) {
                return onSuccess(error, undefined);
            }

        }, onSuccess)
    }

}

/**  @class */
class Message {
    /**
     * @constructor
     * @param {String} body String: the message body (message it self)
     * @param {String|{userId:String}} from String: the id of the user sent this message
     * @param  {ChatRoom} chatRoom ChatRoom: refrance to the chat room this message in
     * @param {(err:Error)=>void} [onComplete] Callback function call after changing chat room title or with err if not     * 
     * @returns {Message} Message that has been created 
     * 
     */
    constructor(body, from, chatRoom, onComplete, fromRef) {
        // check validation message body
        if (_.isEmpty(body) || !_.isString(body))
            throw new MessageError("Message should have body and be string")
        this.body = body

        // check validation of the user id string
        if (_.isEmpty(from))
            throw new MessageError("From should be not empty")

        // check if the user in this chat room 
        if ((_.isString(from) && chatRoom.members[0].userId !== from) && (_.isString(from) && chatRoom.members[1].userId !== from) )
            throw new MessageError(" 'from' user must be in this chat room")

        // check if the user in this chat room 
        if ((_.isObject(from) && chatRoom.members[0].userId !== from.userId) && (_.isObject(from) && chatRoom.members[1].userId !== from.userId) )
            throw new MessageError(" 'from' user must be in this chat room")

        if (_.isString(from)){
            this.from = from;
        }else{
            this.from = from.userId;
        }

        if (!chatRoom instanceof ChatRoom)
            throw new MessageError("chatRoom should be instance of ChatRoom class")

        this.chatRoom = chatRoom;
        this.createdAt = Date.now()

        if (_.isEmpty(fromRef)) {

            this.messageRef = firebase().ref(chatRoom.chatRoomRef).child("messages").push({
                body: this.body,
                from: this.from,
                createdAt: this.createdAt,
            }, onComplete);
        } else {
            this.messageRef = fromRef
        }
    }

    /**
     * update message
     * @param {String} newBody new message body for this message 
     * @param  {(newBody:String)=>void} [callback] action after update 
     * 
     */
    updateBody(newBody, callback) {
        // check validation message body
        if (_.isEmpty(newBody) || !_.isString(newBody))
            throw new MessageError("Message should have body and be string")

        this.updatedAt = Date.now()
        // update chat room title
        this.messageRef.update({
            body: newBody,
            updatedAt: Date.now()
        }, callback(newBody));
    }

    /**
     * remove message
     * @param {(err:Error)=>void)} [afterRemove] action after remove the message
     * @returns {Message} Message object 
     */
    remove(afterRemove) {
        this.messageRef.remove(afterRemove);
        return this;
    }

}


module.exports = {
    initializeFirebase,
    ChatRoom,
    Message
}