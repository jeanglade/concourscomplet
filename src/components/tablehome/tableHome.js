import React from 'react';
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
import {removeFile} from '../../utils/myasyncstorage';
import {useOrientation} from '../../utils/useOrientation';
import {DropdownCompetition} from '_components';

const TableHome = props => {
  const [t] = useTranslation();
  const orientation = useOrientation();

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
              Alert.alert(t('toast:confirm_delete'), epreuve, [
                {
                  text: t('toast:cancel'),
                },
                {
                  text: t('toast:ok'),
                  onPress: async () => {
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
                  },
                },
              ]);
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
      key={index}
      id={item.id}
      data={item.data}
      date={item.dateInfo}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.titleText}>
          {t('common:list_competion_sheets')} {' - '}
          {props.tableData.length > 0
            ? props.allCompetitions.length == 1
              ? props.competition.nomCompetition
              : null
            : t('common:no_imported_competitions') + '...'}
        </Text>
        {props.allCompetitions.length >= 2 && (
          <DropdownCompetition
            competition={props.competition}
            setCompetition={props.setCompetition}
            allCompetitions={props.allCompetitions}
          />
        )}
      </View>
      {props.tableData.length > 0 ? (
        <View style={{flex: 1}}>
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
          <View style={{flex: 1}}>
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              data={props.tableData.filter(x => {
                return (
                  JSON.parse(x.data).GuidCompetition ==
                  props.competition?.idCompetition
                );
              })}
              renderItem={renderItem}
              keyExtractor={(item, index) => {
                return index;
              }}
            />
          </View>
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
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 20,
    borderColor: colors.muted,
    borderTopWidth: 1,
    borderWidth: 0,
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
});

export default TableHome;
