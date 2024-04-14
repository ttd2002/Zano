import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function SkySport() {
  const navigation = useNavigation();
  return (
    <View style={{ flex:1 }}>
      <View style={{ height: 50, width: '100%', backgroundColor: '#DEB887', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', padding: 10 }}>
        <TouchableOpacity style={{ width: '8%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 40 }}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
      </View>
      <WebView
        style={styles.container}
        source={{ uri: 'https://www.skysports.com/football-fixtures' }}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: Constants.statusBarHeight,
  },
});
