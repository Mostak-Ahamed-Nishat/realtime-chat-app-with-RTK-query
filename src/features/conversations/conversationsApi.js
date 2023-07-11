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

                //Optimistic Updates start for add conversation last message

                //Optimistic Updates end for add conversation last message

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
            //This id is the conversation id that will be edited
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

                //Optimistic cache update start || update the client side cache before queryFulfilled and if the query failed we can destroy
                //Draft 
                const updateData=dispatch(apiSlice.util.updateQueryData('getConversations',arg.sender,(draft)=>{
                    //Draft is the whole conversation array list
                    console.log("Arg ID");
                    console.log(arg.id);
                    //get the specific conversation by id
                    const conversationHaveToEdit=draft.find(singleConversation=>singleConversation.id == arg.id)
                    console.log("conversationHaveToEdit");
                    console.log(conversationHaveToEdit);
                    conversationHaveToEdit.message=arg.data.message
                    conversationHaveToEdit.timestamp=arg.data.timestamp

                }))

                //Optimistic cache update end
               try {
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
               } catch (error) {
                updateData.undo()
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