import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Button,
    Stack,
    Typography,
    useTheme,
    Dialog,
    DialogContent,
    Slide,
    DialogTitle,
    InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import FormProvider from "../../../components/hook-form/FormProvider";
import RHFTextField from "../../../components/hook-form/RHFTextField";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { Eye, EyeSlash } from "phosphor-react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ChangePassword = ({ open, handleClose }) => {
    const NewGroupSchema = Yup.object().shape({
        currentPassword: Yup.string().required("Current password is required"),
        newPassword: Yup.string().required("New password is required"),
        confirmNewPassword: Yup.string().required("Confirm new password is required"),
    });
    const defaultValues = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    };

    const methods = useForm({
        resolver: yupResolver(NewGroupSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setError,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
    } = methods;
    const { setValue } = methods;
    const [registeredPassword, setSegisteredPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const userId = localStorage.getItem("loginId");
    // useEffect(() => {
    //     const fetchPass = async () => {
    //         try {
    //             const response = await axios.get(`/users/getPasswordById/${userId}`);
    //             console.log(response.data);
    //             if (response.status === 200) {
    //                 setSegisteredPassword(response.data.password);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     fetchPass();
    // }, [])
    const onSubmit = async (data) => {
        const { watch } = methods;
        const currentPassword = watch("currentPassword");
        const newPassword = watch("newPassword");
        const confirmNewPassword = watch("confirmNewPassword");

        if (newPassword.length < 6) {
            setError("newPassword", {
                type: "manual",
                message: "Password must be at least 6 characters",
            });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("confirmNewPassword", {
                type: "manual",
                message: "New password and confirm password does not match",
            });
            return;
        }
        try {
            const response = await axios.put("/users/changePasswordWeb", {
                newPassword: newPassword,
                id: userId,
                currentPassword: currentPassword
            });
            if (response.status === 200) {
                toast.success("Password changed successfully");
                handleClose();
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    toast.error("Current password is incorrect");
                } else if (status === 401) {
                    toast.error("New password must be different from current password");
                } else {
                    toast.error("An error occurred while changing password");
                }
            } else {
                toast.error("An error occurred while changing password");
            }
        }
    };
    return (
        <>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                sx={{
                    p: 4,
                    height: '600px',
                }}
            >
                <DialogTitle
                    sx={{
                        mb: 2,
                    }}
                >
                    Change Password
                </DialogTitle>
                <DialogContent>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3} >
                            <RHFTextField
                                sx={{
                                    mt: 2,
                                }}
                                name="currentPassword"
                                label="Current Pasword"
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
                            <RHFTextField
                                sx={{
                                    mt: 2,
                                }}
                                name="newPassword"
                                label="New Password"
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
                            <RHFTextField
                                sx={{
                                    mt: 2,
                                }}
                                name="confirmNewPassword"
                                label="Confirm New Password"
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

                            <Stack
                                spacing={2}
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"end"}
                            >
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="Submit" variant="contained">
                                    Create
                                </Button>
                            </Stack>
                        </Stack>
                    </FormProvider>
                </DialogContent>

            </Dialog>
        </>
    )
};

export default ChangePassword;