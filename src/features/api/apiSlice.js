import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react'


export const apiSlice = createApi({
    reducerPath: 'Api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9000',
        //Send header data based on requirements
        prepareHeaders: async (headers, {
            getState,
            endpoint
        }) => {
            const token = getState()?.auth?.accessToken
            if(token) {
                console.log(token);
                headers.set('Authorization',`Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: [],
    endpoints: (builder) => ({})
})