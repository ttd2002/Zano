import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, Users, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
import useConversation from "../../zustand/useConversation";
import { setSelectedConversation } from "../../redux/slices/conversationSlice";
import Members from "../../sections/main/Members";
//import {Conversation} from "../Conversation/Conversations/Conversation.js""

const Header = (receiver) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
 // console.log("Selected:",selectedConversation);
  const [isGroupChat, setIsGroupChat] = useState(false);
  useEffect(() => {
    if (selectedConversation) {
      // Kiểm tra nếu selectedConversation là group chat
      setIsGroupChat(selectedConversation.isGroupChat === true);
    }
  }, [selectedConversation]);
  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
  };
  const handleOpenGroupDialog = () => {
    setOpenGroupDialog(true);
  };
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  
  return (
    <>
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
          onClick={() => {
            //
            dispatch(ToggleSidebar());
          }}
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
              <Avatar src={receiver.receiver.avatar} alt="" />
            </StyledBadge>
            {/* User */}
          </Box>

          <Stack spacing={0.2}>
            <Typography variant="subtitle2">
            {receiver.receiver.name}
            </Typography>
            {/* <Typography variant="caption">Online</Typography> */}
          </Stack>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} spacing={3}>

        {isGroupChat && ( // Hiển thị IconButton Users nếu là group chat
              <IconButton onClick={handleOpenGroupDialog}>
                <Users />
              </IconButton>
            )}
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
     {openGroupDialog && (
      <Members
        open={openGroupDialog}
        handleClose={handleCloseGroupDialog}
      />
    )}
    </>
  );
};

export default Header;
