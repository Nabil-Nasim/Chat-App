import { GrAttachment } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import {UPLOAD_FILE_ROUTE } from "@/utils/constants";
const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  const [emojiPickerOpen, setemojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setemojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender:userInfo.id,
        content:message,
        recipient:selectedChatData._id,
        messageType:"text",
        fileUrl:undefined,
      })
    }
    else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender:userInfo.id,
        content:message,
       channelId:selectedChatData._id,
        messageType:"text",
        fileUrl:undefined,
      })
    }
    setMessage("");
  };

  const handleAttachmentClick=()=>{
    if (fileInputRef.current){
      fileInputRef.current.click()
    }
  }

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0]
     if (file){
      const formData = new FormData()
      formData.append("file",file)
      setIsUploading(true)
      const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true,onUploadProgress:(data)=>{
        setFileUploadProgress(Math.round((100*data.loaded)/data.total))
      }})

      if ( response.status === 200 && response.data){
        setIsUploading(false)
        if (selectedChatType === "contact"){
          socket.emit("sendMessage",{
            sender:userInfo.id,
            content:undefined,
            recipient:selectedChatData._id,
            messageType:"file",
            fileUrl:response.data.filePath
          })
        }
        else if (selectedChatType === "channel") {
          socket.emit("send-channel-message", {
            sender:userInfo.id,
            content:undefined,
           channelId:selectedChatData._id,
            messageType:"file",
            fileUrl:response.data.filePath,
          })
        }
      }
     }
    }
    catch (error) {
      setIsUploading(false)
      console.log(error)
    }
  }
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex px-8 justify-center items-center mb-6 gap-6">
      <div className="flex fex-1 bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" 
        onClick={handleAttachmentClick}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleAttachmentChange} />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setemojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:border-none focus:bg-[#741bda]  focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
