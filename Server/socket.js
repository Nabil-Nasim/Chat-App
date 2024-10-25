import {
    Server as SocketIOServer
} from "socket.io"

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
        socket.on("disconnect", () => disconnect(socket))
    })
}
export default setupSocket