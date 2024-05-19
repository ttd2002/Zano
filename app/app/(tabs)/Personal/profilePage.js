// import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Dimensions, Image, ImageBackground, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64"
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FontAwesome6, FontAwesome5, AntDesign, FontAwesome, Fontisto, EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import ImageModal from 'react-native-image-modal';
import { ImageGallerySwiper } from 'react-native-image-gallery-swiper';
global.atob = decode;

const ProfilePage = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [modalVisibleMap, setModalVisibleMap] = useState({});
    const [showAllLines, setShowAllLines] = useState({});
    const [modalComments, setModalComments] = useState({});
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [swipedImage, setSwipedImage] = React.useState();
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
            const userString = await AsyncStorage.getItem("auth");
            const user = JSON.parse(userString);
            // const decodedToken = jwtDecode(token);
            const userId = user._id;
            const name = user.name;
            const avatar = user.avatar;
            setUserId(userId);
            setName(name);
            setAvatar(avatar)
            // console.log(user.name);
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
                    id: 1,
                    url: 'https://source.unsplash.com/random?sig=1',
                },
                {
                    id: 2,
                    url: 'https://source.unsplash.com/random?sig=2',
                },
                {
                    id: 3,
                    url: 'https://source.unsplash.com/random?sig=3',
                },
                {
                    id: 4,
                    url: 'https://source.unsplash.com/random?sig=4',
                },
                {
                    id: 5,
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
                    id: 1,
                    url: 'https://source.unsplash.com/random?sig=1',
                },
                {
                    id: 2,
                    url: 'https://source.unsplash.com/random?sig=2',
                },
                {
                    id: 3,
                    url: 'https://source.unsplash.com/random?sig=3',
                },
                {
                    id: 4,
                    url: 'https://source.unsplash.com/random?sig=4',
                },
                {
                    id: 5,
                    url: 'https://source.unsplash.com/random?sig=5',
                },
                {
                    id: 6,
                    url: 'https://source.unsplash.com/random?sig=6',
                },
            ],
            numberOfLikes: 2,
            numberOfComments: 2,
        },
    ]
    return (
        <ScrollView style={{ flex: 1, width: '100%' }}>
            <View style={{ width: '100%', height: 350, justifyContent: 'flex-start' }}>
                <ImageBackground style={{ width: '100%', height: 200, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_pw1BpBfuZAevTRIg7RFQD1NZzdrEy016w&s' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginLeft: '84%', marginTop: 10 }}
                            onPress={() => {
                                setModalVisible(true);
                            }}>
                            <MaterialIcons name="more-horiz" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Image style={{ height: 130, width: 130, marginTop: 90, borderWidth: 5, borderColor: 'white', borderRadius: 100 }} source={{ uri: avatar ? avatar : 'https://phongreviews.com/wp-content/uploads/2022/11/avatar-facebook-mac-dinh-15.jpg' }}></Image>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 23, fontWeight: '600', marginTop: 3 }}>{name}</Text>
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <FontAwesome name="pencil-square-o" size={18} color="blue" />
                            <Text style={{ padding: 3, color: 'blue' }}>Cập nhật giới thiệu bản thân</Text>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
            <Pressable style={{ backgroundColor: 'white', height: 55, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 15, borderRadius: 10 }}>
                <Text style={{ color: 'grey', fontSize: 16, width: '85%', borderRightWidth: 1, borderRightColor: 'grey' }}>Bạn đang nghĩ gì?</Text>
                <FontAwesome6 name="image" size={24} color="green" />
            </Pressable>
            {data.map((item, dataindex) => (
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5, backgroundColor:'white', paddingTop:10 }} key={dataindex}>
                    <Pressable style={{ width: '88%', height: 50, alignItems: 'center', gap: 15, padding: 10, flexDirection: 'row', padding: 15 }}
                        onPress={() => {
                            // router.navigate({
                            //     pathname: '/Personal/profilePage',
                            // })
                        }}>
                        <Image style={{ height: 50, width: 50, borderRadius:50 }} source={{ uri: avatar?avatar:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png' }}></Image>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>{name}</Text>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                        <TouchableOpacity style={{ marginTop: 10, justifyContent: 'center', height: 45 }}
                            onPress={() => {
                                // Handle chuyển tới trang thông tin cá nhân
                                router.navigate({
                                    pathname: '/Personal/InformationPage',
                                })
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Thông tin cá nhân</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'center', height: 45 }}
                            onPress={() => {
                                // Handle chuyển tới trang đổi mật khẩu
                                router.navigate({
                                    pathname: '/Personal/changePassword',
                                })
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Đổi mật khẩu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ justifyContent: 'center', height: 45 }}
                            onPress={() => {
                                // Handle đăng xuất
                                router.replace('(authenticate)/home')
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>Đăng xuất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                            style={{ position: 'absolute', top: 10, right: 10 }}
                        >
                            <FontAwesome name="times" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default ProfilePage;
