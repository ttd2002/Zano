import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { mdiArrowLeft } from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
export default function PhoneBook() {
    const navigation = useNavigation();
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        loadContacts(); 
    }, []);

    const loadContacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails],
            });

            if (data.length > 0) {
                setContacts(data); 
            }
        }
    };

    const handleReloadContacts = () => {
        loadContacts(); 
    };
    return (
        <View style={styles.container}>
            <View style={{ width: '100%', height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#00abf6', padding: 10 }}>
                <TouchableOpacity style={{ width: '10%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <AntDesign name="arrowleft" size={24} height={24} color="black" />
                    
                </TouchableOpacity>
                <View style={{ height: 'auto', width: '90%' }}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>Danh bạ máy</Text>
                </View>
            </View>
            <View style={{ backgroundColor: 'white', justifyContent: 'space-between', flexDirection: 'row', width: '100%', padding: 15 }}>
                <View>
                    <Text>Lần cập nhật danh bạ gần nhất</Text>
                    <Text>22:03, 04/02/1120</Text>
                </View>
                <TouchableOpacity
                onPress={handleReloadContacts}
                >
                    <MaterialCommunityIcons name="reload" size={24} color="black" />
                </TouchableOpacity>
                
            </View>


            <View style={{ width: '100%', height: 40, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white' }}>
                <View style={{ borderRadius: 10, backgroundColor: '#F1EFEF', width: '90%', height: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                    <Ionicons name="search-outline" size={20} height={25} color="black" />
                    <View style={{ height: 'auto', width: '90%' }}>
                        <TextInput style={styles.HideTextInput} placeholder='Tìm tên hoặc số điện thoại'></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', height: 54, marginTop: 8, backgroundColor: 'white', padding: 13, gap: 15 }}>
                    <TouchableOpacity style={{ height: 30, width: 80, borderRadius: 20, border: '1px solid grey', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {

                        }}>
                        <Text>Tất cả </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 30, width: 110, borderRadius: 20, border: '1px solid grey', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {

                        }}>
                        <Text>Chưa kết bạn </Text>
                    </TouchableOpacity>
                </View>


                {/* <View style={{ width: '100%', height: 'auto', backgroundColor: 'white', padding: 15 }}>
                    <Text>A</Text>
                    <View style={{ flexDirection: 'row', alignContent: 'space-between', width: '100%', height: 60, alignItems: 'center', gap: 18 }}>
                        <Image style={{ width: 45, height: 45, borderRadius: 60, border: 'solid 1px black' }} source={require('../../../assets/icon.png')} />
                        <View style={{ width: '60%' }}>
                            <Text style={{ fontWeight: '450', fontSize: 18 }}>Nguyen Van A</Text>
                        </View>
                    </View>
                </View> */}
                {contacts.map((contact, index) => (
                    <View key={index} style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: 50,
                                        height: 60,
                                        borderRadius: 25,
                                        backgroundColor: 'gray',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text style={{ color: 'white' }}>{contact.name[0]}</Text>
                                    
                                </View>
                            <Text style={{ marginLeft: 10 }}>{contact.name}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C7C8CC',
        alignItems: 'center',
        // justifyContent: 'center',
    }, HideTextInput: {
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
