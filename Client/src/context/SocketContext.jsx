import {
    createContext,
    useContext,
    useEffect,
    useRef
} from "react";
import {useAppStore} from "@/store"
import {HOST} from "@/utils/constants"
import {io} from "socket.io-client"

//This creates a new context called SocketContext that will be used to provide the socket object throughout the application.
const SocketContext =  createContext(null)

//This is a helper hook that allows any component to access the socket object by calling useSocket() inside its component body. It retrieves the socket value from the SocketContext using useContext.
export const useSocket = () => {
    return useContext(SocketContext)
}


//This component provides the socket to any children components that need to interact with it.
export const SocketProvider = ({
        children
    }) => {
        const socket = useRef();
        const {userInfo} = useAppStore();
      
        //This useEffect hook is responsible for initializing the socket connection whenever userInfo becomes available. It runs when userInfo changes or is set.
        useEffect(() => {
            if (userInfo) {
               
                socket.current = io(HOST, {
                    withCredentials: true,
                    query: {
                        userId: userInfo.id
                    }
                })
                socket.current.on("connect", () => {
                    console.log("Connected to Socket Server")
                })
                return () => {
                    socket.current.disconnect();
                }
            }
        }, [userInfo])
        return ( 
        //This makes the socket.current object (which holds the Socket.IO connection) available to all children components inside the SocketProvider.
        <SocketContext.Provider value = {socket.current} > 
                {children} 
        </SocketContext.Provider>)
        }