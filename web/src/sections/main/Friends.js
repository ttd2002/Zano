import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  DialogContent,
  Tabs,
  Tab,
  Dialog,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../redux/slices/app";
import { fetchFriendsList } from "../../redux/slices/userSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Directions } from "@mui/icons-material";
import axios from "../../utils/axios";
import Chats from "../../pages/dashboard/Chats";
import toast from "react-hot-toast";
import { setIsCreateSingleConversation } from '../../redux/slices/createSingleCoversationSlice';
import useConversation from "../../zustand/useConversation";
// danh sách người dùng không bao gồm bạn bè
const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState([]);
  const [requestSentMap, setRequestSentMap] = useState(new Map()); // Sử dụng Map để lưu trạng thái yêu cầu kết bạn cho mỗi user
  const [friendRequestsReceived, setFriendRequestsReceived] = useState(new Map());

  const senderId = localStorage.getItem("loginId");
  const [isInitialized, setIsInitialized] = useState(false);
  const [userListUpdated, setUserListUpdated] = useState(false);

  // Fetch users and initialize request sent map
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/users/listUserNotFriend/${senderId}`);
        if (response.status === 200) {
          setUserList(response.data);
          initializeRequestSentMap(response.data);
          initializeRequestReceivedMap(response.data);
        }
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };
    fetchUsers();
  }, []);

  // Initialize request sent map
  const initializeRequestSentMap = (users) => {
    const map = new Map();
    users.forEach((user) => map.set(user._id, false));
    setRequestSentMap(map);
    fetchFriendRequestsSent(); // Fetch friend requests after initializing the map
  };

  // Initialize request received map
  const initializeRequestReceivedMap = (users) => {
    const map = new Map();
    users.forEach((user) => map.set(user._id, false));
    setFriendRequestsReceived(map);
    fetchFriendRequestsReceived(); // Fetch friend requests received after initializing the map
  };

  // Send friend request
  const handleAddFriend = async (userId) => {
    try {
      const addFriend = await axios.post("/users/app/sendFriendRequest", {
        senderId: senderId,
        receiverId: userId,
      });
      if (addFriend.status === 200) {
        setRequestSentMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(userId, true);
          return newMap;
        });

        setUserList((prevUserList) =>
          prevUserList.map((user) =>
            user._id === userId ? { ...user, isFriendRequested: true } : user
          )
        );
        toast.success("Friend request sent successfully.");
      } else
        toast.error("Error sending friend request");
    } catch (error) {
      console.log("Error sending friend request", error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      fetchFriendRequestsSent();
      fetchFriendRequestsReceived();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (userListUpdated) {
      fetchFriendRequestsSent();
      fetchFriendRequestsReceived();
      setUserListUpdated(false);
    }
  }, [userListUpdated]);

  useEffect(() => {
    if (userList.length > 0) {
      setUserListUpdated(true);
    }
  }, [userList]);

  // Fetch friend requests sent
  const fetchFriendRequestsSent = async () => {
    try {
      const response = await axios.get(
        `/users/getListFriendRequestSend/${senderId}`
      );
      if (response.status === 200) {
        const friendRequestsSent = response.data;
        const map = new Map();
        friendRequestsSent.forEach((request) => {
          if (userList.some((user) => user._id === request._id)) {
            map.set(request._id, true);
          }
        });
        setRequestSentMap(map);
      }
    } catch (error) {
      console.log("Error fetching friend requests", error);
    }
  };

  // Fetch friend requests received
  const fetchFriendRequestsReceived = async () => {
    try {
      const response = await axios.get(
        `/users/getListFriendRequestReceived/${senderId}`
      );
      if (response.status === 200) {
        const receivedRequests = response.data;
        const map = new Map();
        receivedRequests.forEach((request) => {
          if (userList.some((user) => user._id === request._id)) {
            map.set(request._id, true);
          }
        });
        setFriendRequestsReceived(map);
      }
    } catch (error) {
      console.log("Error fetching friend requests", error);
    }
  };

  useEffect(() => {
    fetchFriendRequestsReceived();
  }, []);

  // Filter users based on search term
  const filteredUserList = userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Shuffle the filtered user list
  const shuffledUserList = [...filteredUserList].sort(() => 0.5 - Math.random());

  // Get the first 10 users
  const firstTenUsers = shuffledUserList.slice(0, 10);

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={2}>
        {firstTenUsers.map((user) => (
          <Card
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Avatar alt={user.name} src={user.avatar} />
              <Typography variant="subtitle1">{user.name}</Typography>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {requestSentMap.get(user._id) ? (
                <Typography variant="subtitle1">Friend request sent</Typography>
              ) : friendRequestsReceived.get(user._id) ? (
                <Typography variant="subtitle1">Friend request received</Typography>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddFriend(user._id)}
                >
                  Add Friend
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};

// danh sách bạn bè
const FriendsList = ({ onHandleUnfriend, onHandleMessage, listFriend }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUserList = Array.isArray(listFriend) ? listFriend.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={2}>
        {filteredUserList.map((user) => (
          <Card
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Avatar alt={user.name} src={user.avatar} />
              <Typography variant="subtitle1">{user.name}</Typography>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "flex-end", direction: "row" }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#aaaaaa", color: "black" }}
                onClick={() => onHandleUnfriend(user._id)}
              >
                Unfriend
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onHandleMessage(user._id)}
              >
                Create new message
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};

// danh sách yêu cầu kết bạn đã gửi
const FriendRequestSend = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listFriendRequest, setListFriendRequest] = useState([]);
  const senderId = localStorage.getItem("loginId");

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          `/users/getListFriendRequestSend/${senderId}`
        );
        setListFriendRequest(response.data);
      } catch (error) {
        console.log("Error fetching friend requests", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleCancel = async (userId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the friend request?");
    if (confirmCancel) {
      try {
        const cancelRequest = await axios.post("/users/cancelFriendsRequest", {
          senderId: senderId,
          receiverId: userId,
        });
        if (cancelRequest.status === 200) {
          // Remove user from the list of friend requests
          setListFriendRequest((prevList) =>
            prevList.filter((user) => user._id !== userId)
          );
          toast.success("Friend request canceled successfully.");
        } else
          toast.error("Error canceling friend request");
      } catch (error) {
        console.log("Error canceling friend request", error);
      }
    }
  };
  const filteredUserList = listFriendRequest.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={2}>
        {filteredUserList.map((user) => (
          <Card
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Avatar alt={user.name} src={user.avatar} />
              <Typography variant="subtitle1">{user.name}</Typography>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#aaaaaa", color: "black" }}
                onClick={() => handleCancel(user._id)}
              >
                Cancel Request
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};

// danh sách yêu cầu kết bạn đã nhận
const FriendRequestReceived = ({ onAcceptFriendRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [listFriendRequest, setListFriendRequest] = useState([]);
  const senderId = localStorage.getItem("loginId");
  // const [accept, setAccept] = useState(1);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          `/users/getListFriendRequestReceived/${senderId}`
        );
        setListFriendRequest(response.data);
      } catch (error) {
        console.log("Error fetching friend requests", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleResponse = async (userId, response) => {
    if (response === 0) {
      const confirmCancel = window.confirm("Are you sure you want to reject this friend request?");
      if (confirmCancel) {
        try {
          const resRequest = await axios.post("/users/app/respondToFriendRequest", {
            responderId: senderId,
            requestId: userId,
            response: response,
          });
          if (resRequest.status === 200) {
            setListFriendRequest((prevList) =>
              prevList.filter((user) => user._id !== userId)
            );
            // console.log("Friend request rejected");
            toast.success(`${resRequest.data.message}`);
          } else
            toast.error("Error rejectting to friend request");
        } catch (error) {
          console.log("Error rejectting to friend request", error);
        }
      }

    } else {
      try {
        const resRequest = await axios.post("/users/app/respondToFriendRequest", {
          responderId: senderId,
          requestId: userId,
          response: response,
        });
        if (resRequest.status === 200) {
          // window.alert(`${resRequest.data.message}`);
          setListFriendRequest((prevList) =>
            prevList.filter((user) => user._id !== userId)
          );
          console.log("Friend request accepted");
          toast.success(`${resRequest.data.message}`);
          onAcceptFriendRequest();
        } else
          toast.error("Error acceptting to friend request");
      } catch (error) {
        console.log("Error acceptting to friend request", error);
      }
    }
  }


  const filteredUserList = listFriendRequest.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={2}>
        {filteredUserList.map((user) => (
          <Card
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CardContent
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Avatar alt={user.name} src={user.avatar} />
              <Typography variant="subtitle1">{user.name}</Typography>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "flex-end", direction: "row" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleResponse(user._id, 1)}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#aaaaaa", color: "black" }}
                onClick={() => handleResponse(user._id, 0)}
              >
                Reject
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};

const Friends = ({ open, handleClose, onCreateConversation, isCreateConversation, setIsCreateConversation }) => {
  const [value, setValue] = useState(0);
  const [friendKey, setFriendKey] = useState(0);
  const dispatch = useDispatch();
  const { socket } = useConversation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [listFriend, setListFriend] = useState([]);
  const senderId = localStorage.getItem("loginId");

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(
          `/users/${senderId}/friends`
        );
        setListFriend(response.data.friends);
        console.log("Friends",response.data.friends);
      } catch (error) {
        console.log("Error fetching friends", error);
      }
    };
    fetchFriend();
  }, [friendKey]);

  const handleUnfriend = async (userId) => {
    const confirmCancel = window.confirm("Are you sure you want to unfriend?");
    if (confirmCancel) {
      try {
        const unfriend = await axios.post("/users/unfriend", {
          senderId: senderId,
          friendId: userId,
        });
        if (unfriend.status === 200) {
          // Remove user from the list of friends
          setListFriend((prevList) =>
            prevList.filter((user) => user._id !== userId)
          );
          // window.alert("Unfriended successfully.");
          toast.success("Unfriended successfully.");
          setFriendKey((prevKey) => prevKey + 1);
        } else
          toast.error("Error unfriending");
      } catch (error) {
        console.log("Error unfriending", error);
      }
    }
  };

  const handleMessage = async (userId) => {
    try {
      const existingConversation = await axios.post("/mes/createConversationApp", {
        senderId: senderId,
        receiverId: userId,
      });

      // Kiểm tra kết quả từ API
      if (existingConversation.status === 200) {
        // window.alert(existingConversation.data.message);
        toast.error(existingConversation.data.message);
        // console.log("Conversation already exists", existingConversation.data.conversation);
        // Nếu cuộc trò chuyện đã tồn tại, bạn có thể xử lý logic ở đây nếu cần
      } else if (existingConversation.status === 201) {
        // Nếu cuộc trò chuyện đã được tạo mới thành công
        toast.success(existingConversation.data.message);
        // Bạn có thể thực hiện các hành động khác sau khi tạo cuộc trò chuyện ở đây
        onCreateConversation(existingConversation.data.conversation);
        setIsCreateConversation(true);
        dispatch(setIsCreateSingleConversation(true));
        handleClose();
        // socket.emit('newConversation', existingConversation.data.conversation);
        console.log("newConversation event sent successfully");
      } else
        toast.error("Error creating conversation");
    } catch (error) {
      console.log("Error creating conversation", error);
      window.alert("Error creating conversation");
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="40%"
        open={open}
        keepMounted
        onClose={handleClose}
        sx={{
          width: "50%",
          ml: "25%",
        }}
      >
        <Stack p={2} sx={{ width: "100%", justifyContent: "space-between" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Explore" />
            <Tab label="Friends" />
            <Tab label="Requests Sent" />
            <Tab label="Requests Received" />
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
                    return <FriendsList key={listFriend.length} onHandleMessage={handleMessage} onHandleUnfriend={handleUnfriend} listFriend={listFriend} />

                  case 2: //display all friend requests
                    return <FriendRequestSend />;

                  case 3: //display all friend requests
                    return <FriendRequestReceived onAcceptFriendRequest={() => setFriendKey((prevKey) => prevKey + 1)} />;
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
