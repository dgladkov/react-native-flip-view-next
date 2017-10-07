# react-native-flip-view-next

React Native component that can flip between front and back views.

Based on https://github.com/kevinstumpf/react-native-flip-view

## Differences from react-native-flip-view

* Works around missing backfaceVisibility support on Android. (see [react-native#9718](https://github.com/facebook/react-native/issues/9718))
* Updated for React 16
* Uses single `Animated.Value` for opacity and rotation on both sides.
* Animation uses native driver.

## Installation

```
$ npm install react-native-flip-view
```

## Usage

See https://github.com/kevinstumpf/react-native-flip-view
