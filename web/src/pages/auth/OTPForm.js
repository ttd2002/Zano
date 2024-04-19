import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { CaretLeft } from "phosphor-react";
import OtpInputForm from "../../sections/auth/OtpInputForm";

const ResetPassword = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
        OTP Verification 
        </Typography>
        {/* <Typography sx={{ color: "text.secondary", mb: 5 }}>
         Enter the OTP below to verify it.
        </Typography> */}
        <OtpInputForm/>
        
        <Link
          component={RouterLink}
          to="/auth/login"
          color={"inherit"}
          variant="subtitle2"
          sx={{ mt: 3, mx: "auto", alignItems: "center", display: "inline" }}
        >
          <CaretLeft />
          Return to sign in
        </Link>
      </Stack>
    </>
  );
};

export default ResetPassword;