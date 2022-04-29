import React, {useEffect, useState} from 'react';
import {View, Image, Text} from 'react-native';
import i18n from 'i18next';
import {MyButton} from '_components';
import {
  ModalAddAthlete,
  TableConcoursBase,
  ModalParam,
  InfoConcours,
  ModalBar,
  ModalFirstBar,
  ModalAthletePerAthlete,
} from '_screens';
import {styleSheet, colors} from '_config';
import {getFile} from '../../../utils/myAsyncStorage';
import epreuves from '../../../icons/epreuves/epreuves';

const FeuilleDeConcours = props => {
  //Initialisation des données du concours
  const concoursItem = props.route.params.item;
  const [concoursData, setConcoursData] = useState(JSON.parse(concoursItem));

  //Initialisation des variables Option Add an athlete
  //Variables nécessaires pour <ModalAddAthlete> (ET <TableConcoursBase> pour reouvrir la modal)
  const [modalAddAthlete, setModalAddAthlete] = useState(false);
  const initFormAddAthlete = {
    categories: concoursData?.LstCategoriesAthlete,
    type: 'new',
    firstname: '',
    name: '',
    sex: i18n.t('competition:sex') + '*',
    birthDate: new Date(),
    licence_number: '',
    club: '',
    category: i18n.t('competition:category'),
    dossard: '',
  };
  const [fieldsAddAthtlete, setFieldsAddAthtlete] =
    useState(initFormAddAthlete);

  //concoursData = données du concours
  //Toutes les saisies utilisateur changent cette variable et la sauvegarde avec asyncStorage
  //Met à jour concoursData depuis la sauvegarde
  const refreshConcoursData = async () => {
    const value = await getFile(concoursData?._?.id);
    setConcoursData(JSON.parse(value));
    setHaveToRefreshTable(oldValue => !oldValue);
  };

  //Avec le useEffect permet de mettre à jour le titre pour le status du concours et le tableau <TableConcoursBase>
  const [haveToRefreshTable, setHaveToRefreshTable] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      header: ({}) => {
        return (
          <View style={{backgroundColor: colors.ffa_blue_light}}>
            <View
              style={[
                styleSheet.flexRow,
                styleSheet.flexWrap,
                {marginStart: 10, alignItems: 'center'},
              ]}>
              <MyButton
                onPress={() =>
                  props.route.params.refreshAndGoBack(concoursData)
                }
                styleView={[{marginHorizontal: 5}]}
                content={
                  <Image
                    style={styleSheet.icon20}
                    source={require('../icons/back.png')}
                  />
                }
              />
              <Image
                style={[styleSheet.icon30, {marginHorizontal: 5}]}
                source={epreuves[concoursData._?.imageEpreuve.slice(0, -5)]}
              />
              <Text
                style={[
                  styleSheet.textTitle,
                  styleSheet.textWhite,
                  {marginEnd: 10},
                ]}>
                {concoursData._?.epreuve} - {concoursData._?.dateInfo}
              </Text>
              <View
                style={{
                  borderRadius: 15,
                  padding: 3,
                  paddingHorizontal: 10,
                  backgroundColor: concoursData._?.statutColor,
                }}>
                <Text
                  style={[
                    styleSheet.text,
                    styleSheet.textCenter,
                    styleSheet.textWhite,
                  ]}>
                  {concoursData._?.statut}
                </Text>
              </View>
            </View>
          </View>
        );
      },
    });
  }, [haveToRefreshTable]);

  //TODO gestion des calculs de place intermidiaire (sauvegarde de l'ordre initiale)
  const [resetOrder, setResetOrder] = useState(false);

  return (
    <View
      style={[
        styleSheet.backWhite,
        styleSheet.flex1,
        {
          padding: 10,
          paddingHorizontal: 20,
          flexDirection: 'column',
          justifyContent: 'flex-start',
        },
      ]}>
      <View
        style={[
          styleSheet.flexRowCenter,
          styleSheet.flexWrap,
          {justifyContent: 'space-between'},
        ]}>
        <View style={[styleSheet.flexRowCenter, styleSheet.flexWrap]}>
          {concoursData?._?.type !== 'SB' && (
            <MyButton
              onPress={() => setResetOrder(oldValue => !oldValue)}
              styleView={[
                styleSheet.icon,
                {
                  backgroundColor: resetOrder
                    ? colors.red
                    : colors.ffa_blue_light,
                },
              ]}
              tooltip={
                resetOrder
                  ? i18n.t('competition:reset_calcul_place')
                  : i18n.t('competition:calcul_place')
              }
              content={
                <Image
                  style={styleSheet.icon20}
                  source={require('../../icons/calcul_place.png')}
                />
              }
            />
          )}
          {concoursData?._?.type === 'SB' && (
            <>
              <ModalBar
                concoursData={concoursData}
                refreshConcoursData={refreshConcoursData}
              />
              <ModalFirstBar
                concoursData={concoursData}
                refreshConcoursData={refreshConcoursData}
              />
            </>
          )}
          <InfoConcours concoursData={concoursData} />
        </View>
        <View style={styleSheet.flexRowCenter}>
          <ModalAthletePerAthlete refreshConcoursData={refreshConcoursData} />
          <ModalAddAthlete
            initFormAddAthlete={initFormAddAthlete}
            modalVisible={modalAddAthlete}
            setModalVisible={setModalAddAthlete}
            fieldsAddAthtlete={fieldsAddAthtlete}
            setFieldsAddAthtlete={setFieldsAddAthtlete}
            concoursData={concoursData}
            refreshConcoursData={refreshConcoursData}
          />
          <ModalParam
            concoursData={concoursData}
            setConcoursData={setConcoursData}
            refreshConcoursData={refreshConcoursData}
          />
        </View>
      </View>
      <TableConcoursBase
        //Information du concours
        concoursData={concoursData}
        setConcoursData={setConcoursData}
        //Pour reouvrir le modalAddAthlete avec les informations de l'athlète
        setModalAddAthlete={setModalAddAthlete}
        //Champs modalAddAthlete
        fieldsAddAthtlete={fieldsAddAthtlete}
        setFieldsAddAthtlete={setFieldsAddAthtlete}
        //Pour refresh le tableau
        haveToRefreshTable={haveToRefreshTable}
        refreshConcoursData={refreshConcoursData}
      />
      <View style={[{paddingTop: 5, marginHorizontal: 5}]}>
        <Text style={[styleSheet.text]} numberOfLines={1} ellipsizeMode="tail">
          {concoursData?._?.type === 'SB'
            ? '« O » réussi'
            : '« 123 » perf. en cm'}
          {'  « X » échec  « - » impasse  « r » retiré'}
        </Text>
      </View>
    </View>
  );
};

export default FeuilleDeConcours;
