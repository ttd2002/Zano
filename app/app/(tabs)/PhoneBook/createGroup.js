import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, LogBox, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import HeaderCreateGroup from './component/headerCreateGroup';
import axios from 'axios';
import { ipAddress } from '../../../config/env';
const CreateGroup = () => {
    const [dataCreateGroup, setDataCreateGroup] = useState({
        nameGroup: '',
        members: [],
    });
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const handleNameGroupChange = (text) => {
        setDataCreateGroup({ ...dataCreateGroup, nameGroup: text });
        // console.log('datacreateGroup', dataCreateGroup);

    };



    useEffect(() => {
        const fetchUser = async () => {
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            const userId = user._id;
            // const avatar = user.avatar;
            setUserId(userId);
        };
        fetchUser();
    }, []);
    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <HeaderCreateGroup dataCreateGroup={dataCreateGroup} setDataCreateGroup={setDataCreateGroup} onChangeText={handleNameGroupChange} userId={userId} />
            <GetPhoneBookOrRecently dataCreateGroup={dataCreateGroup} setDataCreateGroup={setDataCreateGroup} userId={userId} />
        </View>
    )

}

const GetPhoneBookOrRecently = ({ dataCreateGroup, setDataCreateGroup, userId }) => {
    const Tab = createMaterialTopTabNavigator();

    return (
        <Tab.Navigator initialRouteName='GẦN ĐÂY' screenOptions={{
            tabBarLabelStyle: { fontSize: 15, fontWeight: '700' },
        }} >
            <Tab.Screen name="GẦN ĐÂY">
                {() => <Recently dataCreateGroup={dataCreateGroup} setDataCreateGroup={setDataCreateGroup} userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name="BẠN BÈ">
                {() => <Contacts dataCreateGroup={dataCreateGroup} setDataCreateGroup={setDataCreateGroup} userId={userId} />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

import { FlatList } from 'react-native';

const Recently = ({ dataCreateGroup, setDataCreateGroup, userId }) => {

    const [messaged, setMessaged] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchUserMessaged();
        }
    }, [userId]);

    const fetchUserMessaged = async () => {
        try {
            const response = await axios.get(
                `http://${ipAddress}:3000/mes/${userId}/messaged`
            );
    
            const userMessaged = response.data.filter(item => {
                if (item.isGroupChat === false && item.participants && item.participants.length > 0) {
                    if (item.participants[0]._id !== userId) {
                        item._id = item.participants[0]._id;
                    } else if (item.participants.length > 1 && item.participants[1]._id !== userId) {
                        item._id = item.participants[1]._id;
                    }
                    return true;
                }
                return false;
            });
            
            setMessaged(userMessaged);
    
        } catch (error) {
            console.log("Error", error);
        }
    };
    

    // const handleCheckboxChange = (userId) => {
    //     const memberIndex = dataCreateGroup.members.findIndex(member => member._id === userId);
    //     console.log(memberIndex);
    //     if (memberIndex !== -1) {
    //         setDataCreateGroup(prevData => ({
    //             ...prevData,
    //             members: prevData.members.filter(member => member._id !== userId)
    //         }));
    //     } else {
    //         const memberToAdd = messaged.find(item => item._id === userId);
    //         console.log(memberToAdd);
    //         if (memberToAdd) {
    //             setDataCreateGroup(prevData => ({
    //                 ...prevData,
    //                 members: [...prevData.members, memberToAdd]
    //             }));
    //         }
    //     }
    //     console.log('mem', dataCreateGroup.members);
    // };
    const handleCheckboxChange = (userId) => {
        const memberIndex = dataCreateGroup.members.findIndex(memberId => memberId === userId);
        // console.log(userId);
        // console.log(memberIndex);
        if (memberIndex !== -1) {
            // Loại bỏ ID của thành viên khỏi mảng members
            setDataCreateGroup(prevData => ({
                ...prevData,
                members: prevData.members.filter(memberId => memberId !== userId)
            }));
        } else {
            const memberToAdd = messaged.flat().find(item => item._id === userId);
            console.log(memberToAdd);
            if (memberToAdd) {
                // Thêm ID của thành viên mới vào mảng members
                setDataCreateGroup(prevData => ({
                    ...prevData,
                    members: [...prevData.members, userId]
                }));
            }
        }

    };
    console.log(messaged);
    console.log('mem1', dataCreateGroup.members);
    return (
        <FlatList
            data={messaged}
            renderItem={({ item }) => (
                <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15, marginTop: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                        <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name}</Text>
                        <View style={styles.section}>
                            <Checkbox
                                style={styles.checkbox}
                                value={dataCreateGroup.members.includes(item._id)}
                                onValueChange={() => handleCheckboxChange(item._id)}
                            />
                        </View>
                    </View>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const Contacts = ({ dataCreateGroup, setDataCreateGroup, userId }) => {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`http://${ipAddress}:3000/users/${userId}/friends`);
                const friendInitialSort = response.data.friends.sort((a, b) => {
                    const nameA = a.name?.toUpperCase();
                    const nameB = b.name?.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                setFriends(groupByNameInitial(friendInitialSort));

            } catch (error) {
                console.error('Error fetching friends:', error);
            }

        };
        if (userId)
            fetchFriends();
    }, [userId]);
    // console.log('friends', friends);
    const groupByNameInitial = (dataList) => {
        const groups = new Map();
        dataList.forEach((item) => {
            const initial = item.name.charAt(0).toUpperCase();
            if (!groups.has(initial)) {
                groups.set(initial, []);
            }
            groups.get(initial).push(item);
        });
        return Array.from(groups.values());
    };

    const handleCheckboxChange = (userId) => {
        const memberIndex = dataCreateGroup.members.findIndex(memberId => memberId === userId);
        // console.log(userId);
        // console.log(memberIndex);
        if (memberIndex !== -1) {
            // Loại bỏ ID của thành viên khỏi mảng members
            setDataCreateGroup(prevData => ({
                ...prevData,
                members: prevData.members.filter(memberId => memberId !== userId)
            }));
        } else {
            const memberToAdd = friends.flat().find(item => item._id === userId);
            // console.log(memberToAdd);
            if (memberToAdd) {
                // Thêm ID của thành viên mới vào mảng members
                setDataCreateGroup(prevData => ({
                    ...prevData,
                    members: [...prevData.members, userId]
                }));
            }
        }
        console.log('mem', dataCreateGroup.members);
    };
    return (
        <View style={{ width: '100%', gap: 5, backgroundColor: 'White' }}>
            <View style={{ width: '100%' }}>
                {friends?.length > 0 ? (
                    friends.map((group, index) => (
                        <View key={index} style={{ backgroundColor: 'white', padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{group[0].name.charAt(0).toUpperCase()}</Text>
                            {group.map((item, subIndex) => (
                                <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15, marginTop: 2 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                                        <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '65%' }}>{item.name}</Text>
                                        <View style={styles.section}>
                                            <Checkbox
                                                style={styles.checkbox}
                                                value={dataCreateGroup.members.includes(item._id)}
                                                onValueChange={() => handleCheckboxChange(item._id)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 20 }}>No friends to display</Text>
                )}
            </View>
        </View >

    )
}

export default CreateGroup
// export default GetPhoneBookOrRecently
// export default Header

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
        // outlineColor: 'transparent',outlineColor
        fontSize: 18,
        color: 'grey',
    }, section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        marginLeft: 28,
    },
});
