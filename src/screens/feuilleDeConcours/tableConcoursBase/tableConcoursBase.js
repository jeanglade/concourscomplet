import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import i18n from 'i18next';
import moment from 'moment';
import Flag from 'react-native-flags';
import {ProgressView} from '@react-native-community/progress-view';
import {ProgressBar} from '@react-native-community/progress-bar-android';

import {
  getHauteurToTextValue,
  getMonteeDeBarre,
} from '../../../utils/convertor';
import {colors, styleSheet} from '_config';
import {MyDataTable, MyButton, MyDropdown} from '_components';
import {TableConcoursLT, TableConcoursSL, TableConcoursSB} from '_screens';
import {setFile} from '../../../utils/myAsyncStorage';
import {
  getHeaderTableLT,
  getColumnsVisibleLT,
  calculBestPlaceLT,
} from '../tableConcoursLT/tableConcoursLT';
import {
  getHeaderTableSL,
  getColumnsVisibleSL,
} from '../tableConcoursSL/tableConcoursSL';
import {
  getHeaderTableSB,
  getColumnsVisibleSB,
  calculBestPlaceSB,
} from '../tableConcoursSB/tableConcoursSB';

const TableConcoursBase = props => {
  const [hasDossard] = useState(
    props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.filter(
      row => row.Athlete.Dossard?.toString(),
    ).length > 0,
  );
  //Numero de la premiere colonne visible des performances
  const [indexFirstColumnVisible, setIndexFirstColumnVisible] = useState(0);
  //Montees de barre si le concours est de type SB
  const [barRises, setBarRises] = useState(
    getMonteeDeBarre(props.concoursData),
  );

  //Tailles des minimums des colonnes de base (ordre, dossard, athlète, perf et place)
  const maxWidthBase =
    40 + 60 + 250 + 100 + 40 + (props.concoursData?._?.type === 'SB' ? 80 : 0);
  const getNumberOfColumns = () => {
    var res = 1;
    const sizeAvailable = Dimensions.get('window').width - maxWidthBase;
    if (sizeAvailable > 0) {
      res = Math.floor(sizeAvailable / 75); //75 size of cell in table
    }
    return res;
  };

  const setColumnFixed = () => {
    return [
      {type: 'text', width: 40, text: i18n.t('competition:order')},
      {
        type: 'text',
        width: 60,
        text: i18n.t('competition:number'),
        style: styleSheet.flexRowCenter,
      },
      {
        type: 'text',
        width: 250,
        text: i18n.t('competition:athlete'),
      },
      {
        type: 'text',
        width: Platform.OS === 'windows' ? 80 : 100,
        text: i18n.t('competition:poteaux'),
      },
      {
        type: 'button',
        width: 30,
        content: (
          <Image
            style={styleSheet.icon20}
            source={require('../../../icons/previous.png')}
          />
        ),
        style: {marginHorizontal: 5},
        onPress: () => {
          setIndexFirstColumnVisible(oldValue => oldValue - 1);
        },
      },
      {
        type: 'button',
        width: 0,
        content: (
          <Image
            style={styleSheet.icon20}
            source={require('../../../icons/next.png')}
          />
        ),
        style: {marginHorizontal: 5},
        onPress: () => {
          setIndexFirstColumnVisible(oldValue => oldValue + 1);
        },
      },
      {
        type: 'text',
        width: 100,
        text: i18n.t('competition:performance'),
        style: styleSheet.flexRowCenter,
      },
      {
        type: 'text',
        width: 40,
        text: i18n.t('competition:place'),
        style: styleSheet.flexRowCenter,
      },
    ];
  };

  const refreshColumnsVisible = (onlyHeaders = false) => {
    var result = [];
    if (props.concoursData?._?.type === 'LT') {
      result = onlyHeaders
        ? getHeaderTableLT()
        : getColumnsVisibleLT(props.concoursData?._);
    }
    if (props.concoursData?._?.type === 'SL') {
      result = onlyHeaders
        ? getHeaderTableSL()
        : getColumnsVisibleSL(props.concoursData?._);
    }
    if (props.concoursData?._?.type === 'SB') {
      const bars = getMonteeDeBarre(props.concoursData);
      setBarRises(bars);
      result = onlyHeaders
        ? getHeaderTableSB(bars)
        : getColumnsVisibleSB(bars, props.concoursData?._?.colPerfVisible);
    }
    return result;
  };

  const refreshPlace = (nbTries = 6) => {
    var result = [];
    if (
      props.concoursData?._?.type === 'LT' ||
      props.concoursData?._?.type === 'SL'
    ) {
      result = calculBestPlaceLT(
        props.concoursData.EpreuveConcoursComplet?.TourConcoursComplet
          ?.LstSerieConcoursComplet[0]?.LstResultats,
        nbTries,
      );
    }
    if (props.concoursData?._?.type === 'SB') {
      result = calculBestPlaceSB();
    }
    return result;
  };

  //En fonction de la largeur de la fenêtre, nombre de colonne visible des performances
  const [numberOfColumnVisible, setNumberOfColumnVisible] = useState(
    getNumberOfColumns(),
  );
  //En fonction du type de concours, du nombre de colonne visible et des filtres des colonnes (paramètres)
  const [listColumnVisible, setListColumnVisible] = useState(() =>
    refreshColumnsVisible(),
  );
  //Colonnes obligatoires et toujours visibles
  const [columnBase] = useState(() => setColumnFixed());
  //Colonnes des perfomances, change en fonction de listColumnVisible
  const [columnPerf, setColumnPerf] = useState(() =>
    refreshColumnsVisible(true),
  );
  //Liste des places intermediaires des athlètes
  const [middlePlace, setMiddlePlace] = useState(() => refreshPlace(3));
  const [finalPlace, setFinalPlace] = useState(() => refreshPlace(6));
  //Permet de refresh le classement des athlètes
  const [haveToCalculPlace, setHaveToCalculPlace] = useState(false);

  const getHeaders = (index = 0) => {
    const indexFirstColumPerf = 5;
    //Si colonne dossard
    const countDossard = hasDossard ? 1 : 0;
    //Si bouton precedent (lorsque toutes les colonnes ne sont pas visibles)
    const removePrevBtn =
      index === 0 || listColumnVisible.length < numberOfColumnVisible ? 1 : 0;
    //Si bouton suivant (lorsque toutes les colonnes ne sont pas visibles)
    const removeNextBtn =
      index + numberOfColumnVisible === listColumnVisible.length ||
      listColumnVisible.length < numberOfColumnVisible
        ? 1
        : 0;
    //Colonnes des perfomances
    const columnsVisible =
      numberOfColumnVisible < columnPerf.length
        ? listColumnVisible.slice(index, index + numberOfColumnVisible)
        : listColumnVisible;
    //Si colonne poteaux (pour les concours SB-perche)
    const countPoteaux = props.concoursData?._?.epreuve.includes('Perche')
      ? 1
      : 0;
    return columnBase
      .slice(0, 1 + countDossard)
      .concat(columnBase.slice(2, 3 + countPoteaux))
      .concat(columnBase.slice(4, indexFirstColumPerf - removePrevBtn))
      .concat(columnsVisible.map(i => columnPerf[i]))
      .concat(columnBase.slice(indexFirstColumPerf + removeNextBtn));
  };
  const [headersTable, setHeadersTable] = useState(getHeaders());
  //Si la fenêtre a changé de taille, on refresh le nombre de colonne visible
  const [windowsIsResized, setWindowsIsResized] = useState(false);

  //Lors d'un changement de paramètres de la feuille de concours
  useEffect(() => {
    //Mise à jour des colonnes perfomances visibles
    setListColumnVisible(refreshColumnsVisible());
    //Pour concours SB, mise à jour des headers en fonction des barres (peuvent changer)
    //Pour les concours LT et SL, les headers restent inchangés
    if (props.concoursData?._?.type === 'SB') {
      setColumnPerf(refreshColumnsVisible(true));
    }
    //Remise à 0 de la premiere colonne perfomance visible
    setIndexFirstColumnVisible(0);
  }, [props.haveToRefreshTable]);

  //Met à jour les headers en fonction des colonnes visibles
  useEffect(() => {
    setHeadersTable(getHeaders(indexFirstColumnVisible));
  }, [listColumnVisible]);

  //Met à jour les headers en fonction des actions Precedent/Suivant
  useEffect(() => {
    setHeadersTable(getHeaders(indexFirstColumnVisible));
  }, [indexFirstColumnVisible]);

  useEffect(() => {
    setMiddlePlace(refreshPlace(3));
    setFinalPlace(refreshPlace(6));
  }, [haveToCalculPlace]);

  useEffect(() => {
    setNumberOfColumnVisible(getNumberOfColumns());
    setHeadersTable(getHeaders(indexFirstColumnVisible));
  }, [useWindowDimensions().width]);

  const [essaiEnCours, setEssaiEnCours] = useState(() => {
    var minEssai = -1;
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
      (resultat, i) => {
        resultat.LstEssais?.map((v, index) => {
          if (v.ValeurPerformance === null || v.ValeurPerformance === '') {
            if (minEssai === -1 || index < minEssai) {
              minEssai = index;
            }
          }
        });
      },
    );
    if (minEssai === -1) {
      minEssai = 0;
    }
    return minEssai;
  });

  const [athleteEnCours, setAthleteEnCours] = useState(() => {
    var minAthtlete = -1;
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
      (resultat, i) => {
        if (resultat?.LstEssais?.length > essaiEnCours) {
          if (
            resultat?.LstEssais[essaiEnCours]?.ValeurPerformance === null ||
            resultat?.LstEssais[essaiEnCours]?.ValeurPerformance === ''
          ) {
            if (minAthtlete === -1) {
              minAthtlete = i;
            }
          }
        }
      },
    );
    if (minAthtlete === -1) {
      minAthtlete = 0;
    }
    return minAthtlete;
  });
  /*const serie =
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();*/

  const saveData = async () => {
    await setFile(
      props.concoursData?._?.id,
      JSON.stringify(props.concoursData),
    );
  };

  const Item = ({
    id,
    order,
    dossard,
    athleteName,
    athleteInfo,
    resultat,
    index,
  }) => {
    if (
      resultat.LstEssais === undefined ||
      resultat.LstEssais === [] ||
      resultat.LstEssais.length === 0
    ) {
      resultat.LstEssais = [];
      const count = props.concoursData?._?.type === 'SB' ? barRises.length : 6;
      for (var i = 0; i < count; i++) {
        resultat.LstEssais.push({
          GuidCompetition: props.concoursData.GuidCompetition,
          GuidResultat: resultat.GuidResultat,
          GuidEssai: '',
          NumEssai: i + 1,
          ValeurPerformance: null,
          SatutPerformance: null,
        });
      }
    }
    const [poteaux, setPoteaux] = useState(
      resultat.Athlete?.poteaux !== undefined ? resultat.Athlete.poteaux : '0',
    );
    const [bestPerf, setBestPerf] = useState(
      resultat.Performance !== undefined ? resultat.Performance : 'DNS',
    );

    return (
      <>
        <View style={styles.item}>
          <View style={{width: 40}}>
            <Text style={[styleSheet.text, styleSheet.textCenter]}>
              {order}
            </Text>
          </View>
          {hasDossard && (
            <View style={{width: 60}}>
              <Text style={[styleSheet.text, styleSheet.textCenter]}>
                {dossard}
              </Text>
            </View>
          )}
          <View style={[{width: 250}]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {resultat.Athlete.IsNew && (
                <MyButton
                  onPress={() => {
                    props.setFieldsAddAthtlete({
                      ...props.fieldsAddAthtlete,
                      resultat: resultat,
                      type: 'modify',
                      firstname: resultat.Athlete.Prenom?.toString(),
                      name: resultat.Athlete.Nom?.toString(),
                      sex: resultat.Athlete.Sexe?.toString(),
                      birthDate: moment(
                        resultat.Athlete.DateNaissance?.toString(),
                        'DD/MM/YYYY',
                      ).toDate(),
                      licence_number: resultat.Athlete.Licence?.toString(),
                      club: resultat.Athlete.Club?.toString(),
                      category: resultat.Athlete.Categorie?.toString(),
                      dossard: resultat.Athlete.Dossard?.toString(),
                    });
                    props.setModalAddAthlete(true);
                  }}
                  content={
                    <Image
                      style={{width: 15, height: 15}}
                      source={require('../../../icons/pencil.png')}
                    />
                  }
                  styleView={{
                    backgroundColor: colors.black,
                    borderRadius: 5,
                    padding: 1,
                    marginEnd: 5,
                  }}
                />
              )}
              {props.concoursData?._?.colFlagVisible &&
                resultat.Athlete.Nationalite && (
                  <View style={{paddingRight: 5, paddingTop: 3}}>
                    <Flag
                      code={resultat.Athlete.Nationalite?.toString().slice(
                        0,
                        -1,
                      )}
                      size={16}
                    />
                  </View>
                )}
              <Text
                style={[
                  styleSheet.text,
                  styleSheet.textBold,
                  {
                    color:
                      athleteEnCours === index
                        ? colors.ffa_blue_light
                        : colors.black,
                    fontWeight: athleteEnCours === index ? 'bold' : 'normal',
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {athleteName}
              </Text>
            </View>
            <View
              style={[
                styleSheet.flexRowCenter,
                {justifyContent: 'space-between'},
              ]}>
              <Text
                style={[styleSheet.text]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {athleteInfo}
              </Text>
              {props.concoursData?._?.type === 'SB' && (
                <Text
                  numberOfLines={1}
                  style={[
                    styleSheet.text,
                    {
                      paddingEnd:
                        resultat?.Athlete?.firstBar !== undefined ? 10 : 0,
                      fontStyle: 'italic',
                      color: colors.ffa_blue_dark,
                    },
                  ]}>
                  {getHauteurToTextValue(resultat?.Athlete?.firstBar)}{' '}
                </Text>
              )}
            </View>
          </View>
          <>
            {props.concoursData?._?.epreuve.includes('Perche') && (
              <View style={{width: Platform.OS === 'windows' ? 80 : 100}}>
                <MyDropdown
                  styleContainer={{}}
                  stylePickerIOS={{width: 200}}
                  onValueChange={value => {
                    setPoteaux(value);
                    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
                      index
                    ].Athlete.poteaux = value;
                    saveData();
                  }}
                  data={[
                    '0',
                    '10',
                    '20',
                    '30',
                    '40',
                    '50',
                    '60',
                    '70',
                    '80',
                  ].map(v => ({
                    label: v,
                    value: v,
                  }))}
                  selectedValue={poteaux}
                />
              </View>
            )}
            {indexFirstColumnVisible !== 0 &&
              columnPerf.length > numberOfColumnVisible && (
                <View style={{width: 31}}></View>
              )}
            {props.concoursData?._?.type === 'SB' && (
              <TableConcoursSB
                resultat={resultat}
                bars={barRises}
                athleteEnCours={athleteEnCours}
                setAthleteEnCours={setAthleteEnCours}
                listColumnVisible={listColumnVisible}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                index={index}
                essaiEnCours={essaiEnCours}
                setConcoursData={props.setConcoursData}
                setBestPerf={setBestPerf}
                bestPerf={bestPerf}
              />
            )}
            {props.concoursData?._?.type === 'SL' && (
              <TableConcoursSL
                ndex={index}
                resultat={resultat}
                athleteEnCours={athleteEnCours}
                setAthleteEnCours={setAthleteEnCours}
                concoursData={props.concoursData}
                essaiEnCours={essaiEnCours}
                setEssaiEnCours={setEssaiEnCours}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                listColumnVisible={listColumnVisible}
                setConcoursData={props.setConcoursData}
                setBestPerf={setBestPerf}
                bestPerf={bestPerf}
                middlePlace={middlePlace}
                setHaveToCalculPlace={setHaveToCalculPlace}
                refreshConcoursData={props.refreshConcoursData}
              />
            )}
            {props.concoursData?._?.type === 'LT' && (
              <TableConcoursLT
                index={index}
                resultat={resultat}
                athleteEnCours={athleteEnCours}
                setAthleteEnCours={setAthleteEnCours}
                concoursData={props.concoursData}
                essaiEnCours={essaiEnCours}
                setEssaiEnCours={setEssaiEnCours}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                listColumnVisible={listColumnVisible}
                setConcoursData={props.setConcoursData}
                setBestPerf={setBestPerf}
                bestPerf={bestPerf}
                middlePlace={middlePlace}
                setHaveToCalculPlace={setHaveToCalculPlace}
                refreshConcoursData={props.refreshConcoursData}
              />
            )}

            {indexFirstColumnVisible <
              columnPerf.length - numberOfColumnVisible &&
              columnPerf.length > numberOfColumnVisible && (
                <View style={{width: 31}}></View>
              )}
          </>

          <View style={{width: 105}}>
            <MyDropdown
              styleContainer={{}}
              stylePickerIOS={{width: 200}}
              onValueChange={value => {
                setBestPerf(value);
                props.concoursData.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
                  index
                ].Performance = value;
                saveData();
              }}
              data={['DNS', 'NM', 'DQ', '', bestPerf?.toString()].map(v => ({
                label: v,
                value: v,
              }))}
              selectedValue={bestPerf}
            />
          </View>
          <View style={{width: 40}}>
            <Text style={[styleSheet.text, styleSheet.textCenter]}>
              {props.concoursData?._?.type !== 'SB' ? finalPlace[index] : ''}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderItem = ({item, index}) => {
    var result = null;
    var athleteInfo =
      props.concoursData.EpreuveConcoursComplet.Categorie.toString() === 'TC'
        ? item.Athlete.Categorie?.toString()
        : '';
    athleteInfo +=
      athleteInfo !== '' && item.Athlete.Club?.toString() !== '' ? ' - ' : '';
    athleteInfo += item.Athlete.Club?.toString();
    result = (
      <Item
        id={item.id}
        order={item.NumCouloir?.toString()}
        dossard={item.Athlete.Dossard?.toString()}
        athleteName={
          item.Athlete.Prenom?.toString() +
          ' ' +
          item.Athlete.Nom?.toString() +
          ' '
        }
        athleteInfo={
          item.Athlete.Nationalite?.toString() === 'FRA'
            ? athleteInfo
            : item.Athlete.Nationalite?.toString()
            ? '(' + item.Athlete.Nationalite?.toString() + ')'
            : null
        }
        resultat={item}
        index={index}
      />
    );
    return result;
  };

  return (
    <View style={[styles.containerCenter]}>
      {windowsIsResized && (
        <>
          {Platform.OS === 'windows' ? (
            <ProgressView isIndeterminate="true" />
          ) : (
            <ProgressBar />
          )}
        </>
      )}
      <MyDataTable
        headerTable={headersTable}
        tableData={
          props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet
            ?.LstSerieConcoursComplet[0]?.LstResultats
        }
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default TableConcoursBase;
