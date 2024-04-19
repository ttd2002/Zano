import { faker } from "@faker-js/faker";
import { Avatar, Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import StyledBadge from "./StyledBadge";

const ChatElement = ({ name, msg, avatar, online}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
    >
      {/*Badge green dot  */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"row"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
            <Avatar src={avatar} alt="" />
            </StyledBadge>
          ) : (
            <Avatar />
          )}

          {/*User Name - msgs*/}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            {/* <Typography variant="caption">{msg}</Typography> */}
          </Stack>
        </Stack>

        {/*Time*/}
        <Stack spacing={2} alignItems={"center"}>
          {/* <Typography sx={{ fontWeight: 900 }} variant="caption">
            {time}
          </Typography> */}
          {/* <Badge color="primary" badgeContent={unread}></Badge> */}
        </Stack>
      </Stack>
    </Box>
  );
};
export default ChatElement;
