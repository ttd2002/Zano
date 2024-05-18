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
  Slide,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../redux/slices/app";
import { fetchFriendsList } from "../../redux/slices/userSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Directions, ExitToApp } from "@mui/icons-material";
import axios from "../../utils/axios";
import Chats from "../../pages/dashboard/Chats";
import toast from "react-hot-toast";
import { setIsCreateSingleConversation } from "../../redux/slices/createSingleCoversationSlice";
import useConversation from "../../zustand/useConversation";
import { Trash } from "phosphor-react";

// danh sách bạn bè
const FriendsList = ({ onHandleAddfriend, listFriend }) => {
  const handleAddToGroup = (userId) => {
    console.log("Selected user ID:", userId);
    console.log("friends:", listFriend);
    // Gọi hàm onHandleAddfriend và truyền vào userId
    onHandleAddfriend(userId);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUserList = Array.isArray(listFriend)
    ? listFriend.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  console.log("filter list friend", listFriend);
  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or phone number!"
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
              style={{
                display: "flex",
                justifyContent: "flex-end",
                direction: "row",
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#aaaaaa", color: "black" }}
                onClick={() => handleAddToGroup(user._id)}
              >
                Add to group
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </>
  );
};
const MembersManagement = ({
  listMembers,
  onHandleRemoveMember,
  handleClose,
  onHandleAddGroupAdmin,
  onHandleDemoteAdmin,
  onHandlePromoteToLeader,
}) => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const { selectedConversation } = useConversation();
  const loggedInUserId = localStorage.getItem("loginId");
  const listAdmins = selectedConversation.listAdmins;
  const leaderId = selectedConversation.leader;

  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteConversation = async () => {
    try {
      const response = await axios.put(
        "/group/conversation/removeConversation/",
        {
          conversationId: selectedConversation._id,
        }
      );

      if (response.status === 200) {
        toast.success("Conversation deleted successfully.");
        handleClose();
      } else {
        toast.error("Error deleting conversation.");
      }
    } catch (error) {
      console.log("Error deleting conversation", error);
    }
  };

  const handleExitConversation = async () => {
    if (loggedInUserId === leaderId) {
      toast.error("You need to transfer the leadership before exiting.");
      return;
    }

    try {
      const response = await axios.put("/group/conversation/leave", {
        senderId: loggedInUserId,
        conversationId: selectedConversation._id,
      });

      if (response.status === 200) {
        toast.success("You have exited the conversation.");
        handleClose();
      } else {
        toast.error("Error exiting conversation.");
      }
    } catch (error) {
      console.log("Error exiting conversation", error);
    }
  };

  const filteredMemberList = Array.isArray(listMembers)
    ? listMembers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const ExitDialog = ({ open, handleClose }) => {
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Exit conversation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to exit this conversation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleExitConversation();
              handleClose();
            }}
          >
            Yes
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const DeleteDialog = ({ open, handleClose }) => {
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete this conversation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this conversation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDeleteConversation();
              handleClose();
            }}
          >
            Yes
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const isUserLeaderOrAdmin = (userId) => {
    return userId === leaderId || listAdmins.includes(userId);
  };

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name or phone number!"
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
        {filteredMemberList.map((user) => {
          const isUserAdmin = listAdmins.includes(user._id);
          const isLeader = user._id === leaderId;
          const isLoggedInUser = user._id === loggedInUserId;

          return (
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
                <Typography
                  variant="subtitle1"
                  style={{
                    color: isLeader
                      ? "purple"
                      : isUserAdmin
                      ? "blue"
                      : "inherit",
                    fontWeight: isUserAdmin || isLeader ? "bold" : "normal",
                  }}
                >
                  {user.name}
                  {isLoggedInUser && " (Me)"}
                  {isUserAdmin && !isLeader && " (Group Admin)"}
                  {isLeader && " (Leader)"}
                </Typography>
              </CardContent>
              {isUserLeaderOrAdmin(loggedInUserId) &&
                user._id !== loggedInUserId && (
                  <CardActions
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      direction: "row",
                    }}
                  >
                    {/* Logic hiển thị nút Demote Admin */}
                    {isUserAdmin && (
                      <Button
                        variant="contained"
                        onClick={() => onHandleDemoteAdmin(user._id)}
                        style={{
                          backgroundColor: "Gray",
                          color: "black",
                        }}
                      >
                        Demote
                      </Button>
                    )}
                    {!isUserAdmin && loggedInUserId === leaderId && (
                      <Button
                        variant="contained"
                        onClick={() => onHandleAddGroupAdmin(user._id)}
                        style={{
                          backgroundColor: "Gray",
                          color: "black",
                        }}
                      >
                        Admin
                      </Button>
                    )}

                    {isUserAdmin && loggedInUserId === leaderId && (
                      <Button
                        variant="contained"
                        onClick={() => onHandlePromoteToLeader(user._id)}
                        style={{
                          backgroundColor: "Gray",
                          color: "black",
                        }}
                      >
                        Leader
                      </Button>
                    )}
                      {!isUserAdmin || loggedInUserId === leaderId ? (
                      <Button
                        variant="contained"
                        onClick={() => onHandleRemoveMember(user._id)}
                        style={{
                          backgroundColor: "Gray",
                          color: "black",
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </CardActions>
                )}
            </Card>
          );
        })}
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Button
            onClick={() => setOpenBlock(true)}
            startIcon={<ExitToApp />}
            fullWidth
            variant="outlined"
          >
            Leave the group
          </Button>

          {loggedInUserId === leaderId && (
            <Button
              startIcon={<Trash />}
              fullWidth
              color="error"
              variant="contained"
              onClick={() => setOpenDelete(true)}
            >
              Delete the group
            </Button>
          )}
        </Stack>
      </Stack>

      <ExitDialog open={openBlock} handleClose={handleCloseBlock} />
      <DeleteDialog open={openDelete} handleClose={handleCloseDelete} />
    </>
  );
};

const Members = ({
  open,
  handleClose,
  onCreateConversation,
  isCreateConversation,
  setIsCreateConversation,
}) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [value, setValue] = useState(0);
  const [friendKey, setFriendKey] = useState(0);
  const [membersKey, setmembersKey] = useState(0);
  const dispatch = useDispatch();
  const { socket } = useConversation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [listFriend, setListFriend] = useState([]);
  const [listMembers, setListMembers] = useState([]);

  const senderId = localStorage.getItem("loginId");
  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(`/users/${senderId}/friends`);
        setListFriend(response.data.friends);
        // console.log(response.data.friends);
      } catch (error) {
        console.log("Error fetching friends", error);
      }
    };
    fetchFriend();
  }, [friendKey]);

  useEffect(() => {
    const fetchFriendAndMembers = async () => {
      try {
        const [friendResponse, membersResponse] = await Promise.all([
          axios.get(`/users/${senderId}/friends`),
        ]);
        setListFriend(friendResponse.data.friends);
      } catch (error) {
        console.log("Error fetching friends and members", error);
      }
    };
    fetchFriendAndMembers();
  }, [selectedConversation._id]);

  // Trong handleAddFriendToGroup
  const handleAddFriendToGroup = async (user) => {
    // Kiểm tra xem user có trong mảng participants hay không
    const isUserInGroup = selectedConversation.participants.some(
      (participant) => participant._id === user._id
    );

    if (isUserInGroup) {
      // Hiển thị thông báo user đã nằm trong nhóm
      toast.warning("This friend is already in the group.");
      return;
    }

    const confirmAdd = window.confirm("Add friend to group?");
    if (confirmAdd) {
      try {
        // Gọi API updateMember với conversationId là selectedConversation._id và members là mảng chứa user
        const response = await axios.put("/group/conversation/updateMember", {
          conversationId: selectedConversation._id,
          members: [...selectedConversation.participants, user],
        });

        if (response.status === 200) {
          // Hiển thị thông báo thành công
          toast.success("Friend added to group successfully.");

          // Cập nhật danh sách bạn bè bằng cách loại bỏ user đã được thêm vào nhóm
          setListFriend((prevList) =>
            prevList.filter((friend) => friend._id !== user._id)
          );

          // Thêm user vào danh sách thành viên của nhóm
          setListMembers((prevList) => [...prevList, user]);
        } else {
          // Hiển thị thông báo lỗi nếu yêu cầu không thành công
          toast.error("Error adding friend to group.");
        }
      } catch (error) {
        console.log("Error adding friend to group", error);
      }
    }
  };

  // Trong handleAddGroupAdmin
  const handleAddGroupAdmin = async (userId) => {
    const confirmAdd = window.confirm("Add this member as an admin?");
    if (confirmAdd) {
      try {
        const response = await axios.put("/group/conversation/updateMember", {
          conversationId: selectedConversation._id,
          admins: [...selectedConversation.listAdmins, userId], // Truyền userId vào mảng admins
        });

        if (response.status === 200) {
          toast.success("Member added as admin successfully.");
          // Nếu cần, có thể cập nhật danh sách admin ở đây
        } else {
          toast.error("Error adding member as admin.");
        }
      } catch (error) {
        console.log("Error adding member as admin", error);
      }
    }
  };
  //
  const handleDemoteGroupAdmin = async (userId) => {
    const confirmAdd = window.confirm("Remove this admin?");
    if (confirmAdd) {
      try {
        const response = await axios.put("/group/conversation/updateMember", {
          conversationId: selectedConversation._id,
          admins: selectedConversation.listAdmins.filter(id => id !== userId), // Truyền userId vào mảng admins
        });

        if (response.status === 200) {
          toast.success("Member added as admin successfully.");
          // Nếu cần, có thể cập nhật danh sách admin ở đây
        } else {
          toast.error("Error adding member as admin.");
        }
      } catch (error) {
        console.log("Error adding member as admin", error);
      }
    }
  };
  // Trong handlePromoteGroupLeader
  const handlePromoteGroupLeader = async (userId) => {
    const confirmPromote = window.confirm("Promote this member as leader?");
    if (confirmPromote) {
      try {
        // Gọi API updateMember với conversationId là selectedConversation._id, members và admins
        const response = await axios.put("/group/conversation/changeLeader", {
          conversationId: selectedConversation._id,
          memberId: userId,
        });

        if (response.status === 200) {
          toast.success("Admin promoted as leader successfully.");
        } else {
          toast.error("Error promoting member as leader.");
        }
      } catch (error) {
        console.log("Error promoting member as leader", error);
      }
    }
  };
  const handleRemoveMember = async (userId) => {
    const confirmRemove = window.confirm("Remove member from group?");
    if (confirmRemove) {
      try {
        // Gọi API removeMember với memberId là userId và conversationId là selectedConversation._id
        const response = await axios.put("/group/conversation/leave", {
          senderId: userId,
          conversationId: selectedConversation._id,
        });

        if (response.status === 200) {
          // Loại bỏ người dùng khỏi danh sách thành viên
          setListMembers((prevList) =>
            prevList.filter((user) => user._id !== userId)
          );

          // Thêm user vào danh sách bạn bè
          setListFriend((prevList) => [...prevList, { _id: userId }]);

          // Hiển thị thông báo thành công
          toast.success("Member removed successfully.");
        } else {
          // Hiển thị thông báo lỗi nếu yêu cầu không thành công
          toast.error("Error removing member");
        }
      } catch (error) {
        console.log("Error removing member", error);
      }
    }
  };
  const [selectedMembers, setSelectedMembers] = useState([]);
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
            <Tab label="Add friend to group" />
            <Tab label="Group Mangement" />
          </Tabs>
        </Stack>
        {/* Dialog content */}
        <DialogContent>
          <Stack sx={{ height: "100%" }}>
            <Stack spacing={2.5}>
              {(() => {
                switch (value) {
                  case 0: // display friends
                    return (
                      <FriendsList
                        key={listFriend.length}
                        onHandleAddfriend={handleAddFriendToGroup}
                        listFriend={listFriend.filter(
                          (friend) =>
                            !selectedConversation.participants.some(
                              (participant) => participant._id === friend._id
                            )
                        )}
                      />
                    );

                  case 1: //member management
                    return (
                      <MembersManagement
                        key={listMembers.length}
                        listMembers={selectedConversation.participants}
                        onHandleRemoveMember={handleRemoveMember}
                        onHandleAddGroupAdmin={handleAddGroupAdmin}
                        onHandlePromoteToLeader={handlePromoteGroupLeader}
                        onHandleDemoteAdmin={handleDemoteGroupAdmin}
                      />
                    );

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

export default Members;
