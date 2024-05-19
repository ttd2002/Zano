import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { mdilMagnify } from '@mdi/light-js';
import { mdiAccountPlus } from '@mdi/js';
import { Icon } from '@mdi/react'; // Sửa đổi đây
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Search() {
    return (
        <View style={{ height: 50, width: '100%', backgroundColor: '#00abf6', alignItems: 'center', justifyContent: 'center' }}>
            {/* <View style={{ width: '95%', height: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Feather name="search" size={24} color="black" />
                <TextInput style={{ width: '70%', height: 20, fontSize: 18, color: 'black' }} placeholder='Tìm kiếm'></TextInput>
                <AntDesign name="adduser" size={24} color="black" />
            </View> */}
            <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
                <Pressable style={{ marginLeft: 5 }} onPress={() => { }
                    // setCheckFind(true)
                }>
                    <AntDesign name="search1" size={24} color="white" />
                </Pressable>
                <Pressable onPress={() => { }
                    // setCheckFind(true)
                }
                >
                    <Text style={{ color: 'white', fontSize: 15, paddingRight: 175 }}>
                        Tìm kiếm
                    </Text>
                </Pressable>
                <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={24}
                    color="white"
                />

                <Ionicons
                    name="add"
                    size={40}
                    color="white"
                />
            </View>
        </View>
    );
}
