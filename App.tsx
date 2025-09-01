import React, { useEffect, useRef } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

import WebViewScreen from './src/WebViewScreen';
import VideoPlayerScreen from './src/VideoPlayerScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();
const navigationRef = React.createRef<NavigationContainerRef>();

// 👇 Allow notifications to show while app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // shows the heads-up banner
    shouldShowList: true,     // shows in the notification center
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 👇 Ask permissions + setup channel for Android
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission not granted for notifications!');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}

export default function App() {
  useEffect(() => {
    // ✅ Ask notification permissions once at startup
    registerForPushNotificationsAsync();

    // ✅ Listen for taps on notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data?.navigateTo === 'VideoPlayer' && navigationRef.current) {
        navigationRef.current.navigate('VideoPlayer');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="WebView">
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
