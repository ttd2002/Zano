import { Stack, Navigator } from "expo-router";

export default function Layout() {
  return (
    <>
      <Stack initialRouteName="home">
        <Stack.Screen name="home" options={{headerShown: false}}/>
        <Stack.Screen name="login" options={{headerTitle: 'Đăng nhập', headerStyle:{backgroundColor: '#007bff'},headerTintColor: "white",}} />
        <Stack.Screen name="register" options={{headerTitle: '', headerShadowVisible: false}} />
        <Stack.Screen name="changePassword" options={{headerShown: false}}/>
      </Stack>
    </>
  );
}