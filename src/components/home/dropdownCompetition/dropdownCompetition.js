import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from '_components';

const DropdownCompetition = props => {
  return (
    <Dropdown
      styleContainer={styles.container}
      selectedValue={props.competition}
      onValueChange={value => {
        props.setCompetition(value);
      }}
      data={props.allCompetitions.map(competition => {
        return {
          label: competition.competitionInfo,
          value: competition,
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
