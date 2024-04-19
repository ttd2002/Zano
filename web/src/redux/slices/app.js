import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";

//
// import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
  users: [],
  friends: [],
  friendRequests: [],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    //toggle sidebar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state) {
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    
  },
});

//reducer
export default slice.reducer;
//

export function ToggleSidebar() {
  return async (dispatch, state) => {
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, state) => {
    dispatch(
      slice.actions.updateSidebarType({
        type,
      })
    );
  };
}

export function showSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackbar({
        message,
        severity,
      })
    );
    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };
}

export const closeSnackbar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackbar());
};

//friends
export const FetchFriends = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/user/getFriends", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(slice.actions.updateFriends({ friends: response.data.data }));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const FetchFriendRequests = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/user/getFriendRequests", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateFriendRequests({ request: response.data.data })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const FetchUserProfile = () => {
  return async (dispatch, getState) => {
    const logintoken = localStorage.getItem("logintoken");
    axios
      .get("http://localhost:3000/users/getProfile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logintoken}`, // Include the token in the request headers
        },
      })
      .then((response) => {
        // console.log(response);
        dispatch(slice.actions.FetchUserProfile({ user: response.data.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// export const UpdateUserProfile = (formValues) => {
//   return async (dispatch, getState) => {
//     const file = formValues.avatar;

//     const key = v4();

//     try {
//       S3.getSignedUrl(
//         "putObject",
//         { Bucket: S3_BUCKET_NAME, Key: key, ContentType: `image/${file.type}` },
//         async (_err, presignedURL) => {
//           await fetch(presignedURL, {
//             method: "PUT",

//             body: file,

//             headers: {
//               "Content-Type": file.type,
//             },
//           });
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }

//     axios
//       .patch(
//         "/user/update-me",
//         { ...formValues, avatar: key },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getState().auth.token}`,
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response);
//         dispatch(slice.actions.updateUser({ user: response.data.data }));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// };
