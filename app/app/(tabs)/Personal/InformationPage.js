import { AntDesign, Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useMemo, useState, useEffect } from "react";
import { RadioGroup } from "react-native-radio-buttons-group";
import DateTimePicker from "@react-native-community/datetimepicker"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64"
import axios from "axios";
import UploadModal from "./UploadModal";
global.atob = decode;
import * as ImagePicker from "expo-image-picker"
import { ipAddress } from "../../../config/env";

const { View, ImageBackground, Image, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Pressable, Platform } = require("react-native")

const InformationPage = () => {
    const today = new Date();
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('vi-VN', options);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [showPicker, setShowPicker] = useState(false);

    const [userId, setUserId] = useState("");
    const [birthDate, setBirthDate] = useState(formattedDate);

    const [date, setDate] = useState("");

    const [selectedId, setSelectedId] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState("");

    const uploadImage = async (mode)=>{
        try {
            let result = {};
            if(mode === "gallery"){
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality: 1,
                })
            }else{
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    cameraType: ImagePicker.CameraType.front,
                    allowsEditing: true,
                    aspect: [1,1],
                    quality: 1,
                });
            }   
            if(!result.canceled){
                await saveImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error uploading Image: " + error)
            setModalVisible(false)
        }
    }
    const saveImage = async (avatar) =>{
        try {
            setAvatar(avatar)
            console.log("anh: ", avatar)
            editAvatarHandle()
            setModalVisible(false)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        try {
            const token = await AsyncStorage.getItem("auth");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            const name = decodedToken.uName;
            const phone = decodedToken.phone;
            const avatar = decodedToken.uAvatar;
            const gender = decodedToken.uGender;
            const birthDate = decodedToken.uBirthDate;
            setUserId(userId);
            setName(name);
            setPhone(phone);
            setAvatar(avatar);
            setGender(gender);
            setBirthDate(birthDate !== "" ? birthDate : formattedDate);
            if (gender === "male") {
                setSelectedId("1");
            } else if (gender === "female") {
                setSelectedId("2");
            } else {
                setSelectedId("");
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };
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

        <View>
            <View style={{ width: '100%', height: 200, justifyContent: 'flex-start' }}>
                <ImageBackground style={{ width: '100%', height: 200, flex: 1, justifyContent: 'flex-start' }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_pw1BpBfuZAevTRIg7RFQD1NZzdrEy016w&s' }}>
                    <TouchableOpacity style={{ width: '15%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
                        onPress={() => { router.replace('/Personal/settingPage') }}>
                        <AntDesign name="arrowleft" size={30} color="white" />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => { setModalVisible(true) }}
                        >
                            <Image style={{ height: 60, width: 60, marginTop: 85, borderWidth: 1, borderColor: 'white', borderRadius: 100, margin: 10 }} 
                            source={{ uri: avatar? avatar :  'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }}></Image>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 23, fontWeight: 'normal', marginTop: 100, color: 'white' }}>{name}</Text>
                    </View>

                </ImageBackground>
            </View>
            <UploadModal
                modalVisible={modalVisible}
                onBackPress={() => setModalVisible(false)}
                cancelable
                onCameraPress={()=> uploadImage()}
                onGalleryPress={()=> uploadImage("gallery")}

            >

            </UploadModal>
            <View style={{ padding: 20, backgroundColor: 'white' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Thông tin cá nhân</Text>
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                    <Text style={{ width: '30%' }}>Giới tính:</Text>
                    <Text>{gender === "male" ? "Nam" : "Nữ"}</Text>
                </View>
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', marginTop: 2 }}>
                    <Text style={{ width: '30%' }}>Ngày sinh:</Text>
                    <Text>{birthDate}</Text>
                </View>
                <View style={{ flexDirection: 'row', height: 50, alignItems: 'center', marginTop: 2 }}>
                    <Text style={{ width: '30%' }}>Điện thoại:</Text>
                    <Text>+84 {phone}</Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => { 
                            router.navigate({
                                pathname: '/Personal/editInformation',
                            })
                         }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, height: 40, backgroundColor: 'grey', borderRadius: 20 }}>
                            <FontAwesome name="pencil-square-o" size={18} color="black" />
                            <Text style={{ padding: 3, fontWeight: 'normal' }}>Chỉnh sửa</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff9',
        alignItems: 'center',
    },
})
export default InformationPage;