// slices/episodeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const episodeSlice = createSlice({
    name: "episodes",
    initialState: {
        episodes: [],
    },
    reducers: {
        setEpisodes: (state, action) => {
        state.episodes = action.payload;
        },
    },
});

export const { setEpisodes } = episodeSlice.actions;

export default episodeSlice.reducer;