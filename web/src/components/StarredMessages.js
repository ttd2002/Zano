import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../redux/slices/app";

const StarredMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    // head
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction={"row"}
            alignItems={"center"}
            spacing={3}
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">STARRED MESSAGES</Typography>
          </Stack>
        </Box>

        {/* body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: "8px", // chiều rộng của thanh cuộn
            },
            "&:-webkit-scrollbar-track": {
              background: "#f1f1f1", // màu nền của thanh cuộn
            },
            "&:-webkit-scrollbar-thumb": {
              background: "#888", // màu của thanh cuộn
            },
            "&:-webkit-scrollbar-thumb:hover": {
              background: "#555", // màu của thanh cuộn khi di chuột qua
            },
            "&.is-scrolling": {
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.primary.main, // màu của thanh cuộn khi đang cuộn
                borderRadius: 10,
              },
            },
          }}
          p={3}
          spacing={3}
        >
           
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMessages;
