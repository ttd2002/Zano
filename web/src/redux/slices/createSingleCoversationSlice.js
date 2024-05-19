import { createSlice } from '@reduxjs/toolkit';
import storage from "redux-persist/lib/storage";

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        isCreateSingleConversation: false,
    },
    reducers: {
        setIsCreateSingleConversation: (state, action) => {
            state.isCreateSingleConversation = action.payload;
        },
    },
});

export const { setIsCreateSingleConversation } = conversationSlice.actions;

export const selectIsCreateSingleConversation = (state) => state.conversation.isCreateSingleConversation;
// Thêm phần này để cập nhật trạng thái vào local storage
export const conversationPersistConfig = {
    key: 'conversation',
    storage: storage, // Import storage từ redux-persist/lib/storage
};

export default conversationSlice.reducer;