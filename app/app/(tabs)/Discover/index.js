import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import axios from 'axios';
const index = () => {
  const router = useRouter();
  const currentDate = new Date()
  const [userPhone, setUserPhone] = useState("");
  const [lunarData, setLunarData] = useState({});


  const getLunarDate = async (currentDate) => {
    try {
      const response = await axios.get(`https://amlich.maihoan.com/lunar/${currentDate.getDay()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lunar date:', error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchLunarData = async () => {
      try {
        const data = await getLunarDate(currentDate);
        setLunarData(prevState => ({
          ...prevState,
          lunar: data.lunar
        }));
        console.log('Lunar data:', lunarData);
      } catch (error) {
        console.error('Error fetching lunar data:', error);
      }
    };

    fetchLunarData();
  }, []);

  return (
    <View style={{ width: '100%', flex: 1 }}>
      <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
        <Pressable>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <TextInput
          value={userPhone}
          onChangeText={(txt) => setUserPhone(txt)}
          placeholder='Tìm kiếm' placeholderTextColor={'grey'} style={{ width: 270, height: 35, backgroundColor: 'white', borderRadius: 10, padding: 10 }}
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
      <ScrollView style={{ width: '100%', flex: 1 }}>
        <View style={{ height: 250, width: '100%', backgroundColor: 'white', alignItems: 'center', padding: 10 }}>
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <Image source={require('../../../assets/mini-app.png')} style={{ height: 30, width: 30, margin: 5, borderRadius: 40, margin: 5 }}></Image>
            <Text style={{ fontSize: 20, fontWeight: 600, width: '70%' }}>Mini App nổi bật</Text>
          </View>
          <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            onPress={() => {
              router.navigate({
                pathname: '/Discover/liberty',
              })
            }}
          >
            <View style={{ width: '10%', height: '100%', padding: 5, gap: 5 }}>
              <Image style={{ height: 50, width: 50, borderRadius: 100 }} source={require('../../../assets/liberty.png')}></Image>
            </View>
            <View style={{ height: 'auto', width: '82%' }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Bảo hiểm online</Text>
              <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>Mua bảo hiểm xe máy, ô tô, tai nạn dễ dàng</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: 'grey', marginTop: 5 }}
            onPress={() => {
              router.navigate({
                pathname: '/Discover/rechargecard',
              })
            }}
          >
            <View style={{ width: '10%', height: '100%', padding: 5, gap: 5 }}>
              <Image style={{ height: 50, width: 50, borderRadius: 100 }} source={require('../../../assets/rechargecard.png')}></Image>
            </View>
            <View style={{ height: 'auto', width: '82%' }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Nạp điện thoại</Text>
              <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>Nạp điện thoại, mua thẻ điện thoại nhanh</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '100%', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: 'grey', marginTop: 5 }}
            onPress={() => {
              router.navigate({
                pathname: '/Discover/skysport',
              })
            }}
          >
            <View style={{ width: '10%', height: '100%', padding: 5, gap: 5 }}>
              <Image style={{ height: 50, width: 50, borderRadius: 100 }} source={require('../../../assets/foodball.png')}></Image>
            </View>
            <View style={{ height: 'auto', width: '82%' }}>
              <Text style={{ fontWeight: '600', fontSize: 18, color: 'black' }}>Lịch bóng đá</Text>
              <Text style={{ fontWeight: '400', fontSize: 15, color: 'grey' }}>Theo dõi kết quả trực tuyến</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Pressable style={{ height: 195, width: '100%', marginTop: 10, backgroundColor: 'white', alignItems: 'center' }}
          onPress={() => {
            router.navigate({
              pathname: '/Discover/calendar',
            })
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <Image source={require('../../../assets/calendar.png')} style={{ height: 50, width: 50, margin: 5 }}></Image>
            <Text style={{ fontSize: 20, fontWeight: 600, width: '70%' }}>Lịch Việt</Text>
            <Entypo name="chevron-small-right" size={34} color="black" />
          </View>
          <View style={{ flexDirection: 'row', height: 120, width: '94%', borderWidth: 1, borderColor: 'grey', borderRadius: 15, alignItems: 'center' }}>
            <View style={{ alignItems: 'center', width: '30%', height: '100%', borderRightWidth: 1, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>{currentDate.getDay() == 0 ? 'Chủ nhật' : 'Thứ ' + currentDate.getDay()}</Text>
              <Text style={{ color: 'green', fontWeight: 700, fontSize: 20 }}>{currentDate.getDate()}</Text>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>Tháng {currentDate.getMonth() + 1}</Text>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>{currentDate.getFullYear()}</Text>
            </View>
            <View style={{ width: '70%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 500, height: '65%' }}>Ngày {lunarData?.lunar?.day} tháng {lunarData?.lunar?.month}</Text>
                <Text style={{ fontSize: 16, fontWeight: 400 }}>Năm Giáp Thìn</Text>
                <Text style={{ fontSize: 16, fontWeight: 400 }}>(Âm lịch)</Text>
              </View>
              <Image source={require('../../../assets/calendar-backgroud.png')} style={{ width: 80, height: 80, marginTop: 30 }}></Image>
            </View>
          </View>
        </Pressable>

        <Pressable style={{ height: 230, width: '100%', marginTop: 10, backgroundColor: 'white', alignItems: 'center', padding: 0 }}
          onPress={() => {
            router.navigate({
              pathname: '/Discover/lottery',
            })
          }}
        >
          <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
            <Image source={require('../../../assets/xskt.png')} style={{ height: 50, width: 50, margin: 5, borderRadius: 40 }}></Image>
            <Text style={{ fontSize: 20, fontWeight: 600, width: '70%' }}>Dò vé số</Text>
            <Entypo name="chevron-small-right" size={34} color="black" />
          </View>
          <View style={{ height: 155, width: '94%', borderWidth: 1, borderColor: 'grey', borderRadius: 15, alignItems: 'flex-start', gap: 8, backgroundColor: '#FBF3D5', padding: 20 }}>
            <Text style={{ color: 'red', fontSize: 16, fontWeight: 600 }}>16:45 có kết quả</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
              <Text style={{ width: '35%', fontSize: 16, justifyContent: 'center' }}>Đà Lạt </Text>
              <Text style={{ width: '35%', fontSize: 16 }}>Tiền Giang</Text>
              <Text style={{ width: '100%', fontSize: 16 }}>Kiên Giang</Text>
            </View>
            <TouchableOpacity style={{ height: 40, width: '100%', backgroundColor: '#E8C872', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                router.navigate({
                  pathname: '/Discover/lottery',
                })
              }}
            >
              <Text>Tra cứu kết quả xổ số</Text>
            </TouchableOpacity>

          </View>

        </Pressable>

      </ScrollView>
    </View>

  )
}

export default index

const styles = StyleSheet.create({})