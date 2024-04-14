import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { AntDesign, Entypo, EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const index = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const name = decodedToken.uName;
      const phone = decodedToken.phone;

      setUserId(userId)
      setName(name)
      setPhone(phone)

    }

    fetchUser();
  }, [])
  return (
    <ScrollView>
      <View>
        <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
          <Pressable onPress={() =>
            router.navigate({
              pathname: '/Personal/search',
            })
          }>
            <AntDesign name="search1" size={24} color="white" />
          </Pressable>
          <Pressable onPress={() =>
            router.navigate({
              pathname: '/Personal/search',
            })
          }>
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

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }}
          onPress={() => {
            router.navigate({
              pathname: '/Personal/profilePage',
            })
          }}>
          <View style={{ width: '23%', height: '100%', padding: 12, gap: 5 }}>
            <Image style={{ height: 60, width: 60, borderRadius: 100 }} source={{ uri: 'https://tophinhanh.net/wp-content/uploads/2023/11/avatar-heo-cute-1.jpg' }}></Image>
          </View>
          <View style={{ height: 'auto', width: '77%' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>{name}</Text>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey' }}>Xem trang cá nhân</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 8 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="musical-notes-outline" size={28} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Nhạc chờ</Text>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey' }}>Đăng kí nhạc chờ, thể hiện cá tính</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 2 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="wallet-outline" size={28} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Ví QR</Text>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey' }}>Lưu trữ và xuất trình các mã QR quan trọng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 2 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Entypo name="icloud" size={27} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Cloud của tôi</Text>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey' }}>Lưu trữ các tin nhắn quan trọng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 8 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Feather name="pie-chart" size={27} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Dung lượng và dữ liệu</Text>
            <Text style={{ fontWeight: '400', fontSize: 14, color: 'grey' }}>Quản lý dữ liệu của bạn</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 8 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialIcons name="security" size={27} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Tài khoản và bảo mật</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 8 }}
          onPress={() => {
            // router.navigate({
            //   pathname: '/Discover/liberty',
            // })
          }}>
          <View style={{ width: '17%', height: 70, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
            <EvilIcons name="lock" size={40} color="blue" />
          </View>
          <View style={{ height: 50, width: '83%', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Quyền riêng tư</Text>
          </View>
        </TouchableOpacity>
        <View style={{ width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <TouchableOpacity style={{ width: '60%', height: 'auto', borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeee4' }}
              onPress={()=>{router.replace('(authenticate)/home')}}>
            <Text style={{ fontWeight: '600', fontSize: 18, color: 'black', padding: 15 }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})