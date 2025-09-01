import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const STREAMS = [
    { id: 1, title: 'Stream 1', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 2, title: 'Stream 2', url: 'https://test-streams.mux.dev/test_001/stream.m3u8' },
    { id: 3, title: 'Stream 3', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
];

export default function MultiStreamPlayer() {
    const [currentStream, setCurrentStream] = useState(STREAMS[0].url);

    // whenever currentStream changes, useVideoPlayer reinitializes with the new URL
    const player = useVideoPlayer(currentStream, (p) => {
        p.play(); // autoplay
    });

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />

            {/* Stream Switcher */}
            <View style={styles.streamRow}>
                {STREAMS.map((s) => (
                    <TouchableOpacity
                        key={s.id}
                        onPress={() => setCurrentStream(s.url)}
                        style={[
                            styles.streamBtn,
                            currentStream === s.url && styles.activeStream,
                        ]}
                    >
                        <Text style={styles.streamText}>{s.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    video: {
        width,
        height: (width * 9) / 16,
        backgroundColor: '#000',
    },
    streamRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 10,
    },
    streamBtn: {
        padding: 8,
        margin: 5,
        borderRadius: 6,
        backgroundColor: '#333',
    },
    activeStream: {
        backgroundColor: '#1e90ff',
    },
    streamText: {
        color: '#fff',
        fontSize: 14,
    },
});
