import React from 'react';
import {StyleSheet, Text, View, Image, Alert} from 'react-native';
import i18n from 'i18next';
import {colors, styleSheet} from '_config';
import {getFile, removeFile, removeFiles} from '../../../utils/myAsyncStorage';
import {useOrientation} from '../../../utils/useOrientation';
import {MyButton, MyDataTable} from '_components';
import {showMessage} from 'react-native-flash-message';
import epreuves from '../../../icons/epreuves/epreuves';
import moment from 'moment';

const TableCompetition = props => {
  const orientation = useOrientation();

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
          const res = props.tableData.filter(i => JSON.parse(i)?._?.id !== id);
          props.refreshData(
            res,
            res.filter(i => {
              return (
                JSON.parse(i)?.GuidCompetition ===
                props.competition?.idCompetition
              );
            }).length > 0
              ? props.competition?.idCompetition
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
      i18n.t('toast:confirm_delete_comp') +
        ' ' +
        props.competition?.nomCompetition +
        ' ?',
      i18n.t('toast:delete_concours_info'),

      [
        {
          text: i18n.t('toast:cancel'),
        },
        {
          text: i18n.t('toast:ok'),
          onPress: async () => {
            const concours = props.tableData.filter(x => {
              return (
                JSON.parse(x)?.GuidCompetition ===
                  props.competition?.idCompetition?.toString() &&
                ((JSON.parse(x)._?.statut !== i18n.t('common:in_progress') &&
                  JSON.parse(x)._?.statut !== i18n.t('common:finished')) ||
                  moment().diff(moment(JSON.parse(x)?._?.date), 'days') > 3)
              );
            });
            if (concours !== []) {
              const ids = concours.map(x => JSON.parse(x)?._?.id);
              await removeFiles(ids);
              props.refreshData(
                props.tableData.filter(
                  (item, itemIndex) => !ids.includes(JSON.parse(item)?._?.id),
                ),
              );
            }
          },
        },
      ],
    );
  };

  //Renvoie les concours de la competition visible
  const tableDataFilter = () => {
    return props.tableData.filter(
      d =>
        JSON.parse(d)?.GuidCompetition ===
        props.competition?.idCompetition?.toString(),
    );
  };

  const refreshAndGoBack = newValue => {
    props.setTableData(oldValues =>
      [
        ...oldValues.filter(x => JSON.parse(x)._.id !== newValue._.id),
        JSON.stringify(newValue),
      ].sort((a, b) => {
        return JSON.parse(a)._?.date > JSON.parse(b)._?.date ? 1 : -1;
      }),
    );
    props.navigation.goBack();
  };

  const Item = ({item, index}) => {
    return (
      <>
        <View style={styles.item}>
          <View style={styleSheet.flex2}>
            <Text style={styleSheet.text}>{item?._?.dateInfo}</Text>
          </View>
          <View style={[styles.epreuve, styleSheet.flex5]}>
            <Image
              style={[styleSheet.icon30, {marginRight: 5}]}
              source={epreuves[item?._?.imageEpreuve]}
            />
            <Text style={styleSheet.text}>{item?._?.epreuve}</Text>
          </View>
          <View style={styleSheet.flex1}>
            <View
              style={{
                borderRadius: 15,
                padding: 3,
                paddingHorizontal: 10,
                backgroundColor: item?._?.statutColor,
              }}>
              <Text
                style={[
                  styleSheet.text,
                  styleSheet.textCenter,
                  styleSheet.textWhite,
                ]}>
                {item._?.statut}
              </Text>
            </View>
          </View>
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
                const i = await getFile(item?._?.id);
                props.navigation.navigate('FeuilleDeConcours', {
                  item: i,
                  refreshAndGoBack: refreshAndGoBack,
                });
              }}
              content={
                <Image
                  style={styleSheet.icon20}
                  source={require('../icons/list.png')}
                />
              }
            />
            {((item._?.statut !== i18n.t('common:in_progress') &&
              item._?.statut !== i18n.t('common:finished')) ||
              moment().diff(moment(item?._?.date), 'days') > 3) && (
              <MyButton
                styleView={[styleSheet.icon, styleSheet.backRed]}
                onPress={() =>
                  alertDeleteConcours(item?._?.id, item?._?.epreuve)
                }
                content={
                  <Image
                    style={styleSheet.icon20}
                    source={require('../icons/delete.png')}
                  />
                }
              />
            )}
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
        renderItem={({item, index}) => {
          const i = JSON.parse(item);
          return <Item item={i} index={index} />;
        }}
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
