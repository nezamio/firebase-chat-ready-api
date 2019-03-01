const {
    initializeFirebase,
    ChatRoom,
    Message
} = require("../index");

const config = {
    // Your firbase config...
}

describe("# Initialize Firebase app", () => {
    it("should initialize firebase", () => {
        initializeFirebase(config);
    })
})

describe("# Chat Room", () => {
    describe("# create new chat room", () => {
        it("should create new chat room in firbase with vaild user _id and string title", () => {
            const userAId = {
                userId: "507f1f77bcf86cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86cd799439022"
            }
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            expect(chatRoomOne).toBeInstanceOf(ChatRoom)
        })

        it("should fail if the title is empty or not string ", () => {
            const userAId = {
                userId: "507f1f77bcf86cd79943903"
            }
            const userBId = {
                userId: "507f1f77bcf86cd799r39021"
            }
            let title = "";
            expect(() => {
                var chatRoomOne = new ChatRoom(title, userAId, userBId)
            }).toThrow("title should be not empty and be string")
        })

    })
    describe("#set new title", () => {
        it("should set a chat new title", () => {
            let newTitle = "new title for testing"
            const userAId = {
                userId: "507f1fdd77bcf86cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf8dd6cd799439021"
            }
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            chatRoomOne.setNewTitle(newTitle, (title) => {
                expect(title).toEqual(newTitle)
            })
        })

        it("should fail to set the new title if title is not string or empty", () => {
            let newTitle = ""
            const userAId = {
                userId: "507f1f77bcssf86cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86sscd799439021"
            }
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
            const userAId = {
                userId: "507f1f77bcf86ddcd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86csssd799439021"
            }
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
            const userAId = {
                userId: "507f1f77bcf86cddd799439021"
            }
            const userBId = {
                userId: "507f1f77bcfdd86cd799439021"
            }
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))

            expect(() => {
                chatRoomOne.sendMessage(messageBody, userAId, (err) => {
                    expect(err).toBe(undefined)
                })
            }).toThrow("Message should have body and be string")
        })


        it("should fail if 'from' user to in this chat room ", () => {
            const userAId = {
                userId: "507f1f77bcf8ddd6cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86scd799439021"
            }
            const userNotInChat = "507f1f77bcf86cd799439070"
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))

            expect(() => {
                chatRoomOne.sendMessage("new message", userNotInChat, (err) => {
                    expect(err).toBe(undefined)
                })
            }).toThrow(" 'from' user must be in this chat room")
        })
    })
    describe("#Get chat rooms messages", () => {

        it("should get chat room messages", () => {
            const userAId = {
                userId: "507f1ddf77bcf86cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86cddd799439021"
            }
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            chatRoomOne.getMessagesAndListen((newMessage) => {
                expect(newMessage).toBeInstanceOf(Message)
            })
        })
    })
    describe("#remove chat room", () => {

        it("should remove chat room successfully ", () => {
            const userAId = {
                userId: "507f1ddf77bcf86cd799439021"
            }
            const userBId = {
                userId: "507f1f77bcf86cddd799439021"
            }
            var chatRoomOne = new ChatRoom("new chat room", userAId, userBId, (err => {
                expect(err).toBe(undefined)
            }))
            chatRoomOne.remove(false, (err) => {
                expect(err).toBe(undefined)
            })
        })
    })

    it("should get chat room messages", () => {
        const userAId = {
            userId: "507f1ddf77bcf86cd799439021"
        }
        const userBId = {
            userId: "507f1f77bcf86cddd799439021"
        }
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
        const user = {
            userId: "507f1f77bcf86cdddd799439021"
        }

        ChatRoom.getUserChatRooms(user, (err, chats) => {
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
        const userAId = {
            userId: "507f1f77bcf86cdd799439021"
        }
        const userBId = {
            userId: "507f1f77bcf86cd799439021"
        }
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
        const userAId = {
            userId: "507f1f77bcf86ddcd799439021"
        }
        const userBId = {
            userId: "507f1f77bcf86cdddd799439021"
        }
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
        const userAId = {
            userId: "507f1f77bcf86cdd799439021"
        }
        const userBId = {
            userId: "507f1f77bcf86cd7dd99439021"
        }
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