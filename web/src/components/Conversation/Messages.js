import React from "react";
import { Box, Stack, useTheme, Typography } from "@mui/material";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const Messages = () => {


  const { messages, loading } = useGetMessages();
  const theme = useTheme();
  console.log("test",messages)
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
      {/* {
        !loading && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((conversation) =>
            conversation.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))
          )
        ) : loading ? (
          // Placeholder khi đang tải
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
        ) : (
          // Placeholder khi không có tin nhắn
          <Typography align="center" fontSize={20} variant="body1">
            Send a message to start the conversation!
          </Typography>
        )
      } */}
      {!loading && Array.isArray(messages) && messages.length > 0 && (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      )}
      

      
    </Stack>
  );
};

export default Messages;
