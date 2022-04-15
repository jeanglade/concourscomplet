import React from 'react';
import {colors} from '_config';
import CheckBox from '@react-native-community/checkbox';

const MyCheckBox = props => {
  return (
    <CheckBox
      value={props.isChecked}
      onValueChange={v => props.setIsChecked(v)}
      disabled={props.disabled}
      tintColor={colors.black}
      onCheckColor={colors.black}
      onFillColor={colors.black}
      onTintColor={colors.black}
      tintColors={{true: colors.ffa_blue_light, false: colors.muted}}
    />
  );
};

export default MyCheckBox;
