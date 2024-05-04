import { createSlice } from "@reduxjs/toolkit";

const podcastSlice = createSlice({
    name: "podcasts",
    initialState: {
        podcasts: [],
    },
    reducers: {
        setPodcasts: (state, action) => {
            state.podcasts = action.payload;
        },
    },
});

export const { setPodcasts } = podcastSlice.actions;

export default podcastSlice.reducer;