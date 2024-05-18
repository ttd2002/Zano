import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, Button, Stack } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import { resetPassword } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";
const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState(""); // State for phone number
  
  
  const ResetPasswordSchema = Yup.object().shape({
    phone: Yup.string().required("Phone is required"),
  });

  const defaultValues = {
    phone: "",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      //submit data backend
      dispatch(resetPassword(data));
    } catch (error) {
      console.log(error);
    }
  };

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}> 
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        {/* <RHFTextField name="phone" label="Phone number " /> */}
        <PhoneInput country={"vn"} value={phone} onChange={setPhone} />
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
          Send
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default ResetPasswordForm;
