import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Message"
        options={{
          title: "Tin nhắn",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="message-bulleted" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="message-bulleted" size={24} color="gray" />
            ),
        }}
      />

      <Tabs.Screen
        name="PhoneBook"
        options={{
          title: "Danh bạ",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome
                name="address-book"
                size={24}
                color="black"
              />
            ) : (
              <FontAwesome
                name="address-book-o"
                size={24}
                color="gray"
              />
            ),
        }}
      />

      <Tabs.Screen
        name="Discover"
        options={{
          title: "Khám phá",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="square"
                size={24}
                color="black"
              />
            ) : (
              <Ionicons
                name="square-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="Diary"
        options={{
          title: "Nhật ký",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="stopwatch"
                size={24}
                color="black"
              />
            ) : (
              <Ionicons
                name="stopwatch-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />
      <Tabs.Screen
        name="Personal"
        options={{
          title: "Cá nhân",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="person"
                size={24}
                color="black"
              />
            ) : (
              <Ionicons
                name="person-outline"
                size={24}
                color="gray"
              />
            ),
        }}
      />
    </Tabs>
  );
}