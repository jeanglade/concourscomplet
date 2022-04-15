import React from 'react';
import {colors} from '_config';
import {Platform} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const MyCheckBox = props => {
  return (
    <CheckBox
      value={props.isChecked}
      onValueChange={v => props.setIsChecked(v)}
      disabled={props.disabled}
      tintColor={Platform.OS === 'windows' ? colors.muted : colors.red}
      onCheckColor={Platform.OS === 'windows' ? colors.white : colors.red}
      onFillColor={
        Platform.OS === 'windows' ? colors.ffa_blue_light : colors.red
      }
      onTintColor={
        Platform.OS === 'windows' ? colors.ffa_blue_light : colors.red
      }
      tintColors={{true: colors.ffa_blue_light, false: colors.muted}}
    />
  );
};

export default MyCheckBox;
