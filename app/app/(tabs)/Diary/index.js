import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image, TextInput, ScrollView, Dimensions, Modal } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { FontAwesome6, FontAwesome5, AntDesign, Fontisto, EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import ImageModal from 'react-native-image-modal';
import { ImageGallerySwiper } from 'react-native-image-gallery-swiper';
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64"
global.atob = decode;
const index = () => {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [swipedImage, setSwipedImage] = React.useState();
  const [modalVisibleMap, setModalVisibleMap] = useState({});
  const [showAllLines, setShowAllLines] = useState({});
  const [modalComments, setModalComments] = useState({});

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");


  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleShowAllLines = (itemId) => {
    setShowAllLines(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const toggleModal = (itemId) => {
    setModalVisibleMap(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const toggleModalComments = (itemId) => {
    setModalComments(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  useEffect(() => {
    fetchUser();
    const initialState = {};
    data.forEach(item => {
      initialState[item.id] = false;
    });
    setModalVisibleMap(initialState);
    setShowAllLines(initialState);
    setModalComments(initialState);

  }, []);



  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const name = decodedToken.uName;
      const avatar = decodedToken.uAvatar;
      setUserId(userId);
      setName(name);
      setAvatar(avatar);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };
  const data = [
    {
      id: 1,
      avatar: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png',
      content: 'cdv d hdh  dh gf jhTinh thần thơ mới là một nội dung nổi bật được Hoài Thanh nói lên thật sâu sắc trong phần cuối bài tiểu luận Một thời đại trong thi ca.Sau khi chỉ ra hình dáng câu thơ, nhạc điệu câu thơ, sự mềm mại, chỗ ngắt hơi, phép dùng chữ, phép đặt...',
      images: [
        {
          // Không có id bị báo warning, lúc thêm dùng images.length + 1 để gán vào id
          id:1,
          url: 'https://source.unsplash.com/random?sig=1',
        },
        {
          id:2,
          url: 'https://source.unsplash.com/random?sig=2',
        },
        {
          id:3,
          url: 'https://source.unsplash.com/random?sig=3',
        },
        {
          id:4,
          url: 'https://source.unsplash.com/random?sig=4',
        },
        {
          id:5,
          url: 'https://source.unsplash.com/random?sig=5',
        },
      ],
      numberOfLikes: 2,
      numberOfComments: 2,
      comments: [
        {
          name: 'abc',
          content: 'BBHdbsbfsjbfhs',
          reply: [
            {
              name: 'bcd',
              content: 'dsghduhsdúdgf'
            }
          ]
        },
        {
          name: 'abc',
          content: 'BBHdbsbfsjbfhs',
          reply: [
            {
              name: 'bcd',
              content: 'dsghduhsdúdgf'
            }
          ]
        }

      ]
    },
    {
      id: 2,
      avatar: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png',
      content: '',
      images: [
        {
          id:1,
          url: 'https://source.unsplash.com/random?sig=1',
        },
        {
          id:2,
          url: 'https://source.unsplash.com/random?sig=2',
        },
        {
          id:3,
          url: 'https://source.unsplash.com/random?sig=3',
        },
        {
          id:4,
          url: 'https://source.unsplash.com/random?sig=4',
        },
        {
          id:5,
          url: 'https://source.unsplash.com/random?sig=5',
        },
        {
          id:6,
          url: 'https://source.unsplash.com/random?sig=6',
        },
      ],
      numberOfLikes: 2,
      numberOfComments: 2,
    },
  ]

  return (
    <View style={{ height: '100%' }}>
      <View style={{ backgroundColor: '#00abf6', justifyContent: 'center', alignItems: 'center', flexDirection: "row", alignItems: "center", gap: 10, height: 50 }}>
        <Pressable onPress={() =>
          router.navigate({
            pathname: '/Diary/search',
          })
        }>
          <AntDesign name="search1" size={24} color="white" />
        </Pressable>
        <Pressable onPress={() =>
          router.navigate({
            pathname: '/Diary/search',
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



      <ScrollView style={{ width: '100%', backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', padding: 15, flexWrap: 'wrap', backgroundColor: 'white' }}>
          <Pressable style={{ width: '16%', height: 60, alignItems: 'center', justifyContent: 'center', padding: 10 }}
            onPress={() => {
              router.navigate({
                pathname: '/Personal/profilePage',
              })
            }}>
            <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={{ uri: avatar ? avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }}></Image>
          </Pressable>
          <Pressable style={{ width: '84%', height: 60, justifyContent: 'center', padding: 10 }}
            onPress={() => {
              router.navigate({
                pathname: '/Diary/createDiary',
              })
            }}>
            <Text style={{ fontSize: 17 }}>Hôm nay bạn thế nào?</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', width: '100%', height: 55, alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ width: '45%', height: 40, backgroundColor: '#E8E8E8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                // router.navigate({
                //   pathname: '/Personal/profilePage',
                // })
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <FontAwesome6 name="image" size={24} color="green" />
                <Text style={{}}>Ảnh</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '45%', height: 40, backgroundColor: '#E8E8E8', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                // router.navigate({
                //   pathname: '/Personal/profilePage',
                // })
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <FontAwesome5 name="video" size={24} color="pink" />
                <Text style={{}}>Ảnh</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
        {data.map((item, dataindex) => (
          <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }} key={dataindex}>
            <Pressable style={{ width: '88%', height: 50, alignItems: 'center', gap: 15, padding: 10, flexDirection: 'row', padding: 15 }}
              onPress={() => {
                router.navigate({
                  pathname: '/Personal/profilePage',
                })
              }}>
              <Image style={{ height: 50, width: 50 }} source={{ uri: `${item.avatar}` }}></Image>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Nguyen Van AA</Text>
                <Text style={{ fontSize: 15, fontWeight: '400' }}>Hôm nay lúc 18:21</Text>
              </View>
            </Pressable>
            <Pressable style={{ width: '12%', height: 50, alignItems: 'center', padding: 10, flexDirection: 'row' }}
              onPress={() => {
                // router.navigate({
                //   pathname: '/Personal/profilePage',
                // })
              }}>
              <Feather name="more-horizontal" size={24} color="black" />
            </Pressable>
            {item.content ? <Pressable style={{ width: '100%', justifyContent: 'center', padding: 10 }}
              onPress={() => {
                toggleShowAllLines(item.id)
              }}
            >
              {/* Content  */}
              <Text numberOfLines={showAllLines[item.id] ? undefined : 3}>{item.content ? item.content : ''}</Text>
            </Pressable> : <></>}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginTop: 5 }}>
              {item.images.length === 1 && (
                <View style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <ImageModal
                    resizeMode="contain"
                    imageBackgroundColor="#181818"
                    style={{
                      width: screenWidth,
                      height: screenHeight / 2,
                    }}
                    source={{
                      uri: item.images[0].url,
                    }}
                  />
                </View>
              )}
              {item.images.length === 2 && (
                <>
                  {item.images.slice(0, 2).map((image, index) => (
                    <View key={index + 1} style={{ width: screenWidth / 2 }}>
                      <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="#181818"
                        style={{
                          width: screenWidth / 2,
                          height: screenHeight / 3,
                        }}
                        source={{
                          uri: image.url,
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
              {item.images.length === 3 && (
                <>
                  {item.images.slice(0, 3).map((image, index) => (
                    <View key={index + 1} style={{ width: screenWidth / 3 }}>
                      <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="#181818"
                        style={{
                          width: screenWidth / 3,
                          height: screenHeight / 4,
                        }}
                        source={{
                          uri: image.url,
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
              {item.images.length === 4 && (
                <>
                  {item.images.slice(0, 4).map((image, index) => (
                    <View key={index + 1} style={{ width: '50%', height: screenWidth / 2 }}>
                      <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="#181818"
                        style={{
                          width: screenWidth / 2,
                          height: screenHeight / 4,
                        }}
                        source={{
                          uri: image.url,
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
              {item.images.length > 4 && (
                <>
                  {item.images.slice(0, 3).map((image, index) => (
                    <View key={index} style={{ width: '50%', height: screenWidth / 2 }} onPress={() => handleImagePress(image)}>
                      <ImageModal
                        resizeMode="contain"
                        imageBackgroundColor="#181818"
                        style={{
                          width: screenWidth / 2,
                          height: screenHeight / 4,
                        }}
                        source={{
                          uri: image.url,
                        }}
                      />
                    </View>
                  ))}
                  <View key={4} style={{ width: '50%', height: screenWidth / 2, backgroundColor: "#181818" }}>
                    <ImageModal
                      resizeMode="contain"
                      imageBackgroundColor="#181818"
                      style={{
                        width: screenWidth / 2,
                        height: screenHeight / 4,
                      }}
                      source={{
                        uri: item.images[3].url,
                      }}
                    />
                    <TouchableOpacity style={{ height: '30%', width: '30%', position: 'absolute', bottom: '35%', right: '35%', backgroundColor: 'black', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { toggleModal(item.id) }}
                    >
                      <Text style={{ color: 'white' }}>
                        +{item.images.length - 4}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <Modal
                visible={modalVisibleMap[item.id]}
                transparent
                animationType="slide"
                onRequestClose={() => toggleModal(item.id)}
              >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                  <TouchableOpacity style={{ position: 'absolute', top: 10, right: 20 }} onPress={() => toggleModal(item.id)}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
                  </TouchableOpacity>
                  <View style={{ width: '100%', height: '90%', justifyContent: 'center', alignItems: 'center' }}>
                    <ImageGallerySwiper
                      images={item.images}
                      swipeUp={() => console.log('up')}
                      swipeDown={() => console.log('down')}
                      // displayName
                      showThumbs
                      getSwipedImage={setSwipedImage}
                      activeImage={3}
                      arrows={{
                        arrowRight: require('../../../assets/right-arrow.png'),
                        arrowLeft: require('../../../assets/left-arrow.png'),
                        arrowStyles: {
                          backgroundColor: 'gray',
                          height: 30,
                          width: 30,
                          borderRadius: 10,
                        },
                        containerStyles: {
                          width: '100%',
                          position: 'absolute',
                          // display: 'flex',
                          flexDirection: 'row',
                          // marginTop: 200,
                          justifyContent: 'space-between',
                          paddingHorizontal: 20,
                        },
                      }}
                    >
                    </ImageGallerySwiper>
                  </View>

                </View>
              </Modal>
            </View>
            <View style={{ width: '100%', height: 70, justifyContent: 'center', padding: 10 }}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity onPress={handleLike}>
                  {/* Sử dụng biểu tượng 'heart' hoặc 'hearto' dựa trên trạng thái của isLiked */}
                  <AntDesign name={isLiked ? 'heart' : 'hearto'} size={24} color={isLiked ? 'red' : 'black'} />
                </TouchableOpacity>
                {item.numberOfLikes > 0 ? <Text style={{ justifyContent: 'center', fontSize: 18 }}>{item.numberOfLikes} lượt thích</Text> : <></>}
                <TouchableOpacity
                  onPress={() => {
                    toggleModalComments(item.id)
                  }}
                >
                  <Fontisto name="comment" size={24} color="black" />

                </TouchableOpacity>
                {item.numberOfComments > 0 ? <Text style={{ justifyContent: 'center', fontSize: 18 }}>{item.numberOfComments} bình luận</Text> : <></>}
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalComments[item.id]}
                onRequestClose={() => toggleModalComments(item.id)}
              >
                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                  <TouchableOpacity style={{ position: 'absolute', top: 10, right: 20 }} onPress={() => toggleModalComments(item.id)}>
                    <Text style={{ color: 'black', fontSize: 18 }}>Close</Text>
                  </TouchableOpacity>
                  {/* <Comments item={item}></Comments> */}
                  <ScrollView style={{ width: '100%', marginTop: 40 }}>
                    {item?.comments?.map((comment, index) => {
                      return (
                        <View style={{ width: '100%', height: 50 }} key={index}>
                          <Text style={{ color: 'black' }}>{comment.name}</Text>
                          <Text style={{ color: 'black', marginLeft: 20 }}>{comment.content}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </Modal>
            </View>

          </View>
        ))}

      </ScrollView>

    </View>
  )
}

export default index

const styles = StyleSheet.create({

});