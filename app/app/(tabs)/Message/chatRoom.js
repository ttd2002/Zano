import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ipAddress } from '../../../config/env';
import { GiftedChat, Message, Send } from 'react-native-gifted-chat';
import * as VideoPicker from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import CustomVideoMessage from './CustomVideoMessage';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import CustomDocumentMessage from './CustomDocumentMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler'
import EmojiSelector from 'react-native-emoji-selector';
import UploadModal from '../Personal/UploadModal';
const chatRoom = () => {
    const [recording, setRecording] = useState();

    const navigation = useNavigation();
    const [messages, setMessages] = useState([])

    const params = useLocalSearchParams();
    const router = useRouter();
    const socket = io(`http://${ipAddress}:8000`);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showLongPressView, setShowLongPressView] = useState(false);
    const [inputText, setInputText] = useState('');
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const handleEmojiSelect = (emoji) => {
        setInputText(prevText => prevText + emoji);
    };
    const video = useRef(null)
    socket.on("connection", () => {
        console.log("Connected to the Socket server")
    })
    socket.emit("joinRoom", params?.conversationId)
    // socket.on("Render", () => {
    //     setMessages([]);
    //     fetchMessages();
    // })
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [token, setToken] = useState("");
    useEffect(() => {
        fetchUser();
        fetchMessages();
    }, []);
    const fetchUser = async () => {
        try {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const name = user.name;
            const avatar = user.avatar;
            const token = await AsyncStorage.getItem("token");
            setToken(token)
            setName(name);
            setAvatar(avatar);
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };
    useEffect(() => {
        const receiveMessageHandler = (newMessage) => {
            // Kiểm tra nếu tin nhắn được nhận từ socket không phải là tin nhắn do chính client gửi
            // if (newMessage.senderId !== params?.senderId) {
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
                        _id: newMessage.senderId,
                    },
                    ...messageContent,
                };
                console.log('newMesRecei',newMess);
                // Chỉ thêm tin nhắn mới vào state nếu không phải là tin nhắn do chính client gửi
                setMessages(previousMessages => GiftedChat.append(previousMessages, newMess));
            // }
        };

        socket.on("receiveMessage", receiveMessageHandler);

        // Xóa bỏ listener khi component unmount
        return () => {
            socket.off("receiveMessage", receiveMessageHandler);
        };
    }, [socket, params, messages]); // Đảm bảo cung cấp tất cả các dependency cần thiết



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
            const conversationId = params?.conversationId;
            const response = await axios.get(`http://${ipAddress}:3000/mes/messages/${conversationId}`, {
                params: { conversationId, senderId: params?.senderId },
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
                        _id: message.senderId._id,
                        name: message.senderId.name,
                        avatar: message.senderId.avatar
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


    // const checkFirstMessage = async () => {
    //     try {
    //         const senderId = params?.senderId;
    //         const receiverId = params?.receiverId;
    //         const response = await axios.get(`http://${ipAddress}:3000/mes/messages/${conversationId}`, {
    //             params: { senderId, receiverId },
    //         });
    //         return response.data.length === 1;
    //     } catch (error) {
    //         console.log("Error fetching the messages", error);
    //         return false;
    //     }
    // }
    const onSend = useCallback(async (messages = [], senderId, conversationId, type) => {
        // setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        if (type === "image") {
            const message = messages.image;
            socket.emit("sendMessage", { senderId, conversationId, message, type });
        }
        if (type === "video") {
            const message = messages.video;
            socket.emit("sendMessage", { senderId, conversationId, message, type });

        }
        if (type === "voice") {
            // const message = messages.audio;
            socket.emit("sendMessage", { senderId, conversationId, message: messages.audio, type });

        }
        if (type === "file") {
            const message = messages.document;
            socket.emit("sendMessage", { senderId, conversationId, message, type });

        }
        else {
            const message = messages.length > 0 ? messages[messages.length - 1].text : null;
            socket.emit("sendMessage", { senderId, conversationId, message, type });

        }
        // const hasNoMessages = await checkFirstMessage();
        // if (hasNoMessages) {
        //     handleMessaged();
        // }
    }, []);
    const uploadImage = async (mode) => {
        try {
            let result = {};
            if (mode === "gallery") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Quyền truy cập vào thư viện ảnh bị từ chối!');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                });
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    aspect: [1, 1],
                    quality: 1,
                });
            }
            if (!result.cancelled) {
                const selectedImages = result.assets || []; // Lấy danh sách các ảnh đã chọn
                for (let i = 0; i < selectedImages.length; i++) {
                    const image = selectedImages[i];
                    const uri = image.uri;
                    const type = image.mimeType;
                    const name = "imageChat";
                    const source = { uri, name, type };
                    const data = new FormData();
                    data.append('file', source);
                    const response = await fetch(`https://api.cloudinary.com/v1_1/dbtgez7ua/auto/upload?upload_preset=DemoZanoo`, {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    const responseData = await response.json();
                    const messages = {
                        _id: Math.random().toString(36).substring(7),
                        image: responseData.url,
                        createdAt: new Date(),
                        user: {
                            _id: params?.senderId,
                            name: name,
                            avatar: avatar
                        },
                    };
                    onSend(messages, params?.senderId, params?.conversationId, "image");
                }
                setModalVisible(false)
            }
        } catch (error) {
            console.log("Error uploading Image: " + error);
            setModalVisible(false);
        }
    };

    // const saveImage = async (imageUri) => {
    //     try {
    //         const messages = {
    //             _id: Math.random().toString(36).substring(7),
    //             image: imageUri,
    //             createdAt: new Date(),
    //             user: {
    //                 _id: params?.receiverId,
    //             },
    //         };
    //         onSend(messages, params?.senderId, params?.receiverId, "image")
    //     } catch (error) {
    //         throw error
    //     }
    // }
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

                const uri = result.assets[0].uri
                const type = result.assets[0].mimeType
                const name = result.assets[0].fileName
                const source = { uri, name, type }
                const data = new FormData();
                data.append('file', source);
                // data.append('imageChat', source);
                // fetch(`http://${ipAddress}:3000/mes/uploadImageApp`, {
                //     method: 'POST',
                fetch(`https://api.cloudinary.com/v1_1/dbtgez7ua/video/upload?upload_preset=DemoZanoo`, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => res.json()).then(data => {
                    const messages = {
                        _id: Math.random().toString(36).substring(7),
                        video: data.url,
                        createdAt: new Date(),
                        user: {
                            _id: params?.senderId, name: name, avatar: avatar
                        },
                    };
                    onSend(messages, params?.senderId, params?.conversationId, "video")

                })
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
                setTimeout(async () => {
                    await stopRecording(recording);
                }, 5000);
            }
        } catch (err) { }
    }

    async function stopRecording(recording) {
        if (!recording) {
            // Handle case where recording is undefined
            console.error("Recording is undefined");
            return;
        }
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        const record = {
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        };
        const uri = record.file;
        const extension = uri.substring(uri.lastIndexOf(".") + 1);

        let type;
        switch (extension.toLowerCase()) {
            case "m4a":
                type = "audio/mp4";
                break;
            case "mp3":
                type = "audio/mpeg";
                break;
            default:
                type = "audio/mp4";
        }

        const name = uri.substring(uri.lastIndexOf("/") + 1);
        const source = { uri, name, type };
        const data = new FormData();
        data.append('file', source);
        fetch(`https://api.cloudinary.com/v1_1/dbtgez7ua/auto/upload?upload_preset=DemoZanoo`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.json()).then(data => {
            const messages = {
                _id: Math.random().toString(36).substring(7),
                audio: data.secure_url,
                createdAt: new Date(),
                user: {
                    _id: params?.senderId, name: name, avatar: avatar
                },
            };
            onSend(messages, params?.senderId, params?.conversationId, "voice")

        })
            .catch(error => {
                console.error("Error âm thanh:", error);
            });
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
            const uri = response.assets[0].uri;
            const type = response.assets[0].mimeType;
            const name = response.assets[0].name;
            const source = { uri, name, type };
            const data = new FormData();
            data.append('file', source);
            fetch(`https://api.cloudinary.com/v1_1/dbtgez7ua/auto/upload?upload_preset=DemoZanoo`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => res.json()).then(data => {
                const messages = {
                    _id: Math.random().toString(36).substring(9),
                    document: data.url,
                    createdAt: new Date(),
                    user: {
                        _id: params?.senderId, name: name, avatar: avatar
                    },
                };
                onSend(messages, params?.senderId, params?.conversationId, "file")

            })
                .catch(error => {
                    console.error("Error file tài liệu:", error);
                });

        } catch (err) {
            console.warn(err);
        }
    }, []);
    const onDeleteMessage = async (selectedMessage) => {
        try {
            await axios.post(`http://${ipAddress}:3000/mes/deleteMessage`, {
                currentUserId: params?.senderId,
                // receiverId: params?.receiverId,
                messageId: selectedMessage._id,
                // timestamp: selectedMessage.createdAt,
                conversationId: params?.conversationId,
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
                // receiverId: params?.receiverId,
                messageId: selectedMessage._id,
                // timestamp: selectedMessage.createdAt,
                conversationId: params?.conversationId,
            });
            setMessages([]);
            fetchMessages();
            setShowLongPressView(false);
            //socket.emit("requestRender");
        } catch (error) {
            console.log("error", error);
        }
    };
    const handleLongPress = (context, message) => {
        setSelectedMessage(message); // Lưu message được chọn để sử dụng trong CustomLongPressView
        setShowLongPressView(true);

    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return require('../../../assets/pdf.png');
            case 'doc':
            case 'docx':
                return require('../../../assets/dox.png');
            case 'xls':
            case 'xlsx':
                return require('../../../assets/excel.jpg');
            case 'ppt':
            case 'pptx':
                return require('../../../assets/pp.png');
            default:
                return require('../../../assets/dox.png');
        }
    };
    const renderAvatar = (props) => {
        return (
            <View style={{ marginRight: 5 }}>
                <Image
                    source={{ uri: props.currentMessage.user.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
            </View>
        );
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#e2e8f1" }}>
            <UploadModal
                modalVisible={modalVisible}
                onBackPress={() => setModalVisible(false)}
                cancelable
                onCameraPress={() => uploadImage()}
                onGalleryPress={() => uploadImage("gallery")}
            ></UploadModal>
            <View style={{ backgroundColor: '#00abf6', justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { 
                    router.replace('/Message') 
                    // navigation.goBack()
                    }}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: 'white', width: '75%' }}>{params?.uName}</Text>
                <TouchableOpacity onPress={() => {
                    router.replace({
                        pathname: '/Message/options',
                        params: {
                            uname:params?.uname,
                            conversationId: params?.conversationId,
                            senderId: params?.senderId,
                        }
                    })
                }}>
                    <Ionicons name="options-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages, params?.senderId, params?.conversationId, "text")}
                user={{ _id: params?.senderId}}
                //onInputTextChanged={setText}
                text={inputText} // Sử dụng inputText làm nội dung của thanh chat
                onInputTextChanged={text => setInputText(text)}
                renderUsernameOnMessage={true}
                renderAvatar={(props) => <Image style={{height: 25, width: 25, borderRadius: 25, resizeMode:'contain'}} source={{uri: props.currentMessage.user.avatar}}/>}
                // renderUsername={(props) => <Text style={{color: 'black'}}>{props.currentMessage.user.name}</Text>}
                renderSend={(props) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 14 }}>
                        <TouchableOpacity onPress={() => showEmojiSelector ? setShowEmojiSelector(false) : setShowEmojiSelector(true)}>
                            <Ionicons name="happy-outline" size={24} color="black" />
                        </TouchableOpacity>
                        {inputText.length > 0 && (
                            <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                                <Ionicons name='send' size={28} />
                            </Send>
                        )}
                        {inputText.length === 0 && (
                            <>
                                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                                    {recording ? <Ionicons name='mic-outline' size={28} /> : <Ionicons name='mic' size={28} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickVideo}>
                                    <Entypo name='folder-video' size={28} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setModalVisible(true) }}>
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
                renderMessage={(props) => {
                    // Kiểm tra nếu tin nhắn có chứa tài liệu
                    const documetLink = props.currentMessage.document
                    if (props.currentMessage.document) {
                        return <TouchableOpacity onPress={() => { Linking.openURL(props.currentMessage.document) }}>
                            <View style={props.currentMessage.user._id === params.senderId ? styles.containerSender : styles.containerReceiver}>
                                <View style={{ backgroundColor: '#f0f0f0' }}>
                                    <Image source={getFileIcon(documetLink.substring(documetLink.lastIndexOf(".") + 1))} style={styles.icon} />
                                    <Text>{documetLink.substring(documetLink.lastIndexOf(".") + 1)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }

                    // Nếu không, sử dụng render mặc định của Gifted Chat
                    return <Message {...props} />;
                }}
            />
            {showLongPressView && (
                <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                    {selectedMessage && selectedMessage.user._id === params?.senderId ? (
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
            {showEmojiSelector && (
                <View style={styles.emojiSelectorContainer}>
                    <EmojiSelector
                        onEmojiSelected={handleEmojiSelect} // Callback khi chọn emoji
                    />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

export default chatRoom

const styles = StyleSheet.create({
    containerSender: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'flex-end',
    },
    containerReceiver: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        justifyContent: 'flex-start',
        marginLeft: 44
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    fileName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emojiSelectorContainer: {
        position: 'absolute',
        bottom: 60, // Điều chỉnh vị trí hiển thị EmojiSelector tùy theo thiết kế của bạn
        width: '80%',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
    },
});