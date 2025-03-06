import {
    Server as SocketIOServer
} from "socket.io"
import Message from "./models/MessagesModel.js"
const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    })
    // This is a Map used to store the relationship between the userId and the corresponding socket.id. This allows tracking which socket (connection) belongs to which user, useful for targeting specific users during communication.
    const userSocketMap = new Map();

    //This function is called when a client disconnects. It logs the disconnection and removes the user from userSocketMap by matching the socket.id. The Map helps ensure that when a user disconnects, their socket.id is removed.
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break
            }
        }
    }
    const sendMessage = async(message)=>{
     // 1. Get the socket ID of the sender and recipient from the userSocketMap   
     const senderSocketId= userSocketMap.get(message.sender)
     const recipientSocketId= userSocketMap.get(message.recipient)

     // 2. Create a new message in the database with the provided message data
     const createdMessage = await Message.create(message)

     // 3. Fetch the message that was just created from the database, 
    // and populate sender and recipient details for the message
     const messageData = await Message.findById(createdMessage._id)
     .populate("sender","id email firstName lastName image color")
     .populate("recipient","id email firstName lastName image color")


     // 4. If the recipient is online (socket ID exists), send them the message data
     if (recipientSocketId){
        io.to(recipientSocketId).emit("receiveMessage",messageData);
    }
     // 5. If the sender is online (socket ID exists), send them the message data
    if (senderSocketId){
        io.to(senderSocketId).emit("receiveMessage",messageData);
    }
    }
   
    //(io.on("connection")): This listens for new client connections. When a new connection is made, the server:
    //Retrieves the userId from the client's handshake query (sent when the connection is initiated).
    //Maps the userId to the socket.id.
    //Logs the connection.
    //If no userId is provided, it logs an error message.
    io.on("connection", (socket) => {
      
        const userId = socket.handshake.query.userId
       

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected:${userId} with socket ID:${socket.id}`)
        } else {
            console.log("User Id not provided during connection")
        }
        socket.on("sendMessage",sendMessage)
        socket.on("disconnect", () => disconnect(socket))
    })
}
export default setupSocket