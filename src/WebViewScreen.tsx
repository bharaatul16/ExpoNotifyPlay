import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  // Show the banner (heads-up notification)
        shouldShowList: true,    // Show in notification center list
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const triggerNotificationAndNavigate = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Tap to Watch Video",
            body: "Open the video player by tapping this notification.",
            data: { navigateTo: 'VideoPlayer' }, // Custom data to identify navigation
        },
        trigger: { seconds: 2 }, // Delay 3 seconds for example
    });
};

export default function WebViewScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <WebView source={{ uri: 'https://expo.dev' }} style={styles.webview} />
            <View style={styles.buttonContainer}>
                <Button title="Notify & Open Video" onPress={triggerNotificationAndNavigate} />
                <Button title="Go to Video Player" onPress={() => navigation.navigate('VideoPlayer')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    webview: { flex: 1 },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
});
