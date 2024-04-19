import React, { useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  Badge,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import StyledBadge from "../../StyledBadge";
import useConversation from "../../../zustand/useConversation";
// import { useConversation } from "../../../zustand/useConversation";

const handleClick = () => {
};

const Conversation = ({conversation, lastIdx}) => {
  const theme = useTheme();
  const {selectedConversation, setSelectedConversation,} = useConversation(); 
  const [receiver, setReceiver] = useState([]);
  useEffect(() => {
    if(conversation && !conversation.isGroupChat){
      const senderId = localStorage.getItem("loginId");    
      for(let i = 0; i < conversation.participants.length; i++){
        if (conversation.participants[i]._id != senderId){
          const NewReceiver= {
            _id: conversation.participants[i]._id,
            name: conversation.participants[i].name,
            avatar: conversation.participants[i].avatar,
          }
          setReceiver(NewReceiver);
        //  console.log("receiver",NewReceiver);
        }
      }
    }
  }, [conversation]);

   

    // const {onlineUsers} = useSocketContext();
    // const isOnline = onlineUsers.includes(conversation._id)
    const isSelected = selectedConversation?._id === conversation._id;
  //onst selectedUser = JSON.parse(selectedConversation);
  //console.log(selectedUser);
  // localStorage.setItem("selectedConversation", selectedUser._id);

    
  //  console.log(selectedConversation);

    //const avatar = selectedConversation.avatar;
    
    //console.log(avatar);
  return (
    <>
      <Box
        onClick={()=>setSelectedConversation(conversation)}
        sx={{
          cursor: "pointer",
          width: "100%",
          borderRadius: 1,

          backgroundColor: isSelected ? theme.palette.primary.main : 
            theme.palette.mode === "light"
        }}
        p={2}
      ><Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack direction={"row"} spacing={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          {/* user.avatar */}
          <Avatar src={receiver.avatar} alt="" />
        </StyledBadge>
        {/*User Name - msgs*/}
        <Stack spacing={0.3}>
          <Typography variant="subtitle2">{receiver.name}</Typography>
          {/* <Typography variant="caption">user.messages </Typography> */}
        </Stack>
      </Stack>
    </Stack>
      
      </Box>
    </>
  );
};
export default Conversation;