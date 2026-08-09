import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{tabBarActiveTintColor : "#3C27F5", headerShown: false}}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon:({color,size, focused}) =><MaterialCommunityIcons name={focused? "home" : "home-outline"} color={color} size={size}/>
        }}/>
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
            tabBarIcon:({color,size,focused})=><MaterialCommunityIcons name={focused? "barcode-scan" : "line-scan"} color={color} size={size}/>
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon:({color,size,focused})=><MaterialCommunityIcons name={focused? "account-settings" : "account-settings-outline"} color={color} size={size}/>
          }}
        />
      </Tabs>
  </GestureHandlerRootView>);
  
}
