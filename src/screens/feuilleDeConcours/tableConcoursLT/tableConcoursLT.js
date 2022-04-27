import React from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';

export const getHeaderTableLT = () => {
  return [
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:first'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:second'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:third'),
    },
    {
      type: 'text',
      width: 60,
      text: i18n.t('competition:performance').substring(0, 4) + '.',
    },
    {type: 'text', width: 40, text: i18n.t('competition:place')},
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fourth'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fifth'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:sixth'),
    },
  ];
};

export const getColumnsVisibleLT = _ => {
  var columnsVisible = [];
  if (_?.colPerfVisible) {
    columnsVisible = [0, 1, 2];
    if (_?.colMiddleRankVisible) {
      columnsVisible.push(3, 4);
    }
    if (_?.nbTries > 3) {
      columnsVisible.push(5);
    }
    if (_?.nbTries > 4) {
      columnsVisible.push(6, 7);
    }
  }
  return columnsVisible;
};

const TableConcoursLT = props => {
  const verifyVisibility = (item, index) => {
    //Si l'element a un index entre premier index des colonnes visibles et premier index+nb de colonnes visibles
    return props.listColumnVisible.indexOf(index) >=
      props.indexFirstColumnVisible &&
      props.listColumnVisible.indexOf(index) <
        props.indexFirstColumnVisible + props.numberOfColumnVisible &&
      props.listColumnVisible.includes(index)
      ? item
      : null;
  };

  const lstTextInput = [];
  for (var i = 0; i < 6; i++) {
    lstTextInput.push(
      <View style={[styleSheet.flex1]}>
        <MyInput
          style={[
            {
              backgroundColor:
                props.resultat.LstEssais[i].ValeurPerformance !== null ||
                i + 1 !== props.essaiEnCours
                  ? colors.gray_light
                  : colors.white,
              borderColor:
                props.athleteEnCours === props.index
                  ? colors.red
                  : colors.muted,
            },
          ]}
          onChange={value => {
            props.onChangeTextValue(props.resultat, i + 1, value);
          }}
          value={props.resultat.LstEssais[i].TextValeurPerformance}
          onBlur={() => {
            props.saveEssai(props.resultat, i + 1, props.index);
          }}
        />
      </View>,
    );
  }
  return (
    <>
      {verifyVisibility(lstTextInput[0], 0)}
      {verifyVisibility(lstTextInput[1], 1)}
      {verifyVisibility(lstTextInput[2], 2)}
      {verifyVisibility(
        <View style={{width: 60}}>
          <Text style={[styleSheet.text]}>
            {props.resultat.MiddlePerfomance?.toString()}
          </Text>
        </View>,
        3,
      )}
      {verifyVisibility(
        <View style={{width: 40}}>
          <Text style={[styleSheet.text]}>
            {props.resultat.MiddlePlace?.toString()}
          </Text>
        </View>,
        4,
      )}
      {verifyVisibility(lstTextInput[3], 5)}
      {verifyVisibility(lstTextInput[4], 6)}
      {verifyVisibility(lstTextInput[5], 7)}
    </>
  );
};

export default TableConcoursLT;
