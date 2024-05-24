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
import MessageContainer from "../../components/Conversation/MessageContainer";

// danh sách bạn bè
const FriendsList = ({ onHandleAddfriend, listFriend, setListFriend }) => {
  const handleAddToGroup = (user) => {
    // Gọi hàm onHandleAddfriend và truyền vào user-----
    onHandleAddfriend(user);
    setListFriend(listFriend.filter((friend) => friend._id !== user._id));
    // fetchFriend();
  };
  const { selectedConversation, socket } = useConversation();
  const senderId = localStorage.getItem("loginId");

  const fetchFriend = async () => {
    try {
      const response = await axios.get(`/users/${senderId}/friends`);
      const friends = response.data.friends;

      // Lấy danh sách _id của các participants trong selectedConversation
      const participantIds = selectedConversation.participants.map(participant => participant._id);

      // Lọc bỏ những bạn bè đã là thành viên của selectedConversation
      const filteredFriends = friends.filter(friend => !participantIds.includes(friend._id));

      setListFriend(filteredFriends);
      console.log("listFriend after add");
    } catch (error) {
      console.log("Error fetching friends", error);
    }
  };
  useEffect(() => {
    fetchFriend();
  }, []);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("Render", () => {
  //     fetchFriend();
  //   });
  //   return () => {
  //     socket.off("Render");
  //   }
  // }, [socket]);

  const [searchTerm, setSearchTerm] = useState("");
  // const filteredUserList = Array.isArray(listFriend)
  //   ? listFriend.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   : [];
  const filteredUserList = Array.isArray(listFriend)
    ? listFriend.filter(user =>
      (user && user.name && user.phone) ? (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      ) : false
    )
    : [];

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
                onClick={() => handleAddToGroup(user)}
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
  const [isLeaveGroup, setIsLeaveGroup] = useState(false);
  const { selectedConversation, setSelectedConversation, socket } = useConversation();
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
        socket.emit("requestRender");//-----------
        setSelectedConversation(null);
        handleClose();
        // setIsLeaveGroup(true);
        // return (<MessageContainer isLeaveGroup={true} />);
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
        socket.emit("requestRender");//-----------
        setSelectedConversation(null);
        handleClose();
        // setIsLeaveGroup(true);
        // return (<MessageContainer isLeaveGroup={true} />);
      } else {
        toast.error("Error exiting conversation.");
      }
    } catch (error) {
      console.log("Error exiting conversation", error);
    }
  };

  // const filteredMemberList = Array.isArray(listMembers)
  //   ? listMembers.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  //   )
  //   : [];
  const filteredMemberList = Array.isArray(listMembers)
    ? listMembers.filter(user =>
      (user && user.name && user.phone) ? (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
      ) : false
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
  const { selectedConversation, setSelectedConversation, socket } = useConversation();
  const [value, setValue] = useState(0);
  const [friendKey, setFriendKey] = useState(0);
  const [membersKey, setMembersKey] = useState(0);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [listFriend, setListFriend] = useState([]);
  const [listMembers, setListMembers] = useState([]);

  const senderId = localStorage.getItem("loginId");

  useEffect(() => {
    if (!selectedConversation) return;

    fetchFriend();
    fetchMember();
  }, [selectedConversation]);

  useEffect(() => {
    fetchFriend();
    fetchMember();
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.on("Render", () => {
      fetchMember();
      console.log("*******")
    });
    return () => {
      socket.off("Render");
    }
  }, [socket]);

  useEffect(() => {
    // Update key khi danh sách thành viên thay đổi
    setMembersKey((prevKey) => prevKey + 1);
  }, [listMembers]);


  const fetchFriend = async () => {
    try {
      const response = await axios.get(`/users/${senderId}/friends`);
      const friends = response.data.friends;

      // Lấy danh sách _id của các participants trong selectedConversation
      const participantIds = selectedConversation.participants.map(participant => participant._id);

      // Lọc bỏ những bạn bè đã là thành viên của selectedConversation
      const filteredFriends = friends.filter(friend => !participantIds.includes(friend._id));

      setListFriend(filteredFriends);
    } catch (error) {
      console.log("Error fetching friends", error);
    }
  };

  const fetchMember = async () => {
    try {
      console.log("Fetching members for conversation ID:", selectedConversation._id);
      const response = await axios.get(`/group/conversation/getMembersOfGroup/${selectedConversation._id}`);
      const members = response.data.members;
      console.log("Fetched members:", members);
      setListMembers([...members]);
    } catch (error) {
      console.log("Error fetching member", error);
    }
  };

  // Trong handleAddFriendToGroup
  const handleAddFriendToGroup = async (user) => {
    const isUserInGroup = selectedConversation.participants.some(
      (participant) => participant._id === user._id
    );

    if (isUserInGroup) {
      toast.warning("This friend is already in the group.");
      return;
    }

    const confirmAdd = window.confirm("Add this friend to the group?");
    if (confirmAdd) {
      try {
        const response = await axios.put("/group/conversation/updateMemberWeb", {
          conversationId: selectedConversation._id,
          members: [...selectedConversation.participants, user],
        });

        if (response.status === 200) {
          toast.success("Added friend to group successfully.");

          // Cập nhật friendKey để kích hoạt useEffect làm mới danh sách bạn bè
          setFriendKey((prevKey) => prevKey + 1);
          // fetchFriend();
          // Thêm user vào danh sách thành viên của nhóm
          const updatedParticipants = [...response.data.conversation.participants];
          setSelectedConversation({ ...selectedConversation, participants: updatedParticipants });
          setListMembers(updatedParticipants);
          socket.emit("requestRender");//-----------
        } else {
          toast.error("Error adding friend to group.");
        }
      } catch (error) {
        console.log("Lỗi khi thêm bạn vào nhóm", error);
      }
    }
  };


  // Trong handleAddGroupAdmin
  const handleAddGroupAdmin = async (userId) => {
    const confirmAdd = window.confirm("Add this member as an admin?");
    if (confirmAdd) {
      try {
        const response = await axios.put("/group/conversation/updateMemberWeb", {
          conversationId: selectedConversation._id,
          admins: [...selectedConversation.listAdmins, userId],
        });
  
        if (response.status === 200) {
          toast.success("Member added as admin successfully.");
  
          // Cập nhật danh sách thành viên với vai trò admin mới
          const updatedParticipants = response.data.conversation.participants;
          const updatedListAdmins = response.data.conversation.listAdmins;
  
          // setSelectedConversation({
          //   ...selectedConversation,
          //   participants: updatedParticipants,
          //   listAdmins: updatedListAdmins,
          // });
  
          // Cập nhật danh sách thành viên hiển thị
          setListMembers(updatedParticipants);
  
          // Kích hoạt request render để cập nhật giao diện
          socket.emit("requestRender");
        } else {
          toast.error("Error adding member as admin.");
        }
      } catch (error) {
        console.log("Error adding member as admin", error);
      }
    }
  };
  

  const handleDemoteGroupAdmin = async (userId) => {
    const confirmRemove = window.confirm("Remove this admin?");
    if (confirmRemove) {
      try {
        const response = await axios.put("/group/conversation/updateMemberWeb", {
          conversationId: selectedConversation._id,
          admins: selectedConversation.listAdmins.filter(id => id !== userId),
        });

        if (response.status === 200) {
          toast.success("Admin removed successfully.");
          setListMembers(response.data.conversation.participants);
          socket.emit("requestRender");
        } else {
          toast.error("Error removing admin.");
        }
      } catch (error) {
        console.log("Error removing admin", error);
      }
    }
  };

  const handlePromoteGroupLeader = async (userId) => {
    const confirmPromote = window.confirm("Promote this member as leader?");
    if (confirmPromote) {
      try {
        const response = await axios.put("/group/conversation/changeLeader", {
          conversationId: selectedConversation._id,
          memberId: userId,
        });

        if (response.status === 200) {
          toast.success("Admin promoted as leader successfully.");
          setListMembers(response.data.conversation.participants);
          socket.emit("requestRender");
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
        const response = await axios.put("/group/conversation/leave", {
          senderId: userId,
          conversationId: selectedConversation._id,
        });

        if (response.status === 200) {
          const updatedParticipants = selectedConversation.participants.filter(user => user._id !== userId);
          setSelectedConversation({ ...selectedConversation, participants: updatedParticipants });
          setListMembers(updatedParticipants);
          setListFriend(prevList => [...prevList, { _id: userId }]);
          toast.success("Member removed successfully.");
          socket.emit("requestRender");
        } else {
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
                        setListFriend={setListFriend}
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
                        key={membersKey}
                        listMembers={selectedConversation.participants}
                        onHandleRemoveMember={handleRemoveMember}
                        onHandleAddGroupAdmin={handleAddGroupAdmin}
                        onHandlePromoteToLeader={handlePromoteGroupLeader}
                        onHandleDemoteAdmin={handleDemoteGroupAdmin}
                        handleClose={handleClose}
                      />
                    );

                    break;
                }
              })()}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
      {/* {!selectedConversation ? <NoChatSelected /> : <MessageContainer />} */}
    </>
  );
};

const NoChatSelected = () => {
  return (
    <>
      <Stack direction={"Column"} sx={{ width: "100%" }}>
        <Typography fontSize={60} variant="subtitle1" align="center" mt={2}>
          Welcome to Zano
        </Typography>
        <Typography fontSize={30} variant="body1" align="center" mt={2}>
          Select a chat to start messaging!
        </Typography>
      </Stack>
    </>
  );
};

export default Members;
