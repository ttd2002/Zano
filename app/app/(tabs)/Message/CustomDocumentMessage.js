import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDocumentMessage = ({ currentMessage }) => {
    const { document } = currentMessage;

    const openDocument = () => {
        Linking.openURL(document);
    };

    return (
        <TouchableOpacity onPress={openDocument}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="document" size={24} color="black" />
                <Text style={{ marginLeft: 5 }}>Document</Text>
            </View>
        </TouchableOpacity>
    );
};

export default CustomDocumentMessage;
