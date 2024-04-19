import React, { useState } from "react";
import toast from "react-hot-toast";
    const updateUserProfile = async (data) => {
        try {
            const token = localStorage.getItem("logintoken");
            const loginId = localStorage.getItem("loginId");
            
            const res = await fetch(
                `http://localhost:3000/users/updateUser/${loginId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    // Truyền dữ liệu của user cần cập nhật vào body
                    body: JSON.stringify(data),
                }
            );
            console.log("Data:",res);
            // const responseData = await res.json();
            // console.log("oke",responseData);
            if (res.ok) {
                // Nếu cập nhật thành công, hiển thị thông báo

                toast.success("User profile updated successfully");
            } else {
                // Nếu có lỗi, hiển thị thông báo lỗi
                throw new Error("Failed to update user profile");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error updating user profile:", error);
            toast.error("Failed to update user profile");
        }
    };


export default updateUserProfile;
