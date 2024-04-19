import { useState } from "react";
import useConversation from "../zustand/useConversation";
import useGetMessages from "./useGetMessages";
import useSendMessage from "./useSendMessage";

const useChat = () => {
  const { selectedConversation } = useConversation();
  const { messages, setMessages } = useGetMessages();
  const { loading: sendMessageLoading, sendMessage } = useSendMessage();

  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message || !selectedConversation) return;
    await sendMessage(message);
    setMessage(""); // Clear the message input after sending
  };

  return {
    selectedConversation,
    messages,
    setMessages,
    message,
    setMessage,
    handleSendMessage,
    sendMessageLoading,
  };
};

export default useChat;
