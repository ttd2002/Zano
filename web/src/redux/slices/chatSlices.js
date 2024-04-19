// Redux slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUserId: null,
  // Các trạng thái khác nếu cần
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    // Các reducers khác nếu cần
  },
});

export const { setSelectedUserId } = chatSlice.actions;
export default chatSlice.reducer;
