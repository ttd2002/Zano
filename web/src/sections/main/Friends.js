import React, { useEffect, useState } from "react";
import { Dialog, Tabs, Tab, DialogContent, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../redux/slices/app";
import { fetchFriendsList } from "../../redux/slices/userSlice";
// import {
//   FetchFriendRequests,
//   FetchFriends,
//   FetchUsers,
// } from "../../redux/slices/app";

// const UserList = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(FetchUsers());
//   }, []);

//   const { users } = useSelector((state) => state.app);

//   return (
//     <>
//       {users.map((el, idx) => {
//         // user component
//         return <></>;
//       })}
//     </>
//   );
// };

//friends
const FriendsList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFriendsList());
  }, []);

  const { friends } = useSelector((state) => state.app);

  return (
    <>
      {friends.map((el, idx) => {
        // friends component
        return <></>;
      })}
    </>
  );
};
// //friend requests
// const FriendRequestList = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(FetchFriendRequests());
//   }, []);

//   const { friendRequests } = useSelector((state) => state.app);

//   return (
//     <>
//       {friendRequests.map((el, idx) => {
//         // friend request component
//         return <></>;
//       })}
//     </>
//   );
// };

const UserList = ()=>{
    return(
        <>
        abc
        </>
    )
}
// const FriendsList = ()=>{
//     return(
//         <>
//         abc
//         </>
//     )
// }
const FriendRequestList = ()=>{
    return(
        <>
        abc
        </>
    )
}

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        keepMounted
        onClose={handleClose}
        sx={{ p: 4 }}
      >
        <Stack p={2} sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Explore" />
            <Tab label="Friends" />
            <Tab label="Requests" />
          </Tabs>
        </Stack>
        {/* Dialog content */}
        <DialogContent>
          <Stack sx={{ height: "100%" }}>
            <Stack spacing={2.5}>
              {(() => {
                switch (value) {
                  case 0: //display all users
                    return <UserList />;

                  case 1: // display friends
                    return <FriendsList />;

                  case 2: //display all friend requests
                    return <FriendRequestList />;

                  default:
                    break;
                }
              })()}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Friends;
