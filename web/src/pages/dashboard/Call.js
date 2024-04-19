import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Search from "../../components/Search/Search";
import SearchIconWrapper from "../../components/Search/SearchIconWrapper";
import { MagnifyingGlass, Plus } from "phosphor-react";
import StyledInputBase from "../../components/Search/StyledInputBase";
import { showScrollbars } from "../../components/Scrollbar";
import { CallLogElement } from "../../components/CallElement";
import { CallLogs } from "../../data";
import StartCall from "../../sections/main/StartCall";

const Call = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const handeCloseDialog = () => {
    setOpenDialog(false);
  };

  const theme = useTheme();
  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* Left */}
        <Box
          sx={{
            height: "100vh",
            width: 310,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background.paper,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack>
              <Typography variant="h5">Calls Logs</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="subtitle2" component={Link}>
                Start a new conversation
              </Typography>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              spacing={2}
              onScroll={showScrollbars}
              data-scrollbars
              sx={{
                flexGrow: 1,
                overflowY: "scroll",
                height: "100%",
                "&::-webkit-scrollbar": {
                  width: "8px", // chiều rộng của thanh cuộn
                },
                "&:-webkit-scrollbar-track": {
                  background: "pink", // màu nền của thanh cuộn
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
            >
              {/* Bar */}
              <Stack spacing={2.5}>
                {/* Calllog */}
                {CallLogs.map((el) => (
                  <CallLogElement {...el} online={true} />
                ))}

                {/*  */}
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {/* Right */}
        {/* Reuse conversation */}
      </Stack>
      {openDialog && (
        <StartCall open={openDialog} handleClose={handeCloseDialog} />
      )}
    </>
  );
};

export default Call;
