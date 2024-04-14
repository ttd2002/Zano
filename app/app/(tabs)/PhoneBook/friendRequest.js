import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

export default function FriendRequest() {
    const Stack = createNativeStackNavigator();
    return (
        <View>
            <GetPhoneBookOrRecently/>
        </View>
    );
}

const GetPhoneBookOrRecently = () => {
    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator initialRouteName='Đã nhận' screenOptions={{
            tabBarLabelStyle: { fontSize: 15, fontWeight: '700', bordertop: 'solid 0px black', height: 20 },
        }} >
            <Tab.Screen name="Đã nhận" component={ReceiveScreen} />
            <Tab.Screen name="Đã gửi" component={SendScreen} />
        </Tab.Navigator>
    )
}

const ReceiveScreen = () => {
    return (
        <View style={{ padding: 15, gap: 5, backgroundColor: 'White' }}>
            <Text>Tháng 01, 2024</Text>
            <View style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: '10%', height: '100%' }}>
                    <Image style={{height:50,width:50,borderRadius:100}} src={uri='data:image/jpeg;base64,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'}></Image>
                </View>
                <View style={{ height: 'auto', width: '85%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Tran Van A</Text>
                    <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>22/01 - Từ danh thếp</Text>
                    <Text style={{ width: '100%', height: 50, padding: 5, border: 'solid 1px grey', borderRadius: 5 }} numberOfLines={3}>fsdfsdgfsdg</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginTop: 5 }}>
                        <TouchableOpacity style={{ height: 25, width: '45%', backgroundColor: '#C7C8CC', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                            onPress={() => {

                            }}>
                            <Text>TỪ CHỐI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 25, width: '45%', backgroundColor: '#BBE2EC', color: 'blue', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                            onPress={() => {

                            }}>
                            <Text>ĐỒNG Ý</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

const SendScreen = () => {
    return (
        <View style={{ padding: 15, gap: 5, backgroundColor: 'White' }}>
            <View style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: '15%', height: '100%' }}>
                    <MaterialCommunityIcons
                        name="qrcode-scan"
                        size={24}
                        color="white"
                    />

                </View>
                <View style={{ height: 'auto', width: '60%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Tran Van A</Text>
                    <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>Bạn cùng nhóm</Text>
                    <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>22/01</Text>
                </View>
                <TouchableOpacity style={{ height: 25, width: '25%', backgroundColor: '#BBE2EC', color: 'blue', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                    onPress={() => {

                    }}>
                    <Text>THU HỒI</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C7C8CC',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    HideTextInput: {
        width: '100%',
        height: 20,
        // color: 'transparent',
        outlineColor: 'transparent',
        // border:'solid 2px blue',
        fontSize: 18,
        color: 'grey',
        // textAlign: 'center',
        // position: 'absolute',
    },
});
