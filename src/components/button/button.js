import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';

const Button = props => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={props.styleView}>{props.content}</View>
    </TouchableWithoutFeedback>
  );
};

export default Button;
