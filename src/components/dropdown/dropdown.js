import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import {colors} from '_config';

const Dropdown = props => {
  return (
    <View style={[styles.viewDropdown, props.styleContainer]}>
      {Platform.OS === 'ios' ? (
        <PickerIOS
          style={[styles.dropdownIOS, props.stylePickerIOS]}
          selectedValue={props.selectedValue}
          onValueChange={props.onValueChange}>
          {props.placeholder && (
            <PickerIOS.Item label={props.placeholder} enabled={false} />
          )}
          {props.data.map(d => {
            return <PickerIOS.Item label={d.label} value={d.value} />;
          })}
        </PickerIOS>
      ) : (
        <Picker
          style={styles.dropdown}
          itemStyle={styles.dropdownItem}
          selectedValue={props.selectedValue}
          dropdownIconColor={colors.black}
          onValueChange={props.onValueChange}
          mode="dropdown">
          {props.placeholder && (
            <Picker.Item label={props.placeholder} enabled={false} />
          )}
          {props.data.map(d => {
            return <Picker.Item label={d.label} value={d.value} />;
          })}
        </Picker>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewDropdown: {
    borderColor: colors.muted,
    borderWidth: 2,
    borderRadius: Platform.OS === 'ios' ? 50 : 0,
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
    marginBottom: 10,
  },
  dropdown: {
    height: 55,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
  },
  dropdownIOS: {},
  dropdownItem: {
    color: Platform.OS === 'windows' ? colors.white : colors.black,
    fontSize: 16,
  },
});

export default Dropdown;
