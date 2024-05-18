import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'; // Import thư viện axios để gửi yêu cầu API
import { ipAddress } from "../../../config/env";
const ChangePasswordPage = () => {
    const navigation = useNavigation();
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            setUserId(userId);
        } catch (error) {
            // console.error("Error fetching user data", error);
        }
    };

    const handleChangePassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Mật khẩu mới không trùng khớp');
            return;
        }
    
        try {
            // Gửi yêu cầu đổi mật khẩu tới server
            const response = await axios.post(`http://${ipAddress}:3000/auth/changePassword`, {
                userId: userId,
                oldPassword: currentPassword,
                newPassword: newPassword,
            });
    
            // Xử lý kết quả từ server
            Alert.alert(response.data.message);
    
            // Reset các trường về rỗng sau khi đổi mật khẩu thành công
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
    
            // Chuyển hướng hoặc hiển thị thông báo khác tùy vào kết quả
        } catch (error) {
            // console.error('Error changing password:', error);
            Alert.alert(error.response.data.message); 
        }
    };
    

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
                <Text style={styles.label}>Mật khẩu hiện tại:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
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

export default ChangePasswordPage;
