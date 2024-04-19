import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Khởi tạo initial state
const initialState = {
  messages: [],
  loading: false,
  error: null,
};


export const getMessages = createAsyncThunk(
  'messages/getMessages',
  async (userId, { getState }) => {
    try {
      // Kiểm tra userId có tồn tại và không phải là null
      if (!userId) {
        throw new Error("User ID is null or undefined");
      }

      const token = JSON.parse(localStorage.getItem("logintoken"));

      if (!token) {
        throw new Error("User token not found");
      }

      const response = await axios.get(`http://localhost:3000/mes/get/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);



// Thunk để gửi tin nhắn
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiverId, content, images }) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image) => {
        formData.append('image', image);
      });
      const response = await axios.post(`http://localhost:8000/api/messages/send/${receiverId}`, formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);


// Thunk để xóa tin nhắn
export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/messages/delete/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// Thunk để thu hồi tin nhắn
export const recallMessage = createAsyncThunk(
  'messages/recallMessage',
  async (messageId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/messages/recall/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// Slice cho messages
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa tin nhắn khỏi state.messages dựa trên messageId
        state.messages = state.messages.filter(message => message._id !== action.payload.messageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(recallMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recallMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái của tin nhắn bằng cách đặt recalled = true dựa trên messageId
        state.messages = state.messages.map(message =>
          message._id === action.payload.messageId ? { ...message, recalled: true } : message
        );
      })
      .addCase(recallMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default messageSlice.reducer;
