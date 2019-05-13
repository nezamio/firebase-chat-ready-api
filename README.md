# Firebase chat API 🔥

Firebase-chat-ready-API is a simple package enable fast connection to firebase realtime database to create chat manager.  Create chat rooms, send messages and listen to instance messages .

## Getting started in a minute

**Installation with**

```sh
$ npm install @nezam/firebase-chat-ready-api
```

## Usage

> This package have two main classes `ChatRoom` class and `Message` class as the `ChatRoom` class have properties and functions related to the whole chat room such as title, get messages, sending messages, etc ...
>
> and the `Message` class have properties and functions related to individual message like message body, time of creation, update message, etc ...

#### First, import it

No ES6

```js
const {
	initializeFirebase,
	ChatRoom
} = require("@nezam/firebase-chat-ready-api");
```

ES6

```js
import { initializeFirebase, ChatRoom } from "@nezam/firebase-chat-ready-api";
```

#### Initialize the app

```js
initializeFirebase({
	// your firebase app config...
});
```

---

#### Create chat room between two users

```js
// define users objects
let userA = {userId: '1'} 
let userB = {userId: '2'}
// create chat room 
let newchatRoom = new ChatRoom("chat title", userA, userB, err => {
	if (!err) console.log(" chat room created successfully");
});
```

This class take **5** params as initial values

1. `title` the chat room title
2. `userA` one of the chat room members. object of `{userId, username, photo}`
3. `userB` second chat member. object of `{userId, username, photo}`
4. `onComplete` it's a callback function called after the chat room created successfully in firebase
5. `fromRef` create a class for chat room with it's firebase reference

> Note: you can get created chat props also in the callback function through:
>
> ```js
> var newchatRoom = new ChatRoom("chat title", userA, userB, err => {
> 	// get the chat key
> 	if (!err) console.log(newchatRoom.chatRoomRef.key);
> });
> ```

User Object is consists of 

`userId`: the user unique id  *`required`*  
`usename`: username for this user *`not required`*  
`photo`: url image for this user *`not required`*

> Note: you can get all of title, members with their props and createdAt bt simply user the chat instance 
>```js
> newchatRoom.members[0].username;
> newchatRoom.ctreatedAt;
> ...
>``` 
---

#### Change the chat title

```js
newchatRoom.setNewTitle("new title", title => {
	console.log("the chat new title is " + title);
});
```

This method is property of `ChatRoom` class. call with **2** params

1. `title` as a new string represent the new title
2. `onComplete` callback after changing the title passing the new title

---

#### Remove chat room

```js
newchatRoom.remove();
```

This method is property of `ChatRoom` class. call with **2** params

1. `softRemove` set flag `isRemoved` to `true`
2. `onComplete` callback after removing the chat room
---

#### Remove mutual chat rooms  between two users

```js
ChatRoom.removeMutualChatRooms('userA Id', 'userB Id');
```

This method `static` function  call with **2** params

1. `userA` The id of the user A
1. `userB` The id of the user B
1. `softRemove` set flag `isRemoved` to `true`

---

#### Send message in this chat room

You can use the ChatRoom instances to send messages to it.

```js
var message = newchatRoom.sendMessage("Hi", userA, err => {
	if (!err) console.log("message sent");
});
```

This method also member of `ChatRoom` class. with **3** params

1. `body` string is the message body
2. `from` represent the user how send the message *could be user Id or the user object*
3. `onComplete` callback after sending the message to the firbase

this method is return `Message` instance

---

#### Get chat rooms related to user

```js
ChatRoom.getUserChatRooms(userB, {start:5, limit:10}, (err, chats) => {
	if (!err) console.log("Count of chats is :", chats.length);
	chats.map(chat => {
		console.log(chat.members[0].username);
	});
});
```

> Note: This method is a `static` function

> Chat rooms is ordered by last modified ones

call with **3** params

1. `user` the user  *could be user Id or the user object*
2. `pagination`  paginate the returned chat rooms *Optional*  `{start: *Number*, limit: *Number*}`
3. `onComplete` callback function call after receiving all chats from firebase passing **2** params

     1. `err` is the error message if the call failed
     2. `chats` it's an array ( List ) of all the user chat room (`ChatRoom` instances)

---

#### Get messages

```js
newchatRoom.getMessages({start: 2, limit: 10}, messageList => {
	messageList.map(m =>{
		console.log(m.body);
	})
});
```

call **2** params
1. `pagination`  paginate the returned messages *Optional*  `{start: *Number*, limit: *Number*}`

2. `action` callback after receiving all messages

     > Note : the massages come in list
		 >
		 > Fires only once
---
#### Listen for new messages coming

```js
newchatRoom.listenNewMessges( message => {
	console.log(message.body);
});
```

call **1** params

1. `action` callback function is the action that should happen when receiving a message

     > Note : the massages come one after one not in list
		 >
     > This function fires after getting new message

---

#### Update message

```js
message.updateBody("new message", newBody => {
	console.log("message text updated to" + newBody);
});
```

This method member of `Message` class

call with **2** params

1. `newBody` is the new updated message
2. `onComplete` callback after update

---

#### Remove message

```js
var removedMessage = message.remove();
```

This method member of `Message` class

return the deleted message

call with **1** params

1. `newMessage` is the new updated message string
2. `afterRemove` callback after removing the message

---

#### You can get CreatedAt and updatedAt timestamps by message instance

```js
console.log(message.createdAt);
// as the updatedAt property not available only after the message get updated
if (message.updatedAt) {
	console.log(message.updatedAt);
}
```

return `timestamp` as you can easily format it using package like `moment` (for more formats)

or by simply use `Date` Class

```js
var date = new Date(createdAt);
// like: 4:01:50 AM
console.log(date.toLocaleTimeString());
// like: 10/16/2018
console.log(date.toLocaleDateString());
// like: 110/16/2018, 4:01:50 AM
console.log(date.toLocaleString());
```

> `createdAt` property available also in `ChatRoom` instance

---

#### You can get also the chat room firebase reference(ref) and key. Like this :

```js
var reference = newchatRoom.chatRoomRef;
var key = newchatRoom.chatRoomRef.key;
```

> as newchatRoom is an instance of ChatRoom Class

---

#### Find chat by key (uid)

> `static` function

```js
ChatRoom.findById("-LPK1Rr5mzwkuSDV9U9a", (err, chat) => {
	if (!err) console.log(chat);
});
```

call with **2** params

1. `uid` chat unique id (key)
2. `onComplete` callback function call after receiving all chats from firebase passing **2** params

     1. `err` is the error message if the call failed
     2. `chat` chat room (`ChatRoom` instance)

---

## Tests

Tests are using Jest, to run the tests add your firebase config object in the test file and run:

```sh
$ npm test
```

---

## Roadmap

Check out our [roadmap](https://github.com/nezamio/firebase-chat-ready-api/projects/1) to get informed by the latest feature released and the upcoming ones. You can also give us insights and vote for a specific feature. And your are more than welcome to contribute.

---

> Note: You probably should change the rules of the firbase to link it correctly

**👀 see `examples.js`**
