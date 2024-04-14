import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ipAddress } from '../../config/env'
const login = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const handleLogin = async () => {
        const user = {
          phone: phone,
          password: password,
        };
        try {
          const response = await axios.post(`http://${ipAddress}:3000/auth/login`, user);
          const user2 = response.data.user;
          const token = response.data.token;
          console.log(token,user2);
          AsyncStorage.setItem("auth", JSON.stringify(user2));
          AsyncStorage.setItem("token", token);
          router.replace("/(tabs)/Message");
        } catch (error) {
          console.error("Error:", error);
        }
      };
      
    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                value={phone}
                onChangeText={(txt) => setPhone(txt)}
                placeholder='Số điện thoại'
                style={{ width: '100%', height: 50, padding: 15, borderBottomWidth: 1, borderBottomColor: 'grey' }}
            />
            <TextInput
                value={password}
                onChangeText={(txt) => setPassword(txt)}
                placeholder='Mật khẩu'
                secureTextEntry
                style={{ width: '100%', height: 50, padding: 15, borderBottomWidth: 1, borderBottomColor: 'grey' }}
            />
            <TouchableOpacity
                onPress={handleLogin}
                style={{ height: 50, width: 150, backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: 20 }}>
                <Text style={{ color: 'white', fontSize: 20, fontStyle: 'normal' }}>Đăng nhập</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
})