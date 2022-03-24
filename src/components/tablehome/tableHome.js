import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';
import {Picker} from '@react-native-picker/picker';
import {removeFile} from '../../utils/myasyncstorage';
import {useOrientation} from '../../utils/useOrientation';

const TableHome = props => {
  const [t] = useTranslation();
  const orientation = useOrientation();

  const [competition, setCompetition] = useState('coucou');

  const getImageEpreuve = epreuve => {
    var res = '';
    switch (epreuve) {
      case 'Hauteur':
        res = require('../../icons/epreuves/SautEnHauteur_Dark.png');
        break;
      case 'Perche':
        res = require('../../icons/epreuves/SautALaPerche_Dark.png');
        break;
      case 'Longueur':
        res = require('../../icons/epreuves/SautEnLongueur_Dark.png');
        break;
      case 'Triple':
        res = require('../../icons/epreuves/SautEnLongueur_Dark.png');
        break;
      case 'Poids':
        res = require('../../icons/epreuves/LancerDePoids_Dark.png');
        break;
      case 'Javelot':
        res = require('../../icons/epreuves/Javelot_Dark.png');
        break;
      case 'Marteau':
        res = require('../../icons/epreuves/LancerDeMarteau_Dark.png');
        break;
      case 'Disque':
        res = require('../../icons/epreuves/LancerDeDisque_Dark.png');
        break;
    }
    return res;
  };

  const Item = ({id, data, date, epreuve, statut, index}) => (
    <>
      <View style={styles.item}>
        <View style={{flex: 2}}>
          <Text style={styles.text}>{date}</Text>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
              marginRight: 5,
            }}
            source={getImageEpreuve(epreuve.split(' - ')[0])}
          />
          <Text style={styles.text}>{epreuve}</Text>
        </View>
        <View style={{flex: 2}}>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>{statut}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 2,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('CompetitionSheet', {
                competitionData: data,
              });
            }}>
            <View style={[styles.cellButton]}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../icons/list.png')}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              Alert.alert(
                'Voulez-vous supprimer ce concours?',
                JSON.parse(data).NomCompetition,
                [
                  {
                    text: 'Annuler',
                  },
                  {
                    text: 'OK',
                    onPress: async () => {
                      try {
                        await removeFile(id);
                        props.setTableData(
                          props.tableData.filter(
                            (item, itemIndex) => item.id !== id,
                          ),
                        );
                        props.showMessage({
                          message: t('toast:file_deleted'),
                          type: 'success',
                        });
                      } catch (e) {
                        console.error(e);
                      }
                    },
                  },
                ],
              );
            }}>
            <View style={[styles.cellButton, styles.backRed]}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../icons/delete.png')}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </>
  );

  const renderItem = ({item, index}) => (
    <Item
      id={item.id}
      data={item.data}
      date={item.date}
      epreuve={item.epreuve}
      statut={item.statut}
      index={index}
    />
  );

  return (
    <View
      style={[
        styles.containerCenter,
        orientation === 'LANDSCAPE' && {width: '80%', marginLeft: '10%'},
      ]}>
      <Text style={styles.titleText}>
        {t('common:list_competion_sheets')} -{' '}
        {props.tableData.length > 0
          ? competition
          : t('common:no_imported_competitions') + '...'}
      </Text>
      {props.tableData.length > 0 ? (
        <View>
          <Text style={styles.text}>{t('common:filters')}</Text>
          <View>
            <Picker
              selectedValue={competition}
              onValueChange={value => {
                setCompetition(value);
              }}
              mode="dropdown">
              {props.tableData.map((rowData, index) => {
                return (
                  <></>
                  // <Picker.Item
                  //   style={styles.dropdownItem}
                  //   label={rowData.DateHeureSerie}
                  //   value={rowData.DateHeureSerie}
                  // />
                );
              })}
            </Picker>
          </View>
          <View style={styles.headerTable}>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{t('common:date')}</Text>
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.text}>{t('common:discipline')}</Text>
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{t('common:status')}</Text>
            </View>
            <View style={{flex: 2}}>
              <Text style={styles.text}>{t('common:action')}</Text>
            </View>
          </View>
          <FlatList
            data={props.tableData}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return item.id;
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginHorizontal: 20,
    borderColor: colors.muted,
    borderTopWidth: 1,
    borderWidth: 0,
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
  cellButton: {
    backgroundColor: colors.ffa_blue_dark,
    padding: 10,
    margin: 5,
    borderWidth: 2,
    borderColor: colors.ffa_blue_light,
  },
  backRed: {
    backgroundColor: colors.red,
    borderColor: colors.red_light,
  },

  /* width: Dimensions.get('window').width - 20,*/
  /*dropdown: {
    fontSize: 14,
    width: 200,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
  },
  dropdownItem: {
    color: colors.black,
    backgroundColor: colors.white,
  },*/
});

export default TableHome;
