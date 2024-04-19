import React, { useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Button, Stack } from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import RHFText from "../../components/hook-form/RHFText";
import { useDispatch, useSelector } from "react-redux";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";
import GenderCheckbox from "../auth/GenderCheckBox";
import { FetchUserProfile } from "../../redux/slices/app";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import upDateUser from "../../hooks/upDateUser";
import updateUserProfile from "../../hooks/upDateUser";
const ProfileForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [defaultGender, setDefaultGender] = useState();
  const [genderValue, setGenderValue] = useState("");
  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    gender: Yup.string().oneOf(["male", "female"]).required("male or female"),
    birthDate: Yup.string().required("Name is required"),
    avatar: Yup.mixed().nullable(true).required("Avatar file is required"),
  });

  const avatar = localStorage.getItem("loginavatar");

  const name = localStorage.getItem("loginname");

  const birthDate = localStorage.getItem("loginbirthDate");

  useEffect(() => {
    const gender = localStorage.getItem("logingender");
    setDefaultGender(gender);
    setGenderValue(gender);
  }, []);

  const defaultValues = {
    avatar: avatar,
    name: name,
    gender: defaultGender,
    birthDate: birthDate,
  };
  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;
  const values = watch();

  // const onSubmit = async (data) => {
  //   // try {
  //   //   //   Send API request
  //   //   console.log("DATA", data);
  //   //   dispatch(
  //   //     UpdateUserProfile({
  //   //       firstName: data?.firstName,
  //   //       about: data?.about,
  //   //       avatar: file,
  //   //     })
  //   //   );
  //   // } catch (error) {
  //   //   console.error(error);
  //   // }
  // };
  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = methods.getValues();
  //   // Gọi hàm updateUserProfile với thông tin người dùng được nhập
  //   upDateUser(data);
  // };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    const data = methods.getValues();
    console.log(data) 
    try {
      await updateUserProfile(data); // Gọi hàm updateUser với dữ liệu từ form
      // Thực hiện các hành động sau khi update user thành công
    } catch (error) {
      // Xử lý lỗi nếu có
    }
  };


  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("avatar", newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const handleGenderChange = (e) => {
    setGenderValue(e.target.value); // Update gender value
    setValue("gender", e.target.value); // Update form value
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Stack spacing={3}>
          {/* AVATAR */}
          <RHFUploadAvatar
            name="avatar"
            maxSize={3145728}
            onDrop={handleDrop}
          />
          <Typography>Name:</Typography>
          <RHFTextField name="name" label="Name" helperText={""} />

          {/*GENDER*/}
          <Typography>Gender:</Typography>

          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={genderValue}
              onChange={handleGenderChange} 

            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>

          {/*Birth day*/}
          <Typography>Birth date (M/D/Y):</Typography>
          <RHFText name="birthDate" type="date" />
        </Stack>
        <Stack direction={"row"} justifyContent={"end"}>
          <Button color="primary" size="large" type="submit" variant="outlined">
            Save
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
