import { Stack } from "expo-router";

export default function Layout() {
  return (
    <>
      <Stack initialRouteName="index">
        <Stack.Screen options={{headerShown: false}} name="index" />
        <Stack.Screen options={{headerShown: false}} name="chatRoom" />
        <Stack.Screen options={{headerShown: false}} name="options" />
      </Stack>
    </>
  );
}