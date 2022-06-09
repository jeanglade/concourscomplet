import React, {useState} from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';
import {
  convertHauteurToString,
  convertVentToString,
  convertStringToHauteur,
  convertStringToVent,
  setConcoursStatus,
} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

//SL Saut Longitudinaux
const TableConcoursSL = props => {
  //Meilleure performance sur X essais
  const calculBestPerf = (resultat, nbTries) => {
    console.log('TableConcoursSL > calculBestPerf');
    var bestPerf = Math.max(
      [...Array(nbTries).keys()]
        .map(i => parseInt(resultat.LstEssais[i].PerfValue))
        .filter(i => !isNaN(i)),
    );

    if (bestPerf !== 0) {
      bestPerf = convertHauteurToString(bestPerf);
    } else {
      if (
        resultat.LstEssais.map(v => v.PerfValue).includes('X') &&
        resultat.LstEssais.every(
          v =>
            v.PerfValue === 'X' ||
            v.PerfValue === '' ||
            v.PerfValue === '-' ||
            v.PerfValue === null,
        )
      ) {
        bestPerf = 'NM';
      } else {
        bestPerf = '';
      }
    }
    return bestPerf;
  };

  const [middleBestPerf, setMiddleBestPerf] = useState(
    calculBestPerf(props.resultat, 3),
  );

  const getNextAthlete = numEssai => {
    console.log('tableConcoursSL > getNextAthlete');
    var result = -1;
    //Premier athlete n'ayant pas de résultat pour l'essai en cours
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
      (v, i) => {
        if (
          result === -1 &&
          (v.LstEssais[numEssai].PerfValue === '' ||
            v.LstEssais[numEssai].PerfValue === null)
        ) {
          result = i;
        }
      },
    );
    return result;
  };

  //Mise à jour des meilleures performances
  const updateBestPerf = resultat => {
    const meilleurPerf = calculBestPerf(resultat, 6);
    if (meilleurPerf !== resultat.Performance) {
      props.setBestPerf(meilleurPerf);
      resultat.Performance = meilleurPerf;
    }
    setMiddleBestPerf(calculBestPerf(resultat, 3));
  };

  //Mise à jour de l'essai/athlète en cours
  const updateAthleteAndTrie = numEssai => {
    const essaiComplete = getNextAthlete(numEssai) != -1;
    if (essaiComplete) {
      props.setEssaiEnCours(numEssai + 1);
    }
    props.setAthleteEnCours(getNextAthlete(numEssai + (essaiComplete ? 1 : 0)));
    props.setHaveToCalculPlace(oldValue => !oldValue);
  };

  //Mise à jour du statut du concours
  const updateStatus = async () => {
    if (props.concoursData._?.statut === i18n.t('common:ready')) {
      var data = props.concoursData;
      data = setConcoursStatus(data, i18n.t('common:in_progress'));
      await setFile(data?._?.id, JSON.stringify(data));
      props.refreshConcoursData();
    }
  };

  //Sauvegarde du résultat
  const saveEssai = async (resultat, numEssai, index) => {
    console.log('tableConcoursSL > saveEssai');
    const result = resultat.LstEssais[numEssai].PerfValue?.toString();
    updateBestPerf(resultat);
    if (result !== '' && result !== null) {
      var newConcoursData = props.concoursData;
      newConcoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
        index
      ] = resultat;
      await setFile(newConcoursData?._?.id, JSON.stringify(newConcoursData));
      updateAthleteAndTrie(numEssai);
      updateStatus();
    }
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    console.log('tableConcoursSL > onChangeTextValue');
    //Si perf ou vent
    if (numEssai % 2 === 0) {
      const val = convertStringToHauteur(value);
      const isNumPerf = !isNaN(parseInt(val));
      const isValid =
        ['x', 'X', '-', 'r', 'R', '', null].includes(value) || isNumPerf;
      if (isValid) {
        value = value === 'R' ? val.toLowerCase() : val?.toUpperCase();
        //Mise à jour de la perf/statut de l'essai pour cet athlete : resultat.athlete
        resultat.LstEssais[numEssai].PerfValue = isNumPerf ? val : 0;
        resultat.LstEssais[numEssai].PerfStatus = isNumPerf ? 'O' : val;
      }
    } else {
      resultat.LstEssais[numEssai].Vent = convertStringToVent(value);
    }
  };

  const listTextInput = [];
  const initValues = [];
  [...Array(12).keys()].forEach(i =>
    initValues.push(
      i % 2 === 0
        ? convertHauteurToString(props.resultat.LstEssais[i]?.PerfValue)
        : convertVentToString(props.resultat.LstEssais[i]?.Vent),
    ),
  );
  const [values, setValues] = useState(initValues);
  for (var i = 0; i < 12; i++) {
    const tempIndex = i;
    listTextInput.push(
      <View>
        <MyInput
          placeholder={
            tempIndex % 2 === 0
              ? i18n.t('competition:performance').substring(0, 4) + '.'
              : i18n.t('competition:wind')
          }
          style={[
            {
              backgroundColor:
                (props.resultat.LstEssais[tempIndex]?.PerfValue === null ||
                  props.resultat.LstEssais[tempIndex]?.PerfValue === '') &&
                tempIndex + 1 === props.essaiEnCours
                  ? colors.white
                  : colors.gray_light,
            },
          ]}
          onChange={v => {
            setValues(oldValues =>
              oldValues.map((val, ind) => (ind === tempIndex ? v : val)),
            );
            onChangeTextValue(props.resultat, tempIndex, v);
          }}
          value={values[tempIndex]}
          onBlur={() => {
            saveEssai(props.resultat, tempIndex, props.index);
            setValues(oldValues =>
              oldValues.map((val, ind) =>
                ind === tempIndex && val !== null
                  ? tempIndex % 2 === 0
                    ? convertHauteurToString(val)
                    : convertVentToString(val)
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
      {props.listColVisible.includes(0) && props.concoursData._.colPerfVisible && (
        <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
          {props.concoursData._.fieldPerfVisible && listTextInput[0]}
          {props.concoursData._.fieldWindVisible && listTextInput[1]}
        </View>
      )}
      {props.listColVisible.includes(1) && props.concoursData._.colPerfVisible && (
        <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
          {props.concoursData._.fieldPerfVisible && listTextInput[2]}
          {props.concoursData._.fieldWindVisible && listTextInput[3]}
        </View>
      )}
      {props.listColVisible.includes(2) && props.concoursData._.colPerfVisible && (
        <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
          {props.concoursData._.fieldPerfVisible && listTextInput[4]}
          {props.concoursData._.fieldWindVisible && listTextInput[5]}
        </View>
      )}
      {props.listColVisible.includes(3) &&
        props.concoursData._.colPerfVisible &&
        props.concoursData._.nbTries > 3 &&
        props.concoursData._.colMiddleRankVisible && (
          <View style={{width: 60}}>
            <Text style={[styleSheet.text, styleSheet.textCenter]}>
              {middleBestPerf}
            </Text>
          </View>
        )}
      {props.listColVisible.includes(4) &&
        props.concoursData._.colPerfVisible &&
        props.concoursData._.nbTries > 3 &&
        props.concoursData._.colMiddleRankVisible && (
          <View style={{width: 40}}>
            <Text style={[styleSheet.text, styleSheet.textCenter]}>
              {props.middlePlace[props.index]}
            </Text>
          </View>
        )}
      {props.listColVisible.includes(5) &&
        props.concoursData._.colPerfVisible &&
        props.concoursData._.nbTries > 3 && (
          <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
            {props.concoursData._.fieldPerfVisible && listTextInput[6]}
            {props.concoursData._.fieldWindVisible && listTextInput[7]}
          </View>
        )}
      {props.listColVisible.includes(6) &&
        props.concoursData._.colPerfVisible &&
        props.concoursData._.nbTries > 4 && (
          <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
            {props.concoursData._.fieldPerfVisible && listTextInput[8]}
            {props.concoursData._.fieldWindVisible && listTextInput[9]}
          </View>
        )}
      {props.listColVisible.includes(7) &&
        props.concoursData._.colPerfVisible &&
        props.concoursData._.nbTries > 5 && (
          <View style={[styleSheet.flexColumn, styleSheet.flex1]}>
            {props.concoursData._.fieldPerfVisible && listTextInput[10]}
            {props.concoursData._.fieldWindVisible && listTextInput[11]}
          </View>
        )}
    </>
  );
};

export const getHeaderTableSL = () => {
  return [
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:first'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:second'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:third'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 60,
      text: i18n.t('competition:performance').substring(0, 4) + '.',
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 40,
      text: i18n.t('competition:place'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fourth'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:fifth'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      flex: 1,
      text: i18n.t('competition:sixth'),
      style: styleSheet.flexRowCenter,
    },
  ];
};

export const getColumnsVisibleSL = _ => {
  return _.colMiddleRankVisible ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 5, 6, 7];
};

export default TableConcoursSL;
