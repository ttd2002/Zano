import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import Icon from '@mdi/react';
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipAddress } from '../../../config/env';
import { io } from 'socket.io-client';

const Friend = () => {
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const socket = io(`http://${ipAddress}:8000`);
  // socket.on("Render", () => {
  //   fetchFriends();
  // })
  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("auth");
      const user = JSON.parse(userString);
      const userId = user._id;
      const avatar = user.avatar;
      setUserId(userId);
      setAvatar(avatar);
    };
    fetchUser();
  }, []);
  // useEffect(() => {
  //   fetchFriends();
  // }, [Socket]);
  useEffect(() => {
    if (userId)
      fetchFriends();
  }, [userId]);
  console.log('listFriend', friends);
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
      // setFriends(response.data.friends)
    } catch (error) {
      console.error('Error fetching friends:', error);
    }

  };
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
  const handleUnfriendUser = async (friendId) => {
    try {
      // Validate input
      if (!userId || !friendId) {
        Alert.alert('Both User ID and Friend ID are required');
        return;
      }

      // Send unfriend request to the server
      const response = await axios.post(`http://${ipAddress}:3000/users/app/unfriendUserApp`, {
        userId: userId,
        friendId: friendId,
      });
      // Handle the server's response
      Alert.alert(response.data.message);
      // socket.emit("requestRender")
      router.replace({
        pathname: '/PhoneBook',
      })
    } catch (error) {
      console.error('Error unfriending user:', error);
      Alert.alert(error.response?.data?.error || 'Failed to unfriend user');
    }
  };
  // console.log(`http://${ipAddress}:3000/users/app/handleUnfriendUser`);
  console.log(friends);
  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%' }}>
        <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}
            onPress={() => {
              router.replace({
                pathname: '/PhoneBook/friendRequest',
              })
            }}>
            <FontAwesome5 name="user-friends" size={24} color="black" />
            <Text style={{ fontWeight: '700', fontSize: 15 }}>Lời mời kết bạn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}
            onPress={() => {
              router.navigate({
                pathname: '/PhoneBook/phoneBook',
              })
            }}
          >
            <AntDesign name="contacts" size={28} color="black" />
            <View style={{ width: '70%' }}>
              <Text style={{ fontWeight: '700', fontSize: 15 }}>Danh bạ máy</Text>
              <Text style={{ fontWeight: '400', fontSize: 13 }}>Các liên hệ có dùng Zalo</Text>
            </View>
          </TouchableOpacity>
          {/* <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}>
          <Image style={{ width: 30, height: 30 }} source={require('../../../assets/icon.png')} />
          <View style={{ width: '100%' }}>
            <Text style={{ fontWeight: '700', fontSize: 15 }}>Lịch sinh nhật</Text>
            <Text style={{ fontWeight: '400', fontSize: 13 }}>Theo dõi sinh nhật của bạn bè</Text>
          </View>
        </View> */}
        </View>




        <View style={{ flexDirection: 'row', width: '100%', height: 54, marginTop: 8, backgroundColor: 'white', padding: 13, gap: 15 }}>
          <TouchableOpacity style={{ height: 30, width: 200, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {

            }}>
            <Text style={{ fontSize: 20 }}>Danh sách bạn bè </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ height: 30, width: 110, borderRadius: 20, border: '1px solid grey', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {

            }}>
            <Text>Mới truy cập </Text>
          </TouchableOpacity> */}
        </View>



        <View style={{ width: '100%' }}>
          {friends?.length > 0 ? (
            friends.map((group, index) => (
              <View key={index} style={{ backgroundColor: 'white', padding: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{group[0].name.charAt(0).toUpperCase()}</Text>
                {group.map((item, subIndex) => (
                  <View key={subIndex} style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15, marginTop: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Image style={{ width: 50, height: 50, borderRadius: 60, borderWidth: 2, borderColor: 'black' }} source={{ uri: item.avatar ? item.avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }} />
                      <Text style={{ fontWeight: '500', fontSize: 18, marginLeft: 10, width: '50%' }}>{item.name}</Text>
                      <TouchableOpacity style={{backgroundColor:'red', padding:6, borderRadius:10}}
                        onPress={() => {
                          handleUnfriendUser(item._id);
                        }}
                      >
                        {/* <Ionicons name="call-outline" size={26} color="black" />
                        <Feather name="video" size={24} color="black" /> */}
                        <Text style={{color:'white'}}>Hủy bạn</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 20 }}>No friends to display</Text>
          )}
        </View>
      </ScrollView>



    </View>
  )
}



export default Friend

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C7C8CC',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  HideTextInput: {
    // outlineColor: 'transparent',
    fontSize: 18,
    color: 'white',
    // position: 'absolute',
  },
})