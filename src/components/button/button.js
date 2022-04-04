import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';

const Button = props => {
  return (
    <View style={[props.styleView]}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View>{props.content}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Button;
