import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import GenderCheckbox from "./GenderCheckBox";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Eye, EyeSlash } from "phosphor-react";
import RHFText from "../../components/hook-form/RHFText";
// import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";
import useSignup from "../../hooks/useSignup";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
    avatar: "",
  });

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Confirm password is required"),
    gender: Yup.string().oneOf(["male", "female"]),
    birthDate: Yup.date().required("Birth Date is required"),
    avatar: Yup.mixed().nullable(),
  });

  const defaultValues = {
    name: "",
    phone: "",
    password: "",
    confirmpassword: "",
    gender: "",
    birthDate: "",
    avatar: "",
  };
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  // const formatDateToString = (date) => {
  //   const d = new Date(date);
  //   const year = d.getFullYear();
  //   const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  //   const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  //   return `${month}/${day}/${year}`;
  // };
  const navigate = useNavigate();
  

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
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const { loading, signup } = useSignup(navigate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        {/* name */}
        <RHFTextField
          name="name"
          label="Name"
          value={inputs.name}
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        />
        {/* phone */}
        <RHFTextField
          name="phone"
          label="Phone number"
          value={inputs.phone}
          onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
        />
        {/* password */}
        <RHFTextField
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
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
        {/* confirm password */}
        <RHFTextField
          value={inputs.confirmPassword}
          onChange={(e) =>
            setInputs({ ...inputs, confirmPassword: e.target.value })
          }
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
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
        <Typography variant="subtitle1">Gender:</Typography>
        {/* Gender */}
        <GenderCheckbox
          value={inputs.gender}
          onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
        />

        <Typography variant="subtitle1">Birthday</Typography>
        {/* birthday */}
        <RHFText
          value={inputs.birthDate}
          onChange={(e) => setInputs({ ...inputs, birthDate: e.target.value })}
          name="birthDate"
          type="date"
        />

        {/* <Typography variant="subtitle1">Avatar</Typography> */}

        {/* <RHFUploadAvatar
          value={inputs.avatar}
          onChange={(avatar) => setInputs({ ...inputs, avatar })} // Sử dụng setInputs để cập nhật giá trị avatar
          name="avatar"
        /> */}

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
          Create Account
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
