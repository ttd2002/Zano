
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { mdiAccountGroupOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Group = () => {
    const router = useRouter();

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
                    <Text style={{ fontWeight: '450', fontSize: 18 }}>Tạo nhóm mới</Text>
                </View>
            </TouchableOpacity>



            <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15, marginTop: 4 }}>
                <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', alignItems: 'center', gap: 18 }}>
                    <View style={{ width: '65%' }}>
                        <Text style={{ fontWeight: '400', fontSize: 15 }}>Nhóm đang tham gia ()</Text>
                    </View>
                    <View style={{ width: '35%' }}>
                        <Text style={{ fontWeight: '400', fontSize: 15 }}>Hoạt động cuối</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}>
                    <Image style={{ width: 30, height: 30 }} source={require('../../../assets/icon.png')} />
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontWeight: '700', fontSize: 15 }}>Thanh toán nhanh</Text>
                        <Text style={{ fontWeight: '400', fontSize: 13 }}>Bỏ qua OTP với các giao dịch dưới 300.000đ</Text>
                    </View>
                </View>
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
