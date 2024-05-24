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
// import GenderCheckbox from "../auth/GenderCheckBox";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import updateUserProfile from "../../hooks/upDateUser";
import { fetchUserProfile } from "../../redux/slices/userSlice";
const ProfileForm = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [defaultGender, setDefaultGender] = useState();
  const [genderValue, setGenderValue] = useState("");
  const [loading, setLoading] = useState(false);

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    gender: Yup.string().oneOf(["male", "female"]).required("male or female"),
    birthDate: Yup.string().required("Name is required"),
    avatar: Yup.mixed().nullable(true).required("Avatar file is required"),
  });
  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      avatar: "",
      name: "",
      gender: "",
      birthDate: "",
    },
  });
  const { setValue, handleSubmit } = methods;


  const formatDate = (date) => {
    if (!date) return ""; // Trường hợp giá trị là null hoặc undefined
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };
  const formatDateToISO = (date) => {
    if (!date) return ""; // Trường hợp giá trị là null hoặc undefined
    const parts = date.split("/");
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchUserProfile());
        const birthDate = formatDateToISO(data.payload.birthDate)
        setValue("avatar", data.payload.avatar);
        setValue("name", data.payload.name);
        setValue("gender", data.payload.gender);
        setGenderValue(data.payload.gender);
        setValue("birthDate",birthDate);
        console.log("user data:", data.payload);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchData();
  }, [dispatch, setValue]);

  const formData = new FormData();
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue("avatar", newFile, { shouldValidate: true });
        // console.log("avatar", newFile);
        // console.log("formData", formData);
      }
    },
    [setValue]
  );

  
  const onSubmit = async (e) => {
    e.preventDefault();
   
    const data = methods.getValues();
    const birthDate = formatDate(data.birthDate);
    formData.append("name", data.name);
    formData.append("gender", data.gender);
    formData.append("birthDate", birthDate);
    formData.append("avatar", data.avatar);
    // const formDataObject = Object.fromEntries(formData);
    // console.log("form data", formDataObject);
    try {
      await updateUserProfile(formData, data, setLoading); // Gọi hàm updateUser với dữ liệu từ form// Thực hiện các hành động sau khi update user thành công
      dispatch(fetchUserProfile());
    } catch (error) {
      // Xử lý lỗi nếu có
    }
  };

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    setGenderValue(selectedGender); // Update the genderValue state
    setValue("gender", selectedGender); // Update the form value
  };
  return (
    <>
      {/* Hiển thị loading khi đang chờ phản hồi từ server */}
      {loading && (
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            fontWeight: "bold",
            color: "red",
            top: "90%",
            left: "15%"
          }}
        >
          Loading...
        </div>
      )}

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
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>

            {/*Birth day*/}
            <Typography>Birth date :</Typography>
            <RHFText name="birthDate" type="date" />
          </Stack>
          <Stack direction={"row"} justifyContent={"end"}>
            {!loading && <Button
              color="primary"
              size="large"
              type="submit"
              variant="outlined"
            >
              Save
            </Button>}
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
};

export default ProfileForm;
