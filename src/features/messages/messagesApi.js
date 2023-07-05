import {
    apiSlice
} from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (id) => `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`
        })
    })
})

export const {useGetMessagesQuery}=messagesApi

