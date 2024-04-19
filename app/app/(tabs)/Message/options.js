import React, { useRef, useEffect } from "react";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { ipAddress } from "../../../config/env";
import UploadModal from "../PhoneBook/component/UploadModal";
import * as ImagePicker from "expo-image-picker"
import Options2 from "./options2";
import { io } from 'socket.io-client';
const Options = () => {
    const socket = io(`http://${ipAddress}:8000`);

    const router = useRouter();
    const params = useLocalSearchParams();
    const conversationId = params?.conversationId;
    const userId = params?.senderId;
    const [conversation, setConversation] = useState({});
    const [groupName, setGroupName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddAdminVisible, setModalAddAdminVisible] = useState(false);
    const [modalAddMemberVisible, setModalAddMemberVisible] = useState(false);
    const [modalViewMemberVisible, setModalViewMemberVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleGroupNameChange = (text) => {
        setGroupName(text);
    };
    useEffect(() => {
        fetchConversation();
        setModalAddAdminVisible(false);
        setModalAddMemberVisible(false);
    }, []);
    socket.on("Render", () => {
        fetchConversation();
        setModalAddAdminVisible(false);
        setModalAddMemberVisible(false);
    })

    const fetchConversation = async () => {
        try {
            const response = await axios.get(
                `http://${ipAddress}:3000/mes/getOneConversationApp`, {
                params: { conversationId },
            }
            );
            setConversation(response.data);
            setAvatar(response.data.avatar);
            setIsAdmin(response.data.isGroupChat && response.data.listAdmins.includes(userId))
        } catch (error) {
            console.log("Error", error);
        }
    };
    const [avatar, setAvatar] = useState(null);
    const [source, setSource] = useState(null);

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
                const uri = result.assets[0].uri
                const type = result.assets[0].mimeType
                const name = "groupAvatar"
                const source = { uri, name, type }
                console.log('source', source);
                setAvatar(uri)
                setSource(source)
                setModalVisible(false)
                console.log(result);
            }
        } catch (error) {
            console.log("Error uploading Image: " + error)
            setModalVisible(false)
        }
    }
    const handleDeleteGroup = async () => {

        fetch(`http://${ipAddress}:3000/group/conversation/removeConversation`, {
            method: 'PUT',
            body: JSON.stringify({ conversationId: conversation._id }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            console.log(data.message);
            if (data.result) {
                Alert.alert('Giải tán thành công', '', [
                    {
                        text: 'OK',
                        onPress: () => {
                            socket.emit("requestRender");
                            router.replace("/Message");
                        },
                    },
                ]);
            } else {
                Alert.alert('Giải tán thất bại')
            }

        })
    }
    const handleSubmit = async () => {
        if (groupName.trim() === '') {
            Alert.alert("Vui lòng nhập tên cho nhóm");
        } else {
            const data = new FormData();
            data.append('conversationId', conversation._id)
            data.append('groupAvatar', source)
            data.append('nameGroup', groupName)
            fetch(`http://${ipAddress}:3000/group/changeNameAvatarApp`, {
                method: 'PUT',
                body: data,
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => res.json()).then(data => {
                console.log(data.group);
                if (data.group) {
                    Alert.alert('Thay doi thành công', '', [
                        {
                            text: 'OK',
                            onPress: () => {

                            },
                        },
                    ]);
                } else {
                    Alert.alert('Thay doi group thất bại')
                }

            })
        }
    }
    console.log("conversation", conversation._id);
    console.log("isAdmin", isAdmin);
    return (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Avatar và button đổi avatar */}

            {conversation.isGroupChat === true && (
                <TouchableOpacity
                    style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', height: 40, marginTop: 10 }}
                    onPress={() => { setModalAddMemberVisible(true); }}
                >
                    <Text style={{ color: 'white' }}>Thêm thành viên</Text>
                </TouchableOpacity>
            )}
            {isAdmin === true && (
                <View>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Image
                                source={{ uri: avatar }}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={{ marginTop: 10, color: 'blue' }}>Đổi avatar</Text>
                        </TouchableOpacity>
                        <UploadModal
                            modalVisible={modalVisible}
                            onBackPress={() => setModalVisible(false)}
                            cancelable
                            onCameraPress={() => uploadImage()}
                            onGalleryPress={() => uploadImage("gallery")}
                        ></UploadModal>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            placeholder={conversation.name}
                            value={groupName}
                            onChangeText={handleGroupNameChange}
                            style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, width: '100%' }}
                        />
                    </View>

                    {/* Button thay đổi tên nhóm */}
                    <TouchableOpacity
                        style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', height: 40, marginTop: 20 }}
                        onPress={() => { handleSubmit(); }}
                    >
                        <Text style={{ color: 'white' }}>Đổi tên và hình đại diện</Text>
                    </TouchableOpacity>

                    {/* Các chức năng */}
                    <View style={{ marginTop: 30, width: '100%' }}>
                        {/* Button thêm admin */}
                        <TouchableOpacity
                            style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', height: 40 }}
                            onPress={() => { setModalAddAdminVisible(true); }}
                        >
                            <Text style={{ color: 'white' }}>Thêm admin</Text>
                        </TouchableOpacity>

                        {/* Button thêm thành viên */}


                        {/* Button xóa thành viên */}
                        <TouchableOpacity
                            style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', height: 40, marginTop: 10 }}
                            onPress={() => { setModalViewMemberVisible(true); }}
                        >
                            <Text style={{ color: 'white' }}>Tất cả thành viên</Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalAddAdminVisible}
                            onRequestClose={() => setModalAddAdminVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalAddAdminVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                    <Options2 conversation={conversation} type={'AddAdmin'} userId={userId} />
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalAddMemberVisible}
                            onRequestClose={() => setModalAddMemberVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalAddMemberVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                    <Options2 conversation={conversation} type={'AddMember'} userId={userId} />
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalViewMemberVisible}
                            onRequestClose={() => setModalViewMemberVisible(false)}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalViewMemberVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                    <Options2 conversation={conversation} type={'ViewMember'} userId={userId} />
                                </View>
                            </View>
                        </Modal>




                        {/* Button giải tán nhóm */}
                        <TouchableOpacity
                            style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', height: 40, marginTop: 10 }}
                            onPress={() => { handleDeleteGroup(); }}
                        >
                            <Text style={{ color: 'white' }}>Giải tán nhóm</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            )}
            {/* Tên nhóm */}


        </View>
    )

}

export default Options;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});