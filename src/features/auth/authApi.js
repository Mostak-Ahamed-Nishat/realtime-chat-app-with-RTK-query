import {
    apiSlice
} from "../api/apiSlice";
import {
    userLoggedIn
} from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data
            }),

            // start after send the request before the response it start
            //arg=as the request accepting the data={name,email,password} for registration
            //queryFulfilled =query fulfilled ?
            //dispatch
            async onQueryStarted(arg, {
                queryFulfilled,
                dispatch
            }) {
                try {
                    const result = await queryFulfilled()
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }));

                    dispatch(userLoggedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))

                } catch (error) {
                    //Nothing to do here
                }
            }

        }),
        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, {
                queryFulfilled,
                dispatch
            }) {
                try {
                    const result = await queryFulfilled()
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }));

                    dispatch(userLoggedIn({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))

                } catch (error) {
                    //Nothing to do here
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation
} = authApi;