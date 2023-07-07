import {
    apiSlice
} from "../api/apiSlice";
import {
    messagesApi
} from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query({
            query: (email) => `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`
        }),
        //check the target participant has already conversations with user or not 
        getConversation: builder.query({
            query: ({
                userEmail,
                participantEmail
            }) => `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`
        }),
        addConversation: builder.mutation({
            query: ({
                sender,
                data
            }) => ({
                url: '/conversations',
                method: 'POST',
                body: data
            }),
            //when conversation will create push the message into message queue silently
            async onQueryStarted(arg, {
                dispatch,
                queryFulfilled
            }){
                const conversation = await queryFulfilled;
                if (conversation?.data?.id) {
                    const users=arg.data.users

                    const senderUser=users.find(user => user.email===arg.sender)
                    const receiverUser=users.find(user => user.email!==arg.sender)

                    dispatch(messagesApi.endpoints.addMessage.initiate({
                        conversationId: conversation?.data?.id,
                        sender: senderUser,
                        receiver:receiverUser,
                        message:arg.data.message,
                        timestamp:arg.data.timestamp
                    }))
                }

            }
        }),
        editConversation: builder.mutation({
            query: ({
                id,
                sender,
                data
            }) => ({
                url: `/conversations/${id}`,
                method: 'PATCH',
                body: data
            }),
               //when conversation will create push the message into message queue silently
            async onQueryStarted(arg, {
                dispatch,
                queryFulfilled,
            }) {
                const conversation = await queryFulfilled;
                if (conversation?.data?.id) {
                    const users=arg.data.users

                    const senderUser=users.find(user => user.email===arg.sender)
                    const receiverUser=users.find(user => user.email!==arg.sender)

                    dispatch(messagesApi.endpoints.addMessage.initiate({
                        conversationId: conversation?.data?.id,
                        sender: senderUser,
                        receiver:receiverUser,
                        message:arg.data.message,
                        timestamp:arg.data.timestamp
                    }))
                }

            }
        })
    })
})

export const {
    useGetConversationsQuery,
    useAddConversationMutation,
    useEditConversationMutation
} = conversationsApi