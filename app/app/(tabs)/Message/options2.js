import React, { useRef, useEffect } from "react";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { ipAddress } from "../../../config/env";
import UploadModal from "../PhoneBook/component/UploadModal";
import * as ImagePicker from "expo-image-picker"
import Checkbox from "expo-checkbox";
import { io } from 'socket.io-client';

const Options2 = ({ type, conversation, userId }) => {
    const router = useRouter();
    const socket = io(`http://${ipAddress}:8000`);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    console.log('windowWidth', windowWidth);
    console.log('windowHeight', windowHeight);
    const [friends, setFriends] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [dataFinal, setDataFinal] = useState([]);
    useEffect(() => {
        fetchFriends();
    }, [type]);

    useEffect(() => {
        const handleTypeChange = async () => {
            if (type === 'AddAdmin') {
                let updatedParticipants = [...conversation.participants];
                // updatedParticipants = updatedParticipants.filter(participant => {
                //     const exists = conversation.listAdmins.some(admin => admin === participant._id);
                //     return !exists;
                // });
                setDataFilter(updatedParticipants);
                setDataFinal(conversation.listAdmins)
            }
            if (type === 'AddMember') {
                let updatedlistFriend = [...friends];
                updatedlistFriend = updatedlistFriend.filter(friend => {
                    const exists = conversation.participants.some(participant => participant._id === friend._id);
                    return !exists;
                });

                setDataFilter(updatedlistFriend);
                setDataFinal(conversation.participants.map(member => member._id));
            }
            if (type === 'ViewMember') {
                /*                 let updatedParticipants = [...conversation.participants];
                                updatedParticipants = updatedParticipants.filter(participant => {
                                    const exists = conversation.listAdmins.some(admin => admin === participant._id);
                                    return !exists;
                                }); */
                setDataFilter(conversation.participants);
                setDataFinal(conversation.participants);
            }
            if (type === 'ChangeLeader') {
                /*                 let updatedParticipants = [...conversation.participants];
                                updatedParticipants = updatedParticipants.filter(participant => {
                                    const exists = conversation.listAdmins.some(admin => admin === participant._id);
                                    return !exists;
                                }); */
                setDataFilter(conversation.participants);
                setDataFinal(conversation.participants);
            }
        };
        handleTypeChange();
    }, [friends, type]);


    console.log('listFriend', friends);
    console.log('userId', userId);
    console.log('participants', conversation.participants);
    console.log('listAdmin', conversation.listAdmins);

    console.log('dataFilter', dataFilter);
    console.log('dataFinal', dataFinal);
    const fetchFriends = async () => {
        try {
            const response = await axios.get(`http://${ipAddress}:3000/users/${userId}/friends`);
            const friendInitialSort = response.data.friends.sort((a, b) => {
                const nameA = a.name?.toUpperCase();
                const nameB = b.name?.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            setFriends(groupByNameInitial(friendInitialSort));
            setFriends(response.data.friends);
            // setFriends(response.data.friends)
        } catch (error) {
            console.error('Error fetching friends:', error);
        }

    };
    const groupByNameInitial = (dataList) => {
        const groups = new Map();
        dataList.forEach((item) => {
            const initial = item.name.charAt(0).toUpperCase();
            if (!groups.has(initial)) {
                groups.set(initial, []);
            }
            groups.get(initial).push(item);
        });
        return Array.from(groups.values());
    };
    const handleCheckboxChange = (userId) => {
        const memberIndex = dataFinal.indexOf(userId);
        console.log('userId', userId);
        console.log('memberIndex', memberIndex);
        if (memberIndex !== -1) {
            // Loại bỏ ID của thành viên khỏi mảng members
            const updatedDataFinal = [...dataFinal];
            updatedDataFinal.splice(memberIndex, 1);
            setDataFinal(updatedDataFinal);
        } else {
            const memberToAdd = dataFilter.find(item => item._id === userId);
            console.log('memberToAdd', memberToAdd);
            if (memberToAdd) {
                // Thêm ID của thành viên mới vào mảng members
                setDataFinal(prevData => [...prevData, userId]);
            }
        }
        console.log('dataFinal', dataFinal);
    };
    const handleDeleteMember = async (memId) => {
        console.log('memId', memId);
        fetch(`http://${ipAddress}:3000/group/conversation/removeMember`, {
            method: 'PUT',
            body: JSON.stringify({
                conversationId: conversation._id,
                memberId: memId
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' // Sử dụng 'application/json' thay vì 'multipart/form-data'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.conversation);
                if (data.conversation) {
                    const updatedParticipants = dataFilter.filter(participant => participant._id !== memId);
                    console.log('updatedParticipants', updatedParticipants);
                    // Cập nhật dữ liệu mới cho state
                    setDataFilter([...updatedParticipants]);
                    Alert.alert('Xóa thành công')
                    socket.emit("requestRender");
                } else {
                    Alert.alert('Thay doi group thất bại')
                }
            })
            .catch(error => {
                // console.error('Error deleting member:', error);
                Alert.alert('Xóa thành viên thất bại');
            });
    }
    const handleAddAdmin = async () => {
        fetch(`http://${ipAddress}:3000/group/conversation/updateMember`, {
            method: 'PUT',
            body: JSON.stringify({
                conversationId: conversation._id,
                admins: dataFinal
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' // Sử dụng 'application/json' thay vì 'multipart/form-data'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.conversation);
                if (data.conversation) {
                    Alert.alert('Cập nhật thành công')
                    socket.emit("requestRender");
                } else {
                    Alert.alert('Add admin thất bại')
                }
            })
            .catch(error => {
                // console.error('Error deleting member:', error);
                Alert.alert('Xóa thành viên thất bại');
            });
    }
    const handleAddMembers = async (memId) => {
        console.log('memId', memId);
        fetch(`http://${ipAddress}:3000/group/conversation/updateMember`, {
            method: 'PUT',
            body: JSON.stringify({
                conversationId: conversation._id,
                members: dataFinal
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' // Sử dụng 'application/json' thay vì 'multipart/form-data'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.conversation);
                if (data.conversation) {


                    Alert.alert('Cập nhật thành công')
                    socket.emit("requestRender");
                } else {
                    Alert.alert('Thêm thành viên thất bại')
                }
            })
            .catch(error => {
                // console.error('Error deleting member:', error);
                Alert.alert('Thêm thành viên thất bại');
            });
    }
    const handleChangeLeader = async (memId) => {
        console.log('memId', memId);
        fetch(`http://${ipAddress}:3000/group/conversation/changeLeader`, {
            method: 'PUT',
            body: JSON.stringify({
                conversationId: conversation._id,
                memberId: memId
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' // Sử dụng 'application/json' thay vì 'multipart/form-data'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.conversation);
                if (data.conversation) {
                    // const updatedParticipants = dataFilter.filter(participant => participant._id !== memId);
                    // console.log('updatedParticipants', updatedParticipants);
                    // // Cập nhật dữ liệu mới cho state
                    // setDataFilter([...updatedParticipants]);
                    // conversation.leader = data.conversation.leader;
                    Alert.alert('Thay đổi thành công')
                    socket.emit("requestRender");
                } else {
                    Alert.alert('Thay đổi thất bại')
                }
            })
            .catch(error => {
                console.error('Error deleting member:', error);
                Alert.alert('Xóa thành viên thất bại');
            });
    }
    return (
        <View style={{ flex: 1, padding: 10, width: windowWidth * 8 / 10, }}>
            {type === 'ViewMember' && (
                dataFilter.map((item, subIndex) => (
                    <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 5, marginTop: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                            <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name} {item._id === conversation.leader ? ' (Trưởng nhóm)' : conversation.listAdmins.includes(item._id) ? ' (Phó nhóm)' : ''}</Text>

                            <View style={styles.section}>
                                {userId === conversation.leader && item._id!==userId ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleDeleteMember(item._id);
                                        }}
                                    >
                                        <AntDesign name="delete" size={24} color="black" />
                                    </TouchableOpacity>

                                ) : null}
                                {userId !== conversation.leader && item._id !== userId && item._id !== conversation.leader && !conversation.listAdmins.includes(item._id) && conversation.listAdmins.includes(userId) ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleDeleteMember(item._id);
                                        }}
                                    >
                                        <AntDesign name="delete" size={24} color="black" />
                                    </TouchableOpacity>
                                ) : null}

                            </View>
                        </View>
                    </View>
                ))

            )}
            {type === 'ChangeLeader' && (
                dataFilter.map((item, subIndex) => (
                    <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 5, marginTop: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                            <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name} {item._id === conversation.leader ? ' (Trưởng nhóm)' : conversation.listAdmins.includes(item._id) ? ' (Phó nhóm)' : ''}</Text>

                            <View style={styles.section}>
                                {item._id !== userId
                                    && item._id !== conversation.leader
                                    && conversation.listAdmins.includes(userId)
                                    ? (
                                        <TouchableOpacity style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 5 }}
                                            onPress={() => {
                                                handleChangeLeader(item._id);
                                            }}
                                        >
                                            <AntDesign name="key" size={24} color="gold" />
                                            <AntDesign name="user" size={24} color="black" />
                                        </TouchableOpacity>
                                    ) : null}

                            </View>
                        </View>
                    </View>
                ))

            )}
            {type === 'AddMember' && (
                <View>

                    {dataFilter.map((item, subIndex) => (
                        <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 5, marginTop: 2 }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                                <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name}</Text>
                                <View style={styles.section}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={dataFinal.includes(item._id)}
                                        onValueChange={() => handleCheckboxChange(item._id)}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={{ height: 40, width: '100%', backgroundColor: 'green', pading: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 10 }}
                        onPress={() => {
                            handleAddMembers()
                            // { type === 'AddMember' ? handleAddMembers() : handleAddAdmin() }
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 20 }}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            )}
            {type === 'AddAdmin' && (
                <View>

                    {dataFilter.map((item, subIndex) => (
                        <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 5, marginTop: 2 }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                                <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name}</Text>
                                <View style={styles.section}>
                                    {item._id !== userId && (<Checkbox
                                        style={styles.checkbox}
                                        value={dataFinal.includes(item._id)}
                                        onValueChange={() => handleCheckboxChange(item._id)}
                                    />)}

                                </View>
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={{ height: 40, width: '100%', backgroundColor: 'green', pading: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 10 }}
                        onPress={() => {
                            // { type === 'AddMember' ? handleAddMembers() : handleAddAdmin() }
                            handleAddAdmin()
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 20 }}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )

}

export default Options2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C7C8CC',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    HideTextInput: {
        width: '100%',
        height: 20,
        // outlineColor: 'transparent',outlineColor
        fontSize: 18,
        color: 'grey',
    }, section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        marginLeft: 28,
    },
});
