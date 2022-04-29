import React from 'react';
import {View} from 'react-native';
import {colors} from '_config';
import {MyInput} from '_components';
import {getHauteurToTextValue} from '../../../utils/convertor';

export const getHeaderTableSB = bars => {
  var result = [];
  if (bars.length > 0) {
    bars.forEach(bar => {
      result.push({
        type: 'text',
        width: 75,
        text: getHauteurToTextValue(bar.toString()),
      });
    });
  }
  return result;
};

export const getColumnsVisibleSB = (bars, columnPerfVisible) => {
  return columnPerfVisible ? bars?.map((bar, index) => index) : [];
};

export const calculBestPlaceSB = (resultats, nbTries) => {
  return null;
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
      <View style={{width: 70, marginEnd: 5}}>
        <MyInput
          style={[
            {
              backgroundColor:
                props.resultat.Athlete?.firstBar !== undefined &&
                parseInt(props.resultat.Athlete?.firstBar) === props.bars[i]
                  ? colors.white
                  : colors.gray_light,
              borderColor:
                props.athleteEnCours === props.index
                  ? colors.red
                  : colors.muted,
              width: 70,
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
        return (
          <>
            {verifyVisibility(
              props.resultat.Athlete?.firstBar === undefined ||
                bar >= props.resultat.Athlete?.firstBar ? (
                lstTextInput[index]
              ) : (
                <View style={{width: 75}}></View>
              ),
              index,
            )}
          </>
        );
      })}
    </>
  );
};

export default TableConcoursSB;
