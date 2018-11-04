const {
    initializeFirebase,
    ChatRoom,
    Message
} = require("../index");

const config = {
  //your firebase key...

}

describe("# Initialize Firebase app", () => {
    it("should initialize firebase", () => {
        initializeFirebase(config);
    })
})

describe("# Chat Room", () => {
    describe("# create new chat room", () => {
        it("should create new chat room in firbase with vaild user _id and string title", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            expect(chatRoomOne).toBeInstanceOf(ChatRoom)
        })

        // it("should fail if the user id is invaild ", () => {
        //     const userAId = "not vaild user id"
        //     const userBId = "507f1f77bcf86cd799439011"
        //     expect(() => {
        //         var chatRoomOne = new ChatRoom("new chat room", userAId, userBId)
        //     }).toThrow("Users must be a string and valid _id and not empty")
        // })

        it("should fail if the title is empty or not string ", () => {
            const userAId = "507f1f77bcf86cd799439013"
            const userBId = "507f1f77bcf86cd799439011"
            let title = "";
            expect(() => {
                var chatRoomOne = new ChatRoom(title, userAId, userBId)
            }).toThrow("title should be not empty and be string")
        })

    })
    describe("#set new title", () => {
        it("should set a chat new title", () => {
            let newTitle = "new title for testing"
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            chatRoomOne.setNewTitle(newTitle, (title) => {
                expect(title).toEqual(newTitle)
            })
        })

        it("should fail to set the new title if title is not string or empty", () => {
            let newTitle = ""
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            expect(() => {
                chatRoomOne.setNewTitle(newTitle)
            }).toThrow("title should be not empty and string")
        })
    })

    describe("#send messages", () => {
        it("should create message and return ", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            var message = chatRoomOne.sendMessage("new message body", userAId, (err) => {
                expect(err).toBe(undefined)
            })
            expect(message).toBeInstanceOf(Message)
        })

        it("should fail if message body to string or empty ", () => {
            var messageBody = ""
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))

            expect(() => {
                chatRoomOne.sendMessage(messageBody, userAId, (err) => {
                    expect(err).toBe(undefined)
                })
            }).toThrow("Message should have body and be string")
        })

        // it("should fail if user id in invalid _id", () => {
        //     const userAId = "507f1f77bcf86cd799439021"
        //     const userBId = "507f1f77bcf86cd799439011"
        //     const invaildUserId = "12312312312"
        //     var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
        //         expect(err).toBe(undefined)
        //     }))

        //     expect(() => {
        //         chatRoomOne.sendMessage("new message", invaildUserId, (err) => {
        //             expect(err).toBe(undefined)
        //         })
        //     }).toThrow("From should be a valid user _id")
        // })

        it("should fail if 'from' user to in this chat room ", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            const userNotInChat = "507f1f77bcf86cd799439070"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))

            expect(() => {
                chatRoomOne.sendMessage("new message", userNotInChat, (err) => {
                    expect(err).toBe(undefined)
                })
            }).toThrow("this 'from' user must be in this chat room")
        })
    })
    describe("#Get chat rooms messages", () => {

        it("should get chat room messages", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            chatRoomOne.getMessagesAndListen((newMessage) => {
                expect(newMessage).toBeInstanceOf(Message)
            })
        })
    })

    describe("#Get chat rooms related to user", () => {

        it("should get array of user chat rooms", () => {
            const userId = "507f1f77bcf86cd799439021"

            ChatRoom.getUserChatRooms(userId, (err, chats) => {
                expect(err).toBeUndefined();
                expect(chats).toBe(Array)
            })
        })

        // it("should fail if the user id not vaid _id ", () => {
        //     const userId = "507f1f77bcf86cd79"
        //     expect(() => {
        //         ChatRoom.getUserChatRooms(userId, (err, chats) => {
        //             expect(err).toBeUndefined();
        //             expect(chats).toBe(Array)
        //         })
        //     }).toThrow("userId should be a valid user _id")
        // })
    })
    describe("#message functions", () => {
        it("should update message ", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            var message = chatRoomOne.sendMessage("new message body", userAId, (err) => {
                expect(err).toBe(undefined)
            })
            expect(message).toBeInstanceOf(Message)
            message.updateBody("updated message", (newMessage) => {
                expect(newMessage).toEqual("updated message")
            })
        })

        it("should fail to update message if message body is not string or empty", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            var message = chatRoomOne.sendMessage("new message body", userAId, (err) => {
                expect(err).toBe(undefined)
            })
            expect(message).toBeInstanceOf(Message)
            expect(() => {
                message.updateBody({
                    messag: "message"
                }, (newMessage) => {
                    expect(newMessage).toEqual("updated message")
                })
            }).toThrow("Message should have body and be string")
        })

        it("should remove message and return the deleted message ", () => {
            const userAId = "507f1f77bcf86cd799439021"
            const userBId = "507f1f77bcf86cd799439011"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            var message = chatRoomOne.sendMessage("new message body", userAId, (err) => {
                expect(err).toBe(undefined)
            })
            expect(message).toBeInstanceOf(Message)
            var removedMessage = message.remove((err) => {
                expect(err).toBeUndefined()
            })
            expect(removedMessage).toEqual(message)
        })
    })
    describe("#find by uid", () => {

        it("should find the chat", () => {
            const uid = "-LPK1Rr5mzwkuSDV9U9a"
            ChatRoom.findById(uid, (err, chat) => {
                expect(chat).toBeInstanceOf(ChatRoom)
            })
        })

        it("should fail if chat not found", () => {
            const uid = "-LPK1Rr5mzwkuSDV9U9a"
            ChatRoom.findById(uid, (err, chat) => {
                expect(err).toEqual("Chat not found!")
            })
        })

    })
})