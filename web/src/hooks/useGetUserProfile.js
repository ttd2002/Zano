// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const useGetUserProfile = () => {
//     const [loading, setLoading] = useState(false);
//     const [UserProfile, setUserProfile] = useState([]);
//     useEffect(() => { 
//         const getUserProfile = async () => {
//           setLoading(true);
//           const loginId = localStorage.getItem("loginId");
//           try {
//             const tokenString = localStorage.getItem("logintoken");
//             if (!tokenString) {
//               throw new Error("tokenString not found"); // Throw an error if user object is not found
//             }
//             const res = await fetch(`http://localhost:3000/users//getFinded`, {
//               headers: {
//                 Authorization: `Bearer ${tokenString}`, // Thêm token vào tiêu đề Authorization
//               },
//             });
//             const data = await res.json();
//             if (data.error) {
//               throw new Error(data.error);  
//             }
//             // Lọc những conversation có trường isGroupChat = false
//             const filteredConversations = data.filter(conversation => !conversation.isGroupChat);
//             setgroupConversations(filteredGroupConversations)
//             console.log(filteredConversations);
//           } catch (error) {
//             toast.error(error.message);
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         getConversations();
//       }, []);
//       return { loading, user };
// }

// export default useGetUserProfile
import React from 'react'

const useGetUserProfile = () => {
  return (
    <div>useGetUserProfile</div>
  )
}

export default useGetUserProfile