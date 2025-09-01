# ExpoNotifyPlay

## Overview

ExpoNotifyPlay is a React Native Expo app featuring two main pages:

- **WebView + Notifications:** Embeds a website using `react-native-webview`. Includes two buttons triggering distinct local notifications with 2-5 second delays.
- **Video Player (HLS Playback):** Plays HLS video streams using Expo's modern `expo-video` component with play, pause, and fullscreen controls.

## Choices and Implementation

### WebView and Notifications

- Used `react-native-webview` for robust web content embedding.
- Implemented local notifications with `expo-notifications` to trigger delayed messages on button press.
- Added a notification triggered on WebView load completion (`onLoadEnd`) as an optional bonus.
- Notifications include deep link data to navigate to the Video Player page when tapped, using Expo's notification response listener and React Navigation.

### Video Player

- Chose Expo's `expo-video` package (preferred over deprecated `expo-av` Video) for HLS stream playback compatibility.
- Supports native controls including play, pause, and fullscreen.
- Designed to allow switching between multiple video streams via selectable buttons for future extensibility.

### Navigation

- Utilized React Navigation stack (`@react-navigation/native` and `@react-navigation/stack`) for smooth transition between WebView and Video Player pages.
- Navigation is typed using TypeScript to ensure type safety and better developer experience.

## Setup and Running