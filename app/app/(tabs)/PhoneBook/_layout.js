import { Stack } from "expo-router";
import Search from "./component/search";
import HeaderCreateGroup from "./component/headerCreateGroup"
import HeaderFriendRequest from "./component/headerFriendRequest";
export default function Layout() {
  return (
    <>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false}}>
        <Stack.Screen name="index" options={{ headerShown:true, header: () => <Search />}}/>
        <Stack.Screen name="createGroup" options={{ 
          headerShown:false, 
          // header: () => <HeaderCreateGroup />
          }}/>
        <Stack.Screen name="friendRequest" options={{ headerShown:true, header: () => <HeaderFriendRequest />}}/>
        <Stack.Screen name="phoneBook"/>
      </Stack>
    </>
  );
}

