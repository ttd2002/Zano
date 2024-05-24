import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  useTheme,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Header from "./Header";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
// import Footer from "./Footer";
// import { useConversation } from "../../zustand/useConversation";
import Message from "./Message";
import toast from "react-hot-toast";

import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";

import { TextField, InputAdornment, Fab, Tooltip } from "@mui/material";
import useConversation from "../../zustand/useConversation";
import axios from "../../utils/axios";
import { indexOf } from "lodash";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsCreateSingleConversation, setIsCreateSingleConversation } from '../../redux/slices/createSingleCoversationSlice';

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));
const MessageContainer = () => {
  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = React.useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const theme = useTheme();
  // const { selectedConversation, setSelectedConversation, setMessages, messages } = useConversation();
  const { selectedConversation, socket } = useConversation();
  const [selectedFile, setSelectedFile] = useState();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const senderId = localStorage.getItem("loginId");
  const isCreateSingleConversation = useSelector(selectIsCreateSingleConversation);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsCreateSingleConversation(false));
  }, []); // useEffect sẽ được gọi một lần duy nhất khi component được render

  useEffect(() => {
    // if (selectedConversation && !selectedConversation.isGroupChat) {
    const fetchData = async () => {
      if (selectedConversation) {
        if (selectedConversation.isGroupChat) {
          const NewReceiver = {
            _id: selectedConversation._id,
            name: selectedConversation.name,
            avatar: selectedConversation.avatar,
          };
          setReceiver(NewReceiver);
        } else if (!selectedConversation.isGroupChat) {
          for (let i = 0; i < selectedConversation.participants.length; i++) {
            if (selectedConversation.participants[i]._id != senderId) {
              const NewReceiver = {
                _id: selectedConversation.participants[i]._id,
                name: selectedConversation.participants[i].name,
                avatar: selectedConversation.participants[i].avatar,
              };
              setReceiver(NewReceiver);
              //  console.log("receiver",NewReceiver);
            }
          }
        }
      }
    }
    fetchData();
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(selectedConversation.messages || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const receiveMessageHandler = async (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    if (!socket) return;
    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [socket]);
  const fetchMessages = async () => {
    try {
      if (!selectedConversation) return;
      const response = await axios.get(`/mes/get/${selectedConversation._id}`, {
        params: {
          senderId: senderId,
          conversationId: selectedConversation._id,
        }
      });
      // console.log("mes", response.data);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages(); // Fetch messages when selectedConversation changes
  }, [selectedConversation]);

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.native);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!message && !selectedFile) return;
    if (message.trim() == "") return;
    if (!selectedConversation) {
      console.log("Không có cuộc trò chuyện nào được chọn");
      return;
    }
    console.log("Sending message:", message);
    console.log(selectedFile);
    try {
      if (selectedFile && message.trim() == "") {
        const image = new FormData();
        image.append("imageChat", selectedFile);
        // console.log(image);
        const formData = new FormData();
        formData.append("imageChat", selectedFile);

        const res = await axios.post(
          "/mes/uploadImageApp",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("link ảnh", res.data.link);
        socket.emit("sendMessage", {
          senderId,
          conversationId: selectedConversation._id,
          message: res.data.link,
          type: "image",
        });
        const updatedMessages = [
          ...messages,
          {
            senderId,
            conversationId: selectedConversation._id,
            message: res.data.link,
            type: "image",
          },
        ];
        setMessages(updatedMessages);
        setSelectedFile(null);
      } else {
        socket.emit("sendMessage", {
          senderId,
          conversationId: selectedConversation._id,
          message,
          type: "text",
        });
        const updatedMessages = [
          ...messages,
          {
            senderId,
            conversationId: selectedConversation._id,
            message,
            type: "text",
          },
        ];
        setMessages(updatedMessages);
      }

      // console.log("ok");
      if (message.trim() !== "") {
        setSelectedFile(null);
      }
      setMessage("");
      setShowEmojiPicker(false);
      socket.emit("requestRender");
    } catch (error) {
      console.log(error);
    }
  };


  if (!selectedConversation) {
    return <NoChatSelected />;
  }
  socket.on("connection", () => {
    console.log("Connected to the Socket server");
  });
  socket.emit("joinRoom", selectedConversation._id);

  const handleFileSelect = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên từ mảng files
    setSelectedFile(file); // Gán giá trị tệp đã chọn vào selectedFile
    // Xác định đuôi của tệp được chọn
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    // console.log("File extension:", fileExtension);
  };
  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  return (
    <>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
          {/* Chat header */}
          <Header receiver={receiver} />

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
            <MESSAGES messages={messages} selectedConversation={selectedConversation} setMessages={setMessages} />
            {/* <MessageList userId={selectedUser._id} /> */}
          </Box>
          {/* Chat footer */}

          {/* <Footer /> */}
          <form onSubmit={handleSubmit}>
            <Box
              p={2}
              position={"relative"}
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
                  <StyledInput
                    placeholder={
                      selectedFile ? selectedFile.name : "Send a message..."
                    }
                    value={message}
                    onChange={(e) => {
                      if (e.target.value.length <= 5000) {
                        setMessage(e.target.value);
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <Stack sx={{ width: "max-content" }}>
                          <InputAdornment>
                            {/* Sử dụng IconButton để chọn file */}
                            <IconButton
                              component="label" // Sử dụng label element để làm điểm chính của IconButton
                              htmlFor="fileInput" // Liên kết với input type file
                              sx={{ display: "block" }}
                            >
                              <LinkSimple />
                              <input
                                id="fileInput"
                                type="file"
                                onChange={handleFileSelect}
                                style={{ display: "none" }} // Ẩn input type file
                              />
                            </IconButton>
                          </InputAdornment>
                        </Stack>
                      ),
                      endAdornment: (
                        <Stack sx={{ position: "relative" }}>
                          <InputAdornment>
                            <IconButton
                              onClick={() =>
                                setShowEmojiPicker(!showEmojiPicker)
                              }
                            >
                              <Smiley />
                            </IconButton>
                            {showEmojiPicker && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 80,
                                  right: 20,
                                  zIndex: 999,
                                }}
                              >
                                <Picker
                                  theme={theme.palette.mode}
                                  data={data}
                                  onEmojiSelect={(emoji) => handleEmojiSelect(emoji)}
                                />
                              </Box>
                            )}
                          </InputAdornment>
                        </Stack>
                      ),
                    }}
                  // Nếu đã chọn file, không cho phép nhập vào input
                  />
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

const MESSAGES = ({ messages, selectedConversation, setMessages }) => {
  const timenow = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.now());

  const messageEndRef = useRef(null);

  const theme = useTheme();

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    // Kiểm tra xem có tin nhắn nào bị recall không
    const isAnyRecalled = messages.some(message => message.recall);
    setIsRecalled(isAnyRecalled);
  }, [messages]);

  const [isRecalled, setIsRecalled] = useState(false);
  const { socket } = useConversation();
  const handleRecallMessage = async (messageId) => {
    const confirmRecall = window.confirm("Are you sure to want to recall this message?");
    if (confirmRecall) {
      try {
        const response = await axios.post("/mes/recallMessage", {
          conversationId: selectedConversation._id,
          messageId: messageId,
        });
        // Nếu recall message thành công, cập nhật lại mảng messages
        if (response.status === 200) {
          const recalledMessages = messages.map(message => {
            if (message._id === messageId) {
              return {
                ...message,
                message: "This message has been recalled",
                type: "text"
              };
            }
            // socket.emit("requestRender");
            return message;
          });
          setMessages(recalledMessages);
          setIsRecalled(true);
          toast.success("Recall message successfully");
        } else {
          toast.error("Failed to recall message");
        }
      } catch (error) {
        console.error("Error recalling message:", error);
        toast.error("Failed to recall message");
      }
    }
  };


  return (
    <Stack
      sx={{
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: theme.palette.background.default,
        },
        "&::-webkit-scrollbar-thumb": {
          background: theme.palette.primary.main,
          borderRadius: "4px",
        },
      }}
    >
      {Array.isArray(messages) &&
        messages.map((message, index, array) => (
          <React.Fragment key={message._id || index}>
            <Message key={message._id} message={message} onRecallMessage={handleRecallMessage} setIsRecalled={setIsRecalled} />
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
            )}
          </React.Fragment>
        ))}
      <div ref={messageEndRef}></div>
    </Stack>
  );
};

export default MessageContainer;
