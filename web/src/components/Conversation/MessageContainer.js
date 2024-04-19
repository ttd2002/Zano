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
import axios from "axios";
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={20} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 157,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 212,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 267,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 322,
    title: "Contact",
  },
];

const MessageContainer = () => {
  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = React.useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  // const { loading, sendMessage } = useSendMessage();

  // const [inputMessage, setInputMessage] = useState("");
  const theme = useTheme();
  // const { selectedConversation, setSelectedConversation, setMessages, messages } = useConversation();
  const { selectedConversation, socket } = useConversation();
  const [selectedFile, setSelectedFile] = useState();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (selectedConversation && !selectedConversation.isGroupChat) {
      const senderId = localStorage.getItem("loginId");
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
      setMessages(selectedConversation.messages);
    }
  }, [selectedConversation]);
  // if (selectedConversation && !selectedConversation.isGroupChat) {
  //   for (let i = 0; i < selectedConversation.participants.length; i++) {
  //     if (selectedConversation.paparticipants[i]._id == loginId) {
  //       const Receiver = {
  //         _id: selectedConversation.paparticipants[i]._id,
  //         name: selectedConversation.paparticipants[i].name,
  //         avatar: selectedConversation.paparticipants[i].avatar,
  //       };
  //       setReceiver(Receiver);
  //     }
  //   }
  //   setMessages(selectedConversation.messages);
  // }
  // const socket = io(`http://localhost:8000`);

  // console.log("conid",selectedConversation._id);
  const senderId = localStorage.getItem("loginId");
  const receiveMessageHandler = async (newMessage) => {
    console.log("Nhận tin nhắn mới:", newMessage);
    const updatedMessages = [...messages, newMessage]; // Tạo bản sao mới của mảng messages và thêm tin nhắn mới vào đó
    console.log("Các tin nhắn đã cập nhật:", updatedMessages);
    setMessages(updatedMessages); // Cập nhật messages với mảng tin nhắn mới
    return newMessage;
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", receiveMessageHandler);

    return () => {
      socket.off("receiveMessage", receiveMessageHandler);
    };
  }, [socket, messages]);

  if (!selectedConversation) {
    return <NoChatSelected />;
  }
  socket.on("connection", () => {
    console.log("Connected to the Socket server");
  });
  socket.emit("joinRoom", selectedConversation._id);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!message && !selectedFile) return;
    if (!selectedConversation) {
      console.log("Không có cuộc trò chuyện nào được chọn");
      return;
    }
    console.log("Sending message:", message);

    try {

      if (selectedFile) {
        const image = new FormData();
        image.append("imageChat", selectedFile);
        console.log(image);
        const formData = new FormData();
        formData.append("imageChat", selectedFile);

        const res = await axios.post("http://localhost:3000/mes/uploadImageApp", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

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
      }
      else {
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
      console.log("ok");
      setMessage("");
    } catch (error) {
      console.log(error);
    };
  }

  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.native);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên từ mảng files
    setSelectedFile(file); // Gán giá trị tệp đã chọn vào selectedFile
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
            <MESSAGES messages={messages} />
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
                  {/*  <Box
                    style={{
                      zIndex: 10,
                      position: "fixed",
                      display: openPicker ? "inline" : "none",
                      bottom: 81,
                    }}
                  >
                    <Picker
                      theme={theme.palette.mode}
                      data={data}
                      onEmojiSelect={(emoji) => {
                        handleEmojiClick(emoji.native);
                      }}
                    />
                  </Box> */}
                  <StyledInput
                    //  inputRef={inputRef}
                    //  value={value}
                    // setValue={setValue}
                    // openPicker={openPicker}
                    // setOpenPicker={setOpenPicker}
                    // type="text"
                    placeholder="Send a message..."
                    value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    onChange={(e) => {
                      if (e.target.value.length <= 5000) {
                        // Giới hạn tin nhắn chỉ có tối đa 200 ký tự
                        setMessage(e.target.value);
                      }
                    }}
                  />
                  {/* Emoji Picker */}
                  {/* File Input */}
                  <IconButton>
                    <input type="file" onChange={handleFileSelect}/>
                  </IconButton>
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

// const Footer = () => {
//   const [message, setMessage] = useState("");
//   const { loading, sendMessage } = useSendMessage();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message) return;
//     await socket.emit("sendMessage", { senderId, conversationId, message, type, messages });;
//     setMessage("");
//   };
//   const theme = useTheme();
//   const [openPicker, setOpenPicker] = React.useState(false);
//   return (
//     <form onSubmit={handleSubmit}>
//       <Box
//         p={2}
//         sx={{
//           height: 100,
//           width: "100%",
//           backgroundColor:
//             theme.palette.mode === "light"
//               ? "#F8FAFF"
//               : theme.palette.background.paper,
//           boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
//         }}
//       >
//         <Stack direction={"row"} alignItems={"center"} spacing={3}>
//           <Stack sx={{ width: "100%" }}>
//             {/* Chat input */}
//             {/* <Box sx={{zIndex: 10, position: "fixed", bottom: 81, right: 100, }}>
// import React, { useEffect, useState } from "react";
// import { Box, Stack, useTheme, Typography, IconButton } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import Header from "./Header";
// // import Footer from "./Footer";
// import Messages from "./Messages";
// import { useConversation } from "../../zustand/useConversation";
// import useGetMessages from "../../hooks/useGetMessages";
// import Message from "./Message";
// import io from "socket.io-client";
//           <Picker theme={theme.palette.mode}  data={data} onEmojiSelect={console.log}/>
//           </Box> */}
//             {/* Emoji BOX */}
//             {/* <Box
//               sx={{
//                 display: openPicker ? "inline" : "none",
//                 zIndex: 10,
//                 position: "fixed",
//                 bottom: 70,
//                 right: 90,
//               }}
//             >
//               <EmojiPicker height={"400px"} width={"330px"} />
//             </Box> */}

//             {/* <ChatInput
//           onChange={(e) => setMessage(e.target.value)}
//            setOpenPicker={setOpenPicker} /> */}

//             <StyledInput
//               type="text"
//               placeholder="Send a message..."
//               onChange={(e) => setMessage(e.target.value)}
//             />

//             {/* <input type="text" placeholder="Send a message..."
//            onChange={(e) => setMessage(e.target.value)}
//            /> */}
//           </Stack>

//           <Box
//             sx={{
//               height: 48,
//               width: 48,
//               backgroundColor: theme.palette.primary.main,
//               borderRadius: 1.5,
//             }}
//           >
//             <Stack
//               sx={{ height: "100%", width: "100%" }}
//               alignItems={"center"}
//               justifyContent={"center"}
//             >
//               {/* Submit send message */}
//               <IconButton type="submit">
//                 <PaperPlaneTilt color="#fff" />
//               </IconButton>
//             </Stack>
//           </Box>
//         </Stack>
//       </Box>
//     </form>
//   );
// };

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
      {/* {
        !loading && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((conversation) =>
            conversation.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )
        ) : loading ? (
          // Placeholder khi đang tải
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)) : (
          // Placeholder khi không có tin nhắn
          <Typography align="center" fontSize={20} variant="body1">
            Send a message to start the conversation!
          </Typography>
        )
      } */}
      {/* {Array.isArray(messages) &&
        messages &&
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
         */}
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
export default MessageContainer;
// import {
//   Camera,
//   File,
//   Image,
//   LinkSimple,
//   PaperPlaneTilt,
//   Smiley,
//   Sticker,
//   User,
// } from "phosphor-react";

// import { TextField, InputAdornment, Fab, Tooltip } from "@mui/material";

// import useSendMessage from "../../hooks/useSendMessage";
// const StyledInput = styled(TextField)(({ theme }) => ({
//   "& .MuiInputBase-input": {
//     paddingTop: "12px",
//     paddingBottom: "12px",
//   },
// }));

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

// const MessageContainer = () => {
//   const [message, setMessage] = useState("");
//   const { loading, sendMessage } = useSendMessage();
//   const { GetMSGS, GetMSGLoading } = useGetMessages();
//   const [inputMessage, setInputMessage] = useState("");
//   const theme = useTheme();
//   const [openPicker, setOpenPicker] = React.useState(false);
//   const { selectedConversation, setSelectedConversation , setMessages, messages} = useConversation();
//   // useEffect(() => {
//   //   setMessage(inputMessage); // Cập nhật message từ biến trung gian
//   // }, [inputMessage]);
//   const socket = io(`http://localhost:8000`);

//   // console.log("conid",selectedConversation._id);
//   const senderId = localStorage.getItem("loginId");
//   // const message = selectedConversation.messages
//   useEffect(() => {
//     const receiveMessageHandler = (newMessage) => {
//       console.log("new mes:",newMessage)
//       //console.log("oks",senderId)

//       // Kiểm tra nếu tin nhắn được nhận từ socket không phải là tin nhắn do chính client gửi
//       if (newMessage.senderId !== senderId) {

//         setMessages(prevMessages => [...prevMessages, newMessage]);
//         console.log("List messages:");
//         console.table(messages);
//         // Chỉ thêm tin nhắn mới vào state nếu không phải là tin nhắn do chính client gửi
//       }

//     };

//     socket.on("receiveMessage", receiveMessageHandler);

//     // Xóa bỏ listener khi component unmount
//     return () => {
//       socket.off("receiveMessage", receiveMessageHandler);
//     };
//   }, [socket, messages]);

//   if (!selectedConversation) {
//     return <NoChatSelected />;
//   }
//   socket.on("connection", () => {
//     console.log("Connected to the Socket server")
//   })
//   socket.emit("joinRoom", selectedConversation._id)

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message) return;
//     console.log(message);
//     await socket.emit("sendMessage", { senderId, conversationId: selectedConversation._id, message, type: "text" });
//     setMessage("");
//     console.log(message);
//     console.table(messages);
//   };

//   return (

//     <>
//       {!selectedConversation ? (<NoChatSelected />) : (

//         <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
//           {/* Chat header */}
//           <Header/>
//           {/* MSG */}
//       <Box
//         width={"100%"}
//         sx={{
//           flexGrow: 1,
//           height: "100%",
//           overflowY: "scroll",
//           "&::-webkit-scrollbar": {
//             width: "8px",
//           },
//           "&:-webkit-scrollbar-track": {
//             background: "#f1f1f1",
//           },
//           "&:-webkit-scrollbar-thumb": {
//             background: "#888",
//           },
//           "&:-webkit-scrollbar-thumb:hover": {
//             background: "#555",
//           },
//           "&.is-scrolling": {
//             "&::-webkit-scrollbar-thumb": {
//               background: theme.palette.primary.main,
//               borderRadius: 10,
//             },
//           },
//         }}
//       >
//         {/* Hiển thị danh sách tin nhắn */}
//         <Stack sx={{
//   overflowY: "scroll", // Kích hoạt thanh trượt khi nội dung vượt quá chiều cao
//   "&::-webkit-scrollbar": {
//     width: "8px", // Chiều rộng của thanh trượt
//   },
//   "&::-webkit-scrollbar-track": {
//     background: theme.palette.background.default, // Màu nền của thanh trượt
//   },
//   "&::-webkit-scrollbar-thumb": {
//     background: theme.palette.primary.main, // Màu của nút trượt
//     borderRadius: "4px", // Độ cong của nút trượt
//   },
// }}
// >
//   {/* {
//     !loading && Array.isArray(messages) && messages.length > 0 ? (
//       messages.map((conversation) =>
//         conversation.messages.map((message) => (
//           <Message key={message.id} message={message} />
//         ))
//       )
//     ) : loading ? (
//       // Placeholder khi đang tải
//       [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
//     ) : (
//       // Placeholder khi không có tin nhắn
//       <Typography align="center" fontSize={20} variant="body1">
//         Send a message to start the conversation!
//       </Typography>
//     )
//   } */}
//   {!GetMSGLoading && Array.isArray(GetMSGS) && GetMSGS.length > 0 && (
//     GetMSGS.map((message) => (
//       <Message key={message._id} message={message} />
//     ))
//   )}

// </Stack>

//         {/* <MessageList userId={selectedUser._id} /> */}

//       </Box>
//           {/* Chat footer */}
//           {/* <Footer /> */}
//           <form onSubmit={handleSubmit}>
//             <Box
//               p={2}
//               sx={{
//                 height: 100,
//                 width: "100%",
//                 backgroundColor:
//                   theme.palette.mode === "light"
//                     ? "#F8FAFF"
//                     : theme.palette.background.paper,
//                 boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
//               }}
//             >
//               <Stack direction={"row"} alignItems={"center"} spacing={3}>
//                 <Stack sx={{ width: "100%" }}>
//                   {/* Chat input */}
//                   {/* <Box sx={{zIndex: 10, position: "fixed", bottom: 81, right: 100, }}>
//           <Picker theme={theme.palette.mode}  data={data} onEmojiSelect={console.log}/>
//           </Box> */}
//                   {/* Emoji BOX */}
//                   {/* <Box
//               sx={{
//                 display: openPicker ? "inline" : "none",
//                 zIndex: 10,
//                 position: "fixed",
//                 bottom: 70,
//                 right: 90,
//               }}
//             >
//               <EmojiPicker height={"400px"} width={"330px"} />
//             </Box> */}

//                   {/* <ChatInput
//           onChange={(e) => setMessage(e.target.value)}
//            setOpenPicker={setOpenPicker} /> */}

//                   <StyledInput
//                   value={message}
//                     type="text"
//                     placeholder="Send a message..."
//                     onChange={(e) => setMessage(e.target.value)}
//                   />

//                   {/* <input type="text" placeholder="Send a message..."
//            onChange={(e) => setMessage(e.target.value)}
//            /> */}
//                 </Stack>

//                 <Box
//                   sx={{
//                     height: 48,
//                     width: 48,
//                     backgroundColor: theme.palette.primary.main,
//                     borderRadius: 1.5,
//                   }}
//                 >
//                   <Stack
//                     sx={{ height: "100%", width: "100%" }}
//                     alignItems={"center"}
//                     justifyContent={"center"}
//                   >
//                     {/* Submit send message */}
//                     <IconButton type="submit">
//                       <PaperPlaneTilt color="#fff" />
//                     </IconButton>
//                   </Stack>
//                 </Box>
//               </Stack>
//             </Box>
//           </form>
//         </Stack>
//       )}
//     </>
//   );
// };

// const NoChatSelected = () => {
//   return (
//     <>
//       <Stack direction={"Column"} sx={{ width: "100%" }}>
//         <Typography fontSize={60} variant="subtitle1" align="center" mt={2}>Welcome to Zano</Typography>
//         <Typography fontSize={30} variant="body1" align="center" mt={2}>Select a chat to start messaging!</Typography>
//       </Stack>
//     </>
//   );
// };

// // const Footer = () => {
// //   const [message, setMessage] = useState("");
// //   const { loading, sendMessage } = useSendMessage();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!message) return;
// //     await socket.emit("sendMessage", { senderId, conversationId, message, type, messages });;
// //     setMessage("");
// //   };
// //   const theme = useTheme();
// //   const [openPicker, setOpenPicker] = React.useState(false);
// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <Box
// //         p={2}
// //         sx={{
// //           height: 100,
// //           width: "100%",
// //           backgroundColor:
// //             theme.palette.mode === "light"
// //               ? "#F8FAFF"
// //               : theme.palette.background.paper,
// //           boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
// //         }}
// //       >
// //         <Stack direction={"row"} alignItems={"center"} spacing={3}>
// //           <Stack sx={{ width: "100%" }}>
// //             {/* Chat input */}
// //             {/* <Box sx={{zIndex: 10, position: "fixed", bottom: 81, right: 100, }}>
// //           <Picker theme={theme.palette.mode}  data={data} onEmojiSelect={console.log}/>
// //           </Box> */}
// //             {/* Emoji BOX */}
// //             {/* <Box
// //               sx={{
// //                 display: openPicker ? "inline" : "none",
// //                 zIndex: 10,
// //                 position: "fixed",
// //                 bottom: 70,
// //                 right: 90,
// //               }}
// //             >
// //               <EmojiPicker height={"400px"} width={"330px"} />
// //             </Box> */}

// //             {/* <ChatInput
// //           onChange={(e) => setMessage(e.target.value)}
// //            setOpenPicker={setOpenPicker} /> */}

// //             <StyledInput
// //               type="text"
// //               placeholder="Send a message..."
// //               onChange={(e) => setMessage(e.target.value)}
// //             />

// //             {/* <input type="text" placeholder="Send a message..."
// //            onChange={(e) => setMessage(e.target.value)}
// //            /> */}
// //           </Stack>

// //           <Box
// //             sx={{
// //               height: 48,
// //               width: 48,
// //               backgroundColor: theme.palette.primary.main,
// //               borderRadius: 1.5,
// //             }}
// //           >
// //             <Stack
// //               sx={{ height: "100%", width: "100%" }}
// //               alignItems={"center"}
// //               justifyContent={"center"}
// //             >
// //               {/* Submit send message */}
// //               <IconButton type="submit">
// //                 <PaperPlaneTilt color="#fff" />
// //               </IconButton>
// //             </Stack>
// //           </Box>
// //         </Stack>
// //       </Box>
// //     </form>
// //   );
// // };

// const MESSAGES = () => {
//   const { GetMSGS, GetMSGLoading, receiverId } = useGetMessages();
//   const theme = useTheme();
//   // console.log(Array.isArray(messages));
//   return (

//     <Stack sx={{
//       overflowY: "scroll", // Kích hoạt thanh trượt khi nội dung vượt quá chiều cao
//       "&::-webkit-scrollbar": {
//         width: "8px", // Chiều rộng của thanh trượt
//       },
//       "&::-webkit-scrollbar-track": {
//         background: theme.palette.background.default, // Màu nền của thanh trượt
//       },
//       "&::-webkit-scrollbar-thumb": {
//         background: theme.palette.primary.main, // Màu của nút trượt
//         borderRadius: "4px", // Độ cong của nút trượt
//       },
//     }}
//     >
//       {/* {
//         !loading && Array.isArray(messages) && messages.length > 0 ? (
//           messages.map((conversation) =>
//             conversation.messages.map((message) => (
//               <Message key={message.id} message={message} />
//             ))
//           )
//         ) : loading ? (
//           // Placeholder khi đang tải
//           [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
//         ) : (
//           // Placeholder khi không có tin nhắn
//           <Typography align="center" fontSize={20} variant="body1">
//             Send a message to start the conversation!
//           </Typography>
//         )
//       } */}
//       {!GetMSGLoading && Array.isArray(GetMSGS) && GetMSGS.length > 0 && (
//         GetMSGS.map((message) => (
//           <Message key={message._id} message={message} />
//         ))
//       )}

//     </Stack>
//   );
// };
// export default MessageContainer
//   ;
