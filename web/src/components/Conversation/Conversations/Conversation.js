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
import axios from "../../../utils/axios";
import { Divide } from "phosphor-react";
const handleClick = () => { };

const Conversation = ({ conversation, lastIdx, isCreateConversation }) => {
  const theme = useTheme();
  const { selectedConversation, setSelectedConversation, socket } = useConversation();
  const [receiver, setReceiver] = useState([]);
  const [isGroup, setIsGroup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (conversation) { // Kiểm tra xem conversation có tồn tại không
        const senderId = localStorage.getItem("loginId");
        if (conversation.isGroupChat) {
          const NewReceiver = {
            _id: conversation._id,
            name: conversation.name,
            avatar: conversation.avatar,
          };
          setIsGroup(true);
          setReceiver(NewReceiver);
        } else if (!conversation.isGroupChat) {
          for (let i = 0; i < conversation.participants.length; i++) {
            if (conversation.participants[i]._id != senderId) {
              const NewReceiver = {
                _id: conversation.participants[i]._id,
                name: conversation.participants[i].name,
                avatar: conversation.participants[i].avatar,
              };
              setReceiver(NewReceiver);
              //  console.log("receiver",NewReceiver);
            }
          }
        }
      }
    };

    fetchData();
  }, [conversation]);

  // const {onlineUsers} = useSocketContext();
  // const isOnline = onlineUsers.includes(conversation._id)
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <>
      {conversation && ( // Kiểm tra conversation có tồn tại và không phải là undefined
        <Box
          onClick={() => setSelectedConversation(conversation)}
          sx={{
            cursor: "pointer",
            width: "100%",
            borderRadius: 1,
            backgroundColor: isSelected
              ? theme.palette.primary.main
              : theme.palette.mode === "light",
          }}
          p={2}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={2}>
              {receiver && ( // Kiểm tra xem có người nhận không
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar src={receiver.avatar} alt="" />
                </StyledBadge>
              )}
              <Stack spacing={0.3}>
                {receiver && !isGroup ? ( // Kiểm tra xem có người nhận không
                  <Typography variant="subtitle2">{receiver.name}</Typography>
                ) : (
                  <Typography variant="subtitle2">Group: {conversation.name}</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

        </Box>
      )}
      <Divider />
    </>
  );
};
export default Conversation;
