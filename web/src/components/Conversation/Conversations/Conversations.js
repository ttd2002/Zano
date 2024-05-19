import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../../hooks/useGetConversations";
import { useConversation } from "../../../zustand/useConversation";

const Conversations = ({ ListConversations, isCreateConversation }) => {
  const { loading, conversations } = useGetConversations();
  const [conversationsState, setConversationsState] = useState([]);
  const { socket } = useConversation();

  // Thiết lập giá trị ban đầu cho conversationsState khi danh sách cuộc trò chuyện được trả về từ server
  useEffect(() => {
    if (!loading && conversations && conversations.length > 0) {
      setConversationsState(conversations);
    }
  }, [loading, conversations]);

  useEffect(() => {
    // Cập nhật state conversations với giá trị mới từ props ListConversations
    if (ListConversations && ListConversations.length > 0) {
      setConversationsState((prevConversations) => {
        const existingIds = prevConversations.map(conversation => conversation._id);
        const newConversations = ListConversations.filter(conversation => !existingIds.includes(conversation._id));
        return [...newConversations, ...prevConversations];
      });
    }
  }, [ListConversations]);

  return (
    <>
      {conversationsState.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          isCreateConversation={isCreateConversation}
          lastIdx={idx === conversationsState.length - 1}
        />
      ))}
      {loading ? <span>Loading...</span> : null}
    </>
  );
};

export default Conversations;
