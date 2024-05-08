import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from './config_firebase.js';
import firebase from 'firebase/compat/app';
import { ipAddress } from '../../config/env.js';
import { router, useRouter } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { RadioGroup } from 'react-native-radio-buttons-group';
import DateTimePicker from "@react-native-community/datetimepicker"


const register = () => {
    const today = new Date();
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('vi-VN', options);
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('');
    const router = useRouter();
    const [verificationId, setVertificationId] = useState(null);
    const recaptchaVerifier = useRef(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [birthDate, setBirthDate] = useState(formattedDate);
    const [gender, setGender] = useState('2');
    const [date, setDate] = useState(new Date());

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Nam',
            value: '1'
        },
        {
            id: '2',
            label: 'Nữ',
            value: '0'
        }
    ]), []);
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
    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
            if (Platform.OS === "android") {
                toggleDatePicker();
                setBirthDate(currentDate.toLocaleDateString('vi-VN', options));
            }
        }
        else {
            toggleDatePicker();
        }
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
                {/* {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={onChange}
                        maximumDate={new Date()}
                    />
                )}
                <View style={{ width: '100%', height: 50, paddingLeft: 15, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                    <Text>Ngày sinh</Text>
                    <TouchableOpacity onPress={toggleDatePicker}>
                        <TextInput
                            value={birthDate}
                            onChangeText={setBirthDate}
                            style={{ width: '100%', color: 'black', fontSize: 18 }}
                            editable={false} // editable = false để ko kích hoạt bàn phím
                        />
                    </TouchableOpacity>
                    <AntDesign name="edit" size={24} color="black" />
                </View>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setGender}
                    selectedId={gender}
                    layout='row'
                /> */}
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
                            sendVerification()
                            // handleRegister()
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
                        router.navigate("/login")
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