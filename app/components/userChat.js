import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios"
import { ipAddress } from "../config/env";

const UserChat = ({ item, userId }) => {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const getLastMessage = () => {
        const n = messages.length;
        return messages[n - 1];
    }
    const getContentMessage = () => {
        let messageContent;
        switch (lastMessage.type) {
            case "text":
                messageContent = lastMessage.message;
                break;
            case "image":
                messageContent = "[Hình ảnh]";
                break;
            case "video":
                messageContent = "[Video]";
                break;
            case "voice":
                messageContent = "[Tin nhắn thoại]";
                break;
            case "file":
                messageContent = "[Tài liệu]";
                break;
            default:
                messageContent = lastMessage.message;
        }
        return messageContent;
    }
    const lastMessage = getLastMessage();
    useEffect(() => {
        fetchMessages();
    }, []);
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = item?._id;
            const response = await axios.get(`http://${ipAddress}:3000/messages`, {

                //const response = await axios.get("http://10.0.2.2:3000/messages", {
                params: { senderId, receiverId },
            });

            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    return (
        <Pressable
            onPress={() => {
                router.navigate({

                    pathname: '/Message/chatRoom',
                    params: {

                        uName: item.name,
                        senderId: userId,
                        receiverId: item._id,
                    }
                })
            }}
        >
            <View style={{ borderBottomWidth: 1, alignItems: 'center', borderBottomColor: 'grey', height: 80, width: 400, flexDirection: 'row', gap: 15 }}>
                <Image style={{
                    marginLeft: 15,
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    resizeMode: "contain"
                }} source={{ uri: 'data:image/jpeg;base64,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' }} />
                <View style={{ gap: 10 }}>
                    <Text style={{ fontSize: 20, fontStyle: 'normal', alignItems: 'flex-start' }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, color: 'grey', alignItems: 'flex-start' }}>
                        {lastMessage ? getContentMessage() : '[Hình ảnh]'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default UserChat;

const styles = StyleSheet.create({});