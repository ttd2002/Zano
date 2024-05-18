import React, { useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  Stack,
  Typography,
  useTheme,
  Image,
  Menu,
  MenuItem,
} from "@mui/material";
import { extractTime } from "../../utils/extractTime";
import { Theme } from "emoji-picker-react";
import useConversation from "../../zustand/useConversation";
import { DotsThreeVertical } from "phosphor-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
// import { Message_options } from "../../data";
// import { useConversation } from "../../zustand/useConversation";
const Message_options = [
  {
    title: "Reply",
  },
  {
    title: "React to message",
  },
  {
    title: "Forward message",
  },
  {
    title: "Star message",
  },
  {
    title: "Recall Message",
  },
  {
    title: "Delete Message",
  },
];
const Message = ({ message, onRecallMessage, isRecalled, setIsRecalled }) => {
  //const authUser = JSON.parse(localStorage.getItem("user"));
  const loginUserId = localStorage.getItem("loginId");
  const loginAvatar = localStorage.getItem("loginavatar");
  const loginname = localStorage.getItem("loginname");
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [receiver, setReceiver] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  useEffect(() => {
    if (selectedConversation) {
      const senderId = localStorage.getItem("loginId");
      if (selectedConversation.isGroupChat) {
        const NewReceiver = {
          _id: selectedConversation._id,
          name: selectedConversation.name,
          avatar: selectedConversation.avatar,
        };
        setReceiver(NewReceiver);
        // }
        // setMessages(selectedConversation.messages);
      } else if (!selectedConversation.isGroupChat) {
        for (let i = 0; i < selectedConversation.participants.length; i++) {
          if (selectedConversation.participants[i]._id != senderId) {
            const NewReceiver = {
              _id: selectedConversation.participants[i]._id,
              name: selectedConversation.participants[i].name,
              avatar: selectedConversation.participants[i].avatar,
            };
            setReceiver(NewReceiver);
            // setMessages(selectedConversation.messages);
            //  console.log("receiver",NewReceiver);
          }
        }
      }
    }
  }, [selectedConversation]);
  // console.log("Message:",message);
  //console.log("receiver:",receiver);
  const fromMe = message.senderId === loginUserId;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? loginAvatar
    : selectedConversation.isGroupChat
    ? selectedConversation.participants.find(
        (participant) => participant._id === message.senderId
      )?.avatar
    : receiver.avatar;

  // const profilePic = fromMe ? loginAvatar : message.senderAvatar;
  //  const receiverpic = receiver.avatar;
  // const bubbleBgcolor = fromMe ? "blue" : "";
  const formmattedTime = extractTime(message.createdAt);
  const theme = useTheme();
  // const messageID = message._id;
  // console.log("loginID",loginUserId);
  // console.log("avatar",loginAvatar);
  // console.log("fromme",fromMe);
  // console.log("profile",profilePic);

  // console.log(messageID);
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return require("../../assets/Images/pdf.png");
      case "doc":
      case "docx":
        return require("../../assets/Images/dox.png");
      case "xls":
      case "xlsx":
        return require("../../assets/Images/excel.jpg");
      case "ppt":
      case "pptx":
        return require("../../assets/Images/pp.png");
      default:
        return require("../../assets/Images/dox.png");
    }
  };
  const getContent = (type) => {
    let messageContent;
    let userName = (
      <div style={{ marginRight: fromMe ? 2 : 0, marginLeft: fromMe ? 0 : 2 }}>
        <Typography color={"primary"} variant="caption">
          {/* {fromMe ? loginname : receiver.name} */}
          {fromMe
            ? loginname
            : selectedConversation.isGroupChat
            ? selectedConversation.participants.find(
                (participant) => participant._id === message.senderId
              )?.name
            : receiver.name}
        </Typography>
      </div>
    );
    switch (type) {
      case "text":
        userName = (
          <div>
            <Typography color={"primary"} variant="caption">
              {/* {fromMe ? loginname : receiver.name} */}
              {fromMe
                ? loginname
                : selectedConversation.isGroupChat
                ? selectedConversation.participants.find(
                    (participant) => participant._id === message.senderId
                  )?.name
                : receiver.name}
            </Typography>
          </div>
        );
        messageContent = (
          
          <div>
            <div>{message.message}</div>
          </div>
        );

        break;
      case "image":
        messageContent = (
          <img
            src={message.message}
            style={{ maxWidth: 300, maxHeight: 300 }}
          />
        );
        break;
      case "video":
        messageContent = (
          <video controls width="100%" height="300">
            <source src={message.message} type="video/mp4" />
          </video>
        );
        break;
      case "voice":
        messageContent = (
          <audio id="audioPlayer" controls>
            <source src={message.message} type="audio/mpeg" />
          </audio>
        );

        break;
      case "file":
        messageContent = (
          <a href={message.message} target="_blank" rel="noopener noreferrer">
            <img
              src={getFileIcon(
                message.message.substring(message.message.lastIndexOf(".") + 1)
              )}
              style={{ maxWidth: 50, maxHeight: 50 }}
            />
          </a>
        );
        break;
      default:
        messageContent = message.message;
    }
    return { messageContent, userName };
  };
  // useEffect(() => {
  //   // Kiểm tra nếu tin nhắn đã bị thu hồi, cập nhật state isRecalled
  //   if (message.recall) {
  //     setIsRecalled(true);
  //   }
  // }, [message]);

  const handleMenuItemClick = (title) => {
    // console.log("Selected menu item:", title);
    // handleClose(); // Đóng Menu sau khi chọn
    switch (title) {
      case "Recall Message":
        if (!fromMe) {
          toast.error("You can only recall you own messages");
        } else {
          onRecallMessage(message._id);
          handleClose();
        }
        break;
      case "Delete Message":
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this message?"
        );
        if (confirmDelete) {
          try {
            const response = axios
              .post("/mes/deleteMessage", {
                conversationId: selectedConversation._id,
                messageId: message._id,
                currentUserId: loginUserId,
              })
              .then((res) => {
                // console.log("Delete message successfully", res.data);
                setIsDeleted(true);
                toast.success("Delete message successfully");
              });
          } catch (error) {
            console.log("error delete message", error);
            toast.error("Failed to delete message");
          }
        }
        break;
      default:
        break;
    }
  };
  const filteredMessageOptions = fromMe
  ? Message_options
  : Message_options.filter((option) => option.title !== "Recall Message");
  return (
    !isDeleted && (
      <Stack
        className={`chat ${chatClassName}`}
        direction={fromMe ? "row-reverse" : "row"}
        alignItems="flex-end"
        spacing={1}
        mt={2}
      >
        <Avatar
          alt=""
          src={profilePic}
          sx={{
            marginRight: fromMe ? 2 : 0,
            marginLeft: fromMe ? 0 : 2,
          }}
        />
        <div
          style={{
            maxWidth: "50%",
            heigh: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: fromMe ? "flex-end" : "flex-start",
          }}
        >
          {getContent(message.type).userName}
          {message.recall ? (
            <Typography
              variant="body1"
              sx={{
                backgroundColor: fromMe ? "#fff" : "#00CCFF",
                color: fromMe ? "#CCCCCC" : "#444440",
                borderRadius: "8px",
                py: 0.5,
                px: 0.5,
                whiteSpace: "pre-wrap",
                height: "auto",
                width: "100%",
              }}
              style={{
                wordWrap: "break-word",
              }}
            >
              {getContent(message.type).messageContent}
            </Typography>
          ) : (
            <Typography
              variant="body1"
              sx={{
                backgroundColor: fromMe ? "#fff" : "#00CCFF",
                color: fromMe ? "black" : "white",
                borderRadius: "8px",
                py: 0.5,
                px: 0.5,
                whiteSpace: "pre-wrap",
                height: "auto",
                width: "100%",
              }}
              style={{
                wordWrap: "break-word",
              }}
            >
              {getContent(message.type).messageContent}
            </Typography>
          )}
        </div>
        {!message.recall && (
          <DotsThreeVertical
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            size={20}
            cursor="pointer"
            style={{ marginLeft: 5, marginTop: "auto" }}
          />
        )}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Stack spacing={1} px={1}>
          {filteredMessageOptions.map((el) => (
              <MenuItem
                key={el.title}
                onClick={() => handleMenuItemClick(el.title)}
              >
                {el.title}
              </MenuItem>
            ))}
          </Stack>
        </Menu>
      </Stack>
    )
  );
};

export default Message;
