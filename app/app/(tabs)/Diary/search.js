import React, { useRef, useEffect } from "react";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

const Search = () => {
    const router = useRouter();
    const [userPhone, setUserPhone] = useState("");
    const navigation = useNavigation();

    const textInputRef = useRef(null);

    useEffect(() => {
        textInputRef.current.focus();
    }, []);

    return (
        <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
            <Pressable
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>
            <TextInput
                ref={textInputRef} 
                value={userPhone}
                onChangeText={(txt) => setUserPhone(txt)}
                placeholder='Tìm kiếm' 
                placeholderTextColor={'grey'} 
                style={{ width: 270, height: 35, backgroundColor: 'white', borderRadius: 10, padding: 10 }}
            />
            <Pressable onPress={() => { handleMessaged(userPhone) }}>
                <AntDesign name="search1" size={24} color="white" />
            </Pressable>
            <MaterialCommunityIcons
                name="qrcode-scan"
                size={24}
                color="white"
            />
        </View>
    )

}

export default Search;
