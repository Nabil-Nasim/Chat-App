import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import { useRef,useEffect } from "react";
import moment from "moment";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {selectedChatType,selectedChatData,selectedChatMessages, setSelectedChatMessages,userInfo} = useAppStore();


  useEffect(()=>{
    const getMessages = async () => {
      try{
       const response = await apiClient.post(
        GET_ALL_MESSAGES_ROUTE,
        {id:selectedChatData._id},
        {withCredentials:true});
       if (response.data){
          setSelectedChatMessages(response.data.messages)
       }
      }
      catch (error) {
        console.log(error)
      }
    }

   if (selectedChatData._id){
    if (selectedChatType === "contact"){
    getMessages()
    }
   }
  },[selectedChatType,selectedChatData,setSelectedChatMessages])

    // useEffect hook runs whenever the `selectedChatMessages` array changes:
    // The effect checks if the `scrollRef.current` is set (i.e., it points to a DOM element).
    // If the element exists, it calls `scrollIntoView` on that element, which smoothly scrolls the page to make this element visible.
    // This is typically used for auto-scrolling to the latest message in a chat whenever a new message is added.
  useEffect(() => {
    if (scrollRef.current){
    scrollRef.current.scrollIntoView({ behavior: "smooth" })}
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    //Map over the `selectedChatMessages` array to render each message.
    return selectedChatMessages.map((message,index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      // Check if the current message's date is different from the last rendered message's date.
      // Update `lastDate` to the current message's date for comparison in the next iteration.
      const showDate = lastDate !== messageDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate &&( <div className="text-center text-gray-500 my-2">
            {moment(message.timestamp).format("LL")}</div>)}
            {
              selectedChatType === "contact" && renderDMMessages(message)
            }

        </div>
      )
    })
  }
  const renderDMMessages = (message) =>
    <div className={`${ message.sender=== selectedChatData._id? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
        <div 
        className={`${
          message.sender !== selectedChatData._id 
            ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"  
            : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 "
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}

  </div>
      )}
   <div className="text-xs text-gray-600"> 
    {moment(message.timestamp).format("LT")}
   </div>
    </div> 
  
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}
      <div ref={scrollRef} />
    </div>

  );
};

export default MessageContainer;
