import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  Slide,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  User,
  MagnifyingGlass,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { scrollElements, showScrollbars } from "../../components/Scrollbar";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { Plus } from "phosphor-react";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "../../utils/axios";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import isEqual from 'lodash/isEqual';
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

import Conversations from "../../components/Conversation/Conversations/Conversations";

const Chats = () => {
  const [openFriendDialog, setOpenFriendDialog] = useState(false); // State for Friend dialog
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { socket } = useConversation();
  const [isCreateConversation, setIsCreateConversation] = useState(false);
  const theme = useTheme();

  const handleCloseFriendDialog = () => {
    setOpenFriendDialog(false);
  };

  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
  };

  const handleOpenFriendDialog = () => {
    setOpenFriendDialog(true);
  };

  const handleOpenGroupDialog = () => {
    setOpenGroupDialog(true);
  }

  const addConversation = (conversation) => {
    // Kiểm tra xem cuộc trò chuyện đã tồn tại trong danh sách chưa
    // console.log("conversation", conversation) 
    const conversationExists = conversations.some(
      (existingConversation) => existingConversation._id === conversation._id
    );

    if (!conversationExists) {
      // Nếu cuộc trò chuyện chưa tồn tại, thêm vào đầu danh sách
      setConversations((prevConversations) => [conversation, ...prevConversations]);
    }
  };

  // Logic để xử lý khi conversations thay đổi
  const handleConversationChange = () => {
    const updatedConversations = [...conversations];

    // Sắp xếp lại danh sách conversations dựa trên createdAt hoặc updatedAt của tin nhắn cuối cùng
    updatedConversations.sort((a, b) => {
      const messageA = a.messages ? a.messages[0] : null;
      const messageB = b.messages ? b.messages[0] : null;

      // Kiểm tra xem messages có tồn tại không và lấy thời gian tạo hoặc cập nhật
      const timeA = messageA ? (messageA.createdAt || messageA.updatedAt) : 0;
      const timeB = messageB ? (messageB.createdAt || messageB.updatedAt) : 0;
      return timeB - timeA;
    });

    // Kiểm tra xem updatedConversations có khác conversations hiện tại không
    if (!isEqual(updatedConversations, conversations)) {
      setConversations(updatedConversations);
      // console.log("Updated conversations:", updatedConversations);
    }
  };

  useEffect(() => {

    // Gọi hàm xử lý khi conversations thay đổi
    // socket.on("requestRender", () => {
    //   io.emit("Render")
    //   handleConversationChange();
    // })
    handleConversationChange();
    // console.log("Updated conversations:", conversations);
  }, [conversations.messages, conversations.createdAt, conversations.updatedAt, conversations]);

  useEffect(() => {
    scrollElements.forEach((el) => {
      el.addEventListener("scroll", showScrollbars);
      // el.addEventListener("mouseenter", showScrollbars);

      return () => {
        el.removeEventListener("scroll", showScrollbars);
        // el.removeEventListener("mouseenter", showScrollbars);
      };
    });
  }, []); // Chạy một lần sau khi component được render

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 310,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* App title */}
        <Stack p={2} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">ZANO</Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenFriendDialog();
                }}
              >
                <User />
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>

          {/* search */}
          <Stack sx={{ width: "100%" }}>
            <Search>
              <IconButton>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
              </IconButton>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>

          {/* archive
        <Stack spacing={1}>
          <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
            <ArchiveBox size={24} />
            <Button>Archive</Button>
          </Stack>

          <Divider />
        </Stack> */}
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
                setOpenGroupDialog(true);
              }}
            >
              <Plus style={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Stack>

          <Divider />

          {openGroupDialog && (
            <CreateGroup
              open={openGroupDialog}
              handleClose={handleCloseGroupDialog}
              onCreateConversation={addConversation}
            />
          )}

          {/* Chat Element */}
          <Stack
            onScroll={showScrollbars}
            data-scrollbars
            spacing={2}
            direction={"column"}
            sx={{
              flexGrow: 1,
              overflowY: "scroll",
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
            {/* Scroll bar */}
            <Stack spacing={2.4}></Stack>

            {/* All chats */}
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>
              {/* LOADING USERLISTchat */}
              <Conversations ListConversations={conversations} isCreateConversation={isCreateConversation} />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {openFriendDialog && (
        <Friends
          open={openFriendDialog}
          handleClose={handleCloseFriendDialog}
          onCreateConversation={addConversation}
          isCreateConversation={isCreateConversation}
          setIsCreateConversation={setIsCreateConversation}
        />
      )}
    </>
  );
};

//---------------create group---------------
let MEMBERS = [];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CreateGroup = ({ open, handleClose, onCreateConversation }) => {
  const [newConversation, setNewConversation] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const senderId = localStorage.getItem("loginId");
  const { socket } = useConversation();
  const handleCreateConversation = (conversation) => {
    setNewConversation(conversation); // Nhận conversation mới từ CreateGroupForm
    onCreateConversation(conversation); // Thêm conversation mới vào danh sách conversations
  };

  //-----------------------create group form-----------------------
  const [listUser, setListUser] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("logintoken");
        const response = await axios.get(
          `/users/${senderId}/friends`,
        );
        setListUser(response.data.friends); // Thêm .data để lấy dữ liệu từ response
        // console.log("listUser", response.data);
        MEMBERS = response.data.friends.map((user) => (
          // name: user.name,
          // phone: user.phone,
          // avatar: user.avatar
          user.name
        ));
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
      .map((user) => (
        user.name));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("groupAvatar", selectedFile);
    };
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

      // console.log("Selected Member IDs:", selectedMemberIds);

      // Gửi các trường khác như là các thuộc tính của object
      formData.append("admin", userId);
      formData.append("nameGroup", nameGroup);

      // Gửi mảng các ID trực tiếp vào formData
      selectedMemberIds.forEach(memberId => {
        formData.append("members", memberId);
      });

      const response = await axios.post(
        "/group/createGroupApp",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Accept': 'application/json',
          },
        }
      );
      const data = response.data.group;
      if (response.status === 201) {
        toast.success("Create group success");
        setCheck(true);
        onCreateConversation(data);
        setSelectedFile(null);
        socket.emit("requestRender");
        handleClose();
      }
      console.log("DATA", data);
    } catch (error) {
      toast.error("Create group failed");
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (check) {
      handleClose();
    }
  }, [check]);
  const handleFileSelect = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên từ mảng files
    setSelectedFile(file); // Gán giá trị tệp đã chọn vào selectedFile
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={{
        p: 4,
        height: '600px',
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
        {/* <CreateGroupForm
          handleClose={handleClose}
          onCreateConversation={handleCreateConversation}
        /> */}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <IconButton>
              <input type="file" name="groupAvatar" onChange={handleFileSelect} accept="image/*" />
            </IconButton>
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
      </DialogContent>
    </Dialog>
  );
};

export default Chats;
