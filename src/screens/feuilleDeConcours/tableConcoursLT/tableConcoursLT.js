import React, {useState} from 'react';
import {Text, View} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyInput} from '_components';
import {
  convertHauteurToString,
  setConcoursStatus,
} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

export const getHeaderTableLT = () => {
  return [
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:first'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:second'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:third'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 65,
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
      width: 75,
      text: i18n.t('competition:fourth'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:fifth'),
      style: styleSheet.flexRowCenter,
    },
    {
      type: 'text',
      width: 75,
      text: i18n.t('competition:sixth'),
      style: styleSheet.flexRowCenter,
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
      if (
        index !== index2 &&
        index > index2 &&
        perf.valeur[0] === perf2.valeur[0]
      ) {
        const minPlace = Math.min(perf2.place, perf.place);
        //S'ils ont toutes les mêmes performances = ex aequos

        if (perf.valeur.every((v, i) => v === perf2.valeur[i])) {
          perf.place = minPlace;
          perf2.place = minPlace;
        } else {
          var i = 1;
          const maxLength = Math.max(perf.valeur.length, perf2.valeur.length);
          while (i !== maxLength) {
            //Si fin de performance pour perf ou perf2 ET comme ils ne sont pas égaux
            if (i === perf.valeur.length || i === perf2.valeur.length) {
              perf.place =
                minPlace + (perf.valeur.length > perf2.valeur.length ? 0 : 1);
              perf2.place =
                minPlace + (perf.valeur.length < perf2.valeur.length ? 0 : 1);
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
    console.log(v.Performance);
    if (isNaN(parseInt(v.Performance))) {
      perfs = [-1];
    } else {
      v.LstEssais.map((essai, index) => {
        if (index < nbTries && essai.PerfValue !== undefined) {
          const perf = parseInt(essai.PerfValue);
          if (!isNaN(perf)) {
            perfs.push(perf);
          }
        }
      });
    }
    return {
      index: i,
      place: i,
      valeur: perfs.sort((a, b) => (a < b ? 1 : -1)),
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
  //Retourne un tableau avec les places si l'athlete a au moins une performance
  return perfsAthlete.map((v, i) => (v.valeur == -1 ? '' : v.place));
};

const TableConcoursLT = props => {
  const calculBestPerf = (resultat, nbTries) => {
    var res = null;
    for (var i = 0; i < nbTries; i++) {
      const valeur = parseInt(resultat.LstEssais[i].PerfValue?.toString());
      if (valeur) {
        res =
          valeur >= parseInt(res) || res === null
            ? resultat.LstEssais[i].PerfValue
            : res;
      }
    }

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
      res = 'NM';
    }
    if (
      resultat.LstEssais.every(
        v => v.PerfValue === '' || v.PerfValue === null || v.PerfValue === '-',
      )
    ) {
      res = 'DNS';
    }
    return convertHauteurToString(res?.replace('m', ''));
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

  const getNextAthlete = numE => {
    var result = -1;
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
      (v, i) => {
        if (
          result === -1 &&
          (v.LstEssais[numE].PerfValue === '' ||
            v.LstEssais[numE].PerfValue === null)
        ) {
          result = i;
        }
      },
    );
    return result;
  };

  const saveEssai = async (resultat, numEssai, index) => {
    const result = resultat.LstEssais[numEssai].PerfValue?.replace('m', '');
    var newResultat = props.concoursData;
    var essaiComplete = true;
    const meilleurPerf = calculBestPerf(resultat, 6);
    props.setBestPerf(meilleurPerf);
    resultat.Performance = meilleurPerf;
    setMiddleBestPerf(calculBestPerf(resultat, 3));
    if (result != '' && result !== null) {
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
        index
      ] = resultat;
      await setFile(props.concoursData?._?.id, JSON.stringify(newResultat));
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
        (v, i) => {
          if (
            v.LstEssais[numEssai].PerfValue === null ||
            v.LstEssais[numEssai].PerfValue === ''
          ) {
            essaiComplete = false;
          }
        },
      );

      if (essaiComplete) {
        props.setEssaiEnCours(numEssai + 1);
      }
      props.setAthleteEnCours(
        getNextAthlete(numEssai + (essaiComplete ? 1 : 0)),
      );
      props.setHaveToCalculPlace(oldValue => !oldValue);
      //Mise à jour du statut du concours
      if (props.concoursData._?.statut === i18n.t('common:ready')) {
        var data = props.concoursData;
        data = setConcoursStatus(data, i18n.t('common:in_progress'));
        await setFile(data?._?.id, JSON.stringify(data));
        props.refreshConcoursData();
      }
    }
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    var isValid = false;
    const validValues = ['x', 'X', '-', 'r', 'R', '', null];
    if (validValues.includes(value) || parseInt(value?.replace('m', ''))) {
      isValid = true;
      if (value === 'x' || value === 'R') {
        value = value === 'R' ? value.toLowerCase() : value.toUpperCase();
      }
      resultat.LstEssais[numEssai].PerfValue = value;
      resultat.LstEssais[numEssai].PerfStatus = value;
    }
    return isValid;
  };

  const lstTextInput = [];
  const initValue = [];
  for (var i = 0; i < 6; i++) {
    initValue.push(props.resultat.LstEssais[i].PerfValue);
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
                (props.resultat.LstEssais[indexH].PerfValue === null ||
                  props.resultat.LstEssais[indexH].PerfValue === '') &&
                indexH === props.essaiEnCours
                  ? colors.white
                  : colors.gray_light,
              width: 70,
            },
          ]}
          onChange={v => {
            const isValid = onChangeTextValue(props.resultat, indexH, v);
            if (isValid) {
              setValues(oldValues =>
                oldValues.map((val, ind) => (ind === indexH ? v : val)),
              );
            }
          }}
          value={values[indexH]}
          onBlur={() => {
            saveEssai(props.resultat, indexH, props.index);
            setValues(oldValues =>
              oldValues.map((val, ind) =>
                ind === indexH && val !== null
                  ? convertHauteurToString(val.replace('m', ''))
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
        <View style={{width: 60, marginStart: 5}}>
          <Text style={[styleSheet.text, styleSheet.textCenter]}>
            {middleBestPerf}
          </Text>
        </View>,
        3,
      )}
      {verifyVisibility(
        <View style={{width: 40}}>
          <Text style={[styleSheet.text, styleSheet.textCenter]}>
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
