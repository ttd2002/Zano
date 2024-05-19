import { useRoute } from '@react-navigation/core';
import axios from 'axios';
import { useRouter,useNavigation,useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet,TouchableOpacity,Alert } from 'react-native';
import { ipAddress } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
const ChangePassword = () => {
    const navigation = useNavigation();
    const router = useRouter()
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const params = useLocalSearchParams();
    const handleChangePassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Mật khẩu mới không trùng khớp');
            return;
        }
    
        try {
            // Gửi yêu cầu đổi mật khẩu tới server
            const response = await axios.post(`http://${ipAddress}:3000/auth/changePasswordByPhone`, {
                phone: params?.phone,
                newPassword: newPassword,
            });
    
            // Xử lý kết quả từ server
            Alert.alert(response.data.message);
            router.replace({
                pathname: '/(authenticate)/home'
            })
    
            // Reset các trường về rỗng sau khi đổi mật khẩu thành công
            setNewPassword('');
            setConfirmNewPassword('');
    
            // Chuyển hướng hoặc hiển thị thông báo khác tùy vào kết quả
        } catch (error) {
            // console.error('Error changing password:', error);
            Alert.alert(error.response.data.message); 
        }
    };
   
    console.log(params?.phone)

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
                <View style={{ width: 80 }}></View>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Mật khẩu mới:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <Text style={styles.label}>Xác nhận mật khẩu mới:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#00abf6',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    backButton: {
        color: 'white',
        fontSize: 16,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#00abf6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ChangePassword;
