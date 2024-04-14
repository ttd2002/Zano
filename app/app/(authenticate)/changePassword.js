import { useRoute } from '@react-navigation/core';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { ipAddress } from '../../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
const ChangePassword = () => {
    const router = useRouter();
    const route = useRoute ();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // const {phone} = router.query;
    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            return;
        }
        console.log(phone);
        try {
            const response = await axios.put(`http://${ipAddress}:3000/users/changePassword`, {
                phone: phone, 
                newPassword: password 
            });
    
            console.log("Password changed successfully", response.data);
            Alert.alert('Password changed successfully');
            router.navigate({
                pathname: '/(authenticate)/home',
            })
        } catch (error) {
            console.error("Error changing password", error);
        }
    };
    

    return (
        <View style={styles.container}>
            <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Nhập mật khẩu mới"
                style={styles.input}
                secureTextEntry={true}
            />
            <TextInput
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                placeholder="Xác nhận mật khẩu mới"
                style={styles.input}
                secureTextEntry={true}
            />
            <Pressable
                onPress={handleChangePassword}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Xác nhận</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        height: 50,
        padding: 15,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    button: {
        marginTop: 20,
        height: 50,
        width: 150,
        borderWidth: 1,
        borderColor: '#00abf6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
        fontStyle: 'normal',
    },
});

export default ChangePassword;
