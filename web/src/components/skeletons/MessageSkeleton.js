import React from "react";
import { Skeleton, Box, Stack } from "@mui/material";

const MessageSkeleton = () => {
  return (
    <>
      <Stack direction="row" gap={3} alignItems="center">
        <Box sx={{ width: 40, height: 40 }}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        <Stack direction="column" gap={1}>
          <Skeleton variant="rectangular" width={240} height={16} />
          <Skeleton variant="rectangular" width={240} height={16} />
        </Stack>
      </Stack>
      <Stack direction="row-reverse" gap={3} alignItems="center">
        <Stack direction="column" gap={1}>
          <Skeleton variant="rectangular" width={240} height={16} />
        </Stack>
        <Box sx={{ width: 40, height: 40 }}>
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Stack>
    </>
  );
};

export default MessageSkeleton;
