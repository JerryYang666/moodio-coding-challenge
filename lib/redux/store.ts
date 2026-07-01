import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "./slices/querySlice";
import uiReducer from "./slices/uiSlice";
import { api } from "./services/api";

// Minimal store for the isolated browse page: just the query slice (search /
// filter state), a tiny ui slice, and the RTK Query "api" that talks to the
// real retrieval backend. The full app also wires nextApi/auth/account slices,
// which the challenge does not need.
export const store = configureStore({
  reducer: {
    query: queryReducer,
    ui: uiReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
