
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { mdiAccountGroupOutline } from '@mdi/js';
import Icon from '@mdi/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ipAddress } from '../../../config/env';
import axios from 'axios';
import UserChat from '../../../components/userChat';

const Group = () => {
    const router = useRouter();
    const [messaged, setMessaged] = useState([]);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        const fetchUser = async () => {

            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            setUserId(userId);
        };
        fetchUser();
        if (userId) {
            fetchUserMessaged();
        }
    }, [userId]);
    const fetchUserMessaged = async () => {
        try {
            const response = await axios.get(
                `http://${ipAddress}:3000/mes/${userId}/messaged`
            );

            const userMessaged = response.data.filter(item => item.isGroupChat === true);
            setMessaged(userMessaged);


        } catch (error) {
            console.log("Error", error);
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15 }}
                onPress={() => {
                    router.navigate({
                        pathname: '/PhoneBook/createGroup',
                    })
                }}>
                <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 50, alignItems: 'center', gap: 18 }}>
                    <AntDesign name="addusergroup" size={35} color="black" />
                    <Text style={{ fontWeight: '500', fontSize: 18 }}>Tạo nhóm mới</Text>
                </View>
            </TouchableOpacity>



            <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15, marginTop: 4 }}>
                <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', alignItems: 'center', gap: 18 }}>
                    <View style={{ width: '65%' }}>
                        <Text style={{ fontWeight: '400', fontSize: 15 }}>Nhóm đang tham gia ({messaged.length})</Text>

                    </View>
                    {/* <View style={{ width: '35%' }}>
                        <Text style={{ fontWeight: '400', fontSize: 15 }}>Hoạt động cuối</Text>
                    </View> */}
                </View>

                {/* <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}>
                    <Image style={{ width: 30, height: 30 }} source={require('../../../assets/icon.png')} />
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontWeight: '700', fontSize: 15 }}>Thanh toán nhanh</Text>
                        <Text style={{ fontWeight: '400', fontSize: 13 }}>Bỏ qua OTP với các giao dịch dưới 300.000đ</Text>
                    </View>
                </View> */}
                <ScrollView>
                    {messaged?.map((item, index) => (
                        <UserChat key={index} userId={userId} item={item} />
                    ))}
                    <View style={{ height: 80 }}></View>
                </ScrollView>

            </View>
        </View>
    );
}

export default Group

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C7C8CC',
        alignItems: 'center',
        // justifyContent: 'center',
    },
});
