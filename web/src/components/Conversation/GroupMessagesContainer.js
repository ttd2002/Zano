import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  useTheme,
  Typography,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "./Header";
// import Footer from "./Footer";
// import { useConversation } from "../../zustand/useConversation";
import Message from "./Message";

import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Phone,
  Smiley,
  Sticker,
  User,
  VideoCamera,
} from "phosphor-react";

import { TextField, InputAdornment, Fab, Tooltip } from "@mui/material";
import useConversation from "../../zustand/useConversation";
import StyledBadge from "../StyledBadge";
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

// const Actions = [
//   {
//     color: "#4da5fe",
//     icon: <Image size={20} />,
//     y: 102,
//     title: "Photo/Video",
//   },
//   {
//     color: "#1b8cfe",
//     icon: <Sticker size={24} />,
//     y: 157,
//     title: "Stickers",
//   },
//   {
//     color: "#0172e4",
//     icon: <Camera size={24} />,
//     y: 212,
//     title: "Image",
//   },
//   {
//     color: "#0159b2",
//     icon: <File size={24} />,
//     y: 267,
//     title: "Document",
//   },
//   {
//     color: "#013f7f",
//     icon: <User size={24} />,
//     y: 322,
//     title: "Contact",
//   },
// ];

const GroupMessagesContainer = () => {
  // const { loading, sendMessage } = useSendMessage();

  // const [inputMessage, setInputMessage] = useState("");
  const theme = useTheme();
  const [openPicker, setOpenPicker] = React.useState(false);
  // const { selectedConversation, setSelectedConversation, setMessages, messages } = useConversation();
  return (
    <>
         <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
          {/* Chat header */}
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
        //   onClick={() => {
        //     //
        //     dispatch(ToggleSidebar());
        //   }}
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
              <Avatar src="" alt="" />
            </StyledBadge>
            {/* User */}
          </Box>

          <Stack spacing={0.2}>
            <Typography variant="subtitle2">
            {/* {receiver.receiver.name} */}
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
            <MESSAGES/>
            {/* <MessageList userId={selectedUser._id} /> */}
          </Box>
          {/* Chat footer */}
          {/* <Footer /> */}
          <form >
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
                  {/* Chat input */}
                  {/* <Box sx={{zIndex: 10, position: "fixed", bottom: 81, right: 100, }}>
          <Picker theme={theme.palette.mode}  data={data} onEmojiSelect={console.log}/>
          </Box> */}
                  {/* Emoji BOX */}
                  {/* <Box 
              sx={{
                display: openPicker ? "inline" : "none",
                zIndex: 10,
                position: "fixed",
                bottom: 70,
                right: 90,
              }}
            >
              <EmojiPicker height={"400px"} width={"330px"} />
            </Box> */}
                  {/* <ChatInput  
          onChange={(e) => setMessage(e.target.value)}
           setOpenPicker={setOpenPicker} /> */}
                  <StyledInput
                    type="text"
                    placeholder="Send a message..."
                    // value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    // onChange={(e) => {
                    //   if (e.target.value.length <= 5000) {
                    //     // Giới hạn tin nhắn chỉ có tối đa 200 ký tự
                    //     setMessage(e.target.value);
                    //   }
                    // }}
                  />
                  {/* onChange=
                  {(e) => {
                    if (e.target.value.length <= 1000) {
                      // Giới hạn tin nhắn chỉ có tối đa 200 ký tự
                      setMessage(e.target.value);
                    }
                  }} */}
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
const MESSAGES = ({ messages }) => {
  const timenow = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.now());
  // const { messages, loading } = useGetMessages();
  // messages = mess;
  // const { setMessages, messages } = useConversation();
  const messageEndRef = useRef(null);
  useEffect(() => {
    // Sau mỗi lần render, cuộn xuống phần tử cuối cùng trong danh sách tin nhắn
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);   
  const theme = useTheme();
  // console.log(Array.isArray(messages));
  //console.log("Current messages in MESSAGES component:", messages);
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
    </Stack>
  );
};
export default GroupMessagesContainer;
