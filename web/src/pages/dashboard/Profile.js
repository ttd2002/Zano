import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { CaretLeft, Chats } from "phosphor-react";
import React, { useEffect } from "react";
import ProfileForm from "../../sections/setting/ProfileForm";
import { useDispatch } from "react-redux";
import { FetchUserProfile } from "../../redux/slices/app";
import { useNavigate } from "react-router-dom";
const Profile = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
        }}
      >
        {/* Left panel */}
        <Box
          sx={{
            overflowY: "hidden",

            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,

            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            {/* header */}
            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <IconButton >
                <CaretLeft size={25} colorRendering={"#4B4B4B"} onClick={() => {
                  navigate("/app");
                }} />
              </IconButton>
              <Typography variant="h5">Edit Profile</Typography>
            </Stack>
            {/* profile form */}
            <ProfileForm />
          </Stack>
        </Box>
        {/* RIght panel */}
        <Box
          sx={{
            flex: 1, /* Chiếm toàn bộ không gian còn lại */
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
          }}
        >
           <Stack
        direction={"Column"}
        justifyContent="center" // Canh giữa theo chiều dọc
        alignItems="center"
        sx={{ width: "100%" , mt: "10%" }}
      >
        <Chats size={200} />
        <Typography fontSize={60} variant="subtitle1" align="center" mt={2}>
          Welcome to Zano
        </Typography>

      </Stack>
        </Box>

      </Stack>
    </>
  );
};

export default Profile;
