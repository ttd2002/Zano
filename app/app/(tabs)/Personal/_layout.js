import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>
      <Stack initialRouteName="profilePage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="InformationPage" />
        <Stack.Screen name="profilePage" />
      </Stack>
    </>
  );
}