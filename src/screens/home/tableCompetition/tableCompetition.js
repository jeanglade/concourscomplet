import React from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {getFile, removeFile, removeFiles} from '../../../utils/myAsyncStorage';
import {useOrientation} from '../../../utils/useOrientation';
import {MyButton, MyDataTable} from '_components';
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

  const Item = ({id, date, epreuve, statut, item}) => {
    const status = (
      <View
        style={{
          borderRadius: 15,
          padding: 3,
          paddingHorizontal: 10,
          backgroundColor: getStatusColor(statut),
        }}>
        <Text
          style={[
            styleSheet.text,
            styleSheet.textCenter,
            styleSheet.textWhite,
          ]}>
          {statut}
        </Text>
      </View>
    );
    const image = (
      <Image
        style={[styleSheet.icon30, {marginRight: 5}]}
        source={getImageEpreuve(epreuve)}
      />
    );
    return (
      <>
        <View style={styles.item}>
          <View style={styleSheet.flex2}>
            <Text style={styleSheet.text}>{date}</Text>
          </View>
          <View style={[styles.epreuve, styleSheet.flex5]}>
            {image}
            <Text style={styleSheet.text}>{epreuve}</Text>
          </View>
          <View style={styleSheet.flex1}>{status}</View>
          <View
            style={[
              styleSheet.flex2,
              styleSheet.flexRowCenter,
              styleSheet.flexWrap,
            ]}>
            <MyButton
              styleView={[styleSheet.icon]}
              tooltip={i18n.t('common:competition_sheet')}
              onPress={async () => {
                item.data = await getFile(item.id);
                props.navigation.navigate('FeuilleDeConcours', {
                  item: item,
                  image: image,
                  status: status,
                });
              }}
              content={
                <Image
                  style={styleSheet.icon20}
                  source={require('../icons/list.png')}
                />
              }
            />
            <MyButton
              styleView={[styleSheet.icon, styleSheet.backRed]}
              onPress={() => alertDeleteConcours(id, epreuve)}
              content={
                <Image
                  style={styleSheet.icon20}
                  source={require('../icons/delete.png')}
                />
              }
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View
      style={[
        styles.containerCenter,
        orientation === 'LANDSCAPE' && styles.containerSize,
      ]}>
      {/* Titres */}
      <>
        <View style={styleSheet.flexRowCenter}>
          {/* S il y a 1 seule competition */}
          <Text
            style={[
              styleSheet.textTitle,
              {margin: 0, marginVertical: 0, marginEnd: 5},
            ]}>
            {props.competition?.nomCompetition?.toString()}
          </Text>
          {/* Button de suppression de tous les concours d une competition */}
          <MyButton
            onPress={alertDeleteCompetition}
            styleView={[styleSheet.buttonDelete, styleSheet.backRed]}
            content={
              <Image
                style={styleSheet.icon10}
                source={require('../icons/delete.png')}
              />
            }
          />
        </View>
        {/* Lieu de la competition */}
        {props.competition?.lieuCompetition?.toString() && (
          <Text style={[styleSheet.text, styleSheet.textCenter]}>
            {props.competition?.lieuCompetition?.toString()}
          </Text>
        )}
        {/* Nombre de concours dans la competition */}
        <Text
          style={[
            styleSheet.text,
            styleSheet.textCenter,
            {color: colors.ffa_blue_light},
          ]}>
          {tableDataFilter().length} {i18n.t('common:list_competion_sheets')}
        </Text>
      </>
      {/* Liste des concours */}
      <MyDataTable
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
  containerCenter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 20,
    flex: 1,
  },
  containerSize: {width: '80%', marginLeft: '10%'},
  item: {
    flexDirection: 'row',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 3,
  },
  epreuve: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default TableCompetition;
