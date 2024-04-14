import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Pressable
                onPress={() => { router.navigate("/login") }}
                style={{ height: 50, width: 150, backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                <Text style={{ color: 'white', fontSize: 20, fontStyle: 'normal' }}>Đăng nhập</Text>
            </Pressable>
            <Pressable
                onPress={() => { router.navigate("/register") }}
                style={{ height: 50, width: 150, borderWidth: 1, borderColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                <Text style={{ color: 'black', fontSize: 20, fontStyle: 'normal' }}>Đăng ký</Text>
            </Pressable>
            <Pressable
                onPress={() => { router.navigate("/forgotPassword") }}
                style={{ height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                <Text style={{ color: 'black', fontSize: 15, fontStyle: 'normal' }}>Quên mật khẩu?</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
})