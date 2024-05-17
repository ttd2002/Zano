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
import { io } from 'socket.io-client';

import CryptoJS from 'crypto-js';
import { getRandomBytes } from 'react-native-get-random-values';
// import { Promise } from "core-js";

// const fs = require('fs');
// import RNFetchBlob from 'rn-fetch-blob';
// import {blob} from "react-native-fetch-blob"
const { View, ImageBackground, Image, TouchableOpacity, Text, StyleSheet, Modal, TextInput, Pressable, Platform, TouchableWithoutFeedback } = require("react-native")

const EditInformation = () => {
    const socket = io(`http://${ipAddress}:8000`);

    const navigate = useNavigation()
    const today = new Date();
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('vi-VN', options);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const [showPicker, setShowPicker] = useState(false);

    const [userId, setUserId] = useState("");
    const [birthDate, setBirthDate] = useState(formattedDate);

    const [date, setDate] = useState(new Date());

    const [selectedId, setSelectedId] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [avatar, setAvatar] = useState("");
    const [token, setToken] = useState("");
    const [photo, setPhoto] = useState(null)
    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Nam',
            value: '1'
        },
        {
            id: '2',
            label: 'Nữ',
            value: '0'
        }
    ]), []);
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async () => {
        try {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            const name = user.name;
            const phone = user.phone;
            const avatar = user.avatar;
            const gender = user.gender;
            const birthDate = user.birthDate;
            const token = await AsyncStorage.getItem("token");
            console.log(token);
            setToken(token)
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
    const [showDatePicker, setShowDatePicker] = useState(false);

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setBirthDate(currentDate.toLocaleDateString('vi-VN', options));
            }
        }
        else {
            toggleDatePicker();
        }
    };



    const handleButtonEdit = async () => {
        try {
            await handleUpdata();
            
            //router.replace("/Personal/InformationPage");
        } catch (error) {
            console.error("Error editing profile", error);
        }
    };


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
                const name = "imageUser.jpg"
                const filesize = result.assets[0].filesize
                const source = { uri, name, type }
                setPhoto(source)
                // console.log('source', source);
                // console.log(filesize);
                // await editProfileHandle(result.assets[0].uri);
                // await editProfileHandle(formData);
                // console.log(result);
                // handleUpdata(source)
                setAvatar(uri)
                setModalVisible(false)
            }
        } catch (error) {
            console.log("Error uploading Image: " + error)
            setModalVisible(false)
        }
    }
    const handleUpdata = async () => {
        const data = new FormData();

        if(photo){
            data.append('avatar', photo)
        }
        
        data.append('name', name)
        data.append('birthDate', birthDate)
        data.append('gender', selectedId==1?"male":"female")
        // data.append("upload_preset", "DemoZanoo")
        // data.append("cloud_name", "dbtgez7ua")
        // fetch("https://api.cloudinary.com/v1_1/dbtgez7ua/image/upload",{
        //     method:'POST',
        fetch(`http://${ipAddress}:3000/users/updateUser/${userId}`, {
            method: 'PUT',
            body: data,
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.json()).then(async data => {
            setAvatar(data.avatar)
            console.log(data);
            await AsyncStorage.setItem('auth', JSON.stringify(data));
            socket.emit("requestRender")
            router.replace({
                pathname: '/Personal/InformationPage',
            })
        })
        
    }

    // const saveImage = async (avatar) => {
    //     try {
    //         setAvatar(avatar)
    //         console.log("anh: ", avatar)
    //         editProfileHandle(avatar)
    //         setModalVisible(false)
    //     } catch (error) {
    //         throw error
    //     }
    // }
    // const editAvatarHandle = async () => {
    //     try {
    //         const response = await axios.put(
    //             `http://${ipAddress}:3000/users/${userId}/editAvatar`,
    //             {
    //                 avatar: avatar,
    //             }
    //         );
    //         console.log("Profile updated successfully", response.data);
    //     } catch (error) {
    //         console.error("Error editing profile", error);
    //     }
    // };

    // const readFileData = (path) => {
    //     return new Promise((resolve, reject) => {
    //         fs.readFile(path, (err, data) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // };
    // const editProfileHandle = async () => {
    //     // try {
    //     // Tải dữ liệu của hình ảnh từ đường dẫn
    //     // const responseFetch = await fetch(avatar);
    //     // const blob = await responseFetch.blob();

    //     // Tạo đối tượng file từ dữ liệu đã tải xuống
    //     // const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

    //     // Tạo formData và thêm đối tượng file vào đó
    //     // const formData = new FormData();
    //     // formData.append('avatar', file);
    //     // formData.append('name', name);
    //     // formData.append('birthDate', birthDate);
    //     // formData.append('gender', selectedId === "1" ? "male" : "female");

    //     // Gửi request axios với formData
    //     const responseAxios = await axios.put(
    //         `http://${ipAddress}:3000/users/${userId}/editProfile`,
    //         {
    //             // body: avatar,
    //             // headers: {
    //             //     Authorization: `Bearer ${token}`,
    //             //     'Content-Type': 'multipart/form-data'
    //             // }
    //             name,
    //             gender: selectedId === "1" ? "male" : "female",
    //             birthDate
    //         },
    //         {
    //             headers: {
    //                 // Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         }
    //     );

    //     // Xử lý phản hồi từ server
    //     const user2 = responseAxios.data;
    //     console.log("stad", user2);
    //     // Kiểm tra và xử lý phản hồi

    //     // } catch (error) {
    //     //     console.error("Lỗi khi chỉnh sửa thông tin", error);
    //     // }

    // };


    console.log(selectedId);
    return (
        <View style={styles.container}>
            <View style={{ height: 'auto', width: '100%', backgroundColor: '#00abf6', flexDirection: 'row', alignItems: 'center', padding: 10, gap: 15 }}>
                <TouchableOpacity
                    onPress={() => {
                        router.replace({
                            pathname: '/Personal/InformationPage',
                        })
                    }}
                >
                    <Feather name="x" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, fontStyle: 'normal' }}>Thông tin cá nhân</Text>
            </View>
            <View style={{ height: '40%', width: '100%', backgroundColor: '#fff', padding: 15, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => { setModalVisible(true) }}
                    >
                        <Image style={{
                            width: 60,
                            height: 60,
                            borderRadius: 60,
                            resizeMode: "contain",
                            borderWidth: 1,
                            borderColor: 'white'

                        }} source={{ uri: avatar ? avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                    </TouchableOpacity>

                    <View style={{ marginLeft: 15, width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '100%', height: 35, flexDirection: 'row', borderBottomWidth: 0.5, borderColor: 'grey', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput
                                value={name}
                                onChangeText={(txt) => setName(txt)}
                                style={{ width: '80%', height: 25, fontSize: 18 }}
                            />
                            <AntDesign name="edit" size={24} color="black" />
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                display="spinner"
                                value={date}
                                onChange={onChange}
                                maximumDate={new Date()}
                            />
                        )}
                        <View style={{ width: '100%', height: 35, flexDirection: 'row', alignItems: 'flex-end', borderBottomWidth: 0.5, borderColor: 'grey', justifyContent: 'space-between', marginBottom: 5 }}>
                            {/* {showPicker && Platform.OS === "ios" && (
                                <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
                                    <TouchableOpacity onPress={toggleDatePicker}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )} */}
                            {!showPicker && (
                                <TouchableOpacity onPress={toggleDatePicker}>
                                    <TextInput
                                        value={birthDate}
                                        onChangeText={setBirthDate}
                                        style={{ width: '100%', height: 25, color: 'black', fontSize: 18 }}
                                        editable={false} // editable = false để ko kích hoạt bàn phím
                                    />
                                </TouchableOpacity>
                            )}
                            <AntDesign name="edit" size={24} color="black" />
                        </View>
                        <RadioGroup
                            radioButtons={radioButtons}
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            layout='row'

                        />
                    </View>
                </View>
                <UploadModal
                    modalVisible={modalVisible}
                    onBackPress={() => setModalVisible(false)}
                    cancelable
                    onCameraPress={() => uploadImage()}
                    onGalleryPress={() => uploadImage("gallery")}
                ></UploadModal>
                <TouchableOpacity
                    onPress={() => {
                        handleButtonEdit()
                        
                    }}
                    style={{ height: 50, width: '95%', backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 20, fontStyle: 'normal' }}>Lưu</Text>
                </TouchableOpacity>
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
export default EditInformation;