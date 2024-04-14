import React from "react";
import { Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from "react-native";
const UploadModal = ({ modalVisible, onBackPress, cancelable, onCameraPress, onGalleryPress}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onDismiss={onBackPress}
        >
            <View style={styles.centeredView}>
                <View style={{ width: '80%', height: 'auto' }}>
                    <TouchableOpacity
                        onPress={onCameraPress}
                        style={{ width: '100%', height: 50, backgroundColor: '#eeeee4',alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                        <Text style={{ fontSize: 20, fontStyle: 'normal' }}>Chụp từ máy ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onGalleryPress}
                        style={{ width: '100%', height: 50, backgroundColor: '#eeeee4',alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
                        <Text style={{ fontSize: 20, fontStyle: 'normal' }}>Chọn từ thư viện</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', }}>
                    {cancelable && (<Pressable
                        style={{ ...styles.button, backgroundColor: 'white' }}
                        onPress={onBackPress}>
                        <Text style={[styles.textStyle, { color: '#2b83f9' }]}>Cancel</Text>
                    </Pressable>)}

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 1,
        paddingHorizontal: 20,
        marginTop: 10,
        backgroundColor: '#2b83f9',
        marginLeft: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
    }

});

export default UploadModal