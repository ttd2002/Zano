import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
const HeaderFriendRequest = () => {
    const navigation = useNavigation();
    return (
        <View style={{height:'auto', width:'100%'}}>
            <View style={{ height: 50, width: '100%', backgroundColor: '#00abf6', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 10 }}>
                <TouchableOpacity style={{ width: '8%', height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <AntDesign name="arrowleft" size={26} color="black" />
                </TouchableOpacity>
                <View style={{ height: 25, width: '90%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, color: 'white' }}>Lời mời kết bạn</Text>
                </View>
            </View>
        </View>
    );
}

export default HeaderFriendRequest