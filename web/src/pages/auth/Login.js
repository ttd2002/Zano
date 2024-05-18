import React from "react";
import { Link, Stack, Typography } from "@mui/material";
import { Link as Routerlink } from "react-router-dom";
import LoginForm from "../../sections/auth/LoginForm";
const Login = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Login to Zano</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">New User?</Typography>
          <Link to="/auth/register" component={Routerlink} variant="subtitle2">
            Create an account
          </Link>
        </Stack>
        {/* Login form */}
        <LoginForm />
      </Stack>
    </>
  );
};

export default Login;
