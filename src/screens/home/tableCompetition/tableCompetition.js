import React from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import i18n from 'i18next';
import {colors} from '_config';
import {getFile, removeFile, removeFiles} from '../../../utils/myAsyncStorage';
import {useOrientation} from '../../../utils/useOrientation';
import {Button, DataTable} from '_components';
import {showMessage} from 'react-native-flash-message';

const TableCompetition = props => {
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
      case i18n.t('common:ready'):
        res = colors.black;
        break;
      case i18n.t('common:in_progress'):
        res = colors.red;
        break;
      case i18n.t('common:finished'):
        res = colors.orange;
        break;
      case i18n.t('common:send_to_elogica'):
        res = colors.green;
        break;
    }
    return res;
  };

  //Suppression d un concours
  const alertDeleteConcours = (id, epreuve) => {
    Alert.alert(i18n.t('toast:confirm_delete_concours'), epreuve, [
      {
        text: i18n.t('toast:cancel'),
      },
      {
        text: i18n.t('toast:ok'),
        onPress: async () => {
          await removeFile(id);
          const res = props.tableData.filter(i => i.id !== id);
          props.refreshData(
            res,
            res.filter(i => {
              return (
                JSON.parse(i.data).GuidCompetition ===
                props.competition.idCompetition
              );
            }).length > 0
              ? props.competition.idCompetition
              : null,
          );
          showMessage({
            message: i18n.t('toast:file_deleted'),
            type: 'success',
          });
        },
      },
    ]);
  };

  //Suppression de tous les concours d une competition
  const alertDeleteCompetition = () => {
    Alert.alert(
      i18n.t('toast:confirm_delete_comp'),
      props.competition?.nomCompetition?.toString(),
      [
        {
          text: i18n.t('toast:cancel'),
        },
        {
          text: i18n.t('toast:ok'),
          onPress: async () => {
            const ids = props.tableData
              .filter(x => {
                return (
                  JSON.parse(x.data).GuidCompetition ===
                  props.competition?.idCompetition?.toString()
                );
              })
              .map(x => x.id);
            await removeFiles(ids);
            const res = props.tableData.filter(
              (item, itemIndex) => !ids.includes(item.id),
            );
            props.refreshData(res);
          },
        },
      ],
    );
  };

  //Renvoie les concours de la competition visible
  const tableDataFilter = () => {
    return props.tableData.filter(
      d =>
        JSON.parse(d.data).GuidCompetition ===
        props.competition?.idCompetition?.toString(),
    );
  };

  const Item = ({id, date, epreuve, statut, item}) => (
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
          <View
            style={{
              borderRadius: 15,
              padding: 3,
              backgroundColor: getStatusColor(statut),
            }}>
            <Text
              style={[
                styles.text,
                {
                  textAlign: 'center',
                  color: colors.white,
                },
              ]}>
              {statut}
            </Text>
          </View>
        </View>
        <View style={[styles.actions, styles.flex2]}>
          <Button
            styleView={[styles.cellButton]}
            tooltip={i18n.t('common:competition_sheet')}
            onPress={async () => {
              item.data = await getFile(item.id);
              props.navigation.navigate('FeuilleDeConcours', {
                item: item,
              });
            }}
            content={
              <Image
                style={styles.icon}
                source={require('../icons/list.png')}
              />
            }
          />
          <Button
            styleView={[styles.cellButton, styles.backRed]}
            onPress={() => alertDeleteConcours(id, epreuve)}
            content={
              <Image
                style={styles.icon}
                source={require('../icons/delete.png')}
              />
            }
          />
        </View>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.containerCenter,
        orientation === 'LANDSCAPE' && styles.containerSize,
      ]}>
      {/* Titres */}
      <>
        <View style={styles.containerTitle}>
          {/* S il y a 1 seule competition */}
          <Text style={styles.titleText}>
            {props.competition?.nomCompetition?.toString()}
          </Text>
          {/* Button de suppression de tous les concours d une competition */}
          <Button
            onPress={alertDeleteCompetition}
            styleView={[
              styles.cellButton,
              styles.backRed,
              styles.buttonDeleteCompetition,
            ]}
            content={
              <Image
                style={styles.iconDeleteCompetition}
                source={require('../icons/delete.png')}
              />
            }
          />
        </View>
        {/* Lieu de la competition */}
        {props.competition?.lieuCompetition?.toString() && (
          <Text style={[styles.text, styles.textCenter]}>
            {props.competition?.lieuCompetition?.toString()}
          </Text>
        )}
        {/* Nombre de concours dans la competition */}
        <Text
          style={[
            styles.text,
            styles.textCenter,
            {color: colors.ffa_blue_light},
          ]}>
          {tableDataFilter().length} {i18n.t('common:list_competion_sheets')}
        </Text>
      </>
      {/* Liste des concours */}
      <DataTable
        headerTable={[
          {type: 'text', flex: 2, text: i18n.t('common:date')},
          {type: 'text', flex: 5, text: i18n.t('common:discipline')},
          {type: 'text', flex: 1, text: i18n.t('common:status')},
          {type: 'text', flex: 2, text: i18n.t('common:actions')},
        ]}
        tableData={tableDataFilter()}
        renderItem={({item, index}) => (
          <Item
            key={index}
            id={item.id}
            date={item.dateInfo}
            epreuve={item.epreuve}
            statut={item.statut}
            item={item}
          />
        )}
      />
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
    borderRadius: 3,
  },
  text: {
    color: colors.black,
    fontSize: 16,
  },
  textBold: {fontWeight: 'bold'},
  textCenter: {textAlign: 'center'},
  cellButton: {
    backgroundColor: colors.ffa_blue_light,
    padding: 5,
    margin: 5,
    borderRadius: 3,
  },
  backRed: {
    backgroundColor: colors.red,
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
    width: 30,
    height: 30,
  },
  iconDeleteCompetition: {
    width: 15,
    height: 15,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonDeleteCompetition: {
    padding: 5,
    margin: 0,
    marginLeft: 10,
    marginTop: 15,
    borderRadius: 3,
  },
});

export default TableCompetition;
