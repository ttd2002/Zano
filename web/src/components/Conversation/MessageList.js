import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getMessages } from "../../redux/slices/messageSlice";

const MessageList = ({ userId }) => {
  const messages = useSelector((state) => state.messages.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    // Khi component được render, gọi action để lấy tin nhắn giữa userId và người đăng nhập
    dispatch(getMessages(userId));
  }, [dispatch, userId]);

// useEffect(() => {
//   if (userId) {
//     dispatch(getMessages(userId));
//   }
// }, [dispatch, userId]);
  return (
    <Box>
      {messages.length === 0 ? (
        <Typography variant="body1">No messages yet.</Typography>
      ) : (
        messages.map((message) => (
          <div key={message._id}>
            {/* Hiển thị nội dung của tin nhắn */}
            <Typography variant="body1">{message.content}</Typography>
            {/* Hiển thị hình ảnh nếu có */}
            {message.image &&
              message.image.map((imageUrl) => (
                <img key={imageUrl} src={imageUrl} alt="message" />
              ))}
          </div>
        ))
      )}
    </Box>
  );
};

export default MessageList;
