

export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts:[],
    setSelectedChatType: (selectedChatType) => set({
        selectedChatType
    }),
    setSelectedChatData: (selectedChatData) => set({
        selectedChatData
    }),
    setSelectedChatMessages: (selectedChatMessages) => set({
        selectedChatMessages
    }),
    setDirectMessagesContacts : (directMessagesContacts)=>
        set({directMessagesContacts}),
    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),
    addMessage: (message) => {
       const selectedChatMessages = get().selectedChatMessages;
       const selectedChatType = get().selectedChatData;
// Update the state by adding the new message to the existing list of selected chat messages
       set ({
        selectedChatMessages:[...selectedChatMessages,{
            ...message,
            recipient:
            selectedChatType === "channel" 
            ? message.recipient 
            : message.recipient._id,
            sender:
            selectedChatType === "channel" 
            ? message.sender 
            : message.sender._id,
           
        }]
       })

    },
})