import { FlatList, Pressable, StyleSheet, Text, View, Image, TextInput, TouchableOpacity , ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import UserChat from '../../../components/userChat';
import { decode } from "base-64"
import { ipAddress } from '../../../config/env';
import { io } from "socket.io-client"
global.atob = decode;
const index = () => {
  const socket = io(`http://${ipAddress}:8000`);

  socket.on("Render", () => {
    fetchUserMessaged();
    fetchGetUser();
  })
  
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [messaged, setMessaged] = useState([]);
  const [finded, setFinded] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [listFriend, setListFriend] = useState([]);
  const [friendRequestSendIds, setFriendRequestSendIds] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [userFilter, setUserFilter] = useState([]);
  // const [sockecId, setSockecId] = useState("");
  const [chekcFind, setCheckFind] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {

      const userString = await AsyncStorage.getItem("auth");
      const user = JSON.parse(userString);
      const userId = user._id;
      const listFriend = user.listFriend;
      const friendRequestIds = user.friendRequests;
      const Token = await AsyncStorage.getItem(token);
      setToken(Token)
      setUserId(userId);
      setListFriend(listFriend);
      setFriendRequests(friendRequestIds)
    };
    fetchUser();
    fetchGetUser();
  }, []);
  const fetchUserMessaged = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:3000/mes/${userId}/messaged`
      );

      const userMessaged = response.data;
      setMessaged(userMessaged);

    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchUserFinded = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:3000/users/${userId}/finded`
      );

      const userFinded = response.data.finded;
      setFinded(userFinded);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const fetchGetUser = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:3000/users/getUser`
      );

      const user = response.data.user;
      setUser(user);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserMessaged();
      fetchUserFinded();
      getFriendRequestIdsSend();
    }
  }, [userId]);

  const handleFilter = (txt) => {
    setUserPhone(txt);
    const filterU = user.filter(
      u =>
        u.name.toLowerCase().includes(txt.toLowerCase()) ||
        u.phone.toLowerCase().includes(txt.toLowerCase())

    )
    setUserFilter(filterU)
  };
  const handleFinded = async (receiver) => {
    try {
      await axios.post(`http://${ipAddress}:3000/users/add-finded`, {
        currentUserId: userId,
        receiverId: receiver,
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleCreateConversationSingleChat = async (receiver) => {
    try {
      const response = await axios.post(`http://${ipAddress}:3000/mes/createConversationApp`, {
        senderId: userId,
        receiverId: receiver._id,
      });
      const conversationId = response.data.conversation._id;
      router.navigate({
        pathname: '/Message/chatRoom',
        params: {
          uName: receiver.name,
          senderId: userId,
          // receiverId: item._id,
          conversationId: conversationId,
          uAvatar: receiver.avatar
        }
      })
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleSendFriendRequest = async (receiverId) => {
    try {
      await axios.post(`http://${ipAddress}:3000/users/app/sendFriendRequest`, {
        senderId: userId,
        receiverId: receiverId,
      });
      setFriendRequestSendIds(prevIds => [...prevIds, receiverId]);
    } catch (error) {
      console.log("error", error);
    }
  }
  const getFriendRequestIdsSend = async () => {
    try {
      const response = await axios.get(`http://${ipAddress}:3000/users/app/getFriendRequestIdsSend/${userId}`);
      const friendRequestIdsTemp = response.data.map(item => item._id);
      setFriendRequestSendIds(friendRequestIdsTemp)

    } catch (error) {
      console.log("error", error);
    }
  }
  const handleAcceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://${ipAddress}:3000/users/app/respondToFriendRequest`, {
        responderId: userId,
        requestId: requestId,
        response: 1
      });
      setListFriend(newListFriend => [...newListFriend, requestId]);
      setFriendRequests(prevFriendRequests => prevFriendRequests.filter(id => id !== requestId));
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
      setFriendRequests(prevFriendRequests => prevFriendRequests.filter(id => id !== requestId));
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    chekcFind ?
      <View style={styles.container}>
        <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
          <Pressable onPress={() => {
            setCheckFind(false)
          }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
          <TextInput
            value={userPhone}
            onChangeText={(txt) => {
              handleFilter(txt);
            }}

            placeholder='Tìm kiếm' placeholderTextColor={'grey'} style={{ width: '75%', height: 35, backgroundColor: 'white', borderRadius: 10, padding: 10 }}
          />

          <MaterialCommunityIcons
            name="qrcode-scan"
            size={24}
            color="white"
          />
        </View>
        {userPhone !== "" ?
          <FlatList
            data={userFilter}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({ item }) =>
              userId === item._id ? <View></View> :
                <Pressable onPress={() => {
                  handleFinded(item._id);
                  handleCreateConversationSingleChat(item);
                }}>
                  <View style={{ borderBottomWidth: 1, alignItems: 'center', borderBottomColor: 'grey', height: 100, width: 400, flexDirection: 'row', gap: 15 }}>
                    <Image style={{
                      marginLeft: 15,
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      resizeMode: "contain"
                    }} source={{ uri: item.avatar?item.avatar:'data:image/jpeg;base64,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' }} />
                    <View style={{ gap: 5, width: '45%' }}>
                      <Text style={{ fontSize: 20, fontStyle: 'normal', alignItems: 'flex-start' }}>{item.name}</Text>
                      <Text style={{ fontSize: 15, fontStyle: 'normal', alignItems: 'flex-start' }}>Số điện thoại: {item.phone}</Text>
                    </View>
                    {friendRequestSendIds.includes(item._id) && (
                      <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: 'grey', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                          // handleSendFriendRequest(item._id);
                        }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Đã gửi</Text>
                      </TouchableOpacity>
                    )}
                    {friendRequests.includes(item._id) && (
                      <View>
                        <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                          onPress={() => {
                            handleAcceptFriendRequest(item._id);
                          }}>
                          <Text style={{ fontSize: 16, color: 'white' }}>Đồng ý</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                          onPress={() => {
                            handleRejectFriendRequest(item._id);
                          }}>
                          <Text style={{ fontSize: 16, color: 'white' }}>Từ chối</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {listFriend.includes(item._id) && (
                      <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                          // handleSendFriendRequest(item._id);
                        }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Hủy bạn</Text>
                      </TouchableOpacity>
                    )}
                    {!friendRequestSendIds.includes(item._id) && (
                      <TouchableOpacity style={{ width: 80, height: 30, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                          handleSendFriendRequest(item._id);
                          setFriendRequestSendIds(prevIds => [...prevIds, item._id]);
                        }}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Kết bạn</Text>
                      </TouchableOpacity>
                    )}


                  </View>
                </Pressable>
            }
          />
          :
          <View style={{ gap: 10, borderBottomColor: 'grey', borderWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 500, padding: 15 }}>Liên hệ đã tìm</Text>
            <FlatList
              data={finded}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              horizontal

              renderItem={({ item }) =>
                <Pressable onPress={() => {
                  if (item._id === userId) {
                    alert("myself")
                  }
                  else {
                    handleCreateConversationSingleChat(item);
                  }
                }}>
                  <View style={{ alignItems: 'center', height: 100, width: 100, gap: 5 }}>
                    <Image style={{
                      marginLeft: 15,
                      width: 40,
                      height: 40,
                      borderRadius: 60,
                      resizeMode: "contain"
                    }} source={{ uri: item.avatar?item.avatar:'data:image/jpeg;base64,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' }} />
                    <View style={{ gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 15, fontStyle: 'normal', alignItems: 'center', justifyContent: 'center' }}>{item.name}</Text>

                    </View>
                  </View>
                </Pressable>
              }
            />
          </View>
        }
      </View>
      :
      <View style={styles.container}>
        <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
          <Pressable style={{marginLeft:5}} onPress={() =>
            setCheckFind(true)
          }>
            <AntDesign name="search1" size={24} color="white" />
          </Pressable>
          <Pressable onPress={() =>
            setCheckFind(true)
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
        <ScrollView>
          {messaged?.map((item, index) => (
            <UserChat key={index} userId={userId} item={item} />
          ))}
          <View style={{height:40}}></View>
        </ScrollView>
      </View>
  )
}

export default index

const styles = StyleSheet.create({})