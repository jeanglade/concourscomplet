import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';

const TableConcoursSb = props => {
  const [t] = useTranslation();
  const [hasDossard, setHasDossard] = useState(() => {
    var res = false;
    props.tableData.forEach(row => {
      if (row.Athlete.Dossard?.toString()) res = true;
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
  const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();

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
    if (resultat['LstEssais'] == null) resultat['LstEssais'] = [];
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
        <View style={{flex: 1}}>
          <Text style={[styles.text]}>{order}</Text>
        </View>
        {hasDossard && (
          <View style={{flex: 1}}>
            <Text style={[styles.text]}>{dossard}</Text>
          </View>
        )}
        <View style={{flex: 4}}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 16,
                fontWeight: 'bold',
                color:
                  athleteEnCours == resultat
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
        <View style={{flex: 1}}>
          <TextInput
            style={[
              styles.textinput,
              {
                borderColor:
                  athleteEnCours == resultat
                    ? colors.ffa_blue_light
                    : colors.muted,
              },
            ]}
            onChangeText={value => {
              //createEssai(resultat, 1, value);
              setAllEssais(allEssais => {
                allEssais[index][0] = value.toString();
                return allEssais;
              });
            }}
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            value={allEssais[index] ? allEssais[index][1] : ''}
            onChangeText={value => {
              createEssai(resultat, 2, value);
              setAllEssais(allEssais => {
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
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            value={allEssais[index] ? allEssais[index][2] : ''}
            onChangeText={value => {
              createEssai(resultat, 3, value);
              setAllEssais(allEssais => {
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
        <View style={{flex: 1}}>
          <Text style={styles.text}></Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}></Text>
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 2}}>
          <Text style={styles.text}></Text>
        </View>
        <View style={{flex: 1}}>
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
      <View style={{flex: 1}}>
        <View style={styles.headerTable}>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:order')}</Text>
          </View>
          {hasDossard && (
            <View style={{flex: 1}}>
              <Text style={styles.text}>{t('competition:number')}</Text>
            </View>
          )}
          <View style={{flex: 4}}>
            <Text style={styles.text}>{t('competition:athlete')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:first')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:second')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:third')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {t('competition:performance').substring(0, 4) + '.'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:place')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:fourth')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:fifth')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:six')}</Text>
          </View>
          <View style={{flex: 2}}>
            <Text style={styles.text}>{t('competition:performance')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:place')}</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
            }}
            data={props.tableData}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return index;
            }}
          />
        </View>
      </View>
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
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
    textAlign: 'center',
    paddingVertical: 10,
  },
  text: {
    color: colors.ffa_blue_light,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 5,
  },
  headerTable: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  text: {
    color: colors.black,
    fontSize: 16,
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
