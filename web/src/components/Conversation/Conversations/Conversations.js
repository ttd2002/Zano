import { Stack } from "@mui/material";
import React from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../../hooks/useGetConversations";
// import { useConversation } from "../../../zustand/useConversation";

const Conversations = () => {
    const {loading, conversations} = useGetConversations();
   // console.log("conversations:",conversations);
  return (
    <>
   
     {conversations.map((conversation, idx)=>(
        <Conversation  key={conversation._id}
        conversation={conversation}
        lastIdx={idx === conversations.length-1}
        />
    ))}
     {loading ? <span></span> : null } 
    </>
  );
};

export default Conversations;
