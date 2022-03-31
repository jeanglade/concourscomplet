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
import {removeFile, removeFiles} from '../../utils/myAsyncStorage';
import {useOrientation} from '../../utils/useOrientation';
import {DropdownCompetition} from '_components';

const TableCompetition = props => {
  const [t] = useTranslation();
  const orientation = useOrientation();

  const getImageEpreuve = epreuve => {
    var res = '';
    switch (true) {
      case epreuve.includes('Hauteur'):
        res = require('../../icons/epreuves/SautEnHauteur_Dark.png');
        break;
      case epreuve.includes('Perche'):
        res = require('../../icons/epreuves/SautALaPerche_Dark.png');
        break;
      case epreuve.includes('Longueur'):
        res = require('../../icons/epreuves/SautEnLongueur_Dark.png');
        break;
      case epreuve.includes('Triple saut'):
        res = require('../../icons/epreuves/SautEnLongueur_Dark.png');
        break;
      case epreuve.includes('Poids'):
        res = require('../../icons/epreuves/LancerDePoids_Dark.png');
        break;
      case epreuve.includes('Javelot'):
        res = require('../../icons/epreuves/Javelot_Dark.png');
        break;
      case epreuve.includes('Marteau'):
        res = require('../../icons/epreuves/LancerDeMarteau_Dark.png');
        break;
      case epreuve.includes('Disque'):
        res = require('../../icons/epreuves/LancerDeDisque_Dark.png');
        break;
    }
    return res;
  };

  const getStatusColor = statut => {
    var res = colors.black;
    switch (statut) {
      case t('common:ready'):
        res = colors.black;
        break;
      case t('common:in_progress'):
        res = colors.red;
        break;
      case t('common:finished'):
        res = colors.orange;
        break;
      case t('common:send_to_elogica'):
        res = colors.green;
        break;
    }
    return res;
  };

  const Item = ({id, data, date, epreuve, statut, item, index}) => (
    <>
      <View style={styles.item}>
        <View style={styles.flex2}>
          <Text style={styles.text}>{date}</Text>
        </View>
        <View style={[styles.epreuve, styles.flex5]}>
          <Image style={styles.iconEpreuve} source={getImageEpreuve(epreuve)} />
          <Text style={styles.text}>{epreuve}</Text>
        </View>
        <View style={styles.flex1}>
          <Text
            style={[
              styles.text,
              styles.textBold,
              {color: getStatusColor(statut)},
            ]}>
            {statut}
          </Text>
        </View>
        <View style={[styles.actions, styles.flex2]}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate('CompetitionSheet', {
                item: item,
              });
            }}>
            <View style={[styles.cellButton]}>
              <Image
                style={styles.icon}
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
                      props.tableData.filter((i, itemIndex) => i.id !== id),
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
                style={styles.icon}
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
      item={item}
      index={index}
    />
  );

  return (
    <View
      style={[
        styles.containerCenter,
        orientation === 'LANDSCAPE' && styles.containerSize,
      ]}>
      <View style={styles.containerTitle}>
        {props.allCompetitions.length === 1 && (
          <Text style={styles.titleText}>
            {props.competition.nomCompetition}
          </Text>
        )}
        {props.allCompetitions.length > 1 && (
          <DropdownCompetition
            orientation={orientation}
            competition={props.competition}
            setCompetition={props.setCompetition}
            allCompetitions={props.allCompetitions}
          />
        )}
        <TouchableWithoutFeedback
          onPress={() => {
            Alert.alert(
              t('toast:confirm_delete'),
              props.competition.nomCompetition,
              [
                {
                  text: t('toast:cancel'),
                },
                {
                  text: t('toast:ok'),
                  onPress: async () => {
                    const ids = props.tableData
                      .filter(x => {
                        return (
                          JSON.parse(x.data).GuidCompetition ===
                          props.competition?.idCompetition
                        );
                      })
                      .map(x => x.id);
                    await removeFiles(ids);
                    props.setTableData(
                      props.tableData.filter(
                        (item, itemIndex) => !ids.includes(item.id),
                      ),
                    );
                  },
                },
              ],
            );
          }}>
          <View
            style={[
              styles.cellButton,
              styles.backRed,
              styles.buttonDeleteCompetition,
            ]}>
            <Image
              style={styles.icon}
              source={require('../icons/delete.png')}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {props.competition?.lieuCompetition?.toString() && (
        <Text style={[styles.text, styles.textCenter]}>
          {props.competition.lieuCompetition?.toString()}
        </Text>
      )}
      <Text
        style={[
          styles.text,
          styles.textCenter,
          {color: colors.ffa_blue_light},
        ]}>
        {
          props.tableData.filter(x => {
            return (
              JSON.parse(x.data).GuidCompetition ===
              props.competition?.idCompetition
            );
          }).length
        }{' '}
        {t('common:list_competion_sheets')}
      </Text>
      <View style={styles.flex1}>
        <View style={styles.headerTable}>
          <View style={styles.flex2}>
            <Text style={styles.text}>{t('common:date')}</Text>
          </View>
          <View style={styles.flex5}>
            <Text style={styles.text}>{t('common:discipline')}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.text}>{t('common:status')}</Text>
          </View>
          <View style={styles.flex2}>
            <Text style={styles.text}>{t('common:actions')}</Text>
          </View>
        </View>
        <View style={styles.flex1}>
          <FlatList
            contentContainerStyle={styles.flexGrow1}
            data={props.tableData.filter(x => {
              return (
                JSON.parse(x.data).GuidCompetition ===
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
    </View>
  );
};

const styles = StyleSheet.create({
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCenter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 20,
    flex: 1,
  },
  containerSize: {width: '80%', marginLeft: '10%'},
  titleText: {
    marginTop: 10,
    fontSize: 20,
    color: colors.ffa_blue_light,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingLeft: 10,
    alignItems: 'center',
  },
  headerTable: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingBottom: 5,
    marginTop: 20,
  },
  text: {
    color: colors.black,
    fontSize: 16,
  },
  textBold: {fontWeight: 'bold'},
  textCenter: {textAlign: 'center'},
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
  flexGrow1: {
    flexGrow: 1,
  },
  iconEpreuve: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  epreuve: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  icon: {
    width: 20,
    height: 20,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonDeleteCompetition: {
    padding: 0,
    margin: 0,
    marginLeft: 10,
    marginTop: 15,
    borderRadius: 20,
  },
});

export default TableCompetition;
