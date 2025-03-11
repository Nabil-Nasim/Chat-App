

export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts:[],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels:[],
    setIsUploading: (isUploading) => set({
       isUploading
    }),
    setIsDownloading: (isDownloading) => set({
        isDownloading
    }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),

    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
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
    setChannels: (channels) => set({ channels }),
    closeChat: () => set({
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
    }),
    addMessage: (message) => {
       const selectedChatMessages = get().selectedChatMessages;
       const selectedChatType = get().selectedChatType;
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
           
        },],
       })

    },
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] });
      },
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        const index = channels.findIndex(
          (channel) => channel._id === message.channelId
        );
        if (index !== -1 && index !== undefined) {
          channels.splice(index, 1);
          channels.unshift(data);
        }
      },
      addContactsInDMContacts: (message) => {
        console.log({ message });
        const userId = get().userInfo.id;
        const fromId =
        //if the condition is true means message is sent by us else by someone else
          message.sender._id === userId
            ? message.recipient._id
            : message.sender._id;
        const fromData =
          message.sender._id === userId ? message.recipient : message.sender;
        const dmContacts = get().directMessagesContacts;
        const data = dmContacts.find((contact) => contact._id === fromId);
        const index = dmContacts.findIndex((contact) => contact._id === fromId);
       
        if (index !== -1 && index !== undefined) {
         
          dmContacts.splice(index, 1);
          dmContacts.unshift(data);
        } else {
          
          dmContacts.unshift(fromData);
        }
        set({ directMessagesContacts: dmContacts });
      },
})