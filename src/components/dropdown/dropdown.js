import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {colors} from '_config';

const Dropdown = props => {
  return (
    <View style={[styles.viewDropdown, props.styleContainer]}>
      <Picker
        style={styles.dropdown}
        styleItem={styles.dropdownItem}
        selectedValue={props.selectedValue}
        dropdownIconColor={colors.black}
        onValueChange={props.onValueChange}
        mode="dropdown">
        {props.data.map(d => {
          return <Picker.Item label={d.label} value={d.value} />;
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  viewDropdown: {
    borderColor: colors.muted,
    borderWidth: 1,
    marginVertical: 15,
  },
  dropdown: {
    color: Platform.OS === 'windows' ? colors.white : colors.black,
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
  },
});

export default Dropdown;
