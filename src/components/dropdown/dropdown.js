import React from 'react';
import {View, StyleSheet, Platform, Text, useColorScheme} from 'react-native';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import {colors, styleSheet} from '_config';

const MyDropdown = props => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    view: {
      borderWidth: 1,
      borderColor: colors.muted,
      marginHorizontal: 5,
      borderRadius: Platform.OS === 'ios' ? 50 : 3,
      backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
    },
    dropdown: {
      backgroundColor: Platform.OS === 'windows' ? colors.muted : colors.white,
    },
    dropdownItem: {
      color:
        Platform.OS === 'windows' && colorScheme === 'dark'
          ? colors.white
          : colors.black,
    },
    dropdownIOS: {},
    item: {
      fontSize: 14,
    },
  });
  return (
    <>
      <View style={[styles.view, props.styleContainer]}>
        {Platform.OS === 'ios' ? (
          <PickerIOS
            style={[styles.dropdownIOS, props.stylePickerIOS]}
            selectedValue={props.selectedValue}
            onValueChange={props.onValueChange}>
            {props.placeholder && (
              <PickerIOS.Item
                style={styles.item}
                label={props.placeholder}
                value={props.placeholder}
              />
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
            dropdownIconColor={colors.muted}
            onValueChange={props.onValueChange}
            mode="dropdown">
            {props.placeholder && (
              <Picker.Item
                color={colors.muted}
                style={styles.item}
                label={props.placeholder}
                value={props.placeholder}
              />
            )}
            {props.data.map(d => {
              return (
                <Picker.Item
                  style={styles.item}
                  label={d.label}
                  value={d.value}
                />
              );
            })}
          </Picker>
        )}
      </View>
      {props.touched && props.error && (
        <Text style={styleSheet.textError}>{props.error}</Text>
      )}
    </>
  );
};

export default MyDropdown;
