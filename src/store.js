import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import podcastReducer from "./slices/podcastSlice";
// import episodeReducer from "./slices/episodeSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        podcasts: podcastReducer,
        // episodes: episodeReducer,
    },
});


export default store;