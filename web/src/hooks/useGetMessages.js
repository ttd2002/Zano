import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useConversation } from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  //const { messages, setMessages, selectedConversation } = useConversation();
  const { messages, setMessages, selectedConversation,receiver, setReceiver } = useConversation();
  // const [tempMessages, setTempMessages] = useState([]);
  

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {

        // const token = JSON.parse(localStorage.getItem("logintoken"));
        const token = localStorage.getItem("logintoken");

        if (!token) {
          throw new Error("tokenString not found"); // Throw an error if user object is not found
        }
       // console.log("Conversation:",selectedConversation);
        if(!selectedConversation.isGroupChat){
          const senderId = localStorage.getItem("loginId");    
          for(let i = 0; i < selectedConversation.participants.length; i++){
            if (selectedConversation.participants[i]._id != senderId){
              const NewReceiver= {
                _id: selectedConversation.participants[i]._id,
                name: selectedConversation.participants[i].name,
                avatar: selectedConversation.participants[i].avatar,
              }
              setReceiver(selectedConversation.participants[i])
             console.log("receiver:",NewReceiver);
            }
          }
        }
       
        // const res = await fetch(
        //   `http://localhost:3000/mes/get/${userId}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`, // Thêm token vào tiêu đề Authorization
        //     },
        //   }
        // );
        // const data = await res.json();
        // console.log(data);
        // if (data.error) throw new Error(data.error);
        // setMessages(data.messages);
        // console.log(data);
        // const messagesData = data.map((item) => ({
        //   id: item._id,
        //   message: item.message,
        //   type: item.type,
        //   senderId: item.senderId,
        // }));
        
        // console.log(messagesData);
        // console.log("data:",data.messages);
        
        //ERROR
        // setMessages(data.messages);
        // console.log(messages);


      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if(!selectedConversation) {
      return;
    }
    if (selectedConversation._id) getMessages();
    
  }, [selectedConversation?._id, setMessages]);
  // useEffect(() => {
  //   // console.log(messages);
  // }, [messages]); 
  return { GetMSGS: messages, receiver, GetMSGLoading: loading };
};

export default useGetMessages;
