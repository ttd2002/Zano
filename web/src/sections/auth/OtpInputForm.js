import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import styles from './CustomOtpInput.module.css';
import { Alert, Button, Stack, Typography } from "@mui/material";
import OtpInput from "react-otp-input";

// const handleResendOtp = () => {
// };
// const ResendOtp = ({ onClick }) => {
//   return (
//     <Stack direction="row" alignItems="center" spacing={2}>
//       <Typography variant="body1">
//         Didn't receive the OTP? Click below to resend:
//       </Typography>
//       <Button variant="text" color="primary" onClick={onClick}>
//         Resend OTP
//       </Button>
//     </Stack>
//   );
// };
const OtpInputForm = () => {
  const [otp, setOtp] = useState();
  const [resendTimer, setResendTimer] = useState(0);
  const OTPSchema = Yup.object().shape({
    OTP: Yup.string().required("OTP is required"),
  });

  const defaultValues = {
    OTP: "",
  };

  const methods = useForm({
    resolver: yupResolver(OTPSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      //submit data backend
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    let intervalId;
    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [resendTimer]);
  const handleResendOtp = () => {
    // Kiểm tra nếu đang đếm thời gian resend thì không cho gửi lại
    if (resendTimer > 0) return;
    
    // Gửi OTP lại và set thời gian resend
    console.log('Resend OTP');
    setResendTimer(60); // 60 giây
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
      {errors.OTP && <Alert severity="error">{errors.OTP.message}</Alert>}
        <Stack direction={"row"} justifyContent={"center"}>
        
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="number"
            shouldAutoFocus={true}
            renderSeparator={<span>.</span>}
            renderInput={(props) => <input {...props} />}
            aria-label="OTP Input"
            classname="otp-container"
            inputStyle={styles['otp-input']}
            
     
          />  
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center">
          {resendTimer === 0 ? (
            <Typography variant="body1">
              Didn't receive the OTP? Click below to resend:
            </Typography>
          ) : (
            <Typography variant="body1">
              Resend OTP in {resendTimer} seconds
            </Typography>
          )}
          <Button
            variant="text"
            color="primary"
            onClick={handleResendOtp}
            disabled={resendTimer > 0} // Không cho click nếu đang đếm thời gian
          >
            Resend OTP
          </Button>
        </Stack>
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
          }}
        >
          VERIFY
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default OtpInputForm;
