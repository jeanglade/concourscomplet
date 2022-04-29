import React, {useState} from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';
import {getHauteurToTextValue} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

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
  const calculBestPerf = (resultat, nbTries) => {
    var res = resultat.LstEssais[0].ValeurPerformance;
    if (res !== null && res !== '') {
      for (var i = 1; i < nbTries; i++) {
        const valeur = parseInt(
          resultat.LstEssais[i].ValeurPerformance?.replace('m', ''),
        );
        if (valeur) {
          res =
            valeur >= parseInt(res?.replace('m', ''))
              ? resultat.LstEssais[i].ValeurPerformance
              : res;
        }
      }
    }
    return getHauteurToTextValue(res?.replace('m', ''));
  };

  const [middleBestPerf, setMiddleBestPerf] = useState(
    calculBestPerf(props.resultat, 3),
  );

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

  const saveEssai = async (resultat, numEssai, index) => {
    const result = resultat.LstEssais[numEssai].ValeurPerformance?.replace(
      'm',
      '',
    );
    var newResultat = props.concoursData;
    var essaiComplete = true;
    const meilleurPerf = calculBestPerf(props.resultat, 6);
    props.setBestPerf(meilleurPerf);
    resultat.Performance = meilleurPerf;
    setMiddleBestPerf(calculBestPerf(props.resultat, 3));
    if (result !== '' && result !== null) {
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
        index
      ] = resultat;
      await setFile(props.concoursData?._?.id, JSON.stringify(newResultat));
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
        (v, i) => {
          if (
            v.LstEssais[numEssai].ValeurPerformance === null ||
            v.LstEssais[numEssai].ValeurPerformance === ''
          ) {
            essaiComplete = false;
          }
        },
      );

      if (essaiComplete) {
        props.setEssaiEnCours(oldValue => oldValue + 1);
      }
    }
    props.setHaveToCalculPlace(oldValue => !oldValue);
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    if (numEssai % 2 === 1) {
      resultat.LstEssais[Math.floor(numEssai / 2)].Vent = value;
    } else {
      resultat.LstEssais[numEssai].ValeurPerformance = value;
      resultat.LstEssais[numEssai].SatutPerformance = value;
    }
  };

  const lstTextInput = [];
  const initValue = [];
  for (var i = 0; i < 12; i++) {
    initValue.push(props.resultat.LstEssais[i].ValeurPerformance);
  }
  const [values, setValues] = useState(initValue);
  for (var i = 0; i < 12; i++) {
    const indexH = i;
    lstTextInput.push(
      <View style={[styleSheet.flex1]}>
        <MyInput
          placeholder={
            indexH % 2 === 1
              ? i18n.t('competition:performance').substring(0, 4) + '.'
              : i18n.t('competition:wind')
          }
          style={[
            {
              backgroundColor:
                (props.resultat.LstEssais[indexH].ValeurPerformance === null ||
                  props.resultat.LstEssais[indexH].ValeurPerformance === '') &&
                indexH + 1 === props.essaiEnCours
                  ? colors.white
                  : colors.gray_light,
            },
          ]}
          onChange={v => {
            setValues(oldValues =>
              oldValues.map((val, ind) => (ind === indexH ? v : val)),
            );
            onChangeTextValue(props.resultat, indexH, v);
          }}
          value={values[indexH]}
          onBlur={() => {
            saveEssai(props.resultat, indexH, props.index);
            setValues(oldValues =>
              oldValues.map((val, ind) =>
                ind === indexH && val !== null
                  ? getHauteurToTextValue(val.replace('m', ''))
                  : val,
              ),
            );
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
          <Text style={[styleSheet.text]}>{middleBestPerf}</Text>
        </View>,
        6,
      )}
      {verifyVisibility(
        <View style={{width: 40}}>
          <Text style={[styleSheet.text]}>
            {props.middlePlace[props.index]}
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
