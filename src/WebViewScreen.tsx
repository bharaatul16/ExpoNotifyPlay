import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,   // shows the heads-up banner
        shouldShowList: true,     // shows in the notification center
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function WebViewScreen() {
    const navigation = useNavigation();
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // Listener: When user taps a notification
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const screen = response.notification.request.content.data?.navigateTo;
            if (screen) {
                navigation.navigate(screen); // ✅ only for Notification 1
            }
        });

        return () => subscription.remove();
    }, [navigation]);

    // Notification 1 (5s, navigates)
    const triggerNotification1 = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🎬 Tap to Watch Stream",
                body: "Your video is ready. Open the player now!",
                data: { navigateTo: 'VideoPlayer' },
            },
            trigger: { seconds: 5 },
        });
    };

    // Notification 2 (2s, no navigation)
    const triggerNotification2 = async () => {
        console.log('Triggering Notification 2');
        try {

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "You webview has loaded!",
                    body: "For any action, return to the app.",
                },
                trigger: { seconds: 2 },
            });
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    };

    // Auto-fire Notification 2 when WebView finishes loading
    const handleWebViewLoad = () => {
        if (!hasLoaded) {
            setHasLoaded(true);
            console.log("WebView loaded once!");
            triggerNotification2();

            // your logic here
        }
    };
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://expo.dev' }}
                style={styles.webview}
                onLoadEnd={handleWebViewLoad}
            />

            <View style={styles.buttonContainer}>
                <Button title="Notify (2s)" onPress={triggerNotification2} />
                <Button title="Notify (5s)" onPress={triggerNotification1} />
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
