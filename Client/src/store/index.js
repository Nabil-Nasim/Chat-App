//In index.js, the store is created using Zustand's create function, which includes the auth-slice in the global state using createAuthSlice.
import {
    create
} from "zustand";
import {
    createAuthSlice
} from "./slices/auth-slice";
import {
    createChatSlice
} from "./slices/chat-slice";


export const useAppStore = create()(
    (...a) => ({
        ...createAuthSlice(...a),
        ...createChatSlice(...a),
    })
)