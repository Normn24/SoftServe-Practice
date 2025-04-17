import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
