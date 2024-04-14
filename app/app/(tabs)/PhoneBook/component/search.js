import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { mdilMagnify } from '@mdi/light-js';
import { mdiAccountPlus } from '@mdi/js';
import { Icon } from '@mdi/react'; // Sửa đổi đây
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Search() {
    return (
        <View style={{ height: 50, width: '100%', backgroundColor: '#00abf6', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: '95%', height: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Feather name="search" size={24} color="black" />
                <TextInput style={{ width: '70%', height: 20, outlineColor: 'transparent', fontSize: 18, color: 'black' }} placeholder='Tìm kiếm'></TextInput>
                <AntDesign name="adduser" size={24} color="black" />
            </View>
        </View>
    );
}
