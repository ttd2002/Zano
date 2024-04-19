// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchUserList = createAsyncThunk(
//   'user/fetchUserList',
//   async (_, { getState }) => {
//     try {

//       const tokenString = localStorage.getItem("logintoken");
//       if (!tokenString) {
//         throw new Error("tokenString not found"); // Throw an error if user object is not found
//       }
//       const response = await axios.get('http://localhost:3000/users/getListUsers', {
//         headers: {
//           Authorization: `Bearer ${tokenString}`, // Include the token in the request headers
//         },
//       });
//       // console.log("DATA:")
//       // console.table(response.data);
//       // Filter out the logged-in user from the response
//       const loggedUserId = getState().auth.userId;
//       const filteredUsers = response.data.filter(user => user._id !== loggedUserId);
//       // console.log(filteredUsers);
//       return filteredUsers;
//     } catch (error) {
//       throw error;
//     }
//   }
// );
// export const fetchFriendsList = createAsyncThunk(
//   'user/fetchFriendsList',
//   async (_, { getState }) => {
//     try {

//       const tokenString = localStorage.getItem("logintoken");
//       if (!tokenString) {
//         throw new Error("tokenString not found"); // Throw an error if user object is not found
//       }
//       const response = await axios.get('http://localhost:3000/users//friends', {
//         headers: {
//           Authorization: `Bearer ${tokenString}`, // Include the token in the request headers
//         },
//       });
//       // console.log("DATA:")
//       // console.table(response.data);
//       // Filter out the logged-in user from the response
//       const loggedUserId = getState().auth.userId;
//       const filteredUsers = response.data.filter(user => user._id !== loggedUserId);
//       // console.log(filteredUsers);
//       return filteredUsers;
//     } catch (error) {
//       throw error;
//     }
//   }
// );

// export const fetchUserProfile = createAsyncThunk(
//   'user/fetchUserProfile',
//   async (_, { getState }) => {
//     try {
//       // Lấy token từ localStorage
//       const tokenString = localStorage.getItem("logintoken");
//       const loginId = localStorage.getItem("loginId");
//       if (!tokenString) {
//         throw new Error("Token not found"); // Nếu không tìm thấy token, throw error
//       }

//       // Parse token từ chuỗi JSON
//       const token = JSON.parse(tokenString);

//       // Gửi yêu cầu lấy thông tin người dùng đang đăng nhập
//       const response = await axios.get(`http://localhost:3000/users/${loginId}/getProfile`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Bao gồm token trong header của yêu cầu
//         },
//       });
//       console.log(response.data)

//       return response.data; // Trả về dữ liệu thông tin người dùng
//     } catch (error) {
//       throw error; // Nếu có lỗi, throw error để xử lý trong Redux
//     }
//   }
// );

// const Slice = createSlice({
//   name: 'user',
//   initialState: {
//     userList: [],
//     loading: false,
//     error: null,
//     selectedUserId: null,
//     userProfile: null,

//   },

//   reducers: {
//     setSelectedUserId: (state, action) => {
//       state.selectedUserId = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserList.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserList.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userList = action.payload;
//         state.error = null; // Reset error if successful
//       })
//       .addCase(fetchUserList.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message; // Set error message if request fails
//       })
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loadingProfile = true;
//         state.errorProfile = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loadingProfile = false;
//         state.userProfile = action.payload; // Cập nhật thông tin người dùng vào state
//         state.errorProfile = null; // Reset error nếu thành công
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loadingProfile = false;
//         state.errorProfile = action.error.message; // Set error message nếu request thất bại
//       });
//   },
// });

// export const { setSelectedUserId } = Slice.actions;
// export const selectSelectedUserId = (state) => state.user.selectedUserId;
// export const selectUserList = (state) => state.user.userList;
// export const selectUserListLoading = (state) => state.user.loading;
// export const selectUserListError = (state) => state.user.error;
// //profile
// export const selectUserProfile = (state) => state.user.userProfile;
// export const selectUserProfileLoading = (state) => state.user.loadingProfile;
// export const selectUserProfileError = (state) => state.user.errorProfile;

// export default Slice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserList = createAsyncThunk(
  'user/fetchUserList',
  async (_, { getState }) => {
    try {
      const tokenString = localStorage.getItem("logintoken");
      if (!tokenString) {
        throw new Error("tokenString not found");
      }
      const response = await axios.get(`http://localhost:3000/users/getListUsers`, {
        headers: {
          Authorization: `Bearer ${tokenString}`,
        },
      });
      const loggedUserId = getState().auth.userId;
      const filteredUsers = response.data.filter(user => user._id !== loggedUserId);
      return filteredUsers;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchFriendsList = createAsyncThunk(
  'user/fetchFriendsList',
  async (_, { getState }) => {
    try {
      const tokenString = localStorage.getItem("logintoken");
      const loginId = localStorage.getItem("loginId");
      if (!tokenString) {
        throw new Error("tokenString not found");
      }
      const response = await axios.get(`http://localhost:3000/users/${loginId}/friends`, {
        headers: {
          Authorization: `Bearer ${tokenString}`,
        },
      });
      const loggedUserId = getState().auth.userId;
      const filteredUsers = response.data.filter(user => user._id !== loggedUserId);
      const UserProfile = response.data;
      localStorage.setItem(JSON.stringify(UserProfile));
      console.log(UserProfile);
      return filteredUsers;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { getState }) => {
    try {
      const tokenString = localStorage.getItem("logintoken");
      const loginId = localStorage.getItem("loginId");
      if (!tokenString) {
        throw new Error("Token not found");
      }
      const response = await axios.get(`http://localhost:3000/users/getProfile`, {
        headers: {
          Authorization: `Bearer ${tokenString}`,
        },
      });
      return response.data;
      
    } catch (error) {
      throw error;
    }
  }
);

const Slice = createSlice({
  name: 'user',
  initialState: {
    userList: [],
    loading: false,
    error: null,
    selectedUserId: null,
    userProfile: null,
    friendsList: [],
    loadingFriends: false,
    errorFriends: null,
  },

  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
        state.error = null;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loadingProfile = true;
        state.errorProfile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.userProfile = action.payload;
        state.errorProfile = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.errorProfile = action.error.message;
      })
      .addCase(fetchFriendsList.pending, (state) => {
        state.loadingFriends = true;
        state.errorFriends = null;
      })
      .addCase(fetchFriendsList.fulfilled, (state, action) => {
        state.loadingFriends = false;
        state.friendsList = action.payload;
        state.errorFriends = null;
      })
      .addCase(fetchFriendsList.rejected, (state, action) => {
        state.loadingFriends = false;
        state.errorFriends = action.error.message;
      });
  },
});

export const { setSelectedUserId } = Slice.actions;
export const selectSelectedUserId = (state) => state.user.selectedUserId;
export const selectUserList = (state) => state.user.userList;
export const selectUserListLoading = (state) => state.user.loading;
export const selectUserListError = (state) => state.user.error;
export const selectUserProfile = (state) => state.user.userProfile;
export const selectUserProfileLoading = (state) => state.user.loadingProfile;
export const selectUserProfileError = (state) => state.user.errorProfile;
export const selectFriendsList = (state) => state.user.friendsList;
export const selectFriendsListLoading = (state) => state.user.loadingFriends;
export const selectFriendsListError = (state) => state.user.errorFriends;

export default Slice.reducer;
