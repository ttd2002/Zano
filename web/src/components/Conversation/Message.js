import React, { useEffect, useState } from "react";
import { Avatar, Divider, Stack, Typography, useTheme, Image } from "@mui/material";
import { extractTime } from "../../utils/extractTime";
import { Theme } from "emoji-picker-react";
import useConversation from "../../zustand/useConversation";
// import { useConversation } from "../../zustand/useConversation";
const Message = ({ message }) => {
  //const authUser = JSON.parse(localStorage.getItem("user"));
  const loginUserId = localStorage.getItem("loginId");
  const loginAvatar = localStorage.getItem("loginavatar");
  const loginname = localStorage.getItem("loginname");
  const { selectedConversation, setSelectedConversation, } = useConversation();
  const [receiver, setReceiver] = useState([]);
  useEffect(() => {
    if (selectedConversation && !selectedConversation.isGroupChat) {
      const senderId = localStorage.getItem("loginId");
      for (let i = 0; i < selectedConversation.participants.length; i++) {
        if (selectedConversation.participants[i]._id != senderId) {
          const NewReceiver = {
            _id: selectedConversation.participants[i]._id,
            name: selectedConversation.participants[i].name,
            avatar: selectedConversation.participants[i].avatar,
          }
          setReceiver(NewReceiver);
          //  console.log("receiver",NewReceiver);
        }
      }
    }
  }, [selectedConversation]);
  // console.log("Message:",message);
  //console.log("receiver:",receiver);
  const fromMe = message.senderId === loginUserId;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? loginAvatar : receiver.avatar;
  //  const receiverpic = receiver.avatar;
  // const bubbleBgcolor = fromMe ? "blue" : "";
  const formmattedTime = extractTime(message.createdAt)
  const theme = useTheme();
  // const messageID = message._id;
  // console.log("loginID",loginUserId);
  // console.log("avatar",loginAvatar);
  // console.log("fromme",fromMe);
  // console.log("profile",profilePic);

  // console.log(messageID);
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
        messageContent = <div style={{  height: 50 }}>
          {/*  //<Typography color={"green"} variant="caption">
            {fromMe ? loginname : receiver.name}

          </Typography> */}
          <div>
          <Typography color={"green"} variant="caption">
            {fromMe ? loginname : receiver.name}
            </Typography>
          </div>
          <div>
            {message.message}

          </div>
        </div>

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
      {/* <Typography color={"green"} variant="caption">
        {fromMe ? loginname : receiver.name}
      </Typography> */}
      <Avatar alt="" src={profilePic} sx={{
        marginRight: fromMe ? 2 : 0,
        marginLeft: fromMe ? 0 : 2,
      }} />
      <Typography
        variant="body1"
        sx={{
          backgroundColor: fromMe ? "#e2e7e3" : "#fff", // Màu xám nếu fromMe, trắng nếu không
          color: "black",
          borderRadius: "8px",
          py: 1,
          px: 2,
          whiteSpace: "pre-wrap",
          maxWidth: "60%",
          height: 'auto',
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

export default Message;
