import React, {useState} from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';
import {getHauteurToTextValue} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

export const getHeaderTableLT = () => {
  return [
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:first'),
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:second'),
    },
    {
      type: 'text',
      width: 75,
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
      width: 75,
      text: i18n.t('competition:fourth'),
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:fifth'),
    },
    {
      type: 'text',
      width: 75,
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

const manageDuplicatePerf = perfs => {
  perfs.map((perf, index) => {
    perfs.map((perf2, index2) => {
      //S'ils sont différent et que leur meilleur performance est égale
      if (index !== index2 && perf.valeur[0] === perf2.valeur[0]) {
        const minPlace = Math.min(perf2.place, perf.place);
        //S'ils ont toutes les mêmes performances = ex aequos

        if (perf.valeur.every((v, i) => v === perf2.valeur[i])) {
          perf.place = minPlace;
          //perf2.place = minPlace;
        } else {
          var i = 1;
          const maxLength = Math.max(perf.valeur.length, perf2.valeur.length);
          while (i !== maxLength) {
            //Si fin de performance pour perf ou perf2 ET comme ils ne sont pas égaux
            if (i === perf.valeur.length || i === perf2.valeur.length) {
              perf.place =
                minPlace + (perf.valeur.length > perf2.valeur.length ? 0 : 1);
            } else {
              if (perf.valeur[i] > perf2.valeur[i]) {
                perf.place = minPlace;
                perf2.place = minPlace + 1;
                i = maxLength - 1;
              } else {
                if (perf.valeur[i] < perf2.valeur[i]) {
                  perf.place = minPlace + 1;
                  perf2.place = minPlace;
                  i = maxLength - 1;
                }
              }
            }
            i++;
          }
        }
      }
    });
  });
  return perfs;
};

export const calculBestPlaceLT = (resultats, nbTries) => {
  var perfsAthlete = resultats.map((v, i) => {
    var perfs = [];
    //Si la meilleur performance est définie (= un chiffre)
    if (isNaN(parseInt(v.Performance?.replace('m', '')))) {
      perfs = [-1];
    } else {
      v.LstEssais.map((essai, index) => {
        if (index < nbTries && essai.ValeurPerformance !== undefined) {
          const perf = parseInt(essai.ValeurPerformance?.replace('m', ''));
          if (!isNaN(perf)) {
            perfs.push(perf);
          }
        }
      });
    }
    return {
      index: i,
      place: i,
      valeur: perfs.sort((a, b) => (a.valeur < b.valeur ? 1 : -1)),
    };
  });
  //Ordonne la liste en fonction de la permière performance
  perfsAthlete = perfsAthlete.sort((a, b) =>
    a.valeur[0] < b.valeur[0] ? 1 : -1,
  );
  //Initialie les places
  perfsAthlete.map((v, i) => {
    v.place = i + 1;
  });
  //Gestion des ex aequos
  perfsAthlete = manageDuplicatePerf(perfsAthlete);
  //Ordonne les places en fonction de la liste des athlètes
  perfsAthlete = perfsAthlete.sort((a, b) => (a.index > b.index ? 1 : -1));
  //Retourne un tableau avec les places
  return perfsAthlete.map((v, i) => v.place);
};

const TableConcoursLT = props => {
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
    if (result != '' && result !== null) {
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
    resultat.LstEssais[numEssai].ValeurPerformance = value;
    resultat.LstEssais[numEssai].SatutPerformance = value;
  };

  const lstTextInput = [];
  const initValue = [];
  for (var i = 0; i < 6; i++) {
    initValue.push(props.resultat.LstEssais[i].ValeurPerformance);
  }
  const [values, setValues] = useState(initValue);
  for (var i = 0; i < 6; i++) {
    const indexH = i;
    lstTextInput.push(
      <View style={[/*styleSheet.flex1*/ {width: 70, marginEnd: 5}]}>
        <MyInput
          textAlign={'center'}
          style={[
            {
              backgroundColor:
                (props.resultat.LstEssais[indexH].ValeurPerformance === null ||
                  props.resultat.LstEssais[indexH].ValeurPerformance === '') &&
                indexH + 1 === props.essaiEnCours
                  ? colors.white
                  : colors.gray_light,
              width: 70,
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
      {verifyVisibility(
        <View style={{width: 60}}>
          <Text style={[styleSheet.text]}>{middleBestPerf}</Text>
        </View>,
        3,
      )}
      {verifyVisibility(
        <View style={{width: 40}}>
          <Text style={[styleSheet.text]}>
            {props.middlePlace[props.index]}
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
