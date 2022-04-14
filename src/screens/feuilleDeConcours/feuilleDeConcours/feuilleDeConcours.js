import React, {useState} from 'react';
import {Text, View} from 'react-native';
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
import {styleSheet} from '_config';

const FeuilleDeConcours = props => {
  //Initialisation des données du concours
  const dataConcours = props.route.params.item;
  const competitionData = JSON.parse(dataConcours.data);
  const listAthlete =
    competitionData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0].LstResultats;
  const [tableData, setTableData] = useState(listAthlete);

  //Initialisation des variables Option Add an athlete
  const [modalAddAthlete, setModalAddAthlete] = useState(false);
  const initFormAddAthlete = {
    categories: competitionData.LstCategoriesAthlete,
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
  const [nbTries, setNbTries] = useState(6);
  const [colPerfVisible, setColPerfVisible] = useState(true);
  const [colFlagVisible, setColFlagVisible] = useState(false);
  const [colWindVisible, setColWindVisible] = useState(true);
  const [colMiddleRankVisible, setColMiddleRankVisible] = useState(true);

  //Initalisatoin des variables Options Montées de barre
  const [modalBarBarrage, setModalBarBarrage] = useState(false);
  const [modalBar, setModalBar] = useState(false);
  const [barRises, setBarRises] = useState(
    competitionData.UtilisationMonteeBarre
      ? competitionData.EpreuveConcoursComplet.MonteesBarre
      : [],
  );
  const [barRisesBarrage, setBarRisesBarrage] = useState([]);

  return (
    <View style={[styleSheet.backWhite, styleSheet.flex1, {padding: 10}]}>
      <View
        style={[
          styleSheet.flexRowCenter,
          styleSheet.flexWrap,
          {justifyContent: 'space-between'},
        ]}>
        <Text style={styleSheet.textTitle}>
          {dataConcours.epreuve} - {dataConcours.dateInfo}
        </Text>
        <View
          style={[
            styleSheet.flexRowCenter,
            styleSheet.flexWrap,
            {justifyContent: 'space-between'},
          ]}>
          <ModalInfoConcours
            setModalVisible={setModalInfoConcours}
            modalVisible={modalInfoConcours}
          />
          <ModalParam
            colFlagVisible={colFlagVisible}
            setColFlagVisible={setColFlagVisible}
            colPerfVisible={colPerfVisible}
            setColPerfVisible={setColPerfVisible}
            colWindVisible={colWindVisible}
            setColWindVisible={setColWindVisible}
            colMiddleRankVisible={colMiddleRankVisible}
            setColMiddleRankVisible={setColMiddleRankVisible}
            setModalVisible={setModalParam}
            modalVisible={modalParam}
            nbTries={nbTries}
            setNbTries={setNbTries}
          />
        </View>
      </View>
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SB' && (
        <TableConcoursSB
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SL' && (
        <TableConcoursSL
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
          setModalAddAthlete={setModalAddAthlete}
          setFieldsAddAthtlete={setFieldsAddAthtlete}
          fieldsAddAthtlete={fieldsAddAthtlete}
        />
      )}
      {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'LR' && (
        <TableConcoursLR
          dataConcours={dataConcours}
          tableData={tableData}
          setTableData={setTableData}
          compData={competitionData}
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
        <Text style={styleSheet.textTitle}>{i18n.t('common:options')} : </Text>
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
          fileContent={competitionData}
          fileName={dataConcours.id}
        />
        {competitionData.EpreuveConcoursComplet.CodeFamilleEpreuve === 'SB' && (
          <>
            <ModalBar
              setModalVisible={setModalBar}
              modalVisible={modalBar}
              barRises={barRises}
              setBarRises={setBarRises}
              isBarrage={false}
            />
            <ModalBar
              setModalVisible={setModalBarBarrage}
              modalVisible={modalBarBarrage}
              barRises={barRisesBarrage}
              setBarRises={setBarRisesBarrage}
              isBarrage={true}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default FeuilleDeConcours;
