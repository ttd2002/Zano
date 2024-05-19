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
            const conversationId = item?._id;
            const response = await axios.get(`http://${ipAddress}:3000/mes/messages/${conversationId}`, {
                params: { conversationId, senderId: userId },
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
                        // receiverId: item._id,
                        conversationId: item._id,
                        // uAvatar: item.avatar,
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
                }} source={{ uri: item.avatar }} />
                <View style={{ gap: 10 }}>
                    <Text style={{ fontSize: 20, fontStyle: 'normal', alignItems: 'flex-start' }}>{item.isGroupChat ? `Group: ${item.name}` : item.name}</Text>
                    <Text style={{ fontSize: 10, color: 'grey', alignItems: 'flex-start' }}>
                        {lastMessage ? getContentMessage() : '[Chưa có tin nhắn]'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default UserChat;

const styles = StyleSheet.create({});