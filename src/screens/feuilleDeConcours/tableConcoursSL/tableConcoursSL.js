import React from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';

export const getHeaderTableSL = () => {
  return [
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:first'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:first') + ' ' + i18n.t('competition:wind'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:second'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:second') + ' ' + i18n.t('competition:wind'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:third'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:third') + ' ' + i18n.t('competition:wind'),
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
      text: i18n.t('competition:fourth') + ' ' + i18n.t('competition:wind'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fifth'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fifth') + ' ' + i18n.t('competition:wind'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:sixth'),
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:sixth') + ' ' + i18n.t('competition:wind'),
    },
  ];
};

export const getColumnsVisibleSL = _ => {
  var columnsVisible = [];
  for (var i = 0; i < 14; i += 2) {
    if (i === 6) {
      if (_?.colPerfVisible && _?.colMiddleRankVisible) {
        columnsVisible.push(6, 7);
      }
    } else {
      if (i < 6 || (i === 8 && _?.nbTries > 3) || (i > 8 && _?.nbTries > 4)) {
        if (_?.colPerfVisible) {
          columnsVisible.push(i);
        }
        if (_?.colWindVisible) {
          columnsVisible.push(i + 1);
        }
      }
    }
  }
  return columnsVisible;
};

const TableConcoursSL = props => {
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
  for (var i = 0; i < 12; i++) {
    lstTextInput.push(
      <View style={[styleSheet.flex1]}>
        <MyInput
          style={[
            {
              backgroundColor:
                props.resultat.LstEssais[i]?.ValeurPerformance !== null ||
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
          value={props.resultat.LstEssais[i]?.TextValeurPerformance}
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
      {verifyVisibility(lstTextInput[3], 3)}
      {verifyVisibility(lstTextInput[4], 4)}
      {verifyVisibility(lstTextInput[5], 5)}
      {verifyVisibility(
        <View style={{width: 60}}>
          <Text style={[styleSheet.text]}>
            {props.resultat.MiddlePerfomance?.toString()}
          </Text>
        </View>,
        6,
      )}
      {verifyVisibility(
        <View style={{width: 40}}>
          <Text style={[styleSheet.text]}>
            {props.resultat.MiddlePlace?.toString()}
          </Text>
        </View>,
        7,
      )}
      {verifyVisibility(lstTextInput[6], 8)}
      {verifyVisibility(lstTextInput[7], 9)}
      {verifyVisibility(lstTextInput[8], 10)}
      {verifyVisibility(lstTextInput[9], 11)}
      {verifyVisibility(lstTextInput[10], 12)}
      {verifyVisibility(lstTextInput[11], 13)}
    </>
  );
};

export default TableConcoursSL;
