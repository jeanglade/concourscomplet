import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {MyDataTable, MyButton, MyInput} from '_components';
import moment from 'moment';
import Flag from 'react-native-flags';
import {getHauteurToTextValue} from '../../../utils/convertor';
import {setFile} from '../../../utils/myAsyncStorage';

const TableConcoursSb = props => {
  const [hasDossard] = useState(() => {
    return (
      props.concoursData?.EpreuveConcoursComplet?.TourConcoursComplet?.LstSerieConcoursComplet[0]?.LstResultats.filter(
        row => row.Athlete.Dossard?.toString(),
      ).length > 0
    );
  });

  const [athleteEnCours, setAthleteEnCours] = useState(0);

  const serie =
    props.concoursData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  // const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  // const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  // const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  // const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();

  const saveEssai = async (resultat, numEssai, index) => {
    console.log('saveEssai', resultat, numEssai);
    var newResultat = props.concoursData;
    newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
      index
    ] = resultat;
    props.setConcoursData(newResultat);
    await setFile(props.concoursData?._?.id, JSON.stringify(newResultat));
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    resultat.LstEssais[numEssai - 1].TextValeurPerformance =
      getHauteurToTextValue(value);
    resultat.LstEssais[numEssai - 1].ValeurPerformance = value;
    resultat.LstEssais[numEssai - 1].SatutPerformance = value;
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
    if (resultat.LstEssais === undefined) {
      resultat.LstEssais = [];
      for (var i = 0; i < 6; i++) {
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

          <View style={[styleSheet.flex4]}>
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
                numberOfLines={1}>
                {athleteName}
              </Text>
            </View>
            <View style={styleSheet.flexRow}>
              {props.concoursData._.type === 'SB' && (
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
                  {getHauteurToTextValue(resultat?.Athlete?.firstBar)}
                </Text>
              )}
              <Text style={[styleSheet.text]} numberOfLines={1}>
                {athleteInfo}
              </Text>
            </View>
          </View>
          <View style={styleSheet.flex1}>
            <MyInput
              style={[
                {
                  backgroundColor:
                    resultat.LstEssais[0].ValeurPerformance !== null
                      ? colors.gray_light
                      : colors.white,
                  borderColor:
                    athleteEnCours === index ? colors.red : colors.muted,
                },
              ]}
              onChange={value => {
                onChangeTextValue(resultat, 1, value);
              }}
              value={resultat.LstEssais[0].TextValeurPerformance}
              onBlur={() => {
                saveEssai(resultat, 1, index);
              }}
            />
          </View>
          {/*
        <View style={styles.flex1}>
          <TextInput
            style={styles.textinput}
            value={allEssais[index] ? allEssais[index][1] : ''}
            onChangeText={value => {
              createEssai(resultat, 2, value);
              setAllEssais(() => {
                allEssais[index][1] = value;
                return allEssais;
              });
            }}
            editable={
              allEssais[index] && allEssais[index][0]?.toString() != null
            }
            selectTextOnFocus={
              allEssais[index] && allEssais[index][0]?.toString() != null
            }
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <TextInput
            style={styles.textinput}
            value={allEssais[index] ? allEssais[index][2] : ''}
            onChangeText={value => {
              createEssai(resultat, 3, value);
              setAllEssais(() => {
                allEssais[index][2] = value;
                return allEssais;
              });
            }}
            editable={
              allEssais[index] && allEssais[index][1]?.toString() != null
            }
            selectTextOnFocus={
              allEssais[index] && allEssais[index][1]?.toString() != null
            }
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.text}></Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.text}></Text>
        </View>
        <View style={styles.flex1}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View> */}
          <View style={{width: 100}}>
            <Text style={styleSheet.text}></Text>
          </View>
          <View style={{width: 40}}>
            <Text style={styleSheet.text}></Text>
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

  const getHeaderTable = () => {
    const countDossard = hasDossard ? 1 : 0;
    // Init table header
    var res = [
      {type: 'text', width: 40, text: i18n.t('competition:order')},
      {type: 'text', flex: 4, text: i18n.t('competition:athlete')},
      {type: 'text', width: 100, text: i18n.t('competition:performance')},
      {type: 'text', width: 40, text: i18n.t('competition:place')},
    ];
    if (hasDossard) {
      res.splice(1, 0, {
        type: 'text',
        width: 60,
        text: i18n.t('competition:number'),
      });
    }
    if (props.concoursData._?.colPerfVisible) {
      //Si concours de saut horizontaux
      if (props.concoursData._.type !== 'SB') {
        res.splice(
          2 + countDossard,
          0,
          {type: 'text', flex: 1, text: i18n.t('competition:first')},
          {type: 'text', flex: 1, text: i18n.t('competition:second')},
          {type: 'text', flex: 1, text: i18n.t('competition:third')},
        );
        switch (parseInt(props.concoursData._?.nbTries)) {
          case 4:
            res.splice(5 + countDossard, 0, {
              type: 'text',
              flex: 1,
              text: i18n.t('competition:fourth'),
            });
            break;
          case 6:
            res.splice(
              5 + countDossard,
              0,
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
            );
            break;
          default:
            break;
        }
      }

      // if (
      //   props.concoursData._.type === 'SL' &&
      //   props.concoursData._?.colWindVisible
      // ) {
      //   res.splice(7 + countDossard, 0, {
      //     type: 'text',
      //     flex: 1,
      //     text: i18n.t('competition:wind'),
      //   });
      // }

      if (
        props.concoursData._?.nbTries === 6 &&
        props.concoursData._?.colMiddleRankVisible
      ) {
        res.splice(
          5 + countDossard,
          0,
          {
            type: 'text',
            flex: 1,
            text: i18n.t('competition:performance').substring(0, 4) + '.',
          },
          {type: 'text', flex: 1, text: i18n.t('competition:place')},
        );
      }
    }
    console.log(res);
    return res;
  };

  return (
    <View style={[styles.containerCenter]}>
      <MyDataTable
        headerTable={getHeaderTable()}
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

export default TableConcoursSb;
