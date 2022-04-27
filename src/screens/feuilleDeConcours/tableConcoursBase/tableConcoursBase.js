import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyDataTable, MyButton, MyDropdown} from '_components';
import moment from 'moment';
import {TableConcoursLT, TableConcoursSL, TableConcoursSB} from '_screens';
import Flag from 'react-native-flags';
import {getHauteurToTextValue} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';
import {
  getHeaderTableLT,
  getColumnsVisibleLT,
} from '../tableConcoursLT/tableConcoursLT';
import {
  getHeaderTableSL,
  getColumnsVisibleSL,
} from '../tableConcoursSL/tableConcoursSL';
import {
  getHeaderTableSB,
  getColumnsVisibleSB,
} from '../tableConcoursSB/tableConcoursSB';

const TableConcoursBase = props => {
  const [hasDossard] = useState(
    props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.filter(
      row => row.Athlete.Dossard?.toString(),
    ).length > 0,
  );

  //Tailles des minimums des colonnes de base (ordre, dossard, athlète, perf et place)
  const maxWidthBase =
    40 + 60 + 200 + 100 + 40 + (props.concoursData?._?.type === 'SB' ? 50 : 0);
  const getNumberOfColumns = () => {
    var res = 1;
    const sizeAvailable = Dimensions.get('window').width - maxWidthBase;
    if (sizeAvailable > 0) {
      res = Math.floor(sizeAvailable / 100); //100 avg size of cell in table
    }
    return res;
  };
  const [indexFirstColumnVisible, setIndexFirstColumnVisible] = useState(0);
  const [numberOfColumnVisible, setNumberOfColumnVisible] = useState(
    getNumberOfColumns(),
  );

  const setColumnFixed = () => {
    return [
      {type: 'text', width: 40, text: i18n.t('competition:order')},
      {
        type: 'text',
        width: 60,
        text: i18n.t('competition:number'),
      },
      {
        type: 'text',
        flex: 3,
        text: i18n.t('competition:athlete'),
      },
      {
        type: 'text',
        flex: 1,
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
      },
      {
        type: 'text',
        width: 40,
        text: i18n.t('competition:place'),
      },
    ];
  };

  const getMonteeDeBarre = () => {
    var res = [];
    if (
      props.concoursData?._?.type === 'SB' &&
      props.concoursData.EpreuveConcoursComplet.hasOwnProperty('MonteesBarre')
    ) {
      for (
        var i = 1;
        i <
        Object.keys(props.concoursData.EpreuveConcoursComplet.MonteesBarre)
          .length;
        i++
      ) {
        const nameBarre = 'Barre' + (i < 10 ? '0' : '') + i.toString();
        //Si barre existe
        if (
          props.concoursData.EpreuveConcoursComplet.MonteesBarre.hasOwnProperty(
            nameBarre,
          )
        ) {
          res.push(
            props.concoursData.EpreuveConcoursComplet.MonteesBarre[nameBarre],
          );
        }
      }
    }
    return res;
  };

  const [barRises, setBarRises] = useState(getMonteeDeBarre());

  const refreshColumnsVisible = () => {
    var res = [];
    if (props.concoursData?._?.type === 'LT') {
      res = getColumnsVisibleLT(props.concoursData?._);
    }
    if (props.concoursData?._?.type === 'SL') {
      res = getColumnsVisibleSL(props.concoursData?._);
    }
    if (props.concoursData?._?.type === 'SB') {
      const bars = getMonteeDeBarre();
      setBarRises(bars);
      res = getColumnsVisibleSB(bars);
    }
    return res;
  };

  const [listColumnVisible, setListColumnVisible] = useState(() =>
    refreshColumnsVisible(),
  );

  const refreshColumnsPerf = () => {
    var res = [];
    if (props.concoursData?._?.type === 'LT') {
      res = getHeaderTableLT();
    }
    if (props.concoursData?._?.type === 'SL') {
      res = getHeaderTableSL();
    }
    if (props.concoursData?._?.type === 'SB') {
      const bars = getMonteeDeBarre();
      setBarRises(bars);
      res = getHeaderTableSB(bars);
    }
    return res;
  };

  const [columnBase, setColumnBase] = useState(() => setColumnFixed());
  const [columnPerf, setColumnPerf] = useState(() => refreshColumnsPerf());

  const getHeaders = (index = 0) => {
    const indexFirstColumPerf = 5;
    const countDossard = hasDossard ? 1 : 0;
    const removePrevBtn =
      index === 0 || listColumnVisible.length < numberOfColumnVisible ? 1 : 0;
    const removeNextBtn =
      index + numberOfColumnVisible === listColumnVisible.length ||
      listColumnVisible.length < numberOfColumnVisible
        ? 1
        : 0;
    const columnsVisible =
      numberOfColumnVisible < columnPerf.length
        ? listColumnVisible.slice(index, index + numberOfColumnVisible)
        : listColumnVisible;

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

  useEffect(() => {
    setNumberOfColumnVisible(getNumberOfColumns());
  }, []);

  //Lors d'un changement de paramètres de la feuille de concours
  useEffect(() => {
    setListColumnVisible(refreshColumnsVisible());
    setColumnPerf(refreshColumnsPerf());
    setIndexFirstColumnVisible(0);
  }, [props.haveToRefresh]);

  useEffect(() => {
    setHeadersTable(getHeaders());
  }, [listColumnVisible]);

  useEffect(() => {
    setHeadersTable(getHeaders(indexFirstColumnVisible));
  }, [indexFirstColumnVisible]);
  const [athleteEnCours, setAthleteEnCours] = useState(0);
  const [essaiEnCours, setEssaiEnCours] = useState(1);
  /*const serie =
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();*/

  const saveEssai = async (resultat, numEssai, index) => {
    var newResultat = props.concoursData;
    newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
      index
    ] = resultat;
    props.setConcoursData(newResultat);
    await setFile(props.concoursData?._?.id, JSON.stringify(newResultat));
    if (
      index ===
      props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
        .LstSerieConcoursComplet[0].LstResultats.length -
        1
    ) {
      setEssaiEnCours(numEssai + 1);
    }
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    resultat.LstEssais[numEssai - 1].TextValeurPerformance =
      getHauteurToTextValue(value);
    resultat.LstEssais[numEssai - 1].ValeurPerformance = value;
    resultat.LstEssais[numEssai - 1].SatutPerformance = value;
  };

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
          TextValeurPerformance: null,
          SatutPerformance: null,
        });
      }
    }
    const [poteaux, setPoteaux] = useState(
      resultat.Athlete?.poteaux !== undefined ? resultat.Athlete.poteaux : '0',
    );
    const [bestPerf, setBestPerf] = useState(
      resultat.Performance !== undefined ? resultat.Performance : '',
    );

    return (
      <>
        <View style={styles.item}>
          <View style={{width: 40}}>
            <Text style={[styleSheet.text]}>{order}</Text>
          </View>
          {hasDossard && (
            <View style={{width: 60}}>
              <Text style={[styleSheet.text]}>{dossard}</Text>
            </View>
          )}
          <View style={[styleSheet.flex3]}>
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
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {athleteName}
              </Text>
            </View>
            <View style={styleSheet.flexRow}>
              <Text
                style={[styleSheet.text]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {props.concoursData?._?.type === 'SB' && (
                  <Text
                    style={[
                      styleSheet.text,
                      {
                        marginEnd:
                          resultat?.Athlete?.firstBar !== undefined ? 5 : 0,
                        fontStyle: 'italic',
                        color: colors.ffa_blue_dark,
                      },
                    ]}
                    numberOfLines={1}>
                    {getHauteurToTextValue(resultat?.Athlete?.firstBar)}{' '}
                  </Text>
                )}
                {athleteInfo}
              </Text>
            </View>
          </View>
          <>
            {props.concoursData?._?.epreuve.includes('Perche') && (
              <View style={{flex: 1}}>
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
                listColumnVisible={listColumnVisible}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                index={index}
                essaiEnCours={essaiEnCours}
                athleteEnCours={athleteEnCours}
                onChangeTextValue={onChangeTextValue}
                saveEssai={saveEssai}
              />
            )}
            {props.concoursData?._?.type === 'SL' && (
              <TableConcoursSL
                index={index}
                resultat={resultat}
                athleteEnCours={athleteEnCours}
                onChangeTextValue={onChangeTextValue}
                saveEssai={saveEssai}
                concoursData={props.concoursData}
                essaiEnCours={essaiEnCours}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                listColumnVisible={listColumnVisible}
              />
            )}
            {props.concoursData?._?.type === 'LT' && (
              <TableConcoursLT
                index={index}
                resultat={resultat}
                athleteEnCours={athleteEnCours}
                onChangeTextValue={onChangeTextValue}
                saveEssai={saveEssai}
                concoursData={props.concoursData}
                essaiEnCours={essaiEnCours}
                indexFirstColumnVisible={indexFirstColumnVisible}
                numberOfColumnVisible={numberOfColumnVisible}
                listColumnVisible={listColumnVisible}
              />
            )}

            {indexFirstColumnVisible <
              columnPerf.length - numberOfColumnVisible &&
              columnPerf.length > numberOfColumnVisible && (
                <View style={{width: 31}}></View>
              )}
          </>

          <View style={{width: 100}}>
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
              data={['DNS', 'DNF', 'NM', 'DQ', bestPerf.toString()].map(v => ({
                label: v,
                value: v,
              }))}
              selectedValue={bestPerf}
            />
          </View>
          <View style={{width: 40}}>
            <Text style={styleSheet.text}>{resultat.Place?.toString()}</Text>
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
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 5,
  },
  textinput: {
    height: 35,
    marginRight: 5,
    color: colors.black,
    borderColor: colors.muted,
    borderWidth: 1,
  },
});

export default TableConcoursBase;
