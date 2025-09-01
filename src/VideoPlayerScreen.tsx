import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const STREAMS = [
    { id: 1, title: 'Stream 1', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { id: 2, title: 'Stream 2', url: 'https://test-streams.mux.dev/test_001/stream.m3u8' },
    { id: 3, title: 'Stream 3', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
];

export default function MultiStreamPlayer() {
    const [currentStream, setCurrentStream] = useState(STREAMS[0].url);
    const [loading, setLoading] = useState(true);

    // player instance
    const player = useVideoPlayer(currentStream, (p) => {
        setLoading(true);
        p.play(); // autoplay
    });

    const [muted, setMuted] = useState(player.muted);

    useEffect(() => {
        const sub = player.addListener('statusChange', (event) => {
            console.log('Player status:', event.status);
            if (event.status === 'loading') {
                setLoading(true);
            } else if (event.status === 'ready' || event.status === 'readyToPlay') {
                setLoading(false);
            }
        });

        return () => sub.remove();
    }, [player]);

    // Controls
    const togglePlayPause = () => {
        player.playing ? player.pause() : player.play();
    };

    const skipForward = () => {
        player.seekBy(10); // skip 10s
    };

    const skipBackward = () => {
        player.seekBy(-10); // rewind 10s
    };

    const toggleMute = () => {
        const next = !player.muted;
        player.muted = next;
        setMuted(next);
    };

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />

            {loading ? (
                <ActivityIndicator size="large" color="#1e90ff" style={{ margin: 20 }} />
            ) : (
                <>
                    {/* Custom Controls */}
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={skipBackward} style={styles.button}>
                            <Text style={styles.text}>⏪ 10s</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={togglePlayPause} style={styles.button}>
                            <Text style={styles.text}>
                                {player.playing ? '⏸ Pause' : '▶️ Play'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={skipForward} style={styles.button}>
                            <Text style={styles.text}>10s ⏩</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleMute} style={styles.button}>
                            <Text style={styles.text}>
                                {muted ? '🔇 Unmute' : '🔊 Mute'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stream Switcher */}
                    <View style={styles.streamRow}>
                        {STREAMS.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                onPress={() => {
                                    setCurrentStream(s.url);
                                    setLoading(true);
                                }}
                                style={[
                                    styles.streamBtn,
                                    currentStream === s.url && styles.activeStream,
                                ]}
                            >
                                <Text style={styles.streamText}>{s.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
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
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
        padding: 10,
        marginHorizontal: 8,
        backgroundColor: '#222',
        borderRadius: 8,
    },
    text: {
        color: '#fff',
        fontSize: 14,
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
