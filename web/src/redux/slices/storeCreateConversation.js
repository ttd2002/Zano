import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from '../slices/createSingleCoversationSlice';

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
    },
});