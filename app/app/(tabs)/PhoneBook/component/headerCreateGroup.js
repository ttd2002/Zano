import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import UploadModal from './UploadModal';
import * as ImagePicker from "expo-image-picker"
import axios from 'axios';
import { ipAddress } from '../../../../config/env';
import { io } from 'socket.io-client';
const HeaderCreateGroup = ({ dataCreateGroup, setDataCreateGroup, onChangeText, userId }) => {
    const router = useRouter();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [source, setSource] = useState(null);
    const socket = io(`http://${ipAddress}:8000`);

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
                // console.log(result);
            }
        } catch (error) {
            console.log("Error uploading Image: " + error)
            setModalVisible(false)
        }
    }

    const handleCreateGroup = async () => {
        if (dataCreateGroup.members.length < 2) {
            Alert.alert("Cần ít nhất 3 thành viên để tạo group")
        } else if (dataCreateGroup.nameGroup.trim() === '') {
            Alert.alert("Vui lòng nhập tên cho nhóm");
        } else {
            const data = new FormData();
            data.append('groupAvatar', source)
            data.append('admin', userId) //admin, nameGroup, members, groupAvatar
            // data.append('members', dataCreateGroup.members)
            dataCreateGroup.members.forEach(member => {
                data.append('members[]', member);
            });
            data.append('members[]', userId);
            data.append('nameGroup', dataCreateGroup.nameGroup)
            fetch(`http://${ipAddress}:3000/group/createGroupApp`, {
                method: 'POST',
                body: data,
                headers: {
                    // Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => res.json()).then(data => {
                // console.log(data.group);
                if(data.group){
                    router.replace("/PhoneBook");
                    Alert.alert('Tạo group thành công', '', [
                        {
                            text: 'OK',
                            onPress: () => {
                                socket.emit("requestRender");
                                router.replace("/Message");
                            },
                        },
                    ]);
                }else{
                    Alert.alert('Tạo group thất bại')
                }

            })
        }




    }
    return (
        <SafeAreaView style={{ height: 'auto', width: '100%' }}>
            <View style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#00abf6', padding: 20 }}>
                <TouchableOpacity style={{ width: '8%', height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
                    onPress={() => {
                        // router.navigate('(tabs)/PhoneBook');
                        navigation.goBack();
                    }}>
                    <AntDesign name="arrowleft" size={24} color="black" />

                </TouchableOpacity>
                <View style={{ height: 'auto', width: '65%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>Nhóm mới</Text>
                    <Text>Đã chọn: {dataCreateGroup.members.length}</Text>
                </View>
                <TouchableOpacity style={{ height: 30, width: '15%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                    onPress={() => {
                        handleCreateGroup();
                    }}
                >
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>Tạo</Text>
                </TouchableOpacity>
            </View>

            <View style={{ width: '100%', height: 75, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 30 }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                >
                    {avatar ? <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: avatar }} /> : <Entypo name="camera" size={32} height={35} color="black" />}
                </TouchableOpacity>

                <View style={{ height: 'auto', width: '80%' }}>
                    <TextInput style={styles.HideTextInput} onChangeText={onChangeText} value={dataCreateGroup.nameGroup} placeholder='Đặt tên nhóm'></TextInput>
                </View>
                <UploadModal
                    modalVisible={modalVisible}
                    onBackPress={() => setModalVisible(false)}
                    cancelable
                    onCameraPress={() => uploadImage()}
                    onGalleryPress={() => uploadImage("gallery")}
                ></UploadModal>
            </View>

            <View style={{ width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }}>
                <View style={{ borderRadius: 10, backgroundColor: '#F1EFEF', width: '90%', height: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                    <Ionicons name="search" size={24} height={22} color="black" />
                    <View style={{ height: 15, width: '90%' }}>
                        <TextInput style={styles.HideTextInput} placeholder='Tìm tên hoặc số điện thoại'></TextInput>
                    </View>
                </View>
            </View>
        </SafeAreaView>

    );
}

export default HeaderCreateGroup

const styles = StyleSheet.create({
    HideTextInput: {
        width: '100%',
        height: 22,
        // outlineColor: 'transparent',
        fontSize: 18,
        color: 'grey',
    }, checkbox: {
        alignSelf: 'center',
    }
});