import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Image, ImageBackground, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
global.atob = decode;

const ProfilePage = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            // const decodedToken = jwtDecode(token);
            const userId = user._id;
            const name = user.name;
            const avatar = user.avatar;
            setUserId(userId);
            setName(name);
            setAvatar(avatar)
            // console.log(user.name);
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <View style={{ width: '100%', height: 350, justifyContent: 'flex-start' }}>
                <ImageBackground style={{ width: '100%', height: 200, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_pw1BpBfuZAevTRIg7RFQD1NZzdrEy016w&s' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginLeft: '84%', marginTop: 10 }}
                            onPress={() => {
                                setModalVisible(true);
                            }}>
                            <MaterialIcons name="more-horiz" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Image style={{ height: 130, width: 130, marginTop: 90, borderWidth: 5, borderColor: 'white', borderRadius: 100 }} source={{ uri: avatar ? avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }}></Image>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 23, fontWeight: '600', marginTop: 3 }}>{name}</Text>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <FontAwesome name="pencil-square-o" size={18} color="blue" />
                            <Text style={{ padding: 3, color: 'blue' }}>Cập nhật giới thiệu bản thân</Text>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
            <Pressable style={{ backgroundColor: 'white', height: 55, margin: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 15, borderRadius: 10 }}>
                <Text style={{ color: 'grey', fontSize: 16, width: '85%', borderRightWidth: 1, borderRightColor: 'grey' }}>Bạn đang nghĩ gì?</Text>
                <FontAwesome6 name="image" size={24} color="green" />
            </Pressable>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                        <TouchableOpacity style={{marginTop:10, justifyContent: 'center', height:45}}
                            onPress={() => {
                                // Handle chuyển tới trang thông tin cá nhân
                                router.navigate({
                                    pathname: '/Personal/InformationPage',
                                })
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Thông tin cá nhân</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{justifyContent: 'center', height:45}}
                            onPress={() => {
                                // Handle chuyển tới trang đổi mật khẩu
                                router.navigate({
                                    pathname: '/Personal/changePassword',
                                })
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Đổi mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{justifyContent: 'center', height:45}}
                            onPress={() => {
                                // Handle đăng xuất
                                router.replace('(authenticate)/home')
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Đăng xuất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                            style={{ position: 'absolute', top: 10, right: 10 }}
                        >
                            <FontAwesome name="times" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ProfilePage;
