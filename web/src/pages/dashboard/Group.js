import {
  Box,
  Stack,
  Typography,
  Link,
  IconButton,
  useTheme,
  Divider,
  Avatar,
  // Badge,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { scrollElements, showScrollbars } from "../../components/Scrollbar";

import StyledBadge from "../../components/StyledBadge";
import useGetConversations from "../../hooks/useGetConversations";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { styled } from "@mui/material/styles";
import {
  PaperPlaneTilt,
} from "phosphor-react";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
import { Phone, VideoCamera } from "phosphor-react";
import toast from "react-hot-toast";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Group = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [groupList, setGroupList] = useState([]);

  //RENDER CHAT GROUP
  const { selectedConversation } = useConversation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const conversation = useGetConversations();
  const [selectedGroup, setSelectedGroup] = useState(null);

  const fetchGroupList = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/group/getGroupMessaged",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("logintoken")}`,
          },
        }
      );
      // console.log("List group", res.data);
      // Loại bỏ các bản sao từ groupList trước khi thêm nhóm mới
      const uniqueGroups = res.data.filter((newGroup) => {
        return !groupList.some(
          (existingGroup) => existingGroup._id === newGroup._id
        );
      });
      const newGroupList = [...uniqueGroups, ...groupList]; // Thêm nhóm mới vào đầu danh sách
      newGroupList.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setGroupList(newGroupList);
      // await setListConversation(res.data);
    } catch (error) {
      console.log("Error fetching  list group", error);
    }
  };

  const handeCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (selectedGroup) {
      setMessages(selectedGroup.messages);
    }
    fetchGroupList();
  }, [selectedGroup]);
  // console.log("List coversation", listConversation);
  const updateGroupList = () => {
    fetchGroupList();
  };

  useEffect(() => {
    if (groupList) {
      scrollElements.forEach((el) => {
        el.addEventListener("scroll", showScrollbars);
      });
    }
    // console.log("Selected Group ID:", selectedGroup);
  }, [groupList, selectedGroup]); // Chạy một lần sau khi component được render

  const handleChatElementClick = (group) => {
    if (!group) return;
    setSelectedGroup(group);
    // console.log("Chat element clicked:", selectedGroup);
  };
  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%",overflowY: "scroll", }}>
        {/* Left */}
        <Box
          // width="calc(100% - 400px)"
          sx={{
            height: "100vh",
          
            width: 310,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background.paper,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack>
              <Typography variant="h5">Groups</Typography>
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="subtitle2" component={Link}>
                Create New Group
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>

            <Divider />

            <Stack
              spacing={2}
              onScroll={showScrollbars}
              data-scrollbars
              sx={{
                flexGrow: 1,
                overflowY: "scroll",
                height: "100%",
                "&::-webkit-scrollbar": {
                  width: "8px", // chiều rộng của thanh cuộn
                },
                "&:-webkit-scrollbar-track": {
                  background: "pink", // màu nền của thanh cuộn
                },
                "&:-webkit-scrollbar-thumb": {
                  background: "#888", // màu của thanh cuộn
                },
                "&:-webkit-scrollbar-thumb:hover": {
                  background: "#555", // màu của thanh cuộn khi di chuột qua
                },
                "&.is-scrolling": {
                  "&::-webkit-scrollbar-thumb": {
                    background: theme.palette.primary.main, // màu của thanh cuộn khi đang cuộn
                    borderRadius: 10,
                  },
                },
              }}
            >
              {/* sidebar */}

              <Stack spacing={2.5}>

                {/*  */}
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Groups
                </Typography>

                {/* Chat list */}
                {groupList.map((group) => (
                  <ChatElement
                    key={group._id}
                    group={group}
                    onClick={() => handleChatElementClick(group)}
                  />
                ))}

              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            width: "calc(100vw - 400px)",
          }}
        >
          {selectedGroup ? (
            <MessageContainer group={selectedGroup} />
          ) : (
            <NoChatSelected />
          )}
          {/* Reuse conversation */}
        </Box>
      </Stack>
      {openDialog && (
        <CreateGroup
          open={openDialog}
          handleClose={handeCloseDialog}
          updateGroupList={updateGroupList}
        />
      )}
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

const ChatElement = ({ group, msg, online, onClick }) => {
  // console.log("name", name);
  // console.log("avatar", avatar);
  //chưa render được avatar
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
    >
      {/*Badge green dot  */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={group.avatar} alt="" />
            </StyledBadge>
          ) : (
            <Avatar />
          )}

          {/*User Name - msgs*/}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">Group: {group.name}</Typography>
            {/* <Typography variant="caption">{msg}</Typography> */}
          </Stack>
        </Stack>

        {/*Time*/}
        <Stack spacing={2} alignItems={"center"}>
          {/* <Typography sx={{ fontWeight: 900 }} variant="caption">
            {time}
          </Typography> */}
          {/* <Badge color="primary" badgeContent={unread}></Badge> */}
        </Stack>
      </Stack>
    </Box>
  );
};

//------------------------create group------------------------

let MEMBERS = [];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//
const CreateGroupForm = ({ handleClose, updateGroupList }) => {
  const [listUser, setListUser] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("logintoken");
        const response = await axios.get(
          "http://localhost:3000/users/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListUser(response.data); // Thêm .data để lấy dữ liệu từ response
         console.log("listUser", response.data);
        MEMBERS = response.data.map((user) => user.name);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };

    fetchData(); // Gọi hàm fetchData khi component được render
  }, []);

  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have at least two members"),
  });
  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;
  const { setValue } = methods;

  const handleAutocompleteChange = (event, value) => {
    setValue("members", value); // Cập nhật giá trị trong form

    // Cập nhật danh sách MEMBERS dựa trên giá trị đã chọn
    MEMBERS = listUser
      .filter((user) => !value.includes(user._id)) // Lọc ra các user chưa được chọn
      .map((user) => user.name); // Chỉ lấy tên user
  };

  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("loginId");
      const { watch } = methods;
      const nameGroup = watch("title");
      const selectedMembers = watch("members"); // Lấy giá trị của trường "Members"

      // Lấy id của các user được chọn từ danh sách listUser
      const selectedMemberIds = listUser
        .filter((user) => selectedMembers.includes(user.name))
        .map((user) => user._id);

      selectedMemberIds.push(userId);

      console.log("Selected Member IDs:", selectedMemberIds);
      const response = await axios.post(
        "http://localhost:3000/group/createGroupApp",
        {
          admin: userId,
          nameGroup: nameGroup,
          members: selectedMemberIds,
        }
      );
      const data = response.data;
      if (data) {
        setCheck(true);
        updateGroupList();
      }
      console.log("DATA", data);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    if (check) {
      handleClose();
    }
  }, [check]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          sx={{
            mt: 2,
          }}
          name="title"
          label="Group Name"
        />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={MEMBERS}
          value={watch("members")} // Lấy giá trị từ form
          onChange={handleAutocompleteChange}
          ChipProps={{ size: "medium" }}
        />
        <Stack
          spacing={2}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"end"}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="Submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose, updateGroupList }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{
        p: 4,
      }}
    >
      {/* Title  */}
      <DialogTitle
        sx={{
          mb: 2,
        }}
      >
        Create New Group
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Form */}
        <CreateGroupForm
          handleClose={handleClose}
          updateGroupList={updateGroupList}
        />
      </DialogContent>
    </Dialog>
  );
};


//----------------------render message-------------------------------
const MessageContainer = ({ group }) => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const [openPicker, setOpenPicker] = React.useState(false);
  const { selectedConversation, socket } = useConversation();

  const [messages, setMessages] = useState([]);
  // console.log("group at message", group);

  useEffect(() => {
    if (group) {
      setMessages(group.messages);
    }
  }, [group]);
  // console.log("danh sách tin nhắn cũ", messages);
  // const socket = io(`http://localhost:8000`);

  // console.log("conid",selectedConversation._id);
  const senderId = localStorage.getItem("loginId");
  const receiveMessageHandler = async (newMessage) => {
    console.log("Nhận tin nhắn mới:", newMessage);
    // const updatedMessages = [...messages, newMessage]; // Tạo bản sao mới của mảng messages và thêm tin nhắn mới vào đó
    // console.log("Các tin nhắn đã cập nhật:", updatedMessages);
    setMessages(prevMessages => [...prevMessages, newMessage]);
    // setMessages(updatedMessages); // Cập nhật messages với mảng tin nhắn mới
    return newMessage;
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", receiveMessageHandler);
    // console.log("tin nhắn từ Socket:", messages);
    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [socket, messages]);

  if (!group) {
    return <NoChatSelected />;
  }
  socket.on("connection", () => {
    console.log("Connected to the Socket server");
  });
  socket.emit("joinRoom", group._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    if (!group) {
      console.log("Không có cuộc trò chuyện nào được chọn");
      return;
    }
    console.log("Sending message:", message);
    socket.emit("sendMessage", {
      senderId,
      conversationId: [group._id],
      message,
      type: "text",
    });

    const updatedMessages = [...messages, { senderId, conversationId: group._id, message, type: "text" }];
    setMessages(updatedMessages); // Cập nhật danh sách tin nhắn trong state của component
    setMessage("");
  };


  return (
    <>
      {!group ? (
        <NoChatSelected />
      ) : (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"} >
          {/* Chat header */}
          <Header group={group} />

          {/* MSG */}
          <Box
            width={"100%"}
            sx={{
              flexGrow: 1,
              height: "100%",
              overflowY: "scroll",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&:-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&:-webkit-scrollbar-thumb": {
                background: "#888",
              },
              "&:-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
              "&.is-scrolling": {
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.primary.main,
                  borderRadius: 10,
                },
              },
            }}
          >
            {/* Hiển thị danh sách tin nhắn */}
            {/* <MESSAGES  /> */}
            <MESSAGES messages={messages} />
            {/* <MessageList userId={selectedUser._id} /> */}
          </Box>
          {/* Chat footer */}
          {/* <Footer /> */}
          <form onSubmit={handleSubmit}>
            <Box
              p={2}
              sx={{
                height: 100,
                width: "100%",
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#F8FAFF"
                    : theme.palette.background.paper,
                boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={3}>
                <Stack sx={{ width: "100%" }}>
                  <StyledInput
                    type="text"
                    placeholder="Send a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  {/* <input type="text" placeholder="Send a message..."
           onChange={(e) => setMessage(e.target.value)}
           /> */}
                </Stack>

                <Box
                  sx={{
                    height: 48,
                    width: 48,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                >
                  <Stack
                    sx={{ height: "100%", width: "100%" }}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {/* Submit send message */}
                    <IconButton type="submit">
                      <PaperPlaneTilt color="#fff" />
                    </IconButton>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </form>
        </Stack>
      )}
    </>
  );
};


const MESSAGES = ({ messages }) => {
  const timenow = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.now());
  const messageEndRef = useRef(null);
  useEffect(() => {
    // Sau mỗi lần render, cuộn xuống phần tử cuối cùng trong danh sách tin nhắn
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // const { messages, loading } = useGetMessages();
  // messages = mess;
  // const { setMessages, messages } = useConversation();
  const theme = useTheme();
  // console.log(Array.isArray(messages));
  // console.log("Current messages in MESSAGES component:", messages);
  return (
    <Stack
      sx={{
        overflowY: "scroll", // Kích hoạt thanh trượt khi nội dung vượt quá chiều cao
        "&::-webkit-scrollbar": {
          width: "8px", // Chiều rộng của thanh trượt
        },
        "&::-webkit-scrollbar-track": {
          background: theme.palette.background.default, // Màu nền của thanh trượt
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.primary.main, // Màu của nút trượt
          borderRadius: "4px", // Độ cong của nút trượt
        },
      }}
    >
    {Array.isArray(messages) &&
        messages.map((message, index, array) => (
          <React.Fragment key={message._id}>
            <Message message={message} />
            {index === array.length - 1 && (
              <Stack
                sx={{ mb: 2, mt: 2 }}
                direction="row"
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Divider width="46%" />
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text }}
                >
                  {timenow}
                </Typography>
                <Divider width="46%" />
              </Stack>
            )}{" "}
            {/* Thêm Divider sau tin nhắn cuối cùng */}
          </React.Fragment>
        ))}
         <div ref={messageEndRef}></div>
      {/* {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))} */}
    </Stack>
  );
};

const Header = (group) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  // const {onlineUsers} = useSocketContext();
  // const isOnline = onlineUsers.includes(conversation._id)
  const theme = useTheme();
  const dispatch = useDispatch();
  // console.log(group.group);
  // console.log("name", group.group.name);
  // console.log("avatar", group.avatar);
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          onClick={() => {
            //
            dispatch(ToggleSidebar());
          }}
          direction={"row"}
          spacing={2}
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar src={group.group.avatar} alt="" />
            </StyledBadge>
            {/* User */}
          </Box>

          <Stack spacing={0.2}>
            <Typography variant="subtitle2">
              {group.group.name}
            </Typography>
            {/* <Typography variant="caption">Online</Typography> */}
          </Stack>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>

          <IconButton>
            <Phone />
          </IconButton>

          {/* <IconButton>
            <MagnifyingGlass />
          </IconButton> */}
          {/* <Divider orientation="vertical" flexItem /> */}
          {/* <IconButton>
            <CaretDown />
          </IconButton> */}
        </Stack>
      </Stack>
    </Box>
  );
};

// ------------------------------------------
const useGetMessages = (group) => {
  const [loading, setLoading] = useState(false);
  //const { messages, setMessages, selectedConversation } = useConversation();
  const { messages, setMessages, selectedConversation } = useConversation();
  // const [tempMessages, setTempMessages] = useState([]);


  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        setMessages(group.messages);

      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (group._id) getMessages();
  }, [group?._id, setMessages]);
  return { messages, loading };
};

const Messages = (group) => {


  const { messages, loading } = useGetMessages(group);
  const theme = useTheme();
  // console.log("test", messages)
  // console.log("OKE")
  //console.log("group kiểm tra avatar 111:", group);

  return (


    <Stack sx={{
      overflowY: "scroll", // Kích hoạt thanh trượt khi nội dung vượt quá chiều cao
      "&::-webkit-scrollbar": {
        width: "8px", // Chiều rộng của thanh trượt
      },
      "&::-webkit-scrollbar-track": {
        background: theme.palette.background.default, // Màu nền của thanh trượt
      },
      "&::-webkit-scrollbar-thumb": {
        background: theme.palette.primary.main, // Màu của nút trượt
        borderRadius: "4px", // Độ cong của nút trượt
      },
    }}
    >

      {!loading && Array.isArray(group.messages) && group.messages.length > 0 && (
        group.messages.map((message) => (
          <Message key={message._id} message={message} group={group} />
        ))
      )}
    </Stack>
  );
};


const Message = ({ message, group }) => {
  //const authUser = JSON.parse(localStorage.getItem("user"));
  const loginUserId = localStorage.getItem("loginId");
  const loginAvatar = localStorage.getItem("loginavatar");
  const { selectedConversation, setSelectedConversation, } = useConversation();
  const [receiver, setReceiver] = useState([]);

 /*  useEffect(() => {
    if (selectedConversation && selectedConversation.isGroupChat) {
      const senderId = localStorage.getItem("loginId");
      const groupParticipants = selectedConversation.participants.filter(participant => participant._id !== senderId);
      setReceiver(groupParticipants);
    }
  }, [selectedConversation]);
  console.log("receiver",receiver); */
  console.log("group kiểm tra avatar:", group);

  const fromMe = message.senderId === loginUserId;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? loginAvatar : receiver.avatar;
  //  const receiverpic = receiver.avatar;
  const loginname = localStorage.getItem("loginame");
  // const bubbleBgcolor = fromMe ? "blue" : "";
  const formmattedTime = extractTime(message.createdAt)
  const theme = useTheme();
  

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return require('../../assets/Images/pdf.png');
      case 'doc':
      case 'docx':
        return require('../../assets/Images/dox.png');
      case 'xls':
      case 'xlsx':
        return require('../../assets/Images/excel.jpg');
      case 'ppt':
      case 'pptx':
        return require('../../assets/Images/pp.png');
      default:
        return require('../../assets/Images/dox.png');
    }
  };
  const getContent = (type) => {
    let messageContent;
    switch (type) {
      case "text":
        messageContent = message.message;
        break;
      case "image":
        messageContent = <img src={message.message} style={{ maxWidth: 300, maxHeight: 300 }} />;
        break;
      case "video":
        messageContent = <video controls width="500" height="300"><source src={message.message} type="video/mp4" /></video>;
        break;
      case "voice":
        messageContent =
          <audio id="audioPlayer" controls>
            <source src={message.message} type="audio/mpeg" />
          </audio>

        break;
      case "file":
        messageContent =
          <a href={message.message} target="_blank" rel="noopener noreferrer">
            <img src={getFileIcon(message.message.substring(message.message.lastIndexOf(".") + 1))} style={{ maxWidth: 50, maxHeight: 50 }} />
          </a>
        break;
      default:
        messageContent = message.message;

    }
    return messageContent;
  }
  return (
    <Stack
      className={`chat ${chatClassName}`}
      direction={fromMe ? "row-reverse" : "row"}
      alignItems="center"
      spacing={1}
      mt={2}
    >
      <Typography>
        {loginname}
      </Typography>
      <Avatar alt="" src={profilePic} sx={{
        marginRight: fromMe ? 2 : 0,
        marginLeft: fromMe ? 0 : 2,
      }} />
      <Typography
        variant="body1"
        sx={{
          backgroundColor: fromMe ? "#e2e7e3" : "#55c1db", // Màu xám nếu fromMe, trắng nếu không
          color: "black",
          borderRadius: "8px",
          py: 1,
          px: 2,
          whiteSpace: "pre-wrap",
          maxWidth: "60%",
        }} style={{
          wordWrap: "break-word", // Xuống dòng khi dòng chat quá dài
        }}
      >
        {getContent(message.type)}
        {/* {message.type === "text"? message.message : <video controls width="500" height="300"><source src={message.message} type="video/mp4" /></video>} */}
      </Typography>
      {/* <Typography>{formmattedTime}</Typography> */}
    </Stack>
  );
};

export default Group;
