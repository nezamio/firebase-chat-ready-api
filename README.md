# Firebase chat API  🔥
Firebase-chat-ready-API is a simple package enable  fast connection to firebase realtime database and create chat manager. Create chat rooms, send messages and listen to instance messages .

## Getting started in a minute
**Installation with**
```sh
$ npm install firebase-chat-ready-api
```
## Usage

> This package have two main classes `ChatRoom` class and `Message` class as the `ChatRoom`  class have properties and functions related to the whole chat room such as title, get messages, sending messages, etc ...
>
> and the `Message` class have properties and functions related to individual message like message body, time of creation, update message, etc ...

#### First, import it

No ES6
```js
const { initializeFirebase, ChatRoom } = require("firebase-chat-ready-api");
```
ES6
```js
import { initializeFirebase, ChatRoom } from "firebase-chat-ready-api"
```
#### Initialize the app

```js
var config = {
	// your firebase app config...
};

initializeFirebase(config);
```

---

#### Create chat room between two users

```js
var chatRoomOne = new ChatRoom("chat title", "user1233", "user1234", err => {
	if (!err) console.log(" chat room created successfully");
});
```

This class take **5** params as initial values

1. `title` the chat room title
2. `userA` the one of the members "id" of the chat
3. `userB` the other member "id"
4. `onComplete` it's a callback function called after the chat room created successfully in firebase
5. `fromRef` create a class for chat room with it's firebase reference 

---

#### Change the chat title

```js
chatRoomOne.setNewTitle("new title", title => {
	console.log("the chat new title is " + title);
});
```

This method is property of `ChatRoom` class. this method call with **2** params

1. `title` as a new string represent the new title
2. `onComplete` callback after changing the title passing the new title

---

#### Send message in this chat room

You can use the ChatRoom instances to send messages to it.

```js
var message = chatRoomOne.sendMessage("Hi", userId, err => {
	if (!err) console.log("message sent");
});
```

This method also member of `ChatRoom` class. as it call with **3** params

1. `body` string is the message body
2. `from` represent the user how send the message 
3. `onComplete` callback after sending the message to the firbase

this method is return `Message` instance


---

#### Get chat rooms related to user

```js
ChatRoom.getUserChatRooms(userId, (err, chats) => {
	if (!err) console.log("Count of chats is :", chats.length);
	chats.map(chat => {
		console.log(chat.title);
	});
});
```

> Note: This method is a `static` function

This method call with **2** params

1. `userId` as it's the user \id
2. `onComplete` callback function call after receiving all chats from firebase passing **2** params

     1. `err` is the error message if the call failed
     2. `chats` it's an array ( List ) of all the user chat room (`ChatRoom` instances)

---

#### Get chat messages and listen for new messages comming

```js
chatRoomOne.getMessagesAndListen(message => {
	console.log(message.body);
});
```

This method call **1** params

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

this method return the deleted message

call with **1** params

1. `newMessage` is the new updated message string
2. `afterRemove` callback after removing the message

---

**You can get CreatedAt  and updatedAt timestamps by message instance**

```js
console.log(message.createdAt);
// as the updatedAt property not available only after the message get updated
if (message.updatedAt) {
	console.log(message.updatedAt);
}
```

return `timestamp` as you can easily format it using package like `moment` (for more formats)

or by simply use ```Date``` Class
```js
var date = new Date(createdAt);
// like: 4:01:50 AM
console.log(date.toLocaleTimeString())
// like: 10/16/2018
console.log(date.toLocaleDateString())
// like: 110/16/2018, 4:01:50 AM
console.log(date.toLocaleString())
```

> `createdAt` property available also in `ChatRoom` instance

---
## Tests
Tests are using Jest, to run the tests use:
```sh
$ npm test
```
---
## Roadmap
Check out our [roadmap](https://github.com/nezamio/firebase-chat-ready-api/projects/1) to get informed by the latest feature released and the upcoming ones. You can also give us insights and vote for a specific feature. And your are more than welcome to contribute.

---
>Note: You probably  should change the rules of the firbase to linked correctly 


**👀 see `examples.js`**


