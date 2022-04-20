import React, {useState} from 'react';
import {Text, View, Image} from 'react-native';
import i18n from 'i18next';
import {
  ModalAddAthlete,
  TableConcoursSB,
  TableConcoursSL,
  TableConcoursLR,
  ModalParam,
  ModalInfoConcours,
  ModalBar,
} from '_screens';
import {styleSheet, colors} from '_config';
import epreuves from '../../../icons/epreuves/epreuves';
import {getFile} from '../../../utils/myAsyncStorage';

const FeuilleDeConcours = props => {
  //Initialisation des données du concours
  const concoursItem = props.route.params.item;
  const [concoursData, setConcoursData] = useState(JSON.parse(concoursItem));
  const [tableData, setTableData] = useState(
    concoursData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0].LstResultats,
  );

  //Initialisation des variables Option Add an athlete
  const [modalAddAthlete, setModalAddAthlete] = useState(false);
  const initFormAddAthlete = {
    categories: concoursData.LstCategoriesAthlete,
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

  const [modalInfoConcours, setModalInfoConcours] = useState(false);

  //Initalisatoin des variables Options Paramètres
  const [modalParam, setModalParam] = useState(false);

  //Initalisatoin des variables Options Montées de barre
  const [modalBar, setModalBar] = useState(false);

  const refreshConcoursData = async () => {
    const id = concoursData?._?.id;
    const value = await getFile(id);
    setConcoursData(JSON.parse(value));
  };

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
          <Image
            style={[styleSheet.icon30, {marginRight: 5}]}
            source={epreuves[concoursData?._?.imageEpreuve]}
          />
          <Text
            style={[
              styleSheet.textTitle,
              {color: colors.black, marginEnd: 10},
            ]}>
            {concoursData?._?.epreuve} - {concoursData?._?.dateInfo} -{' '}
            {concoursData?._?.nbAthlete}{' '}
            {i18n.t('competition:athletes').toLocaleLowerCase()}
          </Text>
          <View
            style={{
              borderRadius: 15,
              padding: 3,
              paddingHorizontal: 10,
              backgroundColor:
                concoursData._ !== undefined
                  ? concoursData?._?.statutColor
                  : colors.white,
            }}>
            <Text
              style={[
                styleSheet.text,
                styleSheet.textCenter,
                styleSheet.textWhite,
              ]}>
              {concoursData?._?.statut}
            </Text>
          </View>
        </View>
        <View
          style={[
            styleSheet.flexRowCenter,
            styleSheet.flexWrap,
            {justifyContent: 'space-between'},
          ]}>
          <ModalInfoConcours
            setModalVisible={setModalInfoConcours}
            modalVisible={modalInfoConcours}
            concoursData={concoursData}
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
      {concoursData?._?.type === 'SB' && (
        <TableConcoursSB
          concoursData={concoursData}
          tableData={tableData}
          setTableData={setTableData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {concoursData?._?.type === 'SL' && (
        <TableConcoursSB
          concoursData={concoursData}
          tableData={tableData}
          setTableData={setTableData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {concoursData?._?.type === 'LT' && (
        <TableConcoursSB
          concoursData={concoursData}
          tableData={tableData}
          setTableData={setTableData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      <View
        style={[
          styleSheet.flexRowCenter,
          {justifyContent: 'flex-start', paddingBottom: 20},
        ]}>
        <Text style={styleSheet.textTitle}>{i18n.t('common:options')}</Text>
        <ModalAddAthlete
          setAthletesData={setTableData}
          modalVisible={modalAddAthlete}
          setModalVisible={b => {
            setFieldsAddAthtlete(initFormAddAthlete);
            setModalAddAthlete(b);
          }}
          athletesData={tableData}
          fieldsAddAthtlete={fieldsAddAthtlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          concoursData={concoursData}
        />
        {concoursData?._?.type === 'SB' && (
          <>
            <ModalBar
              setModalVisible={setModalBar}
              modalVisible={modalBar}
              concoursData={concoursData}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default FeuilleDeConcours;
