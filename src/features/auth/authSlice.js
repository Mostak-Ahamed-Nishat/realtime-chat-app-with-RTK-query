import {
    createSlice
} from "@reduxjs/toolkit";

let initialState = {
    accessToken: undefined,
    user: undefined,
}

export const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user
        },
        userLoggedOut: (state) => {
            state.accessToken = undefined
            state.user = undefined
        }
    }
})

export const {
    userLoggedIn,
    userLoggedOut
} = authSlice.actions
export default authSlice.reducer