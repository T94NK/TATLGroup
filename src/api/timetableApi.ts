import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Columns, Rate, RateItem, SchoolBoy } from '../common/interfaces/common.interfaces'


export const timetableApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://94.131.246.109:5555/v1/2/' }),
  tagTypes: ['Schoolboy', 'Column', 'Rate'],
  endpoints: (build) => ({
    getSchoolboys: build.query<SchoolBoy, void>({
      query: () => 'Schoolboy',
    }),
    getColumns: build.query<Columns, void>({
      query: () => 'Column',
    }),
    getRate: build.query<Rate, void>({
      query: () => 'Rate',
      providesTags: ['Rate']
    }),
    updateRate: build.mutation<RateItem, { url: string, body: RateItem}>({
      query: ({ url, body }) => {
        return ({
          url,
          method: 'POST',
          body,
        })
      },
      invalidatesTags: (_, error, { body }) => {
        if (error) {
          console.error("error", error.status)
        }
        return [{ type: 'Rate', Id: body.SchoolboyId }]
      },
    }),
  }),
})

export const {
  useGetColumnsQuery,
  useGetSchoolboysQuery,
  useGetRateQuery,
  useUpdateRateMutation,
} = timetableApi