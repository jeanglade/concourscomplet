import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';
import {DataTable} from '_components';

const TableConcoursSb = props => {
  const [t] = useTranslation();
  const [hasDossard, setHasDossard] = useState(() => {
    var res = false;
    props.tableData.forEach(row => {
      if (row.Athlete.Dossard?.toString()) {
        res = true;
      }
    });
    return res;
  });
  const [allEssais, setAllEssais] = useState(
    //Init avec les valeurs du JSON
    [...Array(props.tableData.length)].map(row => [...Array(6)].map(x => '')),
  );
  const [athleteEnCours, setAthleteEnCours] = useState(props.tableData[0]);

  const serie =
    props.compData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  // const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  // const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  // const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  // const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();

  const createEssai = (resultat, numEssai, value) => {
    var essai = {
      GuidCompetition: props.compData.GuidCompetition,
      GuidResultat: resultat.GuidResultat,
      GuidEssai: '', //créer un guid
      NumEssai: numEssai,
      ValeurPerformance: value,
      SatutPerformance: 'O', //(X, O, -, r (retiré compétition))
      //GUID_BARRE (nullable)
      //Vent (10, -10), règle saisie (nullable)
    };
    if (resultat['LstEssais'] == null) {
      resultat['LstEssais'] = [];
    }
    resultat['LstEssais'][numEssai - 1] = essai;
  };

  const Item = ({
    id,
    order,
    dossard,
    athleteName,
    athleteInfo,
    resultat,
    index,
  }) => (
    <>
      <View style={styles.item}>
        <View style={styles.flex1}>
          <Text style={[styles.text]}>{order}</Text>
        </View>
        {hasDossard && (
          <View style={styles.flex1}>
            <Text style={[styles.text]}>{dossard}</Text>
          </View>
        )}
        <View style={styles.flex4}>
          <Text
            style={[
              styles.text,
              styles.textBold,
              {
                color:
                  athleteEnCours === resultat
                    ? colors.ffa_blue_light
                    : colors.black,
              },
            ]}
            numberOfLines={1}>
            {athleteName}
          </Text>
          <Text style={[styles.text]} numberOfLines={1}>
            {athleteInfo}
          </Text>
        </View>
        <View style={styles.flex1}>
          <TextInput
            style={[
              styles.textinput,
              {
                borderColor:
                  athleteEnCours === resultat
                    ? colors.ffa_blue_light
                    : colors.muted,
              },
            ]}
            onChangeText={value => {
              //createEssai(resultat, 1, value);
              setAllEssais(() => {
                allEssais[index][0] = value.toString();
                return allEssais;
              });
            }}
          />
        </View>
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
        </View>
        <View style={styles.flex2}>
          <Text style={styles.text}></Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.text}></Text>
        </View>
      </View>
    </>
  );

  const renderItem = ({item, index}) => (
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
          ? item.Athlete.Categorie?.toString() +
            ' - ' +
            item.Athlete.Club?.toString()
          : '(' + item.Athlete.Nationalite?.toString() + ')'
      }
      resultat={item}
      index={index}
    />
  );

  return (
    <View style={[styles.containerCenter]}>
      <DataTable
        headerTable={[
          {type: 'text', flex: 1, text: t('competition:order')},
          hasDossard && {type: 'text', flex: 1, text: t('competition:number')},
          {type: 'text', flex: 4, text: t('competition:athlete')},
          {type: 'text', flex: 1, text: t('competition:first')},
          {type: 'text', flex: 1, text: t('competition:second')},
          {type: 'text', flex: 1, text: t('competition:third')},
          {
            type: 'text',
            flex: 1,
            text: t('competition:performance').substring(0, 4) + '.',
          },
          {type: 'text', flex: 1, text: t('competition:place')},
          {type: 'text', flex: 1, text: t('competition:fourth')},
          {type: 'text', flex: 1, text: t('competition:fifth')},
          {type: 'text', flex: 1, text: t('competition:sixth')},
          {type: 'text', flex: 2, text: t('competition:performance')},
          {type: 'text', flex: 1, text: t('competition:place')},
        ]}
        tableData={props.tableData}
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
    marginHorizontal: 20,
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
  text: {
    color: colors.black,
    fontSize: 16,
  },
  textBold: {fontWeight: 'bold'},
  textinput: {
    height: 35,
    marginRight: 5,
    color: colors.black,
    borderColor: colors.muted,
    borderWidth: 1,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },
});

export default TableConcoursSb;
