import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import axios from "../utils/axios";

// const socket = io(`http://192.168.137.211:8000`);
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [groupconversations, setgroupConversations] = useState([]);
  // socket.on("Render", () => {
  //   getConversations();
  // })
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const tokenString = localStorage.getItem("logintoken");
        if (!tokenString) {
          throw new Error("tokenString not found"); // Throw an error if user object is not found
        }
        const res = await axios.get(`/users/getListUsers`, {
          //         const res = await fetch(`http://localhost:3000/users/getListUsers`, {
          headers: {
            Authorization: `Bearer ${tokenString}`, // Thêm token vào tiêu đề Authorization
          },
        });
        // console.log(res.data);
        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data)
        // console.log(conversations);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  // return { loading, conversations, groupconversations };
  return { loading, conversations };

};

export default useGetConversations;
