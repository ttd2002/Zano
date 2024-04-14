import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from '@mdi/react';
import { mdilMagnify } from '@mdi/light-js';
import { mdiAccountMultiple, mdiAccountPlus, mdiContacts } from '@mdi/js';
import Group from './group';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Friend from './friend';

const index = () => {
  const Tab = createMaterialTopTabNavigator();
  const [selectedTab, setSelectedTab] = useState('Bạn bè');
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator initialLayout={"Bạn bè"}>
        <Tab.Screen name="Bạn bè" component={Friend} />
        <Tab.Screen name="Nhóm" component={Group} />
      </Tab.Navigator>
    </View>
  )
}

export default index;


