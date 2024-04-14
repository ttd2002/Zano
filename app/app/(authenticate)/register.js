import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from './config_firebase.js';
import firebase from 'firebase/compat/app';
import { ipAddress } from '../../config/env.js';
import { router, useRouter } from 'expo-router'


const register = () => {

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('');
    const router = useRouter();
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
            .then(() => {
                handleRegister()
            })
            .catch((error) => {
                alert("Xác thực thất bại")
            })
    }
    const handleRegister = () => {
        const user = {
            name: name,
            phone: phone,
            password: password,
        };
        axios
            .post(`http://${ipAddress}:3000/auth/register`, user)
            //.post("http://10.0.2.2:3000/register", user)
            .then((response) => {
                console.log(response);
                alert("success");
                setName("");
                setPhone("");
                setPassword("");
            })
            .catch((error) => {
                alert("fail");
                console.log("registration failed", error);
            });
    };
    
    return (
        !verificationId ?
            <View style={styles.container}>
                <TextInput
                    value={name}
                    onChangeText={(txt) => setName(txt)}
                    placeholder='Tên'
                    style={{ width: '100%', height: 50, padding: 15, borderBottomWidth: 1, borderBottomColor: 'grey' }}
                />
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
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <Pressable
                    onPress={() => {
                        if (phone === '' || name === '' || password === '') {
                            alert("Vui lòng nhập đầy đủ thông tin")
                        }
                        else {
                            // sendVerification()
                            handleRegister()
                        }
                    }}
                    style={{ marginTop: 20, height: 50, width: 150, borderWidth: 1, borderColor: '#00abf6', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ color: 'black', fontSize: 20, fontStyle: 'normal' }}>Đăng ký</Text>
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

export default register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
})