import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from './config_firebase.js';
import firebase from 'firebase/compat/app';
import { ipAddress } from '../../config/env.js';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ForgotPassword = () => {
    const router = useRouter();

    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('');

    const [verificationId, setVertificationId] = useState(null);
    const recaptchaVerifier = useRef(null);

    const sendVerification = () => {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
            .verifyPhoneNumber('+84 ' + phone.substring(1), recaptchaVerifier.current)
            .then(setVertificationId)
            .catch((error) => {
                console.log(error)
                alert("Định dạng số điện thoại không đúng")
            });
    }
    const confirmCode = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
        firebase.auth().signInWithCredential(credential)
            .then(async () => {
                await AsyncStorage.setItem("phone", phone);
                router.push({
                    pathname: '/(authenticate)/changePassword',
                    query: { phone: phone }
                })
            })
            .catch((error) => {
                alert("Xác thực thất bại")
            })
    }
    const handelForgotPassword = async () => {
        try {
            // Gửi yêu cầu kiểm tra số điện thoại tới server
            const response = await axios.post(`http://${ipAddress}:3000/auth/checkPhoneExistApp`, {
                phone: phone,
            });

            // Xử lý kết quả từ server
            if (response.data.exists) {
                // Alert.alert("User exists");
                sendVerification()
                router.navigate({
                    pathname: '/(authenticate)/changePassword',
                    params: {
                        phone: phone
                    }
                })
            } else {
                Alert.alert("Không tìm thấy");
            }
        } catch (error) {
            // console.error('Error checking phone existence:', error);
            Alert.alert(error.response?.data?.message || "Failed to check phone existence");
        }
    };
    return (
        !verificationId ?
            <View style={styles.container}>
                <TextInput
                    value={phone}
                    onChangeText={(txt) => setPhone(txt)}
                    placeholder='Số điện thoại'
                    style={{ width: '100%', height: 50, padding: 15, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                />
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <Pressable
                    onPress={() => {
                        if (phone === '') {
                            alert("Vui lòng nhập đầy đủ thông tin")
                        }
                        else {
                            handelForgotPassword();


                        }
                    }}
                    style={{ marginTop: 20, height: 50, width: 150, borderWidth: 1, borderColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ color: 'black', fontSize: 20, fontStyle: 'normal' }}>Tìm kiếm</Text>
                </Pressable>
            </View>
            :
            <View style={styles.container}>
                <TextInput
                    value={code}
                    onChangeText={(txt) => setCode(txt)}
                    placeholder='mã xác thực'
                    style={{ width: '100%', height: 50, padding: 15, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                />

                <Pressable
                    onPress={() => {
                        confirmCode()
                        setVertificationId(null)
                    }}
                    style={{ marginTop: 20, height: 50, width: 150, borderWidth: 1, borderColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ color: 'black', fontSize: 20, fontStyle: 'normal' }}>Xác thực</Text>
                </Pressable>

            </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
})