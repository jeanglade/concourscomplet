import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from '_components';

const DropdownCompetition = props => {
  return (
    <Dropdown
      styleContainer={styles.container}
      onValueChange={(value, index) => {
        props.setSelectedValue(index);
      }}
      data={props.allComps.map(compete => {
        return {
          label: compete.competitionInfo,
          value: compete,
        };
      })}
      selectedValue={props.selectedValue}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 600,
  },
});

export default DropdownCompetition;
