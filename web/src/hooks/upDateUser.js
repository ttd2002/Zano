import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../utils/axios";
const updateUserProfile = async (formData, data, setLoading) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("logintoken");
        const loginId = localStorage.getItem("loginId");
        // console.log("form", formData);
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        const dataToSend = {
            name: data.name,
            gender: data.gender,
            birthDate: data.birthDate,
        };

        const res = await axios.put(
            `/users/updateUser/${loginId}`,
            formData,
            config,
            // dataToSend
        );
        // console.log("Data:", res);
        // const responseData = await res.json();
        // console.log("oke",responseData);
        if (res.status === 200) {
            // Nếu cập nhật thành công, hiển thị thông báo
            localStorage.setItem("loginavatar", res.data.avatar);
            localStorage.setItem("loginname", res.data.name);
            localStorage.setItem("loginbirthDate", res.data.birthDate);
            localStorage.setItem("logingender", res.data.gender);
            localStorage.setItem("UserProfile", JSON.stringify(res.data));
            toast.success("User profile updated successfully");
        } else {
            // Nếu cập nhật không thành công, hiển thị thông báo
            toast.error("Failed to update user profile");
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error updating user profile:", error);
        toast.error("Failed to update user profile");
    } finally {
        setLoading(false); // Đặt loading thành false sau khi nhận được phản hồi từ server
    }
};

export default updateUserProfile;
