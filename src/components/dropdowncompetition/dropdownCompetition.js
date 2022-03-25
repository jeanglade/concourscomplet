import React from 'react';

import {View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {colors} from '_config';

const DropdownCompetition = props => {
  return (
    <>
      <View style={styles.viewDropdown}>
        <Picker
          style={styles.dropdown}
          styleItem={styles.dropdownItem}
          selectedValue={props.competition}
          dropdownIconColor={colors.muted}
          onValueChange={value => {
            props.setCompetition(value);
          }}
          mode="dropdown">
          {props.allCompetitions.map(rowData => {
            return (
              <Picker.Item
                style={styles.dropdownItem}
                label={rowData.competitionInfo}
                value={rowData}
              />
            );
          })}
        </Picker>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  viewDropdown: {
    borderColor: colors.muted,
    borderWidth: 1,
    width: 400,
  },
  dropdown: {
    padding: 0,
    margin: 0,
    color: colors.black,
    backgroundColor: colors.white,
  },
  dropdownItem: {
    color: colors.black,
    backgroundColor: colors.white,
    fontSize: 14,
    padding: 0,
    margin: 0,
    height: 20,
  },
});

export default DropdownCompetition;
