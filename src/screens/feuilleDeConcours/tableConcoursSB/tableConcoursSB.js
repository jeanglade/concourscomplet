import React from 'react';
import {View} from 'react-native';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';
import {getHauteurToTextValue} from '../../../utils/convertor';

export const getHeaderTableSB = bars => {
  var res = [];
  bars.forEach(bar => {
    res.push({
      type: 'text',
      flex: 1,
      text: getHauteurToTextValue(bar.toString()),
    });
  });
  return res;
};

export const getColumnsVisibleSB = bars => {
  return bars?.map((bar, index) => index);
};

const TableConcoursSB = props => {
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
  const count = props.bars.length;
  for (var i = 0; i < count; i++) {
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
      {props.bars?.map((bar, index) => {
        return <>{verifyVisibility(lstTextInput[index], index)}</>;
      })}
    </>
  );
};

export default TableConcoursSB;
