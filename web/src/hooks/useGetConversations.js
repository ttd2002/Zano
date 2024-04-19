import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [groupconversations, setgroupConversations] = useState([]);
  useEffect(() => { 
    const getConversations = async () => {
      setLoading(true);
      try {
        const tokenString = localStorage.getItem("logintoken");
        if (!tokenString) {
          throw new Error("tokenString not found"); // Throw an error if user object is not found
        }
        const res = await fetch(`http://localhost:3000/users/getListUsers`, {
          headers: {
            Authorization: `Bearer ${tokenString}`, // Thêm token vào tiêu đề Authorization
          },
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);  
        }
        // Lọc những conversation có trường isGroupChat = false
        const filteredConversations = data.filter(conversation => !conversation.isGroupChat);
        const filteredGroupConversations = data.filter(conversation => conversation.isGroupChat);
        setConversations(filteredConversations);
        setgroupConversations(filteredGroupConversations)
        console.log(filteredConversations);
        console.log(filteredGroupConversations);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations,groupconversations };
};

export default useGetConversations;
