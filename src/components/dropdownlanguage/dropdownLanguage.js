import React from 'react';
import {StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';

const DropdownLanguage = () => {
  const {i18n} = useTranslation();
  return (
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={i18n.language}
      dropdownIconColor={colors.ffa_blue_light}
      dropdownIconRippleColor={colors.ffa_blue_light}
      onValueChange={value => i18n.changeLanguage(value)}
      mode="dropdown">
      <Picker.Item label="🇫🇷" value="fr" />
      <Picker.Item label="🇬🇧" value="en" />
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    marginHorizontal: 10,
    width: 100,
    //marginEnd: -50,
    //backgroundColor: colors.ffa_blue_light,
  },
  pickerItem: {
    //backgroundColor: colors.ffa_blue_light,
  },
});

export default DropdownLanguage;
