// This function is a slice of the store. It defines part of the state and how it can be modified. Here, it takes a set function as an argument (provided by Zustand) which is used to update the state.
export const createAuthSlice = (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({
        userInfo
    }),

})