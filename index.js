import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';

class FlipView extends Component {
  static propTypes = {
    ...ViewPropTypes,
    front: PropTypes.node.isRequired,
    back: PropTypes.node.isRequired,
    flipDuration: PropTypes.number,
    flipEasing: PropTypes.func,
    flipAxis: PropTypes.oneOf(['x', 'y']),
    perspective: PropTypes.number,
    onFlipStart: PropTypes.func,
    onFlipEnd: PropTypes.func,
    isFlipped: PropTypes.bool,
  };

  static defaultProps = {
    flipDuration: 500,
    flipEasing: Easing.out(Easing.ease),
    flipAxis: 'y',
    perspective: 1000,
    onFlipStart: () => {},
    onFlipEnd: () => {},
    isFlipped: false,
  };

  constructor(props) {
    super(props);
    this._flipAnim = new Animated.Value(props.isFlipped ? 1 : 0);
    this.state = { isFlipped: props.isFlipped };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFlipped !== this.props.isFlipped) {
      this.flip();
    }
  }

  flip() {
    this.props.onFlipStart(this.state.isFlipped);
    const nextIsFlipped = !this.state.isFlipped;
    Animated.timing(
      this._flipAnim,
      {
        toValue: nextIsFlipped ? 1 : 0,
        duration: this.props.flipDuration,
        easing: this.props.flipEasing,
        useNativeDriver: true,
      },
    ).start(({ finished }) => {
      if (!finished) {
        return;
      }
      this.setState({ isFlipped: nextIsFlipped });
      this.props.onFlipEnd(nextIsFlipped);
    });
  }

  render() {
    const rotateProperty = this.props.flipAxis === 'y' ? 'rotateY' : 'rotateX';

    return (
      <View {...this.props}>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'none' : 'auto'}
          style={[
            StyleSheet.absoluteFill,
            styles.flippableView,
            {
              transform: [
                { perspective: this.props.perspective },
                { [rotateProperty]: this._flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) },
              ],
            },
            // Android does not support backfaceVisibility
            // https://github.com/facebook/react-native/issues/9718
            Platform.select({
              android: {
                opacity: this._flipAnim.interpolate({ inputRange: [0, 0.5, 0.5], outputRange: [1, 1, 0] }),
              },
            }),
          ]}
        >
          {this.props.front}
        </Animated.View>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'auto' : 'none'}
          style={[
            StyleSheet.absoluteFill,
            styles.flippableView,
            {
              transform: [
                { perspective: this.props.perspective },
                { [rotateProperty]: this._flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) },
              ],
            },
            // Android does not support backfaceVisibility
            // https://github.com/facebook/react-native/issues/9718
            Platform.select({
              android: {
                opacity: this._flipAnim.interpolate({ inputRange: [0.5, 0.5, 1], outputRange: [0, 1, 1] }),
              },
            }),
          ]}
        >
          {this.props.back}
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  flippableView: {
    backfaceVisibility: 'hidden',
  },
});

export default FlipView;
