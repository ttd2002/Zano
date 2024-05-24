import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ipAddress } from '../../../config/env';

export default function FriendRequest() {
    const Stack = createNativeStackNavigator();
    const [userId, setUserId] = useState("");
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestSendIds, setFriendRequestSendIds] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            // setUserId(userId);
        };
        fetchUser();
        if (userId)
            fetchFriendRequest();
    }, [userId]);
    const fetchFriendRequest = async () => {
        try {
            const response = await axios.get(`http://${ipAddress}:3000/users/${userId}/friendRequests`);
            // const friendInitialSort = response.data.friendRequests.sort((a, b) => {
            //     const nameA = a.name?.toUpperCase();
            //     const nameB = b.name?.toUpperCase();
            //     if (nameA < nameB) {
            //         return -1;
            //     }
            //     if (nameA > nameB) {
            //         return 1;
            //     }
            //     return 0;
            // });
            setFriendRequests(response.data.friendRequests);
            // setFriends(response.data.friends)
        } catch (error) {
            console.error('Error fetching friendRequests:', error);
        }

    };

    // console.log('frient request', friendRequests);
    // console.log(`http://${ipAddress}:3000/users/${userId}/friendRequests`);
    return (
        <Stack.Navigator>
            <Stack.Screen name="FriendRequest" component={GetPhoneBookOrRecently} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

const GetPhoneBookOrRecently = () => {
    const Tab = createMaterialTopTabNavigator();
    return (
        <Tab.Navigator initialRouteName='Đã nhận' screenOptions={{
            tabBarLabelStyle: { fontSize: 15, fontWeight: '700', height: 20 },
        }} >
            <Tab.Screen name="Đã nhận" component={ReceiveScreen}/>
            <Tab.Screen name="Đã gửi" component={SendScreen}/>
        </Tab.Navigator>
    )
}


const ReceiveScreen = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            setUserId(userId);
        };
        fetchUser();
        if (userId)
            fetchFriendRequest();
    }, [userId]);
    const fetchFriendRequest = async () => {
        try {
            const response = await axios.get(`http://${ipAddress}:3000/users/${userId}/friendRequests`);
            // const friendInitialSort = response.data.friendRequests.sort((a, b) => {
            //     const nameA = a.name?.toUpperCase();
            //     const nameB = b.name?.toUpperCase();
            //     if (nameA < nameB) {
            //         return -1;
            //     }
            //     if (nameA > nameB) {
            //         return 1;
            //     }
            //     return 0;
            // });
            setFriendRequests(response.data.friendRequests);
            // setFriends(response.data.friends)
        } catch (error) {
            console.error('Error fetching friendRequests:', error);
        }

    };

    const handleAcceptFriendRequest = async (requestId) => {
        try {
            await axios.post(`http://${ipAddress}:3000/users/app/respondToFriendRequest`, {
                responderId: userId,
                requestId: requestId,
                response: 1
            });
            // setListFriend(newListFriend => [...newListFriend, requestId]);
            setFriendRequests(prevFriendRequests => prevFriendRequests.filter(id => id._id !== requestId));
        } catch (error) {
            console.log("error", error);
        }
    }
    const handleRejectFriendRequest = async (requestId) => {
        try {
            await axios.post(`http://${ipAddress}:3000/users/app/respondToFriendRequest`, {
                responderId: userId,
                requestId: requestId,
                response: 0
            });
            setFriendRequests(prevFriendRequests => prevFriendRequests.filter(id => id._id !== requestId));
        } catch (error) {
            console.log("error", error);
        }
    }
    return (
        <View style={{  backgroundColor: 'White' }}>

            {friendRequests?.length > 0 && friendRequests.map((item, index) => (

                <View style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor:'white', borderBottomWidth:1,padding: 15, borderColor:'grey' }} key={index}> 
                    <View style={{ width: '10%', height: '100%' }}>
                        <Image style={{ height: 60, width: 60, borderRadius: 100 }} src={uri = item.avatar}></Image>
                    </View>
                    <View style={{ height: 'auto', width: '80%' }}>
                        <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>{item.name}</Text>
                        {/* <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>22/01 - Từ danh thếp</Text> */}
                        {/* <Text style={{ width: '100%', height: 50, padding: 5, border: 'solid 1px grey', borderRadius: 5 }} numberOfLines={3}>fsdfsdgfsdg</Text> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5, marginTop: 5 }}>
                            <TouchableOpacity style={{ height: 25, width: '45%', backgroundColor: '#C7C8CC', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                                onPress={() => {
                                    handleRejectFriendRequest(item._id)
                                }}>
                                <Text>TỪ CHỐI</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 25, width: '45%', backgroundColor: '#BBE2EC', color: 'blue', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                                onPress={() => {
                                    handleAcceptFriendRequest(item._id)
                                }}>
                                <Text>ĐỒNG Ý</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            ))}

        </View>
    );
}

const SendScreen = () => {
    const [userId, setUserId] = useState("");
    const [friendRequestSendIds, setFriendRequestSendIds] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            setUserId(userId);
        };
        fetchUser();
        if (userId)
            getFriendRequestIdsSend();
    }, [userId]);
    const getFriendRequestIdsSend = async () => {
        try {
          const response = await axios.get(`http://${ipAddress}:3000/users/app/getFriendRequestIdsSend/${userId}`);
          setFriendRequestSendIds(response.data)
    
        } catch (error) {
          console.log("error", error);
        }
      }
      console.log('Abc',friendRequestSendIds);
      const handleRecallFriendRequest = async (responId) => {
        try {
            await axios.post(`http://${ipAddress}:3000/users/app/recallFriendRequestSended`, {
                responderId: responId,
                requestId: userId,
            });
            setFriendRequestSendIds(prevFriendRequests => prevFriendRequests.filter(id => id._id !== responId));
        } catch (error) {
            console.log("error", error);
        }
    }
    return (
        <View style={{  backgroundColor: 'White' }}>

            {friendRequestSendIds?.length > 0 && friendRequestSendIds.map((item, index) => (

                <View style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor:'white', borderBottomWidth:1,padding: 15, borderColor:'grey' }} key={index}> 
                    <View style={{ width: '22%', height: '100%' }}>
                        <Image style={{ height: 60, width: 60, borderRadius: 100 }} src={uri = item.avatar}></Image>
                    </View>
                    <View style={{ height: 'auto', width: '50%' }}>
                        <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>{item.name}</Text>
                    </View>
                    
                        {/* <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>22/01 - Từ danh thếp</Text> */}
                        {/* <Text style={{ width: '100%', height: 50, padding: 5, border: 'solid 1px grey', borderRadius: 5 }} numberOfLines={3}>fsdfsdgfsdg</Text> */}
                        
                    <TouchableOpacity style={{ height: 25, width: '25%', backgroundColor: '#C7C8CC', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                                onPress={() => {
                                    handleRecallFriendRequest(item._id)
                                }}>
                                <Text>Thu hồi</Text>
                    </TouchableOpacity>
                </View>
            ))}

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
