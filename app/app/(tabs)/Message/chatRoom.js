import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ipAddress } from '../../../config/env';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import * as VideoPicker from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import CustomVideoMessage from './CustomVideoMessage';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';

import CustomDocumentMessage from './CustomDocumentMessage';
const chatRoom = () => {
    const [recording, setRecording] = useState();
    const [voice, setVoice] = useState();

    const navigation = useNavigation();
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')

    const params = useLocalSearchParams();
    const router = useRouter();
    const socket = io(`http://${ipAddress}:8000`);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showLongPressView, setShowLongPressView] = useState(false);

    const video = useRef(null)
    socket.on("connect", () => {
        console.log("Connected to the Socket server")
    })
    socket.emit("connected", params?.senderId)
    socket.on("receiveMessage", (newMessage) => {
        console.log("new Message", newMessage)
        let messageContent;
        switch (newMessage.type) {
            case "text":
                messageContent = { text: newMessage.message };
                break;
            case "image":
                messageContent = { image: newMessage.message };
                break;
            case "video":
                messageContent = { video: newMessage.message };
                break;
            case "voice":
                messageContent = { audio: newMessage.message };
                break;
            case "file":
                messageContent = { document: newMessage.message };
                break;
            default:
                messageContent = { text: newMessage.message };
        }


        const newMess = {
            _id: newMessage._id,
            createdAt: newMessage.timestamp,
            user: {
                _id: newMessage.receiverId,
            },
            ...messageContent,
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMess));
    })
    const handleMessaged = async () => {
        try {
            await axios.post(`http://${ipAddress}:3000/users/add-messaged`, {
                currentUserId: params?.senderId,
                receiverId: params?.receiverId,
            });
            socket.emit("requestRender")
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: 'none'
            }
        });
        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    display: 'flex'
                }
            });
        }
    }, [])

    const fetchMessages = async () => {
        try {
            const senderId = params?.senderId;
            const receiverId = params?.receiverId;
            const response = await axios.get(`http://${ipAddress}:3000/mes/messages`, {
                params: { senderId, receiverId },
            });
            const newMessages = response.data.map(message => {
                let messageContent;
                switch (message.type) {
                    case "text":
                        messageContent = { text: message.message };
                        break;
                    case "image":
                        messageContent = { image: message.message };
                        break;
                    case "video":
                        messageContent = { video: message.message };
                        break;
                    case "voice":
                        messageContent = { audio: message.message };
                        break;
                    case "file":
                        messageContent = { document: message.message };
                        break;
                    default:
                        messageContent = { text: message.message };
                }

                return {
                    _id: message._id,
                    createdAt: message.timestamp,
                    user: {
                        _id: message.receiverId,
                    },
                    ...messageContent,
                };
            });
            newMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

        } catch (error) {
            console.log("Error fetching the messages", error);
        }
    };
    useEffect(() => {
        fetchMessages();
    }, []);
    const checkFirstMessage = async () => {
        try {
            const senderId = params?.senderId;
            const receiverId = params?.receiverId;
            const response = await axios.get(`http://${ipAddress}:3000/mes/messages`, {
                params: { senderId, receiverId },
            });
            return response.data.length === 1;
        } catch (error) {
            console.log("Error fetching the messages", error);
            return false;
        }
    }
    const onSend = useCallback(async (messages = [], senderId, receiverId, type) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (type === "image") {
            const message = messages.image;
            socket.emit("sendMessage", { senderId, receiverId, message, type });

        }
        if (type === "video") {
            const message = messages.video;
            socket.emit("sendMessage", { senderId, receiverId, message, type });

        }
        if (type === "voice") {
            console.log("test audio", messages.audio)
            const message = messages.audio;
            socket.emit("sendMessage", { senderId, receiverId, message: messages.audio, type });

        }
        if (type === "file") {
            const message = messages.document.assets[0].uri;
            socket.emit("sendMessage", { senderId, receiverId, message, type });

        }
        else {
            const message = messages.length > 0 ? messages[messages.length - 1].text : null;
            socket.emit("sendMessage", { senderId, receiverId, message, type });

        }
        const hasNoMessages = await checkFirstMessage();
        if (hasNoMessages) {
            handleMessaged();
        }
    }, []);
    const uploadImage = async (mode) => {
        try {
            let result = {};
            if (mode === "gallery") {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            }
            if (!result.canceled) {
                await saveImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error uploading Image: " + error)
            setModalVisible(false)
        }
    }
    const saveImage = async (imageUri) => {
        try {
            const messages = {
                _id: Math.random().toString(36).substring(7),
                image: imageUri,
                createdAt: new Date(),
                user: {
                    _id: params?.receiverId,
                },
            };
            onSend(messages, params?.senderId, params?.receiverId, "image")
        } catch (error) {
            throw error
        }
    }
    const pickVideo = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await VideoPicker.launchImageLibraryAsync({
                mediaTypes: VideoPicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const messages = {
                    _id: Math.random().toString(36).substring(7),
                    video: result.assets[0].uri,
                    createdAt: new Date(),
                    user: {
                        _id: params?.receiverId,
                    },
                };

                onSend(messages, params?.senderId, params?.receiverId, "video")
            }
        } catch (error) {
            console.log('Error selecting video: ', error);
        }
    };
    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                setRecording(recording);
            }
        } catch (err) { }
    }

    async function stopRecording() {
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        const record = {
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        };
        setVoice(record)
        const messages = {
            _id: Math.random().toString(36).substring(7),
            audio: record.file,
            createdAt: new Date(),
            user: {
                _id: params?.receiverId,
            },
        };
        onSend(messages, params?.senderId, params?.receiverId, "voice")
    }

    function getDurationFormatted(milliseconds) {
        const minutes = milliseconds / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
    }
    const playAudio = async (audioUri) => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync({ uri: audioUri });
            await soundObject.playAsync();
        } catch (error) {
            console.error('Error playing audio: ', error);
        }
    };
    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({
                presentationStyle: 'fullScreen',
            });
            const messages = {
                _id: Math.random().toString(36).substring(9),
                document: response,
                createdAt: new Date(),
                user: {
                    _id: params?.receiverId,
                },
            };
            onSend(messages, params?.senderId, params?.receiverId, "file");
        } catch (err) {
            console.warn(err);
        }
    }, []);
    const onDeleteMessage = async (selectedMessage) => {
        try {
            await axios.post(`http://${ipAddress}:3000/mes/deleteMessage`, {
                currentUserId: params?.senderId,
                receiverId: params?.receiverId,
                messageId: selectedMessage._id,
                timestamp: selectedMessage.createdAt,
            });
            setMessages([]);
            fetchMessages();
            setShowLongPressView(false);
            socket.emit("requestRender")
        } catch (error) {
            console.log("error", error);
        }
    };
    const onRecallMessage = async (selectedMessage) => {
        try {
            await axios.post(`http://${ipAddress}:3000/mes/recallMessage`, {
                currentUserId: params?.senderId,
                receiverId: params?.receiverId,
                messageId: selectedMessage._id,
                timestamp: selectedMessage.createdAt,
            });
            setMessages([]);
            fetchMessages();
            setShowLongPressView(false);
            socket.emit("requestRender")
        } catch (error) {
            console.log("error", error);
        }
    };
    const handleLongPress = (context, message) => {
        setSelectedMessage(message); // Lưu message được chọn để sử dụng trong CustomLongPressView
        setShowLongPressView(true);

    };
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#e2e8f1" }}>
            <View style={{ backgroundColor: '#00abf6', justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
                <TouchableOpacity onPress={() => { router.replace('/Message') }}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: 'white' }}>{params?.uName}</Text>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages, params?.senderId, params?.receiverId, "text")}
                user={{ _id: params?.receiverId }}
                onInputTextChanged={setText}
                renderSend={(props) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 14 }}>
                        {text.length > 0 && (
                            <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                                <Ionicons name='send' size={28} />
                            </Send>
                        )}
                        {text.length === 0 && (
                            <>
                                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                                    {recording ? <Ionicons name='mic-outline' size={28} /> : <Ionicons name='mic' size={28} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickVideo}>
                                    <Entypo name='folder-video' size={28} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { uploadImage("gallery") }}>
                                    <Ionicons name='image-outline' size={28} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDocumentSelection}>
                                    <Ionicons name='document-attach' size={28} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
                renderMessageAudio={(props) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 50 }}>
                        <TouchableOpacity onPress={() => { playAudio(props.currentMessage.audio) }}>
                            <AntDesign style={{ padding: 15 }} name='play' size={28} />
                        </TouchableOpacity>
                    </View>
                )}
                renderMessageVideo={(props) => (
                    <>
                        <Video
                            source={{ uri: props.currentMessage.video }}
                            style={{ width: 200, height: 200 }}
                            resizeMode="contain"
                            useNativeControls={true}
                        />
                    </>
                )}
                onLongPress={(context, message) => {

                    console.log('Long pressed on message:', message);
                    handleLongPress(context, message)
                }}

            />
            {showLongPressView && (
                <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                    {selectedMessage && selectedMessage.user._id === params?.receiverId ? (
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                height: 60,
                                backgroundColor: 'white',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                            onPress={() => onRecallMessage(selectedMessage)}
                        >
                            <Text style={{ color: 'black', fontSize: 20 }}>Thu hồi tin nhắn</Text>
                        </TouchableOpacity>
                    ) : (
                        <View></View>
                    )}
                    <TouchableOpacity style={{ width: '100%', height: 60, backgroundColor: 'white', padding: 10, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1 }}
                        onPress={() => onDeleteMessage(selectedMessage)}>
                        <Text style={{ color: 'black', fontSize: 20 }}>Xóa tin nhắn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '100%', height: 60, backgroundColor: 'white', padding: 10, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1 }}
                        onPress={() => setShowLongPressView(false)}>
                        <Text style={{ color: 'black', fontSize: 20 }}>Chuyển tiếp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '100%', height: 60, backgroundColor: 'white', padding: 10, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderWidth: 1 }}
                        onPress={() => setShowLongPressView(false)}>
                        <Text style={{ color: 'black', fontSize: 20 }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

export default chatRoom

