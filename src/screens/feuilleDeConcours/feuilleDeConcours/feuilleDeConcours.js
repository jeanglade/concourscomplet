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

  //Initalisatoin des variables Options Paramètres
  const [modalParam, setModalParam] = useState(false);

  //Initalisatoin des variables Options Montées de barre
  const [modalBar, setModalBar] = useState(false);
  const [modalFirstBar, setModalFirstBar] = useState(false);
  const [modalAthletePerAthlete, setModalAthletePerAthlete] = useState(false);
  const [haveToRefresh, setHaveToRefresh] = useState(false);

  const refreshConcoursData = async () => {
    const id = concoursData?._?.id;
    const value = await getFile(id);
    setConcoursData(JSON.parse(value));
    setHaveToRefresh(!haveToRefresh);
  };

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
                {concoursData._?.epreuve} - {concoursData._?.dateInfo} -{' '}
                {concoursData._?.nbAthlete}{' '}
                {i18n.t('competition:athletes').toLocaleLowerCase()}
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
  }, [haveToRefresh]);

  return (
    <View
      style={[
        styleSheet.backWhite,
        styleSheet.flex1,
        {padding: 10, paddingHorizontal: 20},
      ]}>
      <View
        style={[
          styleSheet.flexRowCenter,
          styleSheet.flexWrap,
          {justifyContent: 'space-between'},
        ]}>
        <View style={[styleSheet.flexRowCenter, styleSheet.flexWrap]}>
          {concoursData?._?.type === 'SB' && (
            <>
              <ModalBar
                setModalVisible={setModalBar}
                modalVisible={modalBar}
                concoursData={concoursData}
                refreshConcoursData={refreshConcoursData}
              />
              <ModalFirstBar
                setModalVisible={setModalFirstBar}
                modalVisible={modalFirstBar}
                concoursData={concoursData}
                refreshConcoursData={refreshConcoursData}
              />
            </>
          )}
          <InfoConcours concoursData={concoursData} />
        </View>
        <View style={styleSheet.flexRowCenter}>
          <ModalAthletePerAthlete
            setModalVisible={setModalAthletePerAthlete}
            modalVisible={modalAthletePerAthlete}
          />
          <ModalAddAthlete
            modalVisible={modalAddAthlete}
            setModalVisible={b => {
              setFieldsAddAthtlete(initFormAddAthlete);
              setModalAddAthlete(b);
            }}
            fieldsAddAthtlete={fieldsAddAthtlete}
            setFieldsAddAthtlete={setFieldsAddAthtlete}
            concoursData={concoursData}
            setHaveToRefresh={setHaveToRefresh}
          />
          <ModalParam
            setModalVisible={setModalParam}
            modalVisible={modalParam}
            concoursData={concoursData}
            setConcoursData={setConcoursData}
            refreshConcoursData={refreshConcoursData}
          />
        </View>
      </View>
      <TableConcoursBase
        concoursData={concoursData}
        setConcoursData={setConcoursData}
        setModalAddAthlete={setModalAddAthlete}
        setFieldsAddAthtlete={setFieldsAddAthtlete}
        fieldsAddAthtlete={fieldsAddAthtlete}
        haveToRefresh={haveToRefresh}
      />
    </View>
  );
};

export default FeuilleDeConcours;
