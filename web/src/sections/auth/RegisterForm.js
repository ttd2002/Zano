import React, { useState, useCallback, useEffect } from "react";
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
import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";
import useSignup from "../../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState();
  const [avatarFile, setAvatarFile] = useState(null);

  const [inputs, setInputs] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthDate: "",
    avatar: null,
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
    confirmPassword: "",
    gender: "",
    birthDate: "",
    avatar: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const {setValue, reset, setError, formState: { errors } } = methods;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setAvatarFile(file);
      if (file) {
        setInputs((prevInputs) => ({ ...prevInputs, avatar: file }));
        setValue("avatar", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );


  const { signup } = useSignup(navigate);
  const formData = new FormData();

  const formatDate = (date) => {
    if (!date) return ""; // Trường hợp giá trị là null hoặc undefined
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const birthDate = formatDate(inputs.birthDate);
    formData.append("name", inputs.name);
    formData.append("phone", inputs.phone);
    formData.append("password", inputs.password);
    formData.append("confirmPassword", inputs.confirmPassword);
    formData.append("gender", inputs.gender);
    formData.append("birthDate", birthDate);
    formData.append("avatar", file);
    // const formDataObject = Object.fromEntries(formData);
    // console.log("form data", formDataObject);
    // console.log("avatarPreview", avatarPreview);
    await signup({ formData });
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <RHFTextField
          name="name"
          label="Name"
          value={inputs.name}
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        />
        <RHFTextField
          name="phone"
          label="Phone number"
          value={inputs.phone}
          onChange={(e) => setInputs({ ...inputs, phone: e.target.value })}
        />
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
        <GenderCheckbox
          value={inputs.gender}
          onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
        />
        <Typography variant="subtitle1">Birthday</Typography>
        <RHFText
          value={inputs.birthDate}
          onChange={(e) => setInputs({ ...inputs, birthDate: e.target.value })}
          name="birthDate"
          type="date"
        />
        <Typography variant="subtitle1">Avatar</Typography>
        <RHFUploadAvatar
          value={avatarFile}
          onDrop={handleDrop}
          name="avatar"
        />
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
