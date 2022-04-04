import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from '_components';

const DropdownCompetition = props => {
  console.log('DropdownCompetition', props);

  return (
    <Dropdown
      styleContainer={styles.container}
      selectedValue={props.selectedValue}
      onValueChange={value => {
        console.log('value', value);
        props.setChoiceCompetition(value);
      }}
      data={props.allComps.map(compete => {
        return {
          label: compete.competitionInfo,
          value: compete,
        };
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 600,
  },
});

export default DropdownCompetition;
