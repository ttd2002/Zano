import { faker } from "@faker-js/faker";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import StyledBadge from "./StyledBadge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  VideoCamera,
} from "phosphor-react";
import { scrollElements, showScrollbars } from "./Scrollbar";

const CallLogElement = ({ online, incoming, missed }) => {
  const theme = useTheme();
  useEffect(() => {
    scrollElements.forEach((el) => {
      el.addEventListener("scroll", showScrollbars);
      // el.addEventListener("mouseenter", showScrollbars);

      return () => {
        el.removeEventListener("scroll", showScrollbars);
        // el.removeEventListener("mouseenter", showScrollbars);
      };
    });
  }, []); // Chạy một lần sau khi component được render
  return (
    <>
      <Stack>
        {/* left */}
        <Box
          onScroll={showScrollbars}
          data-scrollbars
          direction={"column"}
          sx={{
            p: 2,
            width: "100%",
            borderRadius: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#fff"
                : theme.palette.background.default,
            flexGrow: 1,
            overflowY: "scroll",
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
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{}}>
              {online ? (
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar src={faker.image.avatar()} />
                </StyledBadge>
              ) : (
                <Avatar
                  src={faker.image.avatar()}
                  alt={faker.name.fullName()}
                />
              )}
              <Stack spacing={0.3}>
                <Typography variant="subtitle2">
                  {faker.name.fullName()}
                </Typography>
                {/* <Typography variant="caption">{msg}</Typography> */}
                <Stack direction={"row"} alignItems={"center"} spacing={1}>
                  {incoming ? (
                    <ArrowDownLeft color={missed ? "red" : "green"} />
                  ) : (
                    <ArrowUpRight color={missed ? "red" : "green"} />
                  )}
                  <Typography variant="caption">Yesterday 2AM</Typography>
                </Stack>
              </Stack>
            </Stack>
            <IconButton>
              <Phone color="blue" />
            </IconButton>
          </Stack>
        </Box>
        {/* right */}
      </Stack>
    </>
  );
};

const CallElement = ({ online }) => {
  const theme = useTheme();
  return (
    <Box
      onScroll={showScrollbars}
      data-scrollbars
      direction={"column"}
      sx={{
        p: 2,
        width: "100%",
        borderRadius: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
        flexGrow: 1,
        overflowY: "scroll",
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
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2} sx={{}}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
          )}

          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{faker.name.fullName()}</Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} alignItems={"center"}>
          <IconButton>
            <Phone color="blue" />
          </IconButton>
          <IconButton>
            <VideoCamera color="blue" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};
export { CallLogElement, CallElement };
