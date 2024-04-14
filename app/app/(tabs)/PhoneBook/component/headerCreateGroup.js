import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import UploadModal from './UploadModal';
import * as ImagePicker from "expo-image-picker"
import axios from 'axios';
import { ipAddress } from '../../../../config/env';
const HeaderCreateGroup = ({ dataCreateGroup, setDataCreateGroup, onChangeText, userId }) => {
    const router = useRouter();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
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
    const saveImage = async (avatar) => {
        try {
            setAvatar(avatar)
            console.log("anh: ", avatar)
            editAvatarHandle()
            setModalVisible(false)
        } catch (error) {
            throw error
        }
    }
    const editAvatarHandle = async () => {
        try {
            const response = await axios.put(
                `http://${ipAddress}:3000/users/${userId}/editAvatar`,
                {
                    avatar: avatar,
                }
            );
            console.log("Profile updated successfully", response.data);
        } catch (error) {
            console.error("Error editing profile", error);
        }
    };
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
                <View style={{ height: 'auto', width: '85%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>Nhóm mới</Text>
                    <Text>Đã chọn: {dataCreateGroup.members.length}</Text>
                </View>
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