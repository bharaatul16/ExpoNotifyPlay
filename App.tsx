import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WebViewScreen from './src/WebViewScreen';
import VideoPlayerScreen from './src/VideoPlayerScreen';
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();
const navigationRef = React.createRef<NavigationContainerRef>();

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      // If notification data has navigateTo as 'VideoPlayer', navigate
      if (data?.navigateTo === 'VideoPlayer' && navigationRef.current) {
        navigationRef.current.navigate('VideoPlayer');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="WebView">
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


