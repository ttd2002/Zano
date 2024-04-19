import React, { useState, useEffect  } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Eye, EyeSlash } from "phosphor-react";
import { LoginUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{6,}$/, "Phone number must be 6 or more digits"),
    password: Yup.string().required("Password is required"),
  });
  
  
  const defaultValues = {
    phone: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      //submit data backend
      //api call
      dispatch(LoginUser(data))

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
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("SigupUser"));
    if (storedUser) {
      setValue("phone", storedUser.phone);
      setValue("password", storedUser.password);
    }
  }, [setValue]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <RHFTextField name="phone" label="Phone number" 
        />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to="/auth/reset-password"
          variant="body2"
          color={"inherit"}
          underline="always"
        >
          Forgot Password?
        </Link>
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
        Login
      </Button>
    </FormProvider>
  );
};

export default LoginForm;
